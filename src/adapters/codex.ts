import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { execa } from 'execa';
import type { EvaluationAdapter } from './adapter.js';

export type CodexAdapterOptions = {
  executable?: string;
  args?: string[];
  timeoutMs?: number;
  budgetUsd?: number;
  env?: NodeJS.ProcessEnv;
};

function applyTemplate(value: string, repoPath: string, prompt: string): string {
  return value.replaceAll('{repo}', repoPath).replaceAll('{prompt}', prompt);
}

async function isExecutableAvailable(executable: string): Promise<boolean> {
  if (executable.includes('/')) {
    try {
      await access(executable, constants.X_OK);
      return true;
    } catch {
      return false;
    }
  }

  const result = await execa('which', [executable], { reject: false });
  return result.exitCode === 0;
}

export function createCodexAdapter(options: CodexAdapterOptions = {}): EvaluationAdapter {
  const executable = options.executable ?? 'codex';
  const args = options.args ?? ['exec', '-C', '{repo}', '--skip-git-repo-check', '{prompt}'];

  return {
    name: 'codex',
    async runTask(context, task) {
      if ((options.budgetUsd ?? context.budgetUsd ?? 1) <= 0) {
        return {
          status: 'skipped',
          message: 'Codex adapter skipped because budgetUsd is 0.'
        };
      }

      if (!(await isExecutableAvailable(executable))) {
        return {
          status: 'skipped',
          message: `Codex adapter skipped because "${executable}" is not installed.`
        };
      }

      const started = performance.now();
      const renderedArgs = args.map((arg) => applyTemplate(arg, context.worktreePath, task.prompt));
      const timeout = options.timeoutMs ?? context.timeoutMs;
      const execaOptions = {
        cwd: context.worktreePath,
        reject: false,
        ...(options.env !== undefined ? { env: options.env } : {}),
        ...(timeout !== undefined ? { timeout } : {})
      };
      const result = await execa(executable, renderedArgs, execaOptions).catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        return {
          exitCode: 1,
          stdout: '',
          stderr: message
        };
      });
      const durationMs = Math.round(performance.now() - started);

      return {
        status: result.exitCode === 0 ? 'passed' : 'failed',
        verification: [
          {
            command: [executable, ...renderedArgs].join(' '),
            exitCode: result.exitCode ?? 1,
            stdout: result.stdout,
            stderr: result.stderr,
            durationMs
          }
        ],
        message:
          result.exitCode === 0
            ? 'Codex command completed.'
            : `Codex command failed with exit code ${result.exitCode}.`
      };
    }
  };
}
