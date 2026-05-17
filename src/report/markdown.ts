import type { ScoredAgentFitReport } from '../core/scoring.js';
import type { CommandResolution, EvaluationRun, InstructionSignalFinding } from '../types.js';
import { executionModeForRuns, isPreviewRun } from '../core/execution-mode.js';

const MAX_MARKDOWN_EVIDENCE_ROWS = 25;

export function renderMarkdownReport(report: ScoredAgentFitReport): string {
  const lines = [
    `# AgentFit Report`,
    '',
    `**Score:** ${report.score}/100 (${report.grade})`,
    '',
    report.summary,
    '',
    `Generated: ${report.generatedAt}`,
    '',
    ...executionSummary(report),
    '',
    `## Score Breakdown`,
    '',
    `| Check | Score | Notes |`,
    `| --- | ---: | --- |`,
    ...breakdownRows(report),
    '',
    `## Failed Checks`,
    '',
    ...listOrNone(report.failedChecks ?? []),
    '',
    `## Caps`,
    '',
    ...listOrNone(report.caps),
    '',
    `## Instruction Files`,
    '',
    ...instructionRows(report),
    '',
    `## Evaluation Runs`,
    '',
    ...runRows(report),
    ''
  ];

  if (report.referenceIssues.length > 0) {
    lines.splice(
      lines.length - 1,
      0,
      '',
      `## Reference Issues`,
      '',
      `| Source | Target | Severity | Message |`,
      `| --- | --- | --- | --- |`,
      ...report.referenceIssues.map(
        (issue) =>
          `| ${escapeCell(`${issue.sourcePath}:${issue.line}`)} | ${escapeCell(issue.target)} | ${issue.severity} | ${escapeCell(issue.message)} |`
      )
    );
  }

  if ((report.staticIssues ?? []).length > 0) {
    lines.splice(
      lines.length - 1,
      0,
      '',
      `## Static Issues`,
      '',
      `| Category | Source | Severity | Message |`,
      `| --- | --- | --- | --- |`,
      ...(report.staticIssues ?? []).map(
        (issue) =>
          `| ${issue.category} | ${escapeCell(issue.sourcePath)} | ${issue.severity} | ${escapeCell(issue.message)} |`
      )
    );
  }

  if ((report.commandResolutions ?? []).length > 0) {
    const commandResolutions = sortedCommandResolutions(report.commandResolutions ?? []);
    lines.splice(
      lines.length - 1,
      0,
      '',
      `## Command Resolutions`,
      '',
      ...limitNote(commandResolutions.length, 'command resolutions'),
      `| Command | Source | Script | Package | Status |`,
      `| --- | --- | --- | --- | --- |`,
      ...commandResolutions.slice(0, MAX_MARKDOWN_EVIDENCE_ROWS).map(
        (resolution) =>
          `| ${escapeCell(resolution.command)} | ${escapeCell(`${resolution.sourcePath}:${resolution.line}`)} | ${escapeCell(resolution.scriptName)} | ${escapeCell(resolution.packageJsonPath)} | ${resolution.status} |`
      )
    );
  }

  if ((report.signalFindings ?? []).length > 0) {
    const signalFindings = sortedSignalFindings(report.signalFindings ?? []);
    lines.splice(
      lines.length - 1,
      0,
      '',
      `## Signal Findings`,
      '',
      ...limitNote(signalFindings.length, 'signal findings'),
      `| Category | Source | Evidence |`,
      `| --- | --- | --- |`,
      ...signalFindings.slice(0, MAX_MARKDOWN_EVIDENCE_ROWS).map(
        (finding) =>
          `| ${finding.category} | ${escapeCell(`${finding.sourcePath}:${finding.line}`)} | ${escapeCell(finding.message)} |`
      )
    );
  }

  return `${lines.join('\n').trimEnd()}\n`;
}

function limitNote(total: number, label: string): string[] {
  if (total <= MAX_MARKDOWN_EVIDENCE_ROWS) {
    return [];
  }

  return [
    `Showing first ${MAX_MARKDOWN_EVIDENCE_ROWS} of ${total} ${label}. JSON output contains the complete set.`,
    ''
  ];
}

function sortedCommandResolutions(resolutions: CommandResolution[]): CommandResolution[] {
  return [...resolutions].sort(compareCommandResolutions);
}

function compareCommandResolutions(left: CommandResolution, right: CommandResolution): number {
  return (
    left.sourcePath.localeCompare(right.sourcePath) ||
    left.line - right.line ||
    left.command.localeCompare(right.command)
  );
}

function sortedSignalFindings(findings: InstructionSignalFinding[]): InstructionSignalFinding[] {
  return [...findings].sort(compareSignalFindings);
}

function compareSignalFindings(left: InstructionSignalFinding, right: InstructionSignalFinding): number {
  return (
    left.category.localeCompare(right.category) ||
    left.sourcePath.localeCompare(right.sourcePath) ||
    left.line - right.line ||
    left.message.localeCompare(right.message)
  );
}

function breakdownRows(report: ScoredAgentFitReport): string[] {
  if (!report.breakdown || report.breakdown.length === 0) {
    return ['| Overall | ' + `${report.score}/100` + ' | No category breakdown available. |'];
  }

  return report.breakdown.map(
    (item) => `| ${escapeCell(item.label)} | ${item.earned}/${item.max} | ${escapeCell(item.explanation)} |`
  );
}

function instructionRows(report: ScoredAgentFitReport): string[] {
  if (report.instructionFiles.length === 0) {
    return ['No instruction files discovered.'];
  }

  return [
    `| Path | Kind | Scope | Commands | Imports |`,
    `| --- | --- | --- | ---: | ---: |`,
    ...report.instructionFiles.map(
      (file) =>
        `| ${escapeCell(file.path)} | ${file.kind} | ${escapeCell(file.scope)} | ${file.commands.length} | ${file.importedPaths.length} |`
    )
  ];
}

function runRows(report: ScoredAgentFitReport): string[] {
  if (report.runs.length === 0) {
    return ['No evaluation runs completed.'];
  }

  return [
    `| Task | Adapter | Status | Verification | Diff | Cost |`,
    `| --- | --- | --- | --- | ---: | ---: |`,
    ...report.runs.map((run) => {
      const diff = `${run.diffStat.filesChanged} files, +${run.diffStat.insertions}/-${run.diffStat.deletions}`;
      const cost = run.costUsd === undefined ? '-' : `$${run.costUsd.toFixed(4)}`;
      const status = isPreviewRun(run) ? 'preview' : run.status;
      const verification = verificationSummary(run);
      return `| ${escapeCell(run.task.title)} | ${run.adapter} | ${status} | ${verification} | ${diff} | ${cost} |`;
    })
  ];
}

function executionSummary(report: ScoredAgentFitReport): string[] {
  const executionMode = executionModeForRuns(report.runs);
  if (executionMode === 'none') {
    return ['**Task execution:** No generated tasks were executed.'];
  }

  if (executionMode === 'skipped') {
    return ['**Task execution:** Generated task runs were skipped.'];
  }

  if (executionMode === 'preview') {
    return [
      '**Task execution:** Static dry-run preview; generated tasks were not executed.',
      '',
      'Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.'
    ];
  }

  const executedRuns = report.runs.filter((run) => !isPreviewRun(run));
  return [`**Task execution:** ${executedRuns.length} of ${report.runs.length} generated task runs executed.`];
}

function verificationSummary(run: EvaluationRun): string {
  if (isPreviewRun(run)) {
    return 'not executed';
  }

  if (run.verification.length === 0) {
    return 'none recorded';
  }

  const failed = run.verification.filter((result) => result.exitCode !== 0).length;
  if (failed > 0) {
    return `${failed} of ${run.verification.length} failed`;
  }

  return `${run.verification.length} passed`;
}

function listOrNone(items: string[]): string[] {
  if (items.length === 0) {
    return ['None.'];
  }

  return items.map((item) => `- ${item}`);
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}
