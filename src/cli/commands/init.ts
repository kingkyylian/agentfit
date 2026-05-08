import { writeFile } from 'node:fs/promises';
import { Command } from 'commander';
import yaml from 'js-yaml';
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
  return yaml.dump(DEFAULT_CONFIG, {
    lineWidth: -1,
    noRefs: true
  });
}
