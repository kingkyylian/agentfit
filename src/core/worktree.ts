import { mkdir, rmdir } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';
import { execa } from 'execa';
import { assertGitRepository, getHeadRef } from './git.js';

export type EvaluationWorktree = {
  root: string;
  path: string;
  taskId: string;
};

export type CreateEvaluationWorktreeOptions = {
  root: string;
  worktreeDir: string;
  taskId: string;
};

function safePathName(value: string): string {
  const name = value.replaceAll(/[^a-zA-Z0-9._-]/g, '-').replaceAll(/^-+|-+$/g, '');
  return name.length > 0 ? name : 'task';
}

function resolveWorktreePath(root: string, worktreeDir: string, taskId: string): string {
  const base = isAbsolute(worktreeDir) ? worktreeDir : join(root, worktreeDir);
  return join(base, safePathName(taskId));
}

export async function createEvaluationWorktree(
  options: CreateEvaluationWorktreeOptions
): Promise<EvaluationWorktree> {
  const root = await assertGitRepository(options.root);
  const head = await getHeadRef(root);
  const path = resolveWorktreePath(root, options.worktreeDir, options.taskId);

  await mkdir(join(path, '..'), { recursive: true });

  const result = await execa('git', ['worktree', 'add', '--detach', path, head], {
    cwd: root,
    reject: false
  });

  if (result.exitCode !== 0) {
    throw new Error(`Unable to create evaluation worktree: ${result.stderr || result.stdout}`);
  }

  return { root, path, taskId: options.taskId };
}

export async function removeEvaluationWorktree(worktree: EvaluationWorktree): Promise<void> {
  const result = await execa('git', ['worktree', 'remove', '--force', worktree.path], {
    cwd: worktree.root,
    reject: false
  });

  if (result.exitCode !== 0 && !result.stderr.includes('is not a working tree')) {
    throw new Error(`Unable to remove evaluation worktree: ${result.stderr || result.stdout}`);
  }

  await execa('git', ['worktree', 'prune'], { cwd: worktree.root, reject: false });
  await rmdir(join(worktree.path, '..')).catch(() => undefined);
  await rmdir(join(worktree.path, '../..')).catch(() => undefined);
}
