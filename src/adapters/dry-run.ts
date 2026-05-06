import type { EvaluationAdapter } from './adapter.js';

export function createDryRunAdapter(): EvaluationAdapter {
  return {
    name: 'dry-run',
    async runTask(_context, task) {
      const invalidCheck = task.expectedChecks.find((check) => check.trim().length === 0);

      if (invalidCheck !== undefined) {
        return {
          status: 'failed',
          message: 'Dry-run adapter found an empty verification command.'
        };
      }

      return {
        status: 'passed',
        message: `Dry-run adapter validated ${task.expectedChecks.length} verification command(s).`
      };
    }
  };
}
