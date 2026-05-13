import { describe, expect, it } from 'vitest';
import { renderJsonReport } from '../../src/report/json.js';
import type { ScoredAgentFitReport } from '../../src/core/scoring.js';

function report(overrides: Partial<ScoredAgentFitReport> = {}): ScoredAgentFitReport {
  return {
    score: 93,
    grade: 'A',
    summary: 'AgentFit score 93/100 (A).',
    instructionFiles: [],
    referenceIssues: [],
    tasks: [],
    runs: [
      {
        id: 'dry-run-task',
        adapter: 'dry-run',
        task: {
          id: 'task',
          title: 'Exercise the test package script',
          prompt: 'Run tests.',
          expectedChecks: ['npm run test'],
          filesLikelyTouched: ['package.json']
        },
        startedAt: '2026-05-07T10:00:00.000Z',
        finishedAt: '2026-05-07T10:00:00.000Z',
        status: 'passed',
        verification: [],
        diffStat: {
          filesChanged: 0,
          insertions: 0,
          deletions: 0
        },
        message: 'Deterministic dry-run completed. Re-run with --run-tasks to execute isolated worktree checks.'
      }
    ],
    caps: [],
    generatedAt: '2026-05-07T10:00:00.000Z',
    breakdown: [],
    failedChecks: [],
    ...overrides
  };
}

describe('renderJsonReport', () => {
  it('includes a machine-readable execution mode', () => {
    const parsed = JSON.parse(renderJsonReport(report())) as { executionMode?: string };

    expect(parsed.executionMode).toBe('preview');
  });

  it('includes signal findings in a stable order', () => {
    const parsed = JSON.parse(
      renderJsonReport(
        report({
          signalFindings: [
            {
              category: 'reproducibility',
              sourcePath: 'CLAUDE.md',
              line: 8,
              message: 'Exact reproduction guidance.'
            },
            {
              category: 'safety',
              sourcePath: 'AGENTS.md',
              line: 4,
              message: 'Approval boundary for risky changes.'
            }
          ]
        })
      )
    ) as { signalFindings?: Array<{ category: string; sourcePath: string; line: number; message: string }> };

    expect(parsed.signalFindings).toEqual([
      {
        category: 'reproducibility',
        sourcePath: 'CLAUDE.md',
        line: 8,
        message: 'Exact reproduction guidance.'
      },
      {
        category: 'safety',
        sourcePath: 'AGENTS.md',
        line: 4,
        message: 'Approval boundary for risky changes.'
      }
    ]);
  });
});
