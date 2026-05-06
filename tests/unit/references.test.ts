import { describe, expect, it } from 'vitest';
import { resolveInstructionReferences } from '../../src/core/references.js';

describe('resolveInstructionReferences', () => {
  it('resolves markdown @ references relative to the containing file', async () => {
    const result = await resolveInstructionReferences({
      root: 'tests/fixtures/nested-repo',
      sourcePath: 'packages/api/AGENTS.md'
    });

    expect(result.importedPaths).toContain('packages/api/docs/api.md');
  });

  it('reports missing references with source file and line number', async () => {
    const result = await resolveInstructionReferences({
      root: 'tests/fixtures/nested-repo',
      sourcePath: 'packages/api/AGENTS.md'
    });

    expect(result.issues).toContainEqual({
      sourcePath: 'packages/api/AGENTS.md',
      line: 5,
      target: 'docs/missing.md',
      message: 'Referenced file does not exist: docs/missing.md',
      severity: 'error'
    });
  });

  it('rejects references outside the repository root', async () => {
    const result = await resolveInstructionReferences({
      root: 'tests/fixtures/nested-repo',
      sourcePath: 'packages/api/AGENTS.md'
    });

    expect(result.issues).toContainEqual({
      sourcePath: 'packages/api/AGENTS.md',
      line: 6,
      target: '../../../../outside.md',
      message: 'Referenced file escapes repository root: ../../../../outside.md',
      severity: 'error'
    });
  });
});
