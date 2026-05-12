import { mkdir, mkdtemp, readFile, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { evalCommand } from '../../src/cli/commands/eval.js';
import { initCommand } from '../../src/cli/commands/init.js';
import { parseAgentFitConfig } from '../../src/core/config.js';
import { createProgram, isCliEntrypoint } from '../../src/cli/index.js';

describe('agentfit cli', () => {
  it('prints help', async () => {
    const help = createProgram().helpInformation();

    expect(help).toContain('Local-first fitness tests');
    expect(help).toContain('eval');
  });

  it('detects package bin symlinks as CLI entrypoints', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-bin-'));
    const entrypoint = join(root, 'dist/index.js');
    const bin = join(root, 'node_modules/.bin/agentfit');

    await mkdir(join(root, 'dist'), { recursive: true });
    await mkdir(join(root, 'node_modules/.bin'), { recursive: true });
    await writeFile(entrypoint, '#!/usr/bin/env node\n');
    await symlink(entrypoint, bin);

    expect(isCliEntrypoint(pathToFileURL(entrypoint).href, bin)).toBe(true);
  });

  it('creates a parseable default config', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-init-'));
    const previousCwd = process.cwd();

    try {
      process.chdir(root);
      await initCommand().parseAsync(['node', 'agentfit']);
    } finally {
      process.chdir(previousCwd);
    }

    const content = await readFile(join(root, 'agentfit.config.yml'), 'utf8');
    expect(() => parseAgentFitConfig(content)).not.toThrow();
  });

  it.each([
    ['--tasks', '5abc', '--tasks must be a positive integer.'],
    ['--timeout-seconds', '30s', '--timeout-seconds must be a positive integer.'],
    ['--budget-usd', '1x', '--budget-usd must be a non-negative number.']
  ])('rejects malformed numeric option %s=%s', async (option, value, message) => {
    await expect(
      evalCommand(() => {
        throw new Error('cwd should not be read before option validation');
      }).parseAsync(['node', 'agentfit', option, value])
    ).rejects.toThrow(message);
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

  it('hard-fails eval reports when instruction files contain high-confidence secrets', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-cli-'));
    const openAiKey = `sk-proj-${'a'.repeat(32)}`;

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
      ['# Instructions', '', '```bash', `export OPENAI_API_KEY=${openAiKey}`, 'npm test', '```', ''].join('\n')
    );
    await writeFile(
      join(root, 'agentfit.config.yml'),
      ['version: 1', 'root: .', 'report:', '  failBelowScore: 0', ''].join('\n')
    );

    await evalCommand(() => root).parseAsync([
      'node',
      'agentfit',
      '--format',
      'json',
      '--output',
      'reports/agentfit.json'
    ]);

    const report = JSON.parse(await readFile(join(root, 'reports/agentfit.json'), 'utf8')) as {
      score: number;
      caps: string[];
      staticIssues: Array<{ category: string }>;
    };

    expect(report.score).toBe(0);
    expect(report.caps).toContain('exposed secrets in instruction files: hard fail');
    expect(report.staticIssues.some((issue) => issue.category === 'secret')).toBe(true);
  });

  it('uses configured verification commands when generating eval tasks', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-cli-'));

    await writeFile(join(root, 'package.json'), JSON.stringify({ type: 'module' }, null, 2));
    await writeFile(join(root, 'AGENTS.md'), '# Instructions\n');
    await writeFile(
      join(root, 'agentfit.config.yml'),
      [
        'version: 1',
        'root: .',
        'commands:',
        '  verify:',
        '    - node -e "process.exit(0)"',
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
      'json',
      '--output',
      'reports/agentfit.json'
    ]);

    const report = JSON.parse(await readFile(join(root, 'reports/agentfit.json'), 'utf8')) as {
      tasks: Array<{ id: string; expectedChecks: string[] }>;
      caps: string[];
    };

    expect(report.tasks[0]).toEqual(
      expect.objectContaining({
        id: 'config-verification',
        expectedChecks: ['node -e "process.exit(0)"']
      })
    );
    expect(report.caps).not.toContain('no verification command found: max score 75');
  });

  it('recognizes explicit do-not-run instructions as safety guardrails', async () => {
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
      join(root, 'CLAUDE.md'),
      [
        '# Guidelines for Claude Code',
        '',
        '```bash',
        'npm test',
        '```',
        '',
        'Claude should NEVER run versioning or publishing commands.'
      ].join('\n')
    );
    await writeFile(
      join(root, 'agentfit.config.yml'),
      ['version: 1', 'root: .', 'report:', '  failBelowScore: 0', ''].join('\n')
    );

    await evalCommand(() => root).parseAsync([
      'node',
      'agentfit',
      '--format',
      'json',
      '--output',
      'reports/agentfit.json'
    ]);

    const report = JSON.parse(await readFile(join(root, 'reports/agentfit.json'), 'utf8')) as {
      failedChecks: string[];
    };

    expect(report.failedChecks).not.toContain('Safety guardrails were not found.');
  });

  it('shows package-local command resolution in json and markdown reports', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-cli-'));

    await mkdir(join(root, '.cursor/rules'), { recursive: true });
    await mkdir(join(root, 'app/client'), { recursive: true });
    await writeFile(join(root, 'package.json'), JSON.stringify({ scripts: { test: 'node test.js' } }, null, 2));
    await writeFile(
      join(root, 'app/client/package.json'),
      JSON.stringify({ name: '@agentfit/app-client', scripts: { 'test:unit': 'vitest run' } }, null, 2)
    );
    await writeFile(
      join(root, '.cursor/rules/frontend.mdc'),
      [
        '# Frontend rules',
        '',
        'Frontend commands run from `app/client`.',
        '',
        '```bash',
        'yarn test:unit',
        '```',
        ''
      ].join('\n')
    );
    await writeFile(
      join(root, 'agentfit.config.yml'),
      ['version: 1', 'root: .', 'report:', '  failBelowScore: 0', ''].join('\n')
    );

    await evalCommand(() => root).parseAsync([
      'node',
      'agentfit',
      '--format',
      'json',
      '--output',
      'reports/agentfit.json',
      '--markdown-output',
      'reports/agentfit.md'
    ]);

    const report = JSON.parse(await readFile(join(root, 'reports/agentfit.json'), 'utf8')) as {
      commandResolutions?: Array<{
        command: string;
        sourcePath: string;
        scriptName: string;
        packageJsonPath: string;
        status: string;
      }>;
      failedChecks: string[];
    };
    const markdown = await readFile(join(root, 'reports/agentfit.md'), 'utf8');

    expect(report.commandResolutions).toContainEqual(
      expect.objectContaining({
        command: 'yarn test:unit',
        sourcePath: '.cursor/rules/frontend.mdc',
        scriptName: 'test:unit',
        packageJsonPath: 'app/client/package.json',
        status: 'resolved'
      })
    );
    expect(report.failedChecks).not.toContain('Documented command references missing package script "test:unit".');
    expect(markdown).toContain('## Command Resolutions');
    expect(markdown).toContain('| yarn test:unit | .cursor/rules/frontend.mdc:6 | test:unit | app/client/package.json | resolved |');
  });
});
