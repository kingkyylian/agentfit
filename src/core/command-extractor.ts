import type { CommandKind, ExtractedCommand } from '../types.js';

const inlineCommandPrefixes = [
  'pnpm',
  'npm',
  'yarn',
  'bun',
  'npx',
  'node',
  'tsx',
  'tsc',
  'vitest',
  'jest',
  'eslint',
  'prettier',
  'cargo',
  'go',
  'python',
  'python3',
  'pytest',
  'make',
  'docker'
];

const repoLocalCommandDirs = new Set(['bin', 'ci', 'script', 'scripts', 'tooling', 'tools']);
const shellFenceLanguages = new Set(['bash', 'sh', 'shell', 'zsh', 'console', 'terminal']);

export function extractCommands(markdown: string, sourcePath: string): ExtractedCommand[] {
  const commands: ExtractedCommand[] = [];
  const lines = markdown.split(/\r?\n/);
  const fencedLineIndexes = new Set<number>();
  let inShellFence = false;
  let inOtherFence = false;

  lines.forEach((line, index) => {
    const fence = line.match(/^```\s*([A-Za-z0-9_-]*)\s*$/);
    if (fence) {
      const language = fence[1]?.toLowerCase() ?? '';
      if (inShellFence || inOtherFence) {
        inShellFence = false;
        inOtherFence = false;
      } else if (language === '' || shellFenceLanguages.has(language)) {
        inShellFence = true;
      } else {
        inOtherFence = true;
      }
      fencedLineIndexes.add(index);
      return;
    }

    if (inShellFence) {
      fencedLineIndexes.add(index);
      const command = normalizeShellCommand(line);
      if (command) {
        commands.push(toExtractedCommand(command, sourcePath, index + 1));
      }
    } else if (inOtherFence) {
      fencedLineIndexes.add(index);
    }
  });

  lines.forEach((line, index) => {
    if (fencedLineIndexes.has(index)) {
      return;
    }

    const snippets = line.matchAll(/`([^`\n]+)`/g);
    for (const snippet of snippets) {
      const value = snippet[1]?.trim();
      if (value && looksLikeCommand(value)) {
        commands.push(toExtractedCommand(value, sourcePath, index + 1));
      }
    }
  });

  return commands;
}

export function classifyCommand(command: string): CommandKind {
  const value = command.toLowerCase();

  if (/\b(install|bootstrap|setup)\b/.test(value)) {
    return 'setup';
  }

  if (/\b(check|kani|test|validate|vitest|jest|pytest)\b/.test(value)) {
    return 'test';
  }

  if (/\b(clippy|fmt|format|lint|eslint|prettier)\b/.test(value)) {
    return 'lint';
  }

  if (/\b(build|compile|tsc|typecheck)\b/.test(value)) {
    return 'build';
  }

  return 'unknown';
}

function toExtractedCommand(value: string, sourcePath: string, line: number): ExtractedCommand {
  return {
    value,
    sourcePath,
    line,
    kind: classifyCommand(value)
  };
}

function normalizeShellCommand(line: string): string | undefined {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) {
    return undefined;
  }

  const withoutPrompt = trimmed.replace(/^\$\s+/, '');
  return withoutPrompt || undefined;
}

function looksLikeCommand(value: string): boolean {
  const firstToken = value.split(/\s+/)[0];
  return firstToken ? inlineCommandPrefixes.includes(firstToken) || looksLikeRepoLocalCommand(firstToken) : false;
}

function looksLikeRepoLocalCommand(firstToken: string): boolean {
  const normalized = firstToken.replace(/^\.\//, '');
  const [topLevelDir, executableName] = normalized.split('/', 2);

  if (!topLevelDir || !executableName || !repoLocalCommandDirs.has(topLevelDir)) {
    return false;
  }

  return classifyCommand(executableName) !== 'unknown';
}
