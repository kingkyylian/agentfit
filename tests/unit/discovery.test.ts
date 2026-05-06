import { describe, expect, it } from 'vitest';
import { discoverInstructionFiles } from '../../src/core/discovery.js';

describe('discoverInstructionFiles', () => {
  it('discovers default instruction formats in stable path order', async () => {
    const files = await discoverInstructionFiles('tests/fixtures/basic-repo');

    expect(files.map((file) => file.path)).toEqual([
      '.cursor/rules/project.mdc',
      '.github/copilot-instructions.md',
      'AGENTS.md',
      'CLAUDE.md'
    ]);
    expect(files.map((file) => file.kind)).toEqual(['cursor', 'copilot', 'agents', 'claude']);
  });

  it('includes root and nested AGENTS.md files', async () => {
    const files = await discoverInstructionFiles('tests/fixtures/nested-repo');

    expect(files.map((file) => file.path)).toEqual(['AGENTS.md', 'packages/api/AGENTS.md']);
    expect(files.map((file) => file.scope)).toEqual(['.', 'packages/api']);
  });
});
