import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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

  it('ignores vendored instruction files', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-discovery-'));
    await mkdir(join(root, 'vendor/github.com/example/pkg'), { recursive: true });
    await writeFile(join(root, 'AGENTS.md'), '# Root instructions\n');
    await writeFile(join(root, 'vendor/github.com/example/pkg/CLAUDE.md'), '# Vendored instructions\n');

    const files = await discoverInstructionFiles(root);

    expect(files.map((file) => file.path)).toEqual(['AGENTS.md']);
  });
});
