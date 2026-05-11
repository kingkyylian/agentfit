import type {
  AgentFitReport,
  EvaluationRun,
  ExtractedCommand,
  InstructionFile,
  ReferenceIssue,
  StaticIssue
} from '../types.js';
import { isPreviewRun } from './execution-mode.js';

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
  staticIssues?: StaticIssue[];
  runs?: EvaluationRun[];
  configuredCommands?: ExtractedCommand[];
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
const PACKAGE_MANAGERS = new Set(['pnpm', 'npm', 'yarn', 'bun']);
const PACKAGE_MANAGER_COMMANDS = new Set([
  'add',
  'audit',
  'ci',
  'config',
  'create',
  'dlx',
  'exec',
  'install',
  'link',
  'outdated',
  'pack',
  'publish',
  'remove',
  'uninstall',
  'update',
  'upgrade',
  'why'
]);
const NPM_SCRIPT_ALIASES = new Set(['start', 'stop', 'restart', 'test']);

export function calculateScore(input: ScoringInput): ScoreResult {
  const failedChecks: string[] = [];
  const caps: string[] = [];

  const instructionFiles = input.instructionFiles;
  const referenceIssues = input.referenceIssues ?? [];
  const staticIssues = input.staticIssues ?? [];
  const runs = input.runs ?? [];
  const commands = [
    ...instructionFiles.flatMap((file) => file.commands),
    ...(input.configuredCommands ?? [])
  ];
  const verificationCommands = commands.filter((command) => VERIFICATION_COMMAND_KINDS.has(command.kind));
  const setupCommands = commands.filter((command) => command.kind === 'setup');

  const breakdown: ScoreBreakdownItem[] = [
    scoreDiscoverability(instructionFiles, staticIssues, failedChecks),
    scoreCommandFreshness(commands, runs, staticIssues, failedChecks),
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
    staticIssues: report.staticIssues ?? [],
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

function scoreDiscoverability(
  files: InstructionFile[],
  staticIssues: StaticIssue[],
  failedChecks: string[]
): ScoreBreakdownItem {
  if (files.length === 0) {
    failedChecks.push('No agent instruction files were discovered.');
    return category('discoverability', 'Instruction discoverability', 0, WEIGHTS.discoverability, 'No agent instruction files were discovered.');
  }

  const hasRootInstruction = files.some((file) => isRootInstruction(file.path));
  const hasRecognizedKind = files.some((file) => file.kind !== 'unknown');
  const hasReadableContent = files.some((file) => file.bytes > 0);
  const scopeIssues = staticIssues.filter((issue) => issue.category === 'scope');
  const scopePenalty =
    scopeIssues.length === 0 ? 0 : hasRootInstruction ? 5 : Math.min(15, scopeIssues.length * 5);
  const earned = Math.max(
    0,
    (hasRootInstruction ? 10 : 0) + (hasRecognizedKind ? 5 : 0) + (hasReadableContent ? 5 : 0) - scopePenalty
  );

  if (!hasRootInstruction) {
    failedChecks.push('No root-level instruction file was discovered.');
  }
  if (!hasRecognizedKind) {
    failedChecks.push('No recognized instruction file type was discovered.');
  }
  if (scopeIssues.length === 1) {
    failedChecks.push(scopeIssues[0]?.message ?? '1 nested scope does not have a local instruction file.');
  } else if (scopeIssues.length > 1) {
    failedChecks.push(`${scopeIssues.length} nested scopes do not have local instruction files.`);
  }

  return category(
    'discoverability',
    'Instruction discoverability',
    earned,
    WEIGHTS.discoverability,
    scopeIssues.length === 0
      ? `${files.length} instruction file${files.length === 1 ? '' : 's'} discovered.`
      : `${files.length} instruction file${files.length === 1 ? '' : 's'} discovered; ${scopeIssues.length} nested scope issue${scopeIssues.length === 1 ? '' : 's'} found.`
  );
}

function scoreCommandFreshness(
  commands: ExtractedCommand[],
  runs: EvaluationRun[],
  staticIssues: StaticIssue[],
  failedChecks: string[]
): ScoreBreakdownItem {
  const commandIssues = staticIssues.filter((issue) => issue.category === 'command');
  if (commandIssues.length > 0) {
    failedChecks.push(...commandIssues.map((issue) => issue.message));
    return category(
      'command-freshness',
      'Command freshness',
      0,
      WEIGHTS.commandFreshness,
      `${commandIssues.length} static command issue${commandIssues.length === 1 ? '' : 's'} found.`
    );
  }

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
    commands.some((command) => commandsMatch(result.command, command.value))
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
  if (runs.length > 0 && runs.every(isPreviewRun)) {
    return category(
      'evaluation-pass-rate',
      'Evaluation pass rate',
      WEIGHTS.evaluationPassRate,
      WEIGHTS.evaluationPassRate,
      `${runs.length} deterministic task preview${runs.length === 1 ? '' : 's'} generated; no tasks were executed.`
    );
  }

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
  if (runs.length > 0 && runs.every(isPreviewRun)) {
    return category(
      'diff-discipline',
      'Diff discipline',
      WEIGHTS.diffDiscipline,
      WEIGHTS.diffDiscipline,
      'No task diffs were captured because runs were previews.'
    );
  }

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

function commandsMatch(resultCommand: string, documentedCommand: string): boolean {
  const normalizedResult = normalizeComparableCommand(resultCommand);
  const normalizedDocumented = normalizeComparableCommand(documentedCommand);

  return (
    containsComparableCommand(normalizedResult, normalizedDocumented) ||
    containsComparableCommand(normalizedDocumented, normalizedResult)
  );
}

function containsComparableCommand(haystack: string, needle: string): boolean {
  let index = haystack.indexOf(needle);

  while (index !== -1) {
    const before = index === 0 || isCommandBoundary(haystack[index - 1]);
    const afterIndex = index + needle.length;
    const after = afterIndex === haystack.length || isCommandBoundary(haystack[afterIndex]);

    if (before && after) {
      return true;
    }

    index = haystack.indexOf(needle, index + 1);
  }

  return false;
}

function isCommandBoundary(value: string | undefined): boolean {
  return value === undefined || /\s|[;&|()]/.test(value);
}

function normalizeComparableCommand(command: string): string {
  const normalized = command.trim().replace(/\s+/g, ' ');
  const packageScript = parsePackageScriptCommand(normalized);

  if (!packageScript) {
    return normalized;
  }

  return `${packageScript.manager} run ${packageScript.script}${packageScript.args}`;
}

function parsePackageScriptCommand(command: string): { manager: string; script: string; args: string } | undefined {
  const [manager, subcommand, maybeScript, ...rest] = command.split(' ');
  if (!manager || !subcommand || !PACKAGE_MANAGERS.has(manager)) {
    return undefined;
  }

  if (subcommand === 'run' && maybeScript) {
    return {
      manager,
      script: maybeScript,
      args: rest.length > 0 ? ` ${rest.join(' ')}` : ''
    };
  }

  if (PACKAGE_MANAGER_COMMANDS.has(subcommand)) {
    return undefined;
  }

  if (manager === 'npm' && !NPM_SCRIPT_ALIASES.has(subcommand)) {
    return undefined;
  }

  return {
    manager,
    script: subcommand,
    args: maybeScript ? ` ${[maybeScript, ...rest].join(' ')}` : ''
  };
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
