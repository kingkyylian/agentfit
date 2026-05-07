import type { ScoredAgentFitReport } from '../core/scoring.js';
import { executionModeForRuns, type ExecutionMode } from '../core/execution-mode.js';

type JsonAgentFitReport = ScoredAgentFitReport & {
  executionMode: ExecutionMode;
};

export function renderJsonReport(report: ScoredAgentFitReport): string {
  return `${JSON.stringify(normalizeReport(report), null, 2)}\n`;
}

export function normalizeReport(report: ScoredAgentFitReport): JsonAgentFitReport {
  return {
    ...report,
    executionMode: executionModeForRuns(report.runs),
    instructionFiles: [...report.instructionFiles].sort((left, right) => left.path.localeCompare(right.path)),
    referenceIssues: [...report.referenceIssues].sort((left, right) =>
      `${left.sourcePath}:${left.line}:${left.target}`.localeCompare(`${right.sourcePath}:${right.line}:${right.target}`)
    ),
    staticIssues: [...(report.staticIssues ?? [])].sort((left, right) =>
      `${left.category}:${left.sourcePath}:${left.message}`.localeCompare(`${right.category}:${right.sourcePath}:${right.message}`)
    ),
    tasks: [...report.tasks].sort((left, right) => left.id.localeCompare(right.id)),
    runs: [...report.runs].sort((left, right) => left.id.localeCompare(right.id)),
    caps: [...report.caps].sort()
  };
}
