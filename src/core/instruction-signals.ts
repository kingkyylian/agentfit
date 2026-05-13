import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { ExtractedCommand, InstructionFile, InstructionSignalFinding } from '../types.js';

const reproducibilityKinds = new Set(['setup', 'build', 'test']);

export async function hasSafetyGuardrails(root: string, instructionFiles: InstructionFile[]): Promise<boolean> {
  return (await collectInstructionSignalFindings(root, instructionFiles)).some((finding) => finding.category === 'safety');
}

export async function hasReproducibilitySignals(
  root: string,
  instructionFiles: InstructionFile[],
  configuredCommands: ExtractedCommand[] = []
): Promise<boolean> {
  return (await collectInstructionSignalFindings(root, instructionFiles, configuredCommands)).some(
    (finding) => finding.category === 'reproducibility'
  );
}

export async function collectInstructionSignalFindings(
  root: string,
  instructionFiles: InstructionFile[],
  configuredCommands: ExtractedCommand[] = []
): Promise<InstructionSignalFinding[]> {
  const findings: InstructionSignalFinding[] = [];
  const commands = [
    ...instructionFiles.flatMap((file) => file.commands),
    ...configuredCommands
  ];

  findings.push(...commands.filter((command) => reproducibilityKinds.has(command.kind)).map(commandSignalFinding));

  for (const file of instructionFiles) {
    if (file.importedPaths.some((importedPath) => importedPath.toLowerCase().includes('security'))) {
      findings.push({
        category: 'safety',
        sourcePath: file.path,
        line: 1,
        message: 'Security guidance reference.'
      });
    }

    const content = await readInstructionContent(root, file.path);
    findings.push(...contentSignalFindings(file.path, content));
  }

  return uniqueFindings(findings);
}

function commandSignalFinding(command: ExtractedCommand): InstructionSignalFinding {
  return {
    category: 'reproducibility',
    sourcePath: command.sourcePath,
    line: command.line,
    message: `${capitalize(command.kind)} command guidance.`
  };
}

function contentSignalFindings(sourcePath: string, content: string): InstructionSignalFinding[] {
  const findings: InstructionSignalFinding[] = [];
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    findings.push(...lineSignalFindings(sourcePath, index + 1, line));
  });

  return findings;
}

function lineSignalFindings(sourcePath: string, line: number, content: string): InstructionSignalFinding[] {
  const findings: InstructionSignalFinding[] = [];
  const normalized = normalizeContent(content);
  if (!normalized) {
    return findings;
  }

  const riskyArea =
    /\b(?:versioning|publishing|publish|release|deploy|production|destructive|secrets?|credentials?|tokens?|database|migrations?|reset|force-push|force push|private key|api key|passwords?|providers?|network|external services?|dry-run adapter)\b/.test(
      normalized
    );
  const actionBoundary =
    /\b(?:never|do not|don't|dont|must not|should not|avoid)\s+(?:add|run|execute|use|call|modify|delete|remove|publish|deploy|expose|print|log|commit|push|reset|force-push|overwrite|leak)\b/.test(
      normalized
    );
  const approvalBoundary =
    /\b(?:ask|confirm|require|requires|get|obtain|request|seek)\b.{0,60}\b(?:approval|permission|confirmation|consent)\b.{0,60}\b(?:before|first|prior)\b/.test(
      normalized
    ) ||
    /\b(?:ask|confirm)\b.{0,40}\b(?:before|first|prior)\b/.test(normalized) ||
    /\b(?:before|prior to)\b.{0,60}\b(?:ask|confirm|obtain|request|require|get)\b.{0,60}\b(?:approval|permission|confirmation|consent)\b/.test(
      normalized
    );
  const gitStatusBoundary =
    /\bgit status\b.{0,80}\b(?:before|prior to)\b.{0,80}\b(?:change|edit|modify|commit|push)\b/.test(
      normalized
    );

  if (gitStatusBoundary) {
    findings.push({
      category: 'safety',
      sourcePath,
      line,
      message: 'Git status boundary before changes.'
    });
  }
  if (riskyArea && approvalBoundary) {
    findings.push({
      category: 'safety',
      sourcePath,
      line,
      message: 'Approval boundary for risky changes.'
    });
  } else if (riskyArea && actionBoundary) {
    findings.push({
      category: 'safety',
      sourcePath,
      line,
      message: 'Do-not-run or do-not-expose boundary for risky actions.'
    });
  }

  const reproducibilityMatch = [
    /\b(?:reproducible|deterministic|repeatable|idempotent)\b/,
    /\b(?:record|document|include|capture|provide)\b.{0,60}\b(?:exact|full)\b.{0,80}\b(?:repro(?:duction)? steps?|steps to reproduce|command|commands|environment variables?|env vars?|versions?|seed)\b/,
    /\b(?:exact|full)\b.{0,40}\b(?:repro(?:duction)? steps?|steps to reproduce|commands?|environment variables?|env vars?|seed)\b/,
    /\b(?:use|respect|keep|install from)\b.{0,60}\b(?:lockfile|frozen-lockfile|npm ci|yarn --immutable|pnpm install --frozen-lockfile)\b/,
    /\b(?:clean|fresh)\b.{0,40}\b(?:checkout|clone|worktree|install)\b/,
    /\b(?:pin|pinned|lock)\b.{0,40}\b(?:node|pnpm|npm|yarn|dependencies|versions?)\b/
  ].some((pattern) => pattern.test(normalized));

  if (reproducibilityMatch) {
    findings.push({
      category: 'reproducibility',
      sourcePath,
      line,
      message: reproducibilityMessage(normalized)
    });
  }

  return findings;
}

async function readInstructionContent(root: string, sourcePath: string): Promise<string> {
  return readFile(path.join(root, sourcePath), 'utf8');
}

function normalizeContent(content: string): string {
  return content.toLowerCase().replace(/\s+/g, ' ');
}

function reproducibilityMessage(normalizedLine: string): string {
  if (/\b(?:exact|full)\b.{0,80}\b(?:repro(?:duction)? steps?|steps to reproduce|seed|environment variables?|env vars?)\b/.test(normalizedLine)) {
    return 'Exact reproduction guidance.';
  }

  if (/\b(?:lockfile|frozen-lockfile|npm ci|yarn --immutable|pnpm install --frozen-lockfile)\b/.test(normalizedLine)) {
    return 'Lockfile-based setup guidance.';
  }

  return 'Deterministic or reproducible workflow guidance.';
}

function uniqueFindings(findings: InstructionSignalFinding[]): InstructionSignalFinding[] {
  const seen = new Set<string>();

  return findings.filter((finding) => {
    const key = `${finding.category}\0${finding.sourcePath}\0${finding.line}\0${finding.message}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
