import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { evalCommand } from '../../src/cli/commands/eval.js';
import { createProgram } from '../../src/cli/index.js';

describe('agentfit cli', () => {
  it('prints help', async () => {
    const help = createProgram().helpInformation();

    expect(help).toContain('Local-first fitness tests');
    expect(help).toContain('eval');
  });

  it('writes multiple eval report formats from one command invocation', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-cli-'));

    await writeFile(
      join(root, 'package.json'),
      JSON.stringify(
        {
          type: 'module',
          scripts: {
            test: 'node -e "process.exit(0)"'
          }
        },
        null,
        2
      )
    );
    await writeFile(
      join(root, 'AGENTS.md'),
      ['# Instructions', '', '```bash', 'npm test', '```', ''].join('\n')
    );
    await writeFile(
      join(root, 'agentfit.config.yml'),
      [
        'version: 1',
        'root: .',
        'evaluation:',
        '  taskCount: 1',
        'report:',
        '  failBelowScore: 0',
        ''
      ].join('\n')
    );

    await evalCommand(() => root).parseAsync([
      'node',
      'agentfit',
      '--format',
      'text',
      '--output',
      'reports/agentfit.txt',
      '--timeout-seconds',
      '30',
      '--budget-usd',
      '0',
      '--json-output',
      'reports/agentfit.json',
      '--markdown-output',
      'reports/agentfit.md',
      '--badge-output',
      'reports/agentfit.svg'
    ]);

    await expect(readFile(join(root, 'reports/agentfit.txt'), 'utf8')).resolves.toContain('AgentFit score:');
    await expect(readFile(join(root, 'reports/agentfit.txt'), 'utf8')).resolves.toContain(
      'Task execution: static dry-run preview; generated tasks were not executed.'
    );
    await expect(readFile(join(root, 'reports/agentfit.txt'), 'utf8')).resolves.toContain(
      'Runs: 0 executed, 1 previewed'
    );
    await expect(readFile(join(root, 'reports/agentfit.json'), 'utf8')).resolves.toContain('"score"');
    await expect(readFile(join(root, 'reports/agentfit.md'), 'utf8')).resolves.toContain('# AgentFit Report');
    await expect(readFile(join(root, 'reports/agentfit.svg'), 'utf8')).resolves.toContain('<svg');
  });
});
