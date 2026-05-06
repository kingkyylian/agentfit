import type { ScoredAgentFitReport } from '../core/scoring.js';

export function renderJsonReport(report: ScoredAgentFitReport): string {
  return `${JSON.stringify(normalizeReport(report), null, 2)}\n`;
}

export function normalizeReport(report: ScoredAgentFitReport): ScoredAgentFitReport {
  return {
    ...report,
    instructionFiles: [...report.instructionFiles].sort((left, right) => left.path.localeCompare(right.path)),
    referenceIssues: [...report.referenceIssues].sort((left, right) =>
      `${left.sourcePath}:${left.line}:${left.target}`.localeCompare(`${right.sourcePath}:${right.line}:${right.target}`)
    ),
    tasks: [...report.tasks].sort((left, right) => left.id.localeCompare(right.id)),
    runs: [...report.runs].sort((left, right) => left.id.localeCompare(right.id)),
    caps: [...report.caps].sort()
  };
}
