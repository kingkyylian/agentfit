import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdtemp } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { discoverInstructionFiles } from '../../src/core/discovery.js';
import { collectStaticIssues } from '../../src/core/static-checks.js';

async function createRepo(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'agentfit-static-'));
  await mkdir(join(root, 'packages/api'), { recursive: true });
  await writeFile(
    join(root, 'package.json'),
    JSON.stringify(
      {
        scripts: {
          test: 'node -e "process.exit(0)"'
        }
      },
      null,
      2
    )
  );
  await writeFile(join(root, 'packages/api/package.json'), JSON.stringify({ scripts: { test: 'node test.js' } }));
  await writeFile(
    join(root, 'AGENTS.md'),
    ['# Agent instructions', '', 'See @docs/setup.md.', '', '```bash', 'pnpm lint', '```', ''].join('\n')
  );
  return root;
}

describe('collectStaticIssues', () => {
  it('detects stale package scripts, missing runnable verification, and missing nested instructions', async () => {
    const root = await createRepo();
    const instructionFiles = await discoverInstructionFiles(root);

    const issues = await collectStaticIssues(root, instructionFiles);

    expect(issues.map((issue) => issue.message)).toEqual([
      'Documented command references missing package script "lint".',
      'No runnable verification command found in instruction files.',
      'No nested instruction file found for packages/api.'
    ]);
  });
});
