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
        kind: 'test'
      }
    ]);
  });

  it('extracts repo-local inline verification commands', () => {
    const markdown = [
      '# Agent instructions',
      '',
      '| Need | Answer |',
      '| --- | --- |',
      '| Validate changes | `ci/validate` |',
      '| Run tests | `ci/test` |',
      '',
      'Use `docs/adr/README.md` for rationale.'
    ].join('\n');

    expect(extractCommands(markdown, 'AGENTS.md')).toEqual([
      {
        value: 'ci/validate',
        sourcePath: 'AGENTS.md',
        line: 5,
        kind: 'test'
      },
      {
        value: 'ci/test',
        sourcePath: 'AGENTS.md',
        line: 6,
        kind: 'test'
      }
    ]);
  });

  it('extracts Python task-runner inline commands', () => {
    const markdown = [
      '- Install dependencies: `uv sync --all-extras --all-groups`',
      '- Run specific test: `uv run pytest tests/path/to/test.py::test_function`',
      '- Run all tests: `nox -t test` or `nox -s pytest`',
      '- Run all linting: `nox -t lint`',
      '- Run only type checks: `nox -s typing`',
      '- Run formatter: `ruff format .`'
    ].join('\n');

    expect(extractCommands(markdown, 'AGENTS.md')).toEqual([
      {
        value: 'uv sync --all-extras --all-groups',
        sourcePath: 'AGENTS.md',
        line: 1,
        kind: 'setup'
      },
      {
        value: 'uv run pytest tests/path/to/test.py::test_function',
        sourcePath: 'AGENTS.md',
        line: 2,
        kind: 'test'
      },
      {
        value: 'nox -t test',
        sourcePath: 'AGENTS.md',
        line: 3,
        kind: 'test'
      },
      {
        value: 'nox -s pytest',
        sourcePath: 'AGENTS.md',
        line: 3,
        kind: 'test'
      },
      {
        value: 'nox -t lint',
        sourcePath: 'AGENTS.md',
        line: 4,
        kind: 'lint'
      },
      {
        value: 'nox -s typing',
        sourcePath: 'AGENTS.md',
        line: 5,
        kind: 'build'
      },
      {
        value: 'ruff format .',
        sourcePath: 'AGENTS.md',
        line: 6,
        kind: 'lint'
      }
    ]);
  });

  it('does not treat unlabeled explanatory fences as shell commands', () => {
    const markdown = [
      '### Timing Configuration Priorities',
      '```',
      'debounce < click < press < longPress',
      'Example: 20ms < 400ms < 800ms < varies',
      '```'
    ].join('\n');

    expect(extractCommands(markdown, 'copilot-instructions.md')).toEqual([]);
  });
});
