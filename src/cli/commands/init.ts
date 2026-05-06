import { writeFile } from 'node:fs/promises';
import { Command } from 'commander';
import { DEFAULT_CONFIG } from '../../core/config.js';

export function initCommand(): Command {
  return new Command('init')
    .description('Create an agentfit.config.yml file.')
    .action(async () => {
      const content = renderDefaultConfig();

      try {
        await writeFile('agentfit.config.yml', content, { flag: 'wx' });
      } catch (error: unknown) {
        const code = error && typeof error === 'object' && 'code' in error ? error.code : undefined;
        if (code === 'EEXIST') {
          throw new Error('agentfit.config.yml already exists.');
        }
        throw error;
      }

      console.log('Created agentfit.config.yml');
    });
}

function renderDefaultConfig(): string {
  return [
    'version: 1',
    `root: ${DEFAULT_CONFIG.root}`,
    'instructions:',
    '  include:',
    ...DEFAULT_CONFIG.instructions.include.map((pattern) => `    - ${pattern}`),
    'commands:',
    '  setup:',
    ...DEFAULT_CONFIG.commands.setup.map((command) => `    - ${command}`),
    '  verify:',
    ...DEFAULT_CONFIG.commands.verify.map((command) => `    - ${command}`),
    'evaluation:',
    `  adapter: ${DEFAULT_CONFIG.evaluation.adapter}`,
    `  taskCount: ${DEFAULT_CONFIG.evaluation.taskCount}`,
    `  timeoutSeconds: ${DEFAULT_CONFIG.evaluation.timeoutSeconds}`,
    `  budgetUsd: ${DEFAULT_CONFIG.evaluation.budgetUsd}`,
    `  worktreeDir: ${DEFAULT_CONFIG.evaluation.worktreeDir}`,
    `  allowExternalServices: ${String(DEFAULT_CONFIG.evaluation.allowExternalServices)}`,
    'report:',
    '  formats:',
    ...DEFAULT_CONFIG.report.formats.map((format) => `    - ${format}`),
    `  failBelowScore: ${DEFAULT_CONFIG.report.failBelowScore}`,
    ''
  ].join('\n');
}
