import { readFile } from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import type { InstructionFile, StaticIssue } from '../types.js';

const verificationKinds = new Set(['test', 'lint', 'build']);

export async function collectStaticIssues(root: string, instructionFiles: InstructionFile[]): Promise<StaticIssue[]> {
  const commandIssues = await collectCommandIssues(root, instructionFiles);
  const scopeIssues = await collectScopeIssues(root, instructionFiles);

  return [...commandIssues, ...scopeIssues];
}

async function collectCommandIssues(root: string, instructionFiles: InstructionFile[]): Promise<StaticIssue[]> {
  const issues: StaticIssue[] = [];
  const packageJson = await readPackageJson(path.join(root, 'package.json'));
  const scripts = packageJson?.scripts ?? {};
  const verificationCommands = instructionFiles.flatMap((file) =>
    file.commands.filter((command) => verificationKinds.has(command.kind))
  );

  for (const command of verificationCommands) {
    const scriptName = packageScriptName(command.value);
    if (scriptName && scripts[scriptName] === undefined) {
      issues.push({
        category: 'command',
        sourcePath: command.sourcePath,
        message: `Documented command references missing package script "${scriptName}".`,
        severity: 'error'
      });
    }
  }

  const hasRunnableVerification = verificationCommands.some((command) => {
    const scriptName = packageScriptName(command.value);
    return scriptName === undefined || scripts[scriptName] !== undefined;
  });

  if (!hasRunnableVerification) {
    issues.push({
      category: 'command',
      sourcePath: instructionFiles[0]?.path ?? '.',
      message: 'No runnable verification command found in instruction files.',
      severity: 'error'
    });
  }

  return issues;
}

async function collectScopeIssues(root: string, instructionFiles: InstructionFile[]): Promise<StaticIssue[]> {
  const packageJsonPaths = await fg(['packages/*/package.json', 'apps/*/package.json'], {
    cwd: root,
    onlyFiles: true,
    dot: true,
    ignore: ['**/node_modules/**', '**/dist/**']
  });
  const instructionScopes = new Set(instructionFiles.map((file) => file.scope));

  return packageJsonPaths
    .map((packageJsonPath) => normalizePath(path.posix.dirname(packageJsonPath)))
    .sort()
    .filter((scope) => !instructionScopes.has(scope))
    .map((scope) => ({
      category: 'scope' as const,
      sourcePath: scope,
      message: `No nested instruction file found for ${scope}.`,
      severity: 'warning' as const
    }));
}

function packageScriptName(command: string): string | undefined {
  const match = command.match(/^(?:pnpm|npm|yarn|bun)(?:\s+run)?\s+([A-Za-z0-9:_-]+)(?:\s|$)/);
  const scriptName = match?.[1];

  if (!scriptName || scriptName === 'install') {
    return undefined;
  }

  return scriptName;
}

async function readPackageJson(filePath: string): Promise<{ scripts?: Record<string, string> } | undefined> {
  try {
    return JSON.parse(await readFile(filePath, 'utf8')) as { scripts?: Record<string, string> };
  } catch {
    return undefined;
  }
}

function normalizePath(value: string): string {
  return value.split(path.sep).join('/');
}
