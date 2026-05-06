import { describe, expect, it } from 'vitest';
import { compareReports, renderCompareMarkdown, renderCompareText } from '../../src/core/compare.js';
import type { AgentFitReport } from '../../src/types.js';

function report(overrides: Partial<AgentFitReport> & { failedChecks?: string[] } = {}): AgentFitReport & { failedChecks?: string[] } {
  return {
    score: 70,
    grade: 'C',
    summary: 'AgentFit score 70/100 (C).',
    instructionFiles: [],
    referenceIssues: [],
    tasks: [],
    runs: [],
    caps: [],
    generatedAt: '2026-05-06T00:00:00.000Z',
    ...overrides
  };
}

describe('compareReports', () => {
  it('summarizes score improvement and fixed checks', () => {
    const before = report({
      score: 68,
      grade: 'D',
      failedChecks: ['No verification command found.', 'No evaluation runs completed.'],
      caps: ['no verification command found: max score 75']
    });
    const after = report({
      score: 91,
      grade: 'A',
      failedChecks: ['No evaluation runs completed.'],
      caps: []
    });

    const result = compareReports(before, after);

    expect(result).toMatchObject({
      beforeScore: 68,
      afterScore: 91,
      delta: 23,
      direction: 'improved',
      gradeChange: 'D -> A',
      fixedChecks: ['No verification command found.'],
      newFailures: [],
      removedCaps: ['no verification command found: max score 75']
    });
    expect(result.summary).toBe('AgentFit improved by 23 points: 68/100 (D) -> 91/100 (A).');
  });

  it('reports regressions when score drops and failures are introduced', () => {
    const before = report({ score: 93, grade: 'A', failedChecks: [] });
    const after = report({
      score: 76,
      grade: 'C',
      failedChecks: ['2 instruction reference errors found.']
    });

    const result = compareReports(before, after);

    expect(result.direction).toBe('regressed');
    expect(result.delta).toBe(-17);
    expect(result.newFailures).toEqual(['2 instruction reference errors found.']);
    expect(result.summary).toBe('AgentFit regressed by 17 points: 93/100 (A) -> 76/100 (C).');
  });
});

describe('compare rendering', () => {
  it('renders a compact text summary', () => {
    const result = compareReports(report({ score: 82, grade: 'B' }), report({ score: 82, grade: 'B' }));

    expect(renderCompareText(result)).toContain('AgentFit unchanged: 82/100 (B) -> 82/100 (B).');
    expect(renderCompareText(result)).toContain('Fixed checks: none');
  });

  it('renders markdown suitable for PR comments', () => {
    const result = compareReports(
      report({ score: 70, grade: 'C', failedChecks: ['No verification command found.'] }),
      report({ score: 88, grade: 'B', failedChecks: [] })
    );

    expect(renderCompareMarkdown(result)).toContain('| Before | After | Delta | Grade |');
    expect(renderCompareMarkdown(result)).toContain('| 70 | 88 | +18 | C -> B |');
    expect(renderCompareMarkdown(result)).toContain('- No verification command found.');
  });
});
