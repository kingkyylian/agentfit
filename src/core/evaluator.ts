import { delimiter, join } from 'node:path';
import type { AdapterContext, EvaluationAdapter } from '../adapters/adapter.js';
import type { CommandResult, EvaluationRun, FitnessTask } from '../types.js';
import { getDiffStat, runShellCommand } from './git.js';
import {
  createEvaluationWorktree,
  removeEvaluationWorktree,
  type EvaluationWorktree
} from './worktree.js';

export type EvaluateTasksOptions = {
  root: string;
  adapter: EvaluationAdapter;
  tasks: FitnessTask[];
  worktreeDir?: string | undefined;
  keepWorktrees?: boolean | undefined;
  timeoutMs?: number | undefined;
  budgetUsd?: number | undefined;
};

function createAdapterContext(
  options: EvaluateTasksOptions,
  worktree: EvaluationWorktree
): AdapterContext {
  const context: AdapterContext = {
    root: options.root,
    worktreePath: worktree.path
  };

  if (options.timeoutMs !== undefined) {
    context.timeoutMs = options.timeoutMs;
  }

  if (options.budgetUsd !== undefined) {
    context.budgetUsd = options.budgetUsd;
  }

  return context;
}

async function runVerificationCommands(
  commands: string[],
  cwd: string,
  timeoutMs: number | undefined,
  env: NodeJS.ProcessEnv
): Promise<CommandResult[]> {
  const results: CommandResult[] = [];

  for (const command of commands) {
    results.push(await runShellCommand(command, cwd, timeoutMs, env));
  }

  return results;
}

function createVerificationEnv(root: string): NodeJS.ProcessEnv {
  const path = [join(root, 'node_modules', '.bin'), process.env.PATH].filter(Boolean).join(delimiter);
  return { ...process.env, PATH: path };
}

function appendOptionalRunFields(
  run: EvaluationRun,
  values: { message: string | undefined; costUsd: number | undefined }
): EvaluationRun {
  if (values.message !== undefined) {
    run.message = values.message;
  }

  if (values.costUsd !== undefined) {
    run.costUsd = values.costUsd;
  }

  return run;
}

export async function evaluateTasks(options: EvaluateTasksOptions): Promise<EvaluationRun[]> {
  const runs: EvaluationRun[] = [];
  const worktreeDir = options.worktreeDir ?? '.agentfit/worktrees';
  const verificationEnv = createVerificationEnv(options.root);

  for (const task of options.tasks) {
    let worktree: EvaluationWorktree | undefined;
    const startedAt = new Date().toISOString();
    let finishedAt = startedAt;

    try {
      worktree = await createEvaluationWorktree({
        root: options.root,
        worktreeDir,
        taskId: task.id
      });

      const context = createAdapterContext(options, worktree);

      await options.adapter.prepare?.(context);
      const adapterResult = await options.adapter.runTask(context, task);
      const verification =
        adapterResult.status === 'skipped'
          ? (adapterResult.verification ?? [])
          : [
              ...(adapterResult.verification ?? []),
              ...(await runVerificationCommands(task.expectedChecks, worktree.path, options.timeoutMs, verificationEnv))
            ];
      const diffStat = await getDiffStat(worktree.path);
      const failedVerification = verification.some((result) => result.exitCode !== 0);
      const status =
        adapterResult.status === 'skipped'
          ? 'skipped'
          : adapterResult.status === 'failed' || failedVerification
            ? 'failed'
            : 'passed';

      finishedAt = new Date().toISOString();
      runs.push(
        appendOptionalRunFields(
          {
            id: `${options.adapter.name}-${task.id}`,
            adapter: options.adapter.name,
            task,
            startedAt,
            finishedAt,
            status,
            verification,
            diffStat
          },
          {
            message: adapterResult.message,
            costUsd: adapterResult.costUsd
          }
        )
      );
    } finally {
      if (worktree !== undefined) {
        const context = createAdapterContext(options, worktree);

        await options.adapter.cleanup?.(context);

        if (options.keepWorktrees !== true) {
          await removeEvaluationWorktree(worktree);
        }
      }
    }
  }

  return runs;
}
