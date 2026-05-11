import { readFile } from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import type { InstructionFile, InstructionKind } from '../types.js';
import { extractCommands } from './command-extractor.js';
import { resolveInstructionReferences } from './references.js';

export const DEFAULT_INSTRUCTION_PATTERNS = [
  'AGENTS.md',
  '**/AGENTS.md',
  'CLAUDE.md',
  '**/CLAUDE.md',
  'GEMINI.md',
  '**/GEMINI.md',
  '.cursor/rules/**/*.mdc',
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

  const sortedPaths = paths.map(normalizePath).sort();
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

function instructionKind(filePath: string): InstructionKind {
  const normalized = normalizePath(filePath);
  const base = path.posix.basename(normalized);

  if (base === 'AGENTS.md') {
    return 'agents';
  }

  if (base === 'CLAUDE.md') {
    return 'claude';
  }

  if (base === 'GEMINI.md') {
    return 'gemini';
  }

  if (normalized.startsWith('.cursor/rules/') && normalized.endsWith('.mdc')) {
    return 'cursor';
  }

  if (
    normalized === '.github/copilot-instructions.md' ||
    normalized.startsWith('.github/instructions/')
  ) {
    return 'copilot';
  }

  return 'unknown';
}

function normalizePath(value: string): string {
  return value.split(path.sep).join('/');
}
