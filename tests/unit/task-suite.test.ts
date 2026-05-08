import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { generateFitnessTasks } from '../../src/core/task-suite.js';

describe('generateFitnessTasks', () => {
  it('generates deterministic tasks from package scripts, tests, recent paths, and fallback', async () => {
    const tasks = await generateFitnessTasks('tests/fixtures/basic-repo', {
      taskCount: 5,
      recentPaths: ['src/index.ts']
    });

    expect(tasks.map((task) => task.id)).toEqual([
      'script-test',
      'script-typecheck',
      'script-lint',
      'script-build',
      'test-example-test'
    ]);
    expect(tasks[0]?.expectedChecks).toEqual(['npm run test']);
  });

  it('includes explicit configured verification commands as a task', async () => {
    const tasks = await generateFitnessTasks('tests/fixtures/basic-repo', {
      taskCount: 1,
      configuredChecks: ['npm test', 'npm run lint']
    });

    expect(tasks[0]).toMatchObject({
      id: 'config-verification',
      title: 'Run configured verification commands',
      expectedChecks: ['npm test', 'npm run lint'],
      filesLikelyTouched: ['agentfit.config.yml']
    });
  });

  it('omits external-service tasks unless explicitly allowed', async () => {
    const defaultTasks = await generateFitnessTasks('tests/fixtures/basic-repo', {
      taskCount: 20
    });
    const allowedTasks = await generateFitnessTasks('tests/fixtures/basic-repo', {
      taskCount: 20,
      allowExternalServices: true
    });

    expect(defaultTasks.some((task) => task.id === 'script-e2e')).toBe(false);
    expect(allowedTasks.some((task) => task.id === 'script-e2e')).toBe(true);
  });

  it('includes a harmless README fallback task when more tasks are requested', async () => {
    const tasks = await generateFitnessTasks('tests/fixtures/basic-repo', {
      taskCount: 20
    });

    expect(tasks.at(-1)).toMatchObject({
      id: 'fallback-readme-wording',
      title: 'Make a harmless README wording change and run verification',
      filesLikelyTouched: ['README.md']
    });
  });

  it('prioritizes verification scripts and skips interactive lifecycle scripts', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-task-suite-'));
    await mkdir(join(root, 'tests'));
    await mkdir(join(root, 'tests/fixtures/basic-repo/src'), { recursive: true });
    await writeFile(
      join(root, 'package.json'),
      JSON.stringify(
        {
          packageManager: 'pnpm@10.33.0',
          scripts: {
            dev: 'tsx src/cli/index.ts',
            prepack: 'pnpm build',
            test: 'vitest run',
            typecheck: 'tsc --noEmit',
            lint: 'eslint .',
            build: 'tsup',
            'test:unit': 'vitest run tests/unit'
          }
        },
        null,
        2
      )
    );
    await writeFile(join(root, 'tests/example.test.ts'), 'export {};\n');
    await writeFile(join(root, 'tests/fixtures/basic-repo/src/index.ts'), 'export const fixture = true;\n');

    const tasks = await generateFitnessTasks(root, { taskCount: 6 });

    expect(tasks.map((task) => task.id)).toEqual([
      'script-test',
      'script-test-unit',
      'script-typecheck',
      'script-lint',
      'script-build',
      'test-example-test'
    ]);
    expect(tasks.some((task) => task.id === 'script-dev')).toBe(false);
    expect(tasks.some((task) => task.id === 'script-prepack')).toBe(false);
    expect(tasks.some((task) => task.filesLikelyTouched.includes('tests/fixtures/basic-repo/src/index.ts'))).toBe(
      false
    );
    expect(tasks[0]?.expectedChecks).toEqual(['pnpm run test']);
    expect(tasks[5]?.expectedChecks).toEqual(['pnpm run test']);
  });

  it('ignores fixture and example test files when selecting repository tasks', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-task-suite-'));
    await mkdir(join(root, 'tests/unit'), { recursive: true });
    await mkdir(join(root, 'tests/fixtures/basic-repo/tests'), { recursive: true });
    await mkdir(join(root, 'examples/demo/tests'), { recursive: true });
    await writeFile(join(root, 'package.json'), JSON.stringify({ scripts: { test: 'vitest run' } }, null, 2));
    await writeFile(join(root, 'tests/unit/scoring.test.ts'), 'export {};\n');
    await writeFile(join(root, 'tests/fixtures/basic-repo/tests/example.test.ts'), 'export {};\n');
    await writeFile(join(root, 'examples/demo/tests/example.test.ts'), 'export {};\n');

    const tasks = await generateFitnessTasks(root, { taskCount: 10 });
    const touchedFiles = tasks.flatMap((task) => task.filesLikelyTouched);

    expect(touchedFiles).toContain('tests/unit/scoring.test.ts');
    expect(touchedFiles).not.toContain('tests/fixtures/basic-repo/tests/example.test.ts');
    expect(touchedFiles).not.toContain('examples/demo/tests/example.test.ts');
  });
});
