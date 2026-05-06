import { mkdtemp, readFile, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execa } from 'execa';
import { describe, expect, it } from 'vitest';
import { createDryRunAdapter } from '../../src/adapters/dry-run.js';
import { evaluateTasks } from '../../src/core/evaluator.js';
import type { FitnessTask } from '../../src/types.js';

async function createFixtureRepo(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'agentfit-dry-run-'));

  await writeFile(join(root, 'package.json'), JSON.stringify({ type: 'module' }, null, 2));
  await writeFile(join(root, 'README.md'), 'Before\n');
  await execa('git', ['init'], { cwd: root });
  await execa('git', ['config', 'user.email', 'agentfit@example.test'], { cwd: root });
  await execa('git', ['config', 'user.name', 'AgentFit Test'], { cwd: root });
  await execa('git', ['add', '.'], { cwd: root });
  await execa('git', ['commit', '-m', 'initial'], { cwd: root });

  return root;
}

describe('dry-run evaluation', () => {
  it('runs checks inside an isolated worktree and leaves the checkout untouched', async () => {
    const root = await createFixtureRepo();
    const task: FitnessTask = {
      id: 'readme-check',
      title: 'Verify README',
      prompt: 'Run repository verification without editing the checkout.',
      expectedChecks: ['node -e "require(\'node:fs\').accessSync(\'README.md\')"'],
      filesLikelyTouched: ['README.md']
    };

    const runs = await evaluateTasks({
      root,
      adapter: createDryRunAdapter(),
      tasks: [task],
      worktreeDir: '.agentfit/worktrees',
      keepWorktrees: false
    });

    expect(runs).toHaveLength(1);
    expect(runs[0]).toMatchObject({
      adapter: 'dry-run',
      task,
      status: 'passed',
      diffStat: {
        filesChanged: 0,
        insertions: 0,
        deletions: 0
      }
    });
    expect(runs[0]?.verification).toHaveLength(1);
    expect(runs[0]?.verification[0]?.exitCode).toBe(0);
    await expect(readFile(join(root, 'README.md'), 'utf8')).resolves.toBe('Before\n');
    await expect(stat(join(root, '.agentfit/worktrees/readme-check'))).rejects.toThrow();
  });

  it('keeps failed check output in the run record', async () => {
    const root = await createFixtureRepo();
    const task: FitnessTask = {
      id: 'missing-file-check',
      title: 'Verify missing file',
      prompt: 'Run a check that should fail.',
      expectedChecks: ['node -e "require(\'node:fs\').accessSync(\'missing.txt\')"'],
      filesLikelyTouched: ['missing.txt']
    };

    const [run] = await evaluateTasks({
      root,
      adapter: createDryRunAdapter(),
      tasks: [task],
      worktreeDir: '.agentfit/worktrees',
      keepWorktrees: false
    });

    expect(run?.status).toBe('failed');
    expect(run?.verification[0]?.exitCode).not.toBe(0);
    expect(run?.verification[0]?.stderr).toContain('missing.txt');
  });

  it('captures untracked files in diff stats before cleanup', async () => {
    const root = await createFixtureRepo();
    const task: FitnessTask = {
      id: 'new-file-check',
      title: 'Create a note',
      prompt: 'Create a small note file.',
      expectedChecks: ['test -f NOTE.md'],
      filesLikelyTouched: ['NOTE.md']
    };

    const [run] = await evaluateTasks({
      root,
      adapter: {
        name: 'dry-run',
        async runTask(context) {
          await writeFile(join(context.worktreePath, 'NOTE.md'), 'One\nTwo\n');
          return { status: 'passed' };
        }
      },
      tasks: [task],
      worktreeDir: '.agentfit/worktrees',
      keepWorktrees: false
    });

    expect(run?.status).toBe('passed');
    expect(run?.diffStat).toEqual({
      filesChanged: 1,
      insertions: 2,
      deletions: 0
    });
    await expect(stat(join(root, 'NOTE.md'))).rejects.toThrow();
  });
});
