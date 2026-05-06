import type { AgentFitReport, EvaluationRun, InstructionFile, ReferenceIssue } from '../types.js';

export type ScoreCategoryId =
  | 'discoverability'
  | 'command-freshness'
  | 'reference-integrity'
  | 'evaluation-pass-rate'
  | 'diff-discipline'
  | 'safety-guardrails'
  | 'reproducibility';

export type ScoreBreakdownItem = {
  id: ScoreCategoryId;
  label: string;
  earned: number;
  max: number;
  explanation: string;
};

export type ScoringInput = {
  instructionFiles: InstructionFile[];
  referenceIssues?: ReferenceIssue[];
  runs?: EvaluationRun[];
  hasExposedSecrets?: boolean;
  setupCommandFailed?: boolean;
  budgetExceeded?: boolean;
  safetyGuardrailsFound?: boolean;
  reproducibilitySignalsFound?: boolean;
};

export type ScoreResult = {
  score: number;
  grade: string;
  summary: string;
  breakdown: ScoreBreakdownItem[];
  caps: string[];
  failedChecks: string[];
};

export type ScoredAgentFitReport = AgentFitReport & {
  breakdown?: ScoreBreakdownItem[];
  failedChecks?: string[];
  scoreExplanation?: string;
};

const WEIGHTS = {
  discoverability: 20,
  commandFreshness: 15,
  referenceIntegrity: 15,
  evaluationPassRate: 20,
  diffDiscipline: 10,
  safetyGuardrails: 10,
  reproducibility: 10
} as const;

const VERIFICATION_COMMAND_KINDS = new Set(['test', 'lint', 'build']);

export function calculateScore(input: ScoringInput): ScoreResult {
  const failedChecks: string[] = [];
  const caps: string[] = [];

  const instructionFiles = input.instructionFiles;
  const referenceIssues = input.referenceIssues ?? [];
  const runs = input.runs ?? [];
  const verificationCommands = instructionFiles.flatMap((file) =>
    file.commands.filter((command) => VERIFICATION_COMMAND_KINDS.has(command.kind))
  );
  const setupCommands = instructionFiles.flatMap((file) =>
    file.commands.filter((command) => command.kind === 'setup')
  );

  const breakdown: ScoreBreakdownItem[] = [
    scoreDiscoverability(instructionFiles, failedChecks),
    scoreCommandFreshness(instructionFiles, runs, failedChecks),
    scoreReferenceIntegrity(referenceIssues, failedChecks),
    scoreEvaluationPassRate(runs, failedChecks),
    scoreDiffDiscipline(runs, failedChecks),
    scoreBinaryCategory(
      'safety-guardrails',
      'Safety guardrails',
      WEIGHTS.safetyGuardrails,
      input.safetyGuardrailsFound === true,
      'Safety guardrails found.',
      'Safety guardrails were not found.',
      failedChecks
    ),
    scoreBinaryCategory(
      'reproducibility',
      'Reproducibility',
      WEIGHTS.reproducibility,
      input.reproducibilitySignalsFound === true,
      'Reproducible setup and verification guidance found.',
      'Reproducibility instructions were not found.',
      failedChecks
    )
  ];

  if (setupCommands.length > 0 && (input.setupCommandFailed === true || setupVerificationFailed(runs))) {
    caps.push('setup command cannot run: max score 60');
  }

  if (verificationCommands.length === 0) {
    caps.push('no verification command found: max score 75');
    failedChecks.push('No verification command found in instruction files.');
  }

  if (input.budgetExceeded === true || runs.some((run) => run.message?.toLowerCase().includes('budget'))) {
    caps.push('real adapter exceeds budget: run stopped and report marks budget failure');
    failedChecks.push('Evaluation budget was exceeded.');
  }

  if (input.hasExposedSecrets === true) {
    caps.push('exposed secrets in instruction files: hard fail');
    failedChecks.push('Exposed secret detected in instruction files.');
    return {
      score: 0,
      grade: 'F',
      summary: 'Hard fail: exposed secret detected in instruction files.',
      breakdown,
      caps,
      failedChecks: unique(failedChecks)
    };
  }

  const uncappedScore = Math.round(
    breakdown.reduce((total, item) => total + item.earned, 0)
  );
  const cappedScore = applyCaps(uncappedScore, caps);
  const grade = gradeForScore(cappedScore);

  return {
    score: cappedScore,
    grade,
    summary: `AgentFit score ${cappedScore}/100 (${grade}).`,
    breakdown,
    caps,
    failedChecks: unique(failedChecks)
  };
}

export function attachScoreToReport(report: AgentFitReport, input: Omit<ScoringInput, 'instructionFiles' | 'referenceIssues' | 'runs'> = {}): ScoredAgentFitReport {
  const result = calculateScore({
    instructionFiles: report.instructionFiles,
    referenceIssues: report.referenceIssues,
    runs: report.runs,
    ...input
  });

  return {
    ...report,
    score: result.score,
    grade: result.grade,
    summary: result.summary,
    caps: result.caps,
    breakdown: result.breakdown,
    failedChecks: result.failedChecks,
    scoreExplanation: result.breakdown
      .map((item) => `${item.label}: ${item.earned}/${item.max}`)
      .join('; ')
  };
}

function scoreDiscoverability(files: InstructionFile[], failedChecks: string[]): ScoreBreakdownItem {
  if (files.length === 0) {
    failedChecks.push('No agent instruction files were discovered.');
    return category('discoverability', 'Instruction discoverability', 0, WEIGHTS.discoverability, 'No agent instruction files were discovered.');
  }

  const hasRootInstruction = files.some((file) => isRootInstruction(file.path));
  const hasRecognizedKind = files.some((file) => file.kind !== 'unknown');
  const hasReadableContent = files.some((file) => file.bytes > 0);
  const earned = (hasRootInstruction ? 10 : 0) + (hasRecognizedKind ? 5 : 0) + (hasReadableContent ? 5 : 0);

  if (!hasRootInstruction) {
    failedChecks.push('No root-level instruction file was discovered.');
  }
  if (!hasRecognizedKind) {
    failedChecks.push('No recognized instruction file type was discovered.');
  }

  return category(
    'discoverability',
    'Instruction discoverability',
    earned,
    WEIGHTS.discoverability,
    `${files.length} instruction file${files.length === 1 ? '' : 's'} discovered.`
  );
}

function scoreCommandFreshness(files: InstructionFile[], runs: EvaluationRun[], failedChecks: string[]): ScoreBreakdownItem {
  const commands = files.flatMap((file) => file.commands);
  if (commands.length === 0) {
    failedChecks.push('No commands were found in instruction files.');
    return category('command-freshness', 'Command freshness', 0, WEIGHTS.commandFreshness, 'No commands were found in instruction files.');
  }

  const commandResults = runs.flatMap((run) => run.verification);
  const failedCommands = commandResults.filter((result) => result.exitCode !== 0);
  if (failedCommands.length > 0) {
    failedChecks.push(`${failedCommands.length} documented command failed during evaluation.`);
    return category('command-freshness', 'Command freshness', 0, WEIGHTS.commandFreshness, `${failedCommands.length} command result failed.`);
  }

  const executedDocumentedCommands = commandResults.filter((result) =>
    commands.some((command) => result.command.includes(command.value) || command.value.includes(result.command))
  );
  const earned = commandResults.length === 0 ? 8 : executedDocumentedCommands.length > 0 ? WEIGHTS.commandFreshness : 10;

  return category(
    'command-freshness',
    'Command freshness',
    earned,
    WEIGHTS.commandFreshness,
    commandResults.length === 0 ? 'Commands were found but not executed.' : 'Documented commands completed successfully.'
  );
}

function scoreReferenceIntegrity(issues: ReferenceIssue[], failedChecks: string[]): ScoreBreakdownItem {
  const errors = issues.filter((issue) => issue.severity === 'error');
  const warnings = issues.filter((issue) => issue.severity === 'warning');

  if (errors.length > 0) {
    failedChecks.push(`${errors.length} instruction reference ${errors.length === 1 ? 'is' : 'are'} missing or invalid.`);
    return category('reference-integrity', 'Reference integrity', 0, WEIGHTS.referenceIntegrity, `${errors.length} reference error${errors.length === 1 ? '' : 's'} found.`);
  }

  if (warnings.length > 0) {
    failedChecks.push(`${warnings.length} instruction reference warning${warnings.length === 1 ? '' : 's'} found.`);
    return category('reference-integrity', 'Reference integrity', 10, WEIGHTS.referenceIntegrity, `${warnings.length} reference warning${warnings.length === 1 ? '' : 's'} found.`);
  }

  return category('reference-integrity', 'Reference integrity', WEIGHTS.referenceIntegrity, WEIGHTS.referenceIntegrity, 'All instruction references resolve.');
}

function scoreEvaluationPassRate(runs: EvaluationRun[], failedChecks: string[]): ScoreBreakdownItem {
  const evaluatedRuns = runs.filter((run) => run.status !== 'skipped');
  if (evaluatedRuns.length === 0) {
    failedChecks.push('No evaluation runs completed.');
    return category('evaluation-pass-rate', 'Evaluation pass rate', 0, WEIGHTS.evaluationPassRate, 'No evaluation runs completed.');
  }

  const passedRuns = evaluatedRuns.filter((run) => run.status === 'passed');
  const failedRuns = evaluatedRuns.length - passedRuns.length;
  if (failedRuns > 0) {
    failedChecks.push(`${failedRuns} of ${evaluatedRuns.length} evaluation runs failed.`);
  }

  return category(
    'evaluation-pass-rate',
    'Evaluation pass rate',
    Math.round((passedRuns.length / evaluatedRuns.length) * WEIGHTS.evaluationPassRate),
    WEIGHTS.evaluationPassRate,
    `${passedRuns.length} of ${evaluatedRuns.length} evaluation runs passed.`
  );
}

function scoreDiffDiscipline(runs: EvaluationRun[], failedChecks: string[]): ScoreBreakdownItem {
  const changedRuns = runs.filter((run) => run.status !== 'skipped');
  if (changedRuns.length === 0) {
    failedChecks.push('No diff statistics were captured.');
    return category('diff-discipline', 'Diff discipline', 0, WEIGHTS.diffDiscipline, 'No diff statistics were captured.');
  }

  const averages = changedRuns.reduce(
    (total, run) => ({
      filesChanged: total.filesChanged + run.diffStat.filesChanged,
      insertions: total.insertions + run.diffStat.insertions,
      deletions: total.deletions + run.diffStat.deletions
    }),
    { filesChanged: 0, insertions: 0, deletions: 0 }
  );

  const averageFilesChanged = averages.filesChanged / changedRuns.length;
  const averageLineDelta = (averages.insertions + averages.deletions) / changedRuns.length;

  if (averageFilesChanged <= 3 && averageLineDelta <= 80) {
    return category('diff-discipline', 'Diff discipline', WEIGHTS.diffDiscipline, WEIGHTS.diffDiscipline, 'Average diff size fits small fitness tasks.');
  }

  if (averageFilesChanged <= 6 && averageLineDelta <= 180) {
    failedChecks.push('Average diff is larger than expected for fitness tasks.');
    return category('diff-discipline', 'Diff discipline', 5, WEIGHTS.diffDiscipline, 'Average diff is larger than expected.');
  }

  failedChecks.push('Average diff is too large for fitness tasks.');
  return category('diff-discipline', 'Diff discipline', 0, WEIGHTS.diffDiscipline, 'Average diff is too large for fitness tasks.');
}

function scoreBinaryCategory(
  id: ScoreCategoryId,
  label: string,
  max: number,
  passed: boolean,
  passedExplanation: string,
  failedExplanation: string,
  failedChecks: string[]
): ScoreBreakdownItem {
  if (!passed) {
    failedChecks.push(failedExplanation);
  }

  return category(id, label, passed ? max : 0, max, passed ? passedExplanation : failedExplanation);
}

function category(id: ScoreCategoryId, label: string, earned: number, max: number, explanation: string): ScoreBreakdownItem {
  return {
    id,
    label,
    earned,
    max,
    explanation
  };
}

function setupVerificationFailed(runs: EvaluationRun[]): boolean {
  return runs.some((run) =>
    run.verification.some((result) => result.exitCode !== 0 && /install|setup|bootstrap/i.test(result.command))
  );
}

function isRootInstruction(path: string): boolean {
  return !path.includes('/') || ['CLAUDE.md', 'GEMINI.md'].includes(path);
}

function applyCaps(score: number, caps: string[]): number {
  return caps.reduce((current, cap) => {
    if (cap.includes('max score 60')) {
      return Math.min(current, 60);
    }
    if (cap.includes('max score 75')) {
      return Math.min(current, 75);
    }
    return current;
  }, score);
}

function gradeForScore(score: number): string {
  if (score >= 90) {
    return 'A';
  }
  if (score >= 80) {
    return 'B';
  }
  if (score >= 70) {
    return 'C';
  }
  if (score >= 60) {
    return 'D';
  }
  return 'F';
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
