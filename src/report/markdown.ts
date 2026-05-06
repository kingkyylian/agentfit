import type { ScoredAgentFitReport } from '../core/scoring.js';

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
      `## Reference Issues`,
      '',
      `| Source | Target | Severity | Message |`,
      `| --- | --- | --- | --- |`,
      ...report.referenceIssues.map(
        (issue) =>
          `| ${escapeCell(`${issue.sourcePath}:${issue.line}`)} | ${escapeCell(issue.target)} | ${issue.severity} | ${escapeCell(issue.message)} |`
      ),
      ''
    );
  }

  return `${lines.join('\n').trimEnd()}\n`;
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
    `| Task | Adapter | Status | Diff | Cost |`,
    `| --- | --- | --- | ---: | ---: |`,
    ...report.runs.map((run) => {
      const diff = `${run.diffStat.filesChanged} files, +${run.diffStat.insertions}/-${run.diffStat.deletions}`;
      const cost = run.costUsd === undefined ? '-' : `$${run.costUsd.toFixed(4)}`;
      return `| ${escapeCell(run.task.title)} | ${run.adapter} | ${run.status} | ${diff} | ${cost} |`;
    })
  ];
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
