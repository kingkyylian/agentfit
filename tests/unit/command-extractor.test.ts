import { describe, expect, it } from 'vitest';
import { extractCommands } from '../../src/core/command-extractor.js';

describe('extractCommands', () => {
  it('extracts shell fenced block commands with source lines', () => {
    const markdown = [
      '# Setup',
      '',
      '```bash',
      'pnpm install --frozen-lockfile',
      'pnpm test',
      '```'
    ].join('\n');

    expect(extractCommands(markdown, 'AGENTS.md')).toEqual([
      {
        value: 'pnpm install --frozen-lockfile',
        sourcePath: 'AGENTS.md',
        line: 4,
        kind: 'setup'
      },
      {
        value: 'pnpm test',
        sourcePath: 'AGENTS.md',
        line: 5,
        kind: 'test'
      }
    ]);
  });

  it('extracts inline command-looking snippets and classifies them', () => {
    const markdown = 'Run `pnpm lint`, `npm run build`, and `node scripts/check.js`.';

    expect(extractCommands(markdown, 'CLAUDE.md')).toEqual([
      {
        value: 'pnpm lint',
        sourcePath: 'CLAUDE.md',
        line: 1,
        kind: 'lint'
      },
      {
        value: 'npm run build',
        sourcePath: 'CLAUDE.md',
        line: 1,
        kind: 'build'
      },
      {
        value: 'node scripts/check.js',
        sourcePath: 'CLAUDE.md',
        line: 1,
        kind: 'unknown'
      }
    ]);
  });
});
