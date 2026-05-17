import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import type { InstructionFile, InstructionKind } from '../types.js';
import { extractCommands } from './command-extractor.js';
import { resolveInstructionReferences } from './references.js';

export const DEFAULT_INSTRUCTION_PATTERNS = [
  'AGENTS.md',
  'agents.md',
  '**/AGENTS.md',
  '**/agents.md',
  'CLAUDE.md',
  'claude.md',
  '**/CLAUDE.md',
  '**/claude.md',
  'GEMINI.md',
  'gemini.md',
  '**/GEMINI.md',
  '**/gemini.md',
  '.cursor/rules/**/*.md',
  '.cursor/rules/**/*.mdc',
  'copilot-instructions.md',
  '.copilot-instructions.md',
  '.github/copilot-instructions.md',
  '.github/instructions/**/*.instructions.md'
];

export async function discoverInstructionFiles(
  root: string,
  includePatterns: string[] = DEFAULT_INSTRUCTION_PATTERNS
): Promise<InstructionFile[]> {
  const absoluteRoot = path.resolve(root);
  const paths = await fg(includePatterns, {
    cwd: absoluteRoot,
    onlyFiles: true,
    unique: true,
    dot: true,
    ignore: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/vendor/**']
  });

  const actualPaths = await Promise.all(paths.map((filePath) => resolveActualRelativePath(absoluteRoot, filePath)));
  const sortedPaths = uniqueCaseInsensitive(actualPaths).sort();
  const files = await Promise.all(
    sortedPaths.map(async (filePath) => {
      const absolutePath = path.join(absoluteRoot, filePath);
      const content = await readFile(absolutePath, 'utf8');
      const references = await resolveInstructionReferences({
        root: absoluteRoot,
        sourcePath: filePath,
        content
      });

      return {
        path: filePath,
        scope: path.posix.dirname(filePath) === '.' ? '.' : path.posix.dirname(filePath),
        kind: instructionKind(filePath),
        bytes: Buffer.byteLength(content),
        importedPaths: references.importedPaths,
        commands: extractCommands(content, filePath)
      };
    })
  );

  return files;
}

async function resolveActualRelativePath(root: string, filePath: string): Promise<string> {
  const segments = normalizePath(filePath).split('/');
  const actualSegments: string[] = [];
  let currentDir = root;

  for (const segment of segments) {
    const entries = await readdir(currentDir);
    const actualSegment = entries.find((entry) => entry.toLowerCase() === segment.toLowerCase()) ?? segment;
    actualSegments.push(actualSegment);
    currentDir = path.join(currentDir, actualSegment);
  }

  return actualSegments.join('/');
}

function uniqueCaseInsensitive(paths: string[]): string[] {
  const uniquePaths = new Map<string, string>();

  for (const filePath of paths) {
    uniquePaths.set(filePath.toLowerCase(), normalizePath(filePath));
  }

  return [...uniquePaths.values()];
}

function instructionKind(filePath: string): InstructionKind {
  const normalized = normalizePath(filePath);
  const lowerNormalized = normalized.toLowerCase();
  const base = path.posix.basename(lowerNormalized);

  if (base === 'agents.md') {
    return 'agents';
  }

  if (base === 'claude.md') {
    return 'claude';
  }

  if (base === 'gemini.md') {
    return 'gemini';
  }

  if (lowerNormalized.startsWith('.cursor/rules/') && (lowerNormalized.endsWith('.md') || lowerNormalized.endsWith('.mdc'))) {
    return 'cursor';
  }

  if (
    base === 'copilot-instructions.md' ||
    lowerNormalized === '.github/copilot-instructions.md' ||
    lowerNormalized.startsWith('.github/instructions/')
  ) {
    return 'copilot';
  }

  return 'unknown';
}

function normalizePath(value: string): string {
  return value.split(path.sep).join('/');
}
