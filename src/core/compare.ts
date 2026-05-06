import type { AgentFitReport } from '../types.js';

type ComparableReport = AgentFitReport & {
  failedChecks?: string[];
};

export type CompareDirection = 'improved' | 'regressed' | 'unchanged';

export type CompareResult = {
  beforeScore: number;
  afterScore: number;
  delta: number;
  direction: CompareDirection;
  beforeGrade: string;
  afterGrade: string;
  gradeChange: string;
  fixedChecks: string[];
  newFailures: string[];
  removedCaps: string[];
  newCaps: string[];
  summary: string;
};

export function compareReports(before: ComparableReport, after: ComparableReport): CompareResult {
  const delta = after.score - before.score;
  const direction = directionForDelta(delta);
  const beforeFailures = before.failedChecks ?? [];
  const afterFailures = after.failedChecks ?? [];
  const fixedChecks = difference(beforeFailures, afterFailures);
  const newFailures = difference(afterFailures, beforeFailures);
  const removedCaps = difference(before.caps, after.caps);
  const newCaps = difference(after.caps, before.caps);
  const gradeChange = `${before.grade} -> ${after.grade}`;

  return {
    beforeScore: before.score,
    afterScore: after.score,
    delta,
    direction,
    beforeGrade: before.grade,
    afterGrade: after.grade,
    gradeChange,
    fixedChecks,
    newFailures,
    removedCaps,
    newCaps,
    summary: summaryFor(direction, before.score, after.score, before.grade, after.grade, delta)
  };
}

export function renderCompareText(result: CompareResult): string {
  return [
    result.summary,
    `Before: ${result.beforeScore}/100 (${result.beforeGrade})`,
    `After: ${result.afterScore}/100 (${result.afterGrade})`,
    `Delta: ${formatDelta(result.delta)}`,
    `Fixed checks: ${inlineList(result.fixedChecks)}`,
    `New failures: ${inlineList(result.newFailures)}`,
    `Removed caps: ${inlineList(result.removedCaps)}`,
    `New caps: ${inlineList(result.newCaps)}`,
    ''
  ].join('\n');
}

export function renderCompareMarkdown(result: CompareResult): string {
  return [
    '# AgentFit Compare',
    '',
    result.summary,
    '',
    '| Before | After | Delta | Grade |',
    '| ---: | ---: | ---: | --- |',
    `| ${result.beforeScore} | ${result.afterScore} | ${formatDelta(result.delta)} | ${result.gradeChange} |`,
    '',
    '## Fixed Checks',
    '',
    ...markdownList(result.fixedChecks),
    '',
    '## New Failures',
    '',
    ...markdownList(result.newFailures),
    '',
    '## Removed Caps',
    '',
    ...markdownList(result.removedCaps),
    '',
    '## New Caps',
    '',
    ...markdownList(result.newCaps),
    ''
  ].join('\n');
}

function directionForDelta(delta: number): CompareDirection {
  if (delta > 0) {
    return 'improved';
  }
  if (delta < 0) {
    return 'regressed';
  }
  return 'unchanged';
}

function summaryFor(
  direction: CompareDirection,
  beforeScore: number,
  afterScore: number,
  beforeGrade: string,
  afterGrade: string,
  delta: number
): string {
  if (direction === 'unchanged') {
    return `AgentFit unchanged: ${beforeScore}/100 (${beforeGrade}) -> ${afterScore}/100 (${afterGrade}).`;
  }

  const verb = direction === 'improved' ? 'improved' : 'regressed';
  return `AgentFit ${verb} by ${Math.abs(delta)} points: ${beforeScore}/100 (${beforeGrade}) -> ${afterScore}/100 (${afterGrade}).`;
}

function difference(left: string[], right: string[]): string[] {
  const rightSet = new Set(right);
  return left.filter((item) => !rightSet.has(item));
}

function formatDelta(delta: number): string {
  return delta > 0 ? `+${delta}` : String(delta);
}

function inlineList(items: string[]): string {
  return items.length === 0 ? 'none' : items.join('; ');
}

function markdownList(items: string[]): string[] {
  return items.length === 0 ? ['None.'] : items.map((item) => `- ${item}`);
}
