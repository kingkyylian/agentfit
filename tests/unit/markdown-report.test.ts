import { describe, expect, it } from 'vitest';
import { renderMarkdownReport } from '../../src/report/markdown.js';
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

describe('renderMarkdownReport', () => {
  it('makes deterministic dry-run reports explicit about task execution', () => {
    const markdown = renderMarkdownReport(report());

    expect(markdown).toContain('**Task execution:** Static dry-run preview; generated tasks were not executed.');
    expect(markdown).toContain('Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.');
    expect(markdown).toContain('| Task | Adapter | Status | Verification | Diff | Cost |');
    expect(markdown).toContain('| Exercise the test package script | dry-run | preview | not executed | 0 files, +0/-0 | - |');
  });

  it('renders safety and reproducibility signal evidence', () => {
    const markdown = renderMarkdownReport(
      report({
        signalFindings: [
          {
            category: 'safety',
            sourcePath: 'AGENTS.md',
            line: 4,
            message: 'Approval boundary for risky changes.'
          },
          {
            category: 'reproducibility',
            sourcePath: 'CLAUDE.md',
            line: 8,
            message: 'Exact reproduction guidance.'
          }
        ]
      })
    );

    expect(markdown).toContain('## Signal Findings');
    expect(markdown).toContain('| safety | AGENTS.md:4 | Approval boundary for risky changes. |');
    expect(markdown).toContain('| reproducibility | CLAUDE.md:8 | Exact reproduction guidance. |');
  });

  it('describes skipped adapter runs without claiming execution', () => {
    const markdown = renderMarkdownReport(
      report({
        runs: [
          {
            id: 'codex-task',
            adapter: 'codex',
            task: {
              id: 'task',
              title: 'Exercise the test package script',
              prompt: 'Run tests.',
              expectedChecks: ['npm run test'],
              filesLikelyTouched: ['package.json']
            },
            startedAt: '2026-05-07T10:00:00.000Z',
            finishedAt: '2026-05-07T10:00:00.000Z',
            status: 'skipped',
            verification: [],
            diffStat: {
              filesChanged: 0,
              insertions: 0,
              deletions: 0
            },
            message: 'Codex adapter skipped because budgetUsd is 0.'
          }
        ]
      })
    );

    expect(markdown).toContain('**Task execution:** Generated task runs were skipped.');
    expect(markdown).toContain('| Exercise the test package script | codex | skipped | none recorded | 0 files, +0/-0 | - |');
  });

  it('compacts high-volume evidence tables in markdown reports', () => {
    const commandResolutions = Array.from({ length: 27 }, (_, index) => ({
      command: `npm run check-${index + 1}`,
      sourcePath: 'CLAUDE.md',
      line: index + 1,
      scriptName: `check-${index + 1}`,
      packageJsonPath: 'package.json',
      status: 'resolved' as const,
      reason: 'repository root'
    }));
    const signalFindings = Array.from({ length: 30 }, (_, index) => ({
      category: 'reproducibility' as const,
      sourcePath: 'CLAUDE.md',
      line: index + 1,
      message: `Signal evidence ${index + 1}`
    }));

    const markdown = renderMarkdownReport(
      report({
        commandResolutions,
        signalFindings
      })
    );

    expect(markdown).toContain(
      'Showing first 25 of 27 command resolutions. JSON output contains the complete set.'
    );
    expect(markdown).toContain(
      'Showing first 25 of 30 signal findings. JSON output contains the complete set.'
    );
    expect(markdown).toContain('| npm run check-25 | CLAUDE.md:25 | check-25 | package.json | resolved |');
    expect(markdown).not.toContain('npm run check-26');
    expect(markdown).toContain('| reproducibility | CLAUDE.md:25 | Signal evidence 25 |');
    expect(markdown).not.toContain('Signal evidence 26');
  });
});
