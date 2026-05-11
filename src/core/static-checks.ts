import { readFile } from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import type { ExtractedCommand, InstructionFile, StaticIssue } from '../types.js';

const verificationKinds = new Set(['test', 'lint', 'build']);

export type CollectStaticIssuesOptions = {
  configuredCommands?: ExtractedCommand[];
};

export async function collectStaticIssues(
  root: string,
  instructionFiles: InstructionFile[],
  options: CollectStaticIssuesOptions = {}
): Promise<StaticIssue[]> {
  const commandIssues = await collectCommandIssues(root, instructionFiles, options.configuredCommands ?? []);
  const scopeIssues = await collectScopeIssues(root, instructionFiles);
  const secretIssues = await collectSecretIssues(root, instructionFiles);

  return [...commandIssues, ...scopeIssues, ...secretIssues];
}

async function collectCommandIssues(
  root: string,
  instructionFiles: InstructionFile[],
  configuredCommands: ExtractedCommand[]
): Promise<StaticIssue[]> {
  const issues: StaticIssue[] = [];
  const packageJson = await readPackageJson(path.join(root, 'package.json'));
  const scripts = packageJson?.scripts ?? {};
  const commands = [
    ...instructionFiles.flatMap((file) => file.commands),
    ...configuredCommands
  ];
  const verificationCommands = commands.filter((command) => verificationKinds.has(command.kind));

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

const secretPatterns = [
  {
    name: 'OpenAI API key',
    pattern: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/
  },
  {
    name: 'AWS access key ID',
    pattern: /\bA(?:KIA|SIA)[A-Z0-9]{16}\b/
  },
  {
    name: 'GitHub token',
    pattern: /\bgh[pousr]_[A-Za-z0-9_]{36,}\b/
  },
  {
    name: 'private key',
    pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/
  }
] as const;

async function collectSecretIssues(root: string, instructionFiles: InstructionFile[]): Promise<StaticIssue[]> {
  const issues: StaticIssue[] = [];

  for (const file of instructionFiles) {
    const content = await readFile(path.join(root, file.path), 'utf8');

    for (const secretPattern of secretPatterns) {
      if (secretPattern.pattern.test(content)) {
        issues.push({
          category: 'secret',
          sourcePath: file.path,
          message: `Potential ${secretPattern.name} detected in instruction file.`,
          severity: 'error'
        });
      }
    }
  }

  return issues;
}

function packageScriptName(command: string): string | undefined {
  const tokens = command.trim().split(/\s+/);
  const manager = tokens[0];

  if (!manager || !['pnpm', 'npm', 'yarn', 'bun'].includes(manager)) {
    return undefined;
  }

  let index = 1;
  if (tokens[index] === 'run') {
    index += 1;
  }

  while (index < tokens.length) {
    const token = tokens[index];
    if (!token) {
      return undefined;
    }

    if (token === 'run') {
      index += 1;
      continue;
    }

    if (token.startsWith('-')) {
      index += optionConsumesValue(token) ? 2 : 1;
      continue;
    }

    const scriptName = token;

    if (isPackageManagerCommand(scriptName)) {
      return undefined;
    }

    return scriptName;
  }

  return undefined;
}

function optionConsumesValue(token: string): boolean {
  return !token.includes('=') && ['--cwd', '--filter', '-F', '--workspace', '-w', '--dir', '-C', '--prefix'].includes(token);
}

function isPackageManagerCommand(token: string): boolean {
  return ['install', 'add', 'exec', 'dlx', 'create', 'init', 'remove', 'why', 'config'].includes(token);
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
