import { chmod, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createCodexAdapter } from '../../src/adapters/codex.js';
import type { FitnessTask } from '../../src/types.js';

const task: FitnessTask = {
  id: 'readme-check',
  title: 'Check README',
  prompt: 'Inspect README.md and report back.',
  expectedChecks: [],
  filesLikelyTouched: ['README.md']
};

describe('createCodexAdapter', () => {
  it('omits cost when the Codex command does not report usage cost', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-codex-adapter-'));
    const executable = join(root, 'codex-stub');

    await writeFile(executable, '#!/bin/sh\nexit 0\n');
    await chmod(executable, 0o755);

    const adapter = createCodexAdapter({
      executable,
      args: ['{prompt}']
    });

    const result = await adapter.runTask(
      {
        root,
        worktreePath: root
      },
      task
    );

    expect(result.status).toBe('passed');
    expect(result.costUsd).toBeUndefined();
  });
});
