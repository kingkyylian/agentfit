import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdtemp } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { discoverInstructionFiles } from '../../src/core/discovery.js';
import { collectCommandResolutions, collectStaticIssues } from '../../src/core/static-checks.js';
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

  it('accepts repo-local verification commands as runnable instructions', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-static-'));
    await mkdir(join(root, 'ci'), { recursive: true });
    await writeFile(join(root, 'package.json'), JSON.stringify({ type: 'module' }));
    await writeFile(join(root, 'ci/validate'), '#!/usr/bin/env bash\n');
    await writeFile(
      join(root, 'AGENTS.md'),
      [
        '# Agent instructions',
        '',
        '| Need | Answer |',
        '| --- | --- |',
        '| Validate changes | `ci/validate` |',
        '| Run tests | `ci/test` |',
        ''
      ].join('\n')
    );
    const instructionFiles = await discoverInstructionFiles(root);

    const issues = await collectStaticIssues(root, instructionFiles);

    expect(instructionFiles[0]?.commands).toEqual([
      expect.objectContaining({
        value: 'ci/validate',
        kind: 'test'
      }),
      expect.objectContaining({
        value: 'ci/test',
        kind: 'test'
      })
    ]);
    expect(issues.map((issue) => issue.message)).not.toContain(
      'No runnable verification command found in instruction files.'
    );
  });

  it('accepts dotnet test commands as runnable verification instructions', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-static-'));
    await writeFile(
      join(root, 'AGENTS.md'),
      [
        '# Agent instructions',
        '',
        'For final validation before committing changes:',
        '',
        '```bash',
        'dotnet build src/Steeltoe.All.slnx --configuration Release',
        'dotnet test src/Steeltoe.All.slnx --configuration Release',
        '```',
        ''
      ].join('\n')
    );
    const instructionFiles = await discoverInstructionFiles(root);

    const issues = await collectStaticIssues(root, instructionFiles);

    expect(instructionFiles[0]?.commands).toEqual([
      expect.objectContaining({
        value: 'dotnet build src/Steeltoe.All.slnx --configuration Release',
        kind: 'build'
      }),
      expect.objectContaining({
        value: 'dotnet test src/Steeltoe.All.slnx --configuration Release',
        kind: 'test'
      })
    ]);
    expect(issues.map((issue) => issue.message)).not.toContain(
      'No runnable verification command found in instruction files.'
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

  it('resolves npm workspace run commands when -w appears before the script', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-static-'));
    await mkdir(join(root, 'plugins/wp-graphql'), { recursive: true });
    await writeFile(
      join(root, 'package.json'),
      JSON.stringify({
        workspaces: ['plugins/*'],
        scripts: {
          build: 'turbo run build'
        }
      })
    );
    await writeFile(
      join(root, 'plugins/wp-graphql/package.json'),
      JSON.stringify({
        name: '@wpgraphql/wp-graphql',
        scripts: {
          build: 'wp-scripts build',
          'test:codecept:wpunit': 'codecept run wpunit'
        }
      })
    );
    await writeFile(
      join(root, 'CLAUDE.md'),
      [
        '# Agent instructions',
        '',
        '```bash',
        'npm run -w @wpgraphql/wp-graphql build',
        'npm run -w @wpgraphql/wp-graphql test:codecept:wpunit',
        '```',
        ''
      ].join('\n')
    );
    const instructionFiles = await discoverInstructionFiles(root);

    const issues = await collectStaticIssues(root, instructionFiles);
    const resolutions = await collectCommandResolutions(root, instructionFiles);

    expect(issues.filter((issue) => issue.category === 'command')).toEqual([]);
    expect(resolutions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          command: 'npm run -w @wpgraphql/wp-graphql build',
          scriptName: 'build',
          packageJsonPath: 'plugins/wp-graphql/package.json',
          status: 'resolved'
        }),
        expect.objectContaining({
          command: 'npm run -w @wpgraphql/wp-graphql test:codecept:wpunit',
          scriptName: 'test:codecept:wpunit',
          packageJsonPath: 'plugins/wp-graphql/package.json',
          status: 'resolved'
        })
      ])
    );
  });

  it('resolves recursive pnpm run commands from workspace package scripts', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-static-'));
    await mkdir(join(root, 'typescript/cli'), { recursive: true });
    await writeFile(join(root, 'package.json'), JSON.stringify({ scripts: { build: 'pnpm -r build' } }));
    await writeFile(join(root, 'pnpm-workspace.yaml'), "packages:\n  - 'typescript/*'\n");
    await writeFile(
      join(root, 'typescript/cli/package.json'),
      JSON.stringify({
        scripts: {
          format: 'biome format --write'
        }
      })
    );
    await writeFile(
      join(root, 'CLAUDE.md'),
      ['# Agent instructions', '', '```bash', 'pnpm -r run format', '```', ''].join('\n')
    );
    const instructionFiles = await discoverInstructionFiles(root);

    const issues = await collectStaticIssues(root, instructionFiles);
    const resolutions = await collectCommandResolutions(root, instructionFiles);

    expect(issues.filter((issue) => issue.category === 'command')).toEqual([]);
    expect(resolutions).toContainEqual(
      expect.objectContaining({
        command: 'pnpm -r run format',
        scriptName: 'format',
        packageJsonPath: 'typescript/cli/package.json',
        status: 'resolved'
      })
    );
  });

  it('does not treat bun x external commands as package scripts', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-static-'));
    await writeFile(
      join(root, 'package.json'),
      JSON.stringify({
        scripts: {
          check: 'bun ./packages/cli/src/index.ts check'
        }
      })
    );
    await writeFile(join(root, 'CLAUDE.md'), ['# Agent instructions', '', 'Run `bun x ultracite check` before committing.', ''].join('\n'));
    const instructionFiles = await discoverInstructionFiles(root);

    const issues = await collectStaticIssues(root, instructionFiles);
    const resolutions = await collectCommandResolutions(root, instructionFiles);

    expect(issues.map((issue) => issue.message)).not.toContain('Documented command references missing package script "x".');
    expect(issues.map((issue) => issue.message)).not.toContain('No runnable verification command found in instruction files.');
    expect(resolutions).toEqual([]);
  });

  it('resolves cursor rules from heading and frontmatter package scope without treating nearby prose paths as cwd', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-static-'));
    await mkdir(join(root, '.cursor/rules'), { recursive: true });
    await mkdir(join(root, 'app/client'), { recursive: true });
    await writeFile(
      join(root, 'app/client/package.json'),
      JSON.stringify({
        scripts: {
          'test:unit': 'jest',
          'test:pw:flake-check': 'playwright test --repeat-each 5',
          'test:pw:regression': 'playwright test regression',
          'test:pw:sanity': 'playwright test sanity',
          'test:pw:smoke': 'playwright test smoke'
        }
      })
    );
    await writeFile(
      join(root, '.cursor/rules/frontend.mdc'),
      [
        '---',
        'description: React frontend commands',
        '---',
        '# Frontend - `app/client/`',
        '',
        'Look for `ce/`, `ee/`, and `enterprise/` directories under `src/`.',
        '',
        '## Testing',
        '',
        '- **Unit:** Jest - `yarn run test:unit`',
        ''
      ].join('\n')
    );
    await writeFile(
      join(root, '.cursor/rules/playwright.mdc'),
      [
        '---',
        'description: Playwright E2E test conventions',
        'globs:',
        '  - app/client/playwright/**/*.ts',
        'alwaysApply: false',
        '---',
        '# Playwright E2E Conventions',
        '',
        '- Never use bare `test.skip()`. Use `test.fixme("reason")` to track why.',
        '- Before merging new specs: `yarn test:pw:flake-check --grep "test name"`.',
        '',
        '```text',
        'playwright/tests/',
        '  smoke/',
        '  sanity/',
        '  regression/',
        '```',
        '',
        '- Run by tier: `yarn test:pw:smoke`, `yarn test:pw:sanity`, `yarn test:pw:regression`',
        ''
      ].join('\n')
    );
    const instructionFiles = await discoverInstructionFiles(root);

    const issues = await collectStaticIssues(root, instructionFiles);
    const resolutions = await collectCommandResolutions(root, instructionFiles);

    expect(issues.filter((issue) => issue.category === 'command')).toEqual([]);
    expect(resolutions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          command: 'yarn run test:unit',
          packageJsonPath: 'app/client/package.json',
          status: 'resolved'
        }),
        expect.objectContaining({
          command: 'yarn test:pw:flake-check --grep "test name"',
          packageJsonPath: 'app/client/package.json',
          status: 'resolved'
        }),
        expect.objectContaining({
          command: 'yarn test:pw:smoke',
          packageJsonPath: 'app/client/package.json',
          status: 'resolved'
        })
      ])
    );
    expect(resolutions.map((resolution) => resolution.packageJsonPath)).not.toContain('ce/package.json');
    expect(resolutions.map((resolution) => resolution.packageJsonPath)).not.toContain('test.skip(/package.json');
    expect(resolutions.map((resolution) => resolution.packageJsonPath)).not.toContain('smoke/package.json');
  });

  it('does not apply an older path heading to later unscoped command sections', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-static-'));
    await mkdir(join(root, '__fixtures__'), { recursive: true });
    await writeFile(
      join(root, 'package.json'),
      JSON.stringify({
        scripts: {
          build: 'tsc -b',
          'format:write': 'prettier --write .',
          'e2e-build-package-publish': 'node tools/e2e.js'
        }
      })
    );
    await writeFile(join(root, '__fixtures__/package.json'), JSON.stringify({ scripts: {} }));
    await writeFile(
      join(root, 'CLAUDE.md'),
      [
        '# Agent instructions',
        '',
        '### `/__fixtures__/` - Test Fixtures',
        '',
        'Fixture-specific notes live here.',
        '',
        '## Common Commands',
        '',
        '```bash',
        'npm run build',
        'npm run format:write',
        'npm run e2e-build-package-publish',
        '```',
        ''
      ].join('\n')
    );
    const instructionFiles = await discoverInstructionFiles(root);

    const issues = await collectStaticIssues(root, instructionFiles);
    const resolutions = await collectCommandResolutions(root, instructionFiles);

    expect(issues.filter((issue) => issue.category === 'command')).toEqual([]);
    expect(resolutions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          command: 'npm run build',
          packageJsonPath: 'package.json',
          status: 'resolved'
        }),
        expect.objectContaining({
          command: 'npm run format:write',
          packageJsonPath: 'package.json',
          status: 'resolved'
        }),
        expect.objectContaining({
          command: 'npm run e2e-build-package-publish',
          packageJsonPath: 'package.json',
          status: 'resolved'
        })
      ])
    );
  });

  it('falls back to root scripts for nested instructions when only the root defines the script', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-static-'));
    await mkdir(join(root, 'crates'), { recursive: true });
    await writeFile(
      join(root, 'package.json'),
      JSON.stringify({
        scripts: {
          'build:sdk': 'turbo run --filter @agentfit/sdk build',
          format: 'prettier --write .'
        }
      })
    );
    await writeFile(join(root, 'crates/package.json'), JSON.stringify({ scripts: {} }));
    await writeFile(
      join(root, 'crates/AGENTS.md'),
      [
        '# Crate instructions',
        '',
        'After changing exported SDK types, run:',
        '',
        '```bash',
        'pnpm build:sdk && pnpm format',
        '```',
        ''
      ].join('\n')
    );
    const instructionFiles = await discoverInstructionFiles(root);

    const issues = await collectStaticIssues(root, instructionFiles);
    const resolutions = await collectCommandResolutions(root, instructionFiles);

    expect(issues.filter((issue) => issue.category === 'command')).toEqual([]);
    expect(resolutions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          command: 'pnpm build:sdk && pnpm format',
          scriptName: 'build:sdk',
          packageJsonPath: 'package.json',
          status: 'resolved'
        })
      ])
    );
  });

  it('treats prose monorepo root guidance as root instead of a generic word directory', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-static-'));
    await mkdir(join(root, 'tegg'), { recursive: true });
    await writeFile(
      join(root, 'package.json'),
      JSON.stringify({
        scripts: {
          build: 'tsc -b',
          clean: 'rimraf dist',
          test: 'vitest',
          'test:cov': 'vitest --coverage',
          ci: 'vitest --coverage --bail'
        }
      })
    );
    await writeFile(
      join(root, 'tegg/CLAUDE.md'),
      [
        '# Tegg instructions',
        '',
        '**Note:** All commands below should be run from the **monorepo root** (`../egg`), not from the tegg directory.',
        '',
        '```bash',
        'pnpm run build',
        'pnpm run clean',
        'pnpm test',
        'pnpm run test:cov',
        'pnpm run ci',
        '```',
        ''
      ].join('\n')
    );
    const instructionFiles = await discoverInstructionFiles(root);

    const issues = await collectStaticIssues(root, instructionFiles);
    const resolutions = await collectCommandResolutions(root, instructionFiles);

    expect(issues.filter((issue) => issue.category === 'command')).toEqual([]);
    expect(resolutions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          command: 'pnpm run build',
          packageJsonPath: 'package.json',
          status: 'resolved'
        }),
        expect.objectContaining({
          command: 'pnpm test',
          packageJsonPath: 'package.json',
          status: 'resolved'
        })
      ])
    );
    expect(resolutions.map((resolution) => resolution.packageJsonPath)).not.toContain('the/package.json');
  });

  it('reuses same-file package script resolutions for later shorthand commands', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-static-'));
    await mkdir(join(root, 'deck'), { recursive: true });
    await writeFile(join(root, 'deck/package.json'), JSON.stringify({ scripts: { lint: 'eslint .' } }));
    await writeFile(
      join(root, 'AGENTS.md'),
      [
        '# Instructions',
        '',
        '### Frontend',
        '',
        '```bash',
        'cd deck',
        'yarn lint',
        '```',
        '',
        '## Testing Strategy',
        '',
        '- Run `spotlessCheck` / `yarn lint` before commits',
        '',
        '## Git & PR Policy',
        '',
        '- Run `./gradlew spotlessCheck` and `yarn lint` before committing',
        ''
      ].join('\n')
    );
    const instructionFiles = await discoverInstructionFiles(root);

    const issues = await collectStaticIssues(root, instructionFiles);
    const resolutions = await collectCommandResolutions(root, instructionFiles);

    expect(issues.filter((issue) => issue.category === 'command')).toEqual([]);
    expect(resolutions.filter((resolution) => resolution.command === 'yarn lint')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          packageJsonPath: 'deck/package.json',
          status: 'resolved'
        })
      ])
    );
    expect(resolutions.map((resolution) => resolution.packageJsonPath)).not.toContain('spotlessCheck/package.json');
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

  it('documents nested monorepo fixture scope warnings and fixed coverage', async () => {
    const badRoot = join(process.cwd(), 'examples/fixtures/nested-monorepo/bad');
    const fixedRoot = join(process.cwd(), 'examples/fixtures/nested-monorepo/fixed');

    const badIssues = await collectStaticIssues(badRoot, await discoverInstructionFiles(badRoot));
    const fixedIssues = await collectStaticIssues(fixedRoot, await discoverInstructionFiles(fixedRoot));

    expect(badIssues).toContainEqual(
      expect.objectContaining({
        category: 'scope',
        sourcePath: 'packages/api',
        message: 'No nested instruction file found for packages/api.',
        severity: 'warning'
      })
    );
    expect(badIssues).not.toContainEqual(
      expect.objectContaining({
        category: 'scope',
        sourcePath: 'packages/web'
      })
    );
    expect(fixedIssues.filter((issue) => issue.category === 'scope')).toEqual([]);
  });
});
