import { describe, expect, it } from 'vitest';
import { calculateScore } from '../../src/core/scoring.js';
import type { EvaluationRun, ExtractedCommand, InstructionFile } from '../../src/types.js';

const instruction = (overrides: Partial<InstructionFile> = {}): InstructionFile => ({
  path: 'AGENTS.md',
  scope: '.',
  kind: 'agents',
  bytes: 420,
  importedPaths: ['docs/testing.md'],
  commands: [
    {
      value: 'pnpm test',
      sourcePath: 'AGENTS.md',
      line: 12,
      kind: 'test'
    },
    {
      value: 'pnpm install --frozen-lockfile',
      sourcePath: 'AGENTS.md',
      line: 8,
      kind: 'setup'
    }
  ],
  ...overrides
});

const run = (overrides: Partial<EvaluationRun> = {}): EvaluationRun => ({
  id: 'run-1',
  adapter: 'dry-run',
  task: {
    id: 'task-1',
    title: 'Update README wording',
    prompt: 'Make a harmless README wording change and run verification.',
    expectedChecks: ['pnpm test'],
    filesLikelyTouched: ['README.md']
  },
  startedAt: '2026-05-06T10:00:00.000Z',
  finishedAt: '2026-05-06T10:00:03.000Z',
  status: 'passed',
  verification: [
    {
      command: 'pnpm test',
      exitCode: 0,
      stdout: '',
      stderr: '',
      durationMs: 1200
    }
  ],
  diffStat: {
    filesChanged: 1,
    insertions: 2,
    deletions: 1
  },
  ...overrides
});

const configuredCommand = (overrides: Partial<ExtractedCommand> = {}): ExtractedCommand => ({
  value: 'npm test',
  sourcePath: 'agentfit.config.yml',
  line: 0,
  kind: 'test',
  ...overrides
});

describe('calculateScore', () => {
  it('awards a transparent 100 point score for a clean evaluation', () => {
    const result = calculateScore({
      instructionFiles: [instruction()],
      referenceIssues: [],
      runs: [run()],
      safetyGuardrailsFound: true,
      reproducibilitySignalsFound: true
    });

    expect(result.score).toBe(100);
    expect(result.grade).toBe('A');
    expect(result.caps).toEqual([]);
    expect(result.failedChecks).toEqual([]);
    expect(result.breakdown).toEqual([
      expect.objectContaining({ id: 'discoverability', earned: 20, max: 20 }),
      expect.objectContaining({ id: 'command-freshness', earned: 15, max: 15 }),
      expect.objectContaining({ id: 'reference-integrity', earned: 15, max: 15 }),
      expect.objectContaining({ id: 'evaluation-pass-rate', earned: 20, max: 20 }),
      expect.objectContaining({ id: 'diff-discipline', earned: 10, max: 10 }),
      expect.objectContaining({ id: 'safety-guardrails', earned: 10, max: 10 }),
      expect.objectContaining({ id: 'reproducibility', earned: 10, max: 10 })
    ]);
  });

  it('matches package-manager script aliases with explicit run commands', () => {
    const result = calculateScore({
      instructionFiles: [instruction()],
      referenceIssues: [],
      runs: [
        run({
          verification: [
            {
              command: 'pnpm run test',
              exitCode: 0,
              stdout: '',
              stderr: '',
              durationMs: 1200
            }
          ]
        })
      ],
      safetyGuardrailsFound: true,
      reproducibilitySignalsFound: true
    });

    expect(result.breakdown.find((item) => item.id === 'command-freshness')?.earned).toBe(15);
    expect(result.score).toBe(100);
  });

  it('does not match package scripts by prefix only', () => {
    const result = calculateScore({
      instructionFiles: [instruction()],
      referenceIssues: [],
      runs: [
        run({
          verification: [
            {
              command: 'pnpm run test:unit',
              exitCode: 0,
              stdout: '',
              stderr: '',
              durationMs: 1200
            }
          ]
        })
      ],
      safetyGuardrailsFound: true,
      reproducibilitySignalsFound: true
    });

    expect(result.breakdown.find((item) => item.id === 'command-freshness')?.earned).toBe(10);
  });

  it('applies score caps for failed setup and missing verification commands', () => {
    const result = calculateScore({
      instructionFiles: [
        instruction({
          commands: [
            {
              value: 'pnpm install --frozen-lockfile',
              sourcePath: 'AGENTS.md',
              line: 8,
              kind: 'setup'
            }
          ]
        })
      ],
      referenceIssues: [],
      runs: [
        run({
          verification: [
            {
              command: 'pnpm install --frozen-lockfile',
              exitCode: 1,
              stdout: '',
              stderr: 'lockfile is stale',
              durationMs: 900
            }
          ]
        })
      ],
      setupCommandFailed: true,
      safetyGuardrailsFound: true,
      reproducibilitySignalsFound: true
    });

    expect(result.score).toBeLessThanOrEqual(60);
    expect(result.caps).toContain('setup command cannot run: max score 60');
    expect(result.caps).toContain('no verification command found: max score 75');
    expect(result.failedChecks).toContain('No verification command found in instruction files.');
  });

  it('hard fails when exposed secrets are reported', () => {
    const result = calculateScore({
      instructionFiles: [instruction()],
      referenceIssues: [],
      runs: [run()],
      hasExposedSecrets: true,
      safetyGuardrailsFound: true,
      reproducibilitySignalsFound: true
    });

    expect(result.score).toBe(0);
    expect(result.grade).toBe('F');
    expect(result.failedChecks).toContain('Exposed secret detected in instruction files.');
    expect(result.caps).toContain('exposed secrets in instruction files: hard fail');
  });

  it('penalizes failed runs, noisy diffs, and missing reference targets', () => {
    const result = calculateScore({
      instructionFiles: [instruction()],
      referenceIssues: [
        {
          sourcePath: 'AGENTS.md',
          line: 2,
          target: 'docs/testing.md',
          message: 'Missing reference',
          severity: 'error'
        }
      ],
      runs: [
        run({ id: 'run-1', status: 'passed' }),
        run({
          id: 'run-2',
          status: 'failed',
          diffStat: {
            filesChanged: 14,
            insertions: 520,
            deletions: 210
          }
        })
      ],
      safetyGuardrailsFound: false,
      reproducibilitySignalsFound: false
    });

    expect(result.breakdown.find((item) => item.id === 'reference-integrity')?.earned).toBe(0);
    expect(result.breakdown.find((item) => item.id === 'evaluation-pass-rate')?.earned).toBe(10);
    expect(result.breakdown.find((item) => item.id === 'diff-discipline')?.earned).toBe(0);
    expect(result.failedChecks).toEqual(
      expect.arrayContaining([
        '1 instruction reference is missing or invalid.',
        '1 of 2 evaluation runs failed.',
        'Average diff is too large for fitness tasks.',
        'Safety guardrails were not found.',
        'Reproducibility instructions were not found.'
      ])
    );
  });

  it('describes deterministic dry-run previews without claiming tasks executed', () => {
    const result = calculateScore({
      instructionFiles: [instruction()],
      referenceIssues: [],
      runs: [
        run({
          verification: [],
          diffStat: {
            filesChanged: 0,
            insertions: 0,
            deletions: 0
          },
          message: 'Deterministic dry-run completed. Re-run with --run-tasks to execute isolated worktree checks.'
        })
      ],
      safetyGuardrailsFound: true,
      reproducibilitySignalsFound: true
    });

    expect(result.breakdown.find((item) => item.id === 'evaluation-pass-rate')?.explanation).toBe(
      '1 deterministic task preview generated; no tasks were executed.'
    );
    expect(result.breakdown.find((item) => item.id === 'diff-discipline')?.explanation).toBe(
      'No task diffs were captured because runs were previews.'
    );
  });

  it('uses explicit configured commands as verification signals', () => {
    const result = calculateScore({
      instructionFiles: [
        instruction({
          commands: []
        })
      ],
      configuredCommands: [configuredCommand()],
      referenceIssues: [],
      runs: [
        run({
          verification: [
            {
              command: 'npm test',
              exitCode: 0,
              stdout: '',
              stderr: '',
              durationMs: 1200
            }
          ]
        })
      ],
      safetyGuardrailsFound: true,
      reproducibilitySignalsFound: true
    });

    expect(result.caps).not.toContain('no verification command found: max score 75');
    expect(result.breakdown.find((item) => item.id === 'command-freshness')?.earned).toBe(15);
  });

  it('includes static command and scope issues in the score', () => {
    const result = calculateScore({
      instructionFiles: [instruction()],
      referenceIssues: [],
      staticIssues: [
        {
          category: 'command',
          sourcePath: 'AGENTS.md',
          message: 'Documented command references missing package script "lint".',
          severity: 'error'
        },
        {
          category: 'scope',
          sourcePath: 'packages/api',
          message: 'No nested instruction file found for packages/api.',
          severity: 'warning'
        }
      ],
      runs: [run()],
      safetyGuardrailsFound: true,
      reproducibilitySignalsFound: true
    });

    expect(result.breakdown.find((item) => item.id === 'command-freshness')?.earned).toBe(0);
    expect(result.breakdown.find((item) => item.id === 'discoverability')?.earned).toBe(15);
    expect(result.failedChecks).toEqual(
      expect.arrayContaining([
        'Documented command references missing package script "lint".',
        'No nested instruction file found for packages/api.'
      ])
    );
  });

  it('caps nested scope penalties for monorepos covered by root instructions', () => {
    const scopeIssues = Array.from({ length: 6 }, (_, index) => ({
      category: 'scope' as const,
      sourcePath: `packages/package-${index}`,
      message: `No nested instruction file found for packages/package-${index}.`,
      severity: 'warning' as const
    }));

    const result = calculateScore({
      instructionFiles: [instruction()],
      referenceIssues: [],
      staticIssues: scopeIssues,
      runs: [run()],
      safetyGuardrailsFound: true,
      reproducibilitySignalsFound: true
    });

    expect(result.breakdown.find((item) => item.id === 'discoverability')?.earned).toBe(15);
    expect(result.failedChecks).toContain('6 nested scopes do not have local instruction files.');
    expect(result.failedChecks).not.toContain('No nested instruction file found for packages/package-0.');
  });
});
