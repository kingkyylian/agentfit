import { describe, expect, it } from 'vitest';
import { generateFitnessTasks } from '../../src/core/task-suite.js';

describe('generateFitnessTasks', () => {
  it('generates deterministic tasks from package scripts, tests, recent paths, and fallback', async () => {
    const tasks = await generateFitnessTasks('tests/fixtures/basic-repo', {
      taskCount: 5,
      recentPaths: ['src/index.ts']
    });

    expect(tasks.map((task) => task.id)).toEqual([
      'script-build',
      'script-lint',
      'script-test',
      'script-typecheck',
      'test-example-test'
    ]);
    expect(tasks[2]?.expectedChecks).toEqual(['npm run test']);
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
});
