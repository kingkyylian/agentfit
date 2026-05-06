import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { execa, execaCommand } from 'execa';
import type { CommandResult, EvaluationRun } from '../types.js';

export async function assertGitRepository(root: string): Promise<string> {
  const result = await execa('git', ['rev-parse', '--show-toplevel'], {
    cwd: root,
    reject: false
  });

  if (result.exitCode !== 0) {
    throw new Error(`AgentFit evaluation requires a git repository: ${result.stderr || result.stdout}`);
  }

  return result.stdout.trim();
}

export async function getHeadRef(root: string): Promise<string> {
  const result = await execa('git', ['rev-parse', 'HEAD'], {
    cwd: root,
    reject: false
  });

  if (result.exitCode !== 0) {
    throw new Error(`Unable to resolve git HEAD: ${result.stderr || result.stdout}`);
  }

  return result.stdout.trim();
}

export async function getDiffStat(root: string): Promise<EvaluationRun['diffStat']> {
  const result = await execa('git', ['diff', '--numstat', 'HEAD', '--'], {
    cwd: root,
    reject: false
  });

  if (result.exitCode !== 0) {
    throw new Error(`Unable to capture git diff stat: ${result.stderr || result.stdout}`);
  }

  let filesChanged = 0;
  let insertions = 0;
  let deletions = 0;

  for (const line of result.stdout.split('\n')) {
    if (line.trim().length === 0) {
      continue;
    }

    const [added, removed] = line.split('\t');
    filesChanged += 1;
    insertions += added === '-' ? 0 : Number(added ?? 0);
    deletions += removed === '-' ? 0 : Number(removed ?? 0);
  }

  const untracked = await execa('git', ['ls-files', '--others', '--exclude-standard', '-z'], {
    cwd: root,
    reject: false
  });

  if (untracked.exitCode !== 0) {
    throw new Error(`Unable to capture untracked files: ${untracked.stderr || untracked.stdout}`);
  }

  for (const filePath of untracked.stdout.split('\0').filter(Boolean)) {
    filesChanged += 1;
    insertions += await countFileLines(join(root, filePath));
  }

  return { filesChanged, insertions, deletions };
}

async function countFileLines(filePath: string): Promise<number> {
  try {
    const content = await readFile(filePath, 'utf8');
    if (content.length === 0) {
      return 0;
    }

    const lineCount = content.split(/\r\n|\r|\n/).length;
    return content.endsWith('\n') || content.endsWith('\r') ? lineCount - 1 : lineCount;
  } catch {
    return 0;
  }
}

export async function runShellCommand(
  command: string,
  cwd: string,
  timeoutMs?: number
): Promise<CommandResult> {
  const started = performance.now();
  const result = await execaCommand(command, {
    cwd,
    reject: false,
    shell: true,
    ...(timeoutMs !== undefined ? { timeout: timeoutMs } : {})
  }).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    return {
      exitCode: 1,
      stdout: '',
      stderr: message
    };
  });
  const durationMs = Math.round(performance.now() - started);

  return {
    command,
    exitCode: result.exitCode ?? 1,
    stdout: result.stdout,
    stderr: result.stderr,
    durationMs
  };
}
