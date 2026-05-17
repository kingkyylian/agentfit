import { describe, expect, it } from 'vitest';
import { parseRealWorldCorpus, summarizeRealWorldCorpus } from '../../src/core/real-world-corpus.js';

const validManifest = [
  'version: 1',
  "updatedAt: '2026-05-17'",
  'policy:',
  '  contentUse: Metadata only.',
  '  execution: Dry-run first.',
  '  contact: Concrete findings only.',
  'candidates:',
  '  - repo: meltano/meltano',
  '    instructionSources:',
  '      - AGENTS.md',
  '    searchQuery: path:AGENTS.md is:public fork:false',
  '    stack: Python',
  '    shape: data tooling application',
  '    recentActivity: active',
  '    licenseStatus: unverified',
  '    status: candidate',
  '    expectedSignal: command coverage',
  '    contactPolicy: no contact before report review',
  '  - repo: grafana/mimir',
  '    instructionSources:',
  '      - AGENTS.md',
  '      - CLAUDE.md',
  '    searchQuery: path:AGENTS.md is:public fork:false',
  '    stack: Go',
  '    shape: infrastructure monorepo',
  '    recentActivity: active',
  '    licenseStatus: reviewed',
  '    status: healthy',
  '    expectedSignal: healthy layered instructions',
  '    contactPolicy: permission before public named use',
  ''
].join('\n');

describe('real-world corpus manifest', () => {
  it('parses a valid candidate manifest', () => {
    const corpus = parseRealWorldCorpus(validManifest);

    expect(corpus.version).toBe(1);
    expect(corpus.candidates.map((candidate) => candidate.repo)).toEqual(['meltano/meltano', 'grafana/mimir']);
  });

  it('rejects duplicate repositories', () => {
    const duplicateManifest = validManifest.replace('grafana/mimir', 'meltano/meltano');

    expect(() => parseRealWorldCorpus(duplicateManifest)).toThrow('Duplicate corpus candidate: meltano/meltano');
  });

  it('summarizes candidates by status and keeps manifest order for the queue', () => {
    const summary = summarizeRealWorldCorpus(parseRealWorldCorpus(validManifest));

    expect(summary.total).toBe(2);
    expect(summary.byStatus).toEqual({
      candidate: 1,
      healthy: 1
    });
    expect(summary.queue.map((candidate) => candidate.repo)).toEqual(['meltano/meltano']);
  });
});
