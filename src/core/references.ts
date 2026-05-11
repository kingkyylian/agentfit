import { stat, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { ReferenceIssue } from '../types.js';

export type MarkdownReference = {
  target: string;
  line: number;
};

export type ResolvedReferences = {
  importedPaths: string[];
  issues: ReferenceIssue[];
};

export type ResolveInstructionReferencesOptions = {
  root: string;
  sourcePath: string;
  content?: string;
};

export async function resolveInstructionReferences(
  options: ResolveInstructionReferencesOptions
): Promise<ResolvedReferences> {
  const root = path.resolve(options.root);
  const sourcePath = normalizePath(options.sourcePath);
  const sourceAbsolutePath = path.resolve(root, sourcePath);
  const content = options.content ?? (await readFile(sourceAbsolutePath, 'utf8'));
  const references = extractMarkdownReferences(content);
  const importedPaths: string[] = [];
  const issues: ReferenceIssue[] = [];

  for (const reference of references) {
    const resolved = path.resolve(path.dirname(sourceAbsolutePath), reference.target);
    const relative = normalizePath(path.relative(root, resolved));

    if (isOutsideRoot(root, resolved)) {
      issues.push({
        sourcePath,
        line: reference.line,
        target: reference.target,
        message: `Referenced file escapes repository root: ${reference.target}`,
        severity: 'error'
      });
      continue;
    }

    if (!(await exists(resolved))) {
      issues.push({
        sourcePath,
        line: reference.line,
        target: reference.target,
        message: `Referenced file does not exist: ${reference.target}`,
        severity: 'error'
      });
      continue;
    }

    importedPaths.push(relative);
  }

  return {
    importedPaths: [...new Set(importedPaths)].sort(),
    issues
  };
}

export function extractMarkdownReferences(markdown: string): MarkdownReference[] {
  const references: MarkdownReference[] = [];
  const lines = markdown.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const match of line.matchAll(/(^|[\s([])@([^\s)\],>]+)/g)) {
      const target = trimReference(match[2] ?? '');
      if (isFileReference(target)) {
        references.push({
          target,
          line: index + 1
        });
      }
    }
  });

  return references;
}

async function exists(filePath: string): Promise<boolean> {
  try {
    const stats = await stat(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
}

function isOutsideRoot(root: string, target: string): boolean {
  const relative = path.relative(root, target);
  return relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative);
}

function trimReference(value: string): string {
  return value.replace(/[.,;:]+$/g, '');
}

function isFileReference(value: string): boolean {
  if (value.includes('@') || /[()]/.test(value)) {
    return false;
  }

  return value.startsWith('./') || value.startsWith('../') || value.startsWith('/') || /\.[A-Za-z0-9]+$/.test(value);
}

function normalizePath(value: string): string {
  return value.split(path.sep).join('/');
}
