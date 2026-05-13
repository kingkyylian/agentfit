import type { EvaluationRun } from '../types.js';

export type ExecutionMode = 'none' | 'preview' | 'skipped' | 'executed' | 'mixed';

export function executionModeForRuns(runs: EvaluationRun[]): ExecutionMode {
  if (runs.length === 0) {
    return 'none';
  }

  const skippedRuns = runs.filter((run) => run.status === 'skipped').length;
  if (skippedRuns === runs.length) {
    return 'skipped';
  }

  const previewRuns = runs.filter(isPreviewRun).length;
  if (previewRuns === runs.length) {
    return 'preview';
  }

  if (previewRuns === 0) {
    return 'executed';
  }

  return 'mixed';
}

export function isPreviewRun(run: EvaluationRun): boolean {
  return (
    run.adapter === 'dry-run' &&
    run.verification.length === 0 &&
    run.message?.startsWith('Deterministic dry-run completed.') === true
  );
}
