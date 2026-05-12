import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdtemp } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { discoverInstructionFiles } from '../../src/core/discovery.js';
import { collectStaticIssues } from '../../src/core/static-checks.js';
import type { ExtractedCommand } from '../../src/types.js';

async function createRepo(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'agentfit-static-'));
  await mkdir(join(root, 'packages/api'), { recursive: true });
  await writeFile(
    join(root, 'package.json'),
    JSON.stringify(
      {
        scripts: {
          test: 'node -e "process.exit(0)"'
        }
      },
      null,
      2
    )
  );
  await writeFile(join(root, 'packages/api/package.json'), JSON.stringify({ scripts: { test: 'node test.js' } }));
  await writeFile(
    join(root, 'AGENTS.md'),
    ['# Agent instructions', '', 'See @docs/setup.md.', '', '```bash', 'pnpm lint', '```', ''].join('\n')
  );
  return root;
}

describe('collectStaticIssues', () => {
  it('detects stale package scripts, missing runnable verification, and missing nested instructions', async () => {
    const root = await createRepo();
    const instructionFiles = await discoverInstructionFiles(root);

    const issues = await collectStaticIssues(root, instructionFiles);

    expect(issues.map((issue) => issue.message)).toEqual([
      'Documented command references missing package script "lint".',
      'No runnable verification command found in instruction files.',
      'No nested instruction file found for packages/api.'
    ]);
  });

  it('flags high-confidence secrets in instruction files', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-static-'));
    const openAiKey = `sk-proj-${'a'.repeat(32)}`;
    await writeFile(join(root, 'package.json'), JSON.stringify({ scripts: { test: 'node test.js' } }));
    await writeFile(
      join(root, 'AGENTS.md'),
      [
        '# Agent instructions',
        '',
        '```bash',
        `export OPENAI_API_KEY=${openAiKey}`,
        'npm test',
        '```',
        ''
      ].join('\n')
    );
    const instructionFiles = await discoverInstructionFiles(root);

    const issues = await collectStaticIssues(root, instructionFiles);

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: 'secret',
          sourcePath: 'AGENTS.md',
          message: 'Potential OpenAI API key detected in instruction file.',
          severity: 'error'
        })
      ])
    );
  });

  it('validates explicit configured verification commands', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-static-'));
    await writeFile(join(root, 'package.json'), JSON.stringify({ scripts: { test: 'node test.js' } }));
    await writeFile(join(root, 'AGENTS.md'), '# Agent instructions\n');
    const instructionFiles = await discoverInstructionFiles(root);
    const configuredCommands: ExtractedCommand[] = [
      {
        value: 'npm lint',
        sourcePath: 'agentfit.config.yml#commands.verify',
        line: 0,
        kind: 'lint'
      }
    ];

    const issues = await collectStaticIssues(root, instructionFiles, { configuredCommands });

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: 'command',
          sourcePath: 'agentfit.config.yml#commands.verify',
          message: 'Documented command references missing package script "lint".',
          severity: 'error'
        })
      ])
    );
  });

  it('skips package manager options before validating script names', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-static-'));
    await writeFile(
      join(root, 'package.json'),
      JSON.stringify({
        scripts: {
          test: 'node test.js'
        }
      })
    );
    await writeFile(
      join(root, 'AGENTS.md'),
      ['# Agent instructions', '', '```bash', 'yarn --cwd tests/e2e test', 'pnpm --filter @scope/package test', '```', ''].join('\n')
    );
    const instructionFiles = await discoverInstructionFiles(root);

    const issues = await collectStaticIssues(root, instructionFiles);

    expect(issues.map((issue) => issue.message)).not.toContain(
      'Documented command references missing package script "--cwd".'
    );
    expect(issues.map((issue) => issue.message)).not.toContain(
      'Documented command references missing package script "--filter".'
    );
  });

  it('resolves package scripts from a nested instruction file package', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-static-'));
    await mkdir(join(root, 'libs/@hashintel/ds-components'), { recursive: true });
    await writeFile(join(root, 'package.json'), JSON.stringify({ scripts: { test: 'node test.js' } }));
    await writeFile(
      join(root, 'libs/@hashintel/ds-components/package.json'),
      JSON.stringify({ scripts: { build: 'tsc -b', 'test:snapshots': 'vitest run snapshots' } })
    );
    await writeFile(
      join(root, 'libs/@hashintel/ds-components/AGENTS.md'),
      ['# Component instructions', '', '```bash', 'pnpm build', 'pnpm test:snapshots', '```', ''].join('\n')
    );
    const instructionFiles = await discoverInstructionFiles(root);

    const issues = await collectStaticIssues(root, instructionFiles);

    expect(issues.map((issue) => issue.message)).not.toContain(
      'Documented command references missing package script "build".'
    );
    expect(issues.map((issue) => issue.message)).not.toContain(
      'Documented command references missing package script "test:snapshots".'
    );
  });

  it('resolves package scripts from prose-scoped working directories and cwd flags', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-static-'));
    await mkdir(join(root, '.cursor/rules'), { recursive: true });
    await mkdir(join(root, 'app/client'), { recursive: true });
    await writeFile(join(root, 'package.json'), JSON.stringify({ scripts: { test: 'node test.js' } }));
    await writeFile(
      join(root, 'app/client/package.json'),
      JSON.stringify({ scripts: { 'test:unit': 'vitest run', 'test:pw:smoke': 'playwright test --grep smoke' } })
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
        'yarn --cwd app/client test:pw:smoke',
        '```',
        ''
      ].join('\n')
    );
    const instructionFiles = await discoverInstructionFiles(root);

    const issues = await collectStaticIssues(root, instructionFiles);

    expect(issues.map((issue) => issue.message)).not.toContain(
      'Documented command references missing package script "test:unit".'
    );
    expect(issues.map((issue) => issue.message)).not.toContain(
      'Documented command references missing package script "test:pw:smoke".'
    );
  });

  it('resolves package scripts from package-manager filters', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-static-'));
    await mkdir(join(root, 'packages/api'), { recursive: true });
    await writeFile(join(root, 'package.json'), JSON.stringify({ scripts: { test: 'node test.js' } }));
    await writeFile(
      join(root, 'packages/api/package.json'),
      JSON.stringify({ name: '@agentfit/api', scripts: { lint: 'eslint .', test: 'vitest run' } })
    );
    await writeFile(
      join(root, 'AGENTS.md'),
      ['# Agent instructions', '', '```bash', 'pnpm --filter @agentfit/api lint', 'pnpm --filter @agentfit/api run test', '```', ''].join('\n')
    );
    const instructionFiles = await discoverInstructionFiles(root);

    const issues = await collectStaticIssues(root, instructionFiles);

    expect(issues.map((issue) => issue.message)).not.toContain(
      'Documented command references missing package script "lint".'
    );
    expect(issues.map((issue) => issue.message)).not.toContain(
      'Documented command references missing package script "test".'
    );
  });

  it('does not satisfy root-scoped stale commands from unrelated nested packages', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-static-'));
    await mkdir(join(root, 'packages/api'), { recursive: true });
    await writeFile(join(root, 'package.json'), JSON.stringify({ scripts: { test: 'node test.js' } }));
    await writeFile(join(root, 'packages/api/package.json'), JSON.stringify({ scripts: { lint: 'eslint .' } }));
    await writeFile(join(root, 'AGENTS.md'), ['# Agent instructions', '', '```bash', 'pnpm lint', '```', ''].join('\n'));
    const instructionFiles = await discoverInstructionFiles(root);

    const issues = await collectStaticIssues(root, instructionFiles);

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: 'command',
          sourcePath: 'AGENTS.md',
          message: 'Documented command references missing package script "lint".',
          severity: 'error'
        })
      ])
    );
  });

  it('does not report optional package script alias examples as stale commands', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-static-'));
    await writeFile(
      join(root, 'package.json'),
      JSON.stringify({
        scripts: {
          test: 'node test.js'
        }
      })
    );
    await writeFile(
      join(root, 'AGENTS.md'),
      [
        '# Agent instructions',
        '',
        'Run the default verification command before committing:',
        '',
        '```bash',
        'npm test',
        '```',
        '',
        '#### Creating Test Aliases (Optional)',
        '',
        'For convenience, you can add these aliases to your `package.json` scripts.',
        '',
        '```json',
        '{',
        '  "scripts": {',
        '    "test:options": "mocha test/options/**/*.spec.ts"',
        '  }',
        '}',
        '```',
        '',
        'Then run with:',
        '',
        '```bash',
        'npm run test:options',
        '```',
        ''
      ].join('\n')
    );
    const instructionFiles = await discoverInstructionFiles(root);

    const issues = await collectStaticIssues(root, instructionFiles);

    expect(issues.map((issue) => issue.message)).not.toContain(
      'Documented command references missing package script "test:options".'
    );
  });
});
