import { chmod, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execa } from 'execa';
import { describe, expect, it } from 'vitest';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const scriptPath = join(repoRoot, 'scripts/issue9-refresh-preflight.mjs');

const fixtureRefreshBody = [
  'Current local corpus manifest:',
  '- 37 reviewed public candidates',
  'Dry-run policy remains unchanged',
  ''
].join('\n');

const fixtureIssueBody = [
  'Current baseline:',
  '- 37 reviewed public dry-run candidates in the current corpus manifest',
  '- 16 healthy internal baselines, 12 actionable local drafts, 8 reviewed no-contact snapshots, and 1 unsupported low-signal snapshot',
  ''
].join('\n');

const fixturePacket = [
  '# Issue #9 Refresh Packet - 2026-05-23',
  'Final Preflight Before Posting',
  'docs/local/public-preview-issue-9-body-2026-05-23.md',
  'gh issue comment 9 --repo kingkyylian/agentfit --body-file docs/local/public-preview-issue-9-refresh-2026-05-23.txt',
  ''
].join('\n');

async function writePackedPreflightFixture(root: string, options: { liveIssueBody?: string } = {}) {
  const bin = join(root, 'bin');
  const liveIssueBody = options.liveIssueBody ?? fixtureIssueBody;
  const comments = [
    {
      author: { login: 'kingkyylian' },
      body: `${fixtureRefreshBody}\n`
    }
  ];

  await mkdir(join(root, 'scripts'), { recursive: true });
  await mkdir(join(root, 'docs/local'), { recursive: true });
  await mkdir(join(root, 'dist'), { recursive: true });
  await mkdir(bin);
  await writeFile(join(root, 'scripts/issue9-refresh-preflight.mjs'), await readFile(scriptPath, 'utf8'));
  await writeFile(join(root, 'docs/local/public-preview-issue-9-refresh-2026-05-23.txt'), fixtureRefreshBody);
  await writeFile(join(root, 'docs/local/public-preview-issue-9-refresh-2026-05-23.md'), fixturePacket);
  await writeFile(join(root, 'docs/local/public-preview-issue-9-body-2026-05-23.md'), fixtureIssueBody);
  await writeFile(
    join(root, 'dist/index.js'),
    [
      '#!/usr/bin/env node',
      "import { writeFileSync } from 'node:fs';",
      "const output = process.argv[process.argv.indexOf('--output') + 1];",
      'const candidates = [',
      "  ...Array.from({ length: 16 }, () => ({ status: 'healthy' })),",
      "  ...Array.from({ length: 12 }, () => ({ status: 'actionable' })),",
      "  ...Array.from({ length: 8 }, () => ({ status: 'snapshotted' })),",
      "  { status: 'unsupported' }",
      '];',
      'writeFileSync(output, JSON.stringify({ candidates, queue: [] }));',
      ''
    ].join('\n')
  );
  await writeFile(
    join(bin, 'gh'),
    [
      '#!/usr/bin/env node',
      `const issueBody = ${JSON.stringify(liveIssueBody)};`,
      `const comments = ${JSON.stringify(comments)};`,
      "if (process.argv[2] === 'issue') {",
      "  console.log(JSON.stringify({ state: 'OPEN', body: issueBody, comments }));",
      "} else if (process.argv[2] === 'api') {",
      "  console.log('false');",
      '} else {',
      '  process.exit(1);',
      '}',
      ''
    ].join('\n')
  );
  await writeFile(
    join(bin, 'pnpm'),
    ['#!/bin/sh', 'echo "pnpm corpus:check should not be used in packed layout" >&2', 'exit 42', ''].join('\n')
  );
  await chmod(join(bin, 'gh'), 0o755);
  await chmod(join(bin, 'pnpm'), 0o755);

  return bin;
}

describe('issue #9 refresh preflight script', () => {
  it('validates local artifacts and prints the guarded issue comment command without posting', async () => {
    const { stdout } = await execa(process.execPath, [scriptPath, '--skip-live'], {
      cwd: repoRoot
    });

    expect(stdout).toContain('Preflight mode: local artifact checks only.');
    expect(stdout).toContain(
      'gh issue comment 9 --repo kingkyylian/agentfit --body-file docs/local/public-preview-issue-9-refresh-2026-05-23.txt'
    );
    expect(stdout).toContain('No issue comment was posted.');
  });

  it('refuses to post without explicit environment approval', async () => {
    await expect(
      execa(process.execPath, [scriptPath, '--skip-live', '--post'], {
        cwd: repoRoot,
        reject: true
      })
    ).rejects.toMatchObject({
      stderr: expect.stringContaining('Refusing to post without AGENTFIT_APPROVE_ISSUE9_REFRESH=1.')
    });
  });

  it('uses the packed dist CLI for corpus checks when source files are not present', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-packed-preflight-'));
    const bin = await writePackedPreflightFixture(root);

    const { stdout } = await execa(process.execPath, [join(root, 'scripts/issue9-refresh-preflight.mjs')], {
      cwd: root,
      env: {
        PATH: `${bin}:${process.env.PATH ?? ''}`
      }
    });

    expect(stdout).toContain('Preflight mode: live issue, repository, corpus, and public-funnel gates passed.');
    expect(stdout).toContain('No issue comment was posted.');
  });

  it('fails when the live issue body is not synced to the 37-candidate funnel state', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agentfit-stale-issue-body-'));
    const bin = await writePackedPreflightFixture(root, {
      liveIssueBody: [
        'Current baseline:',
        '- 34 reviewed public dry-run candidates in the current corpus manifest',
        '- 16 healthy internal baselines, 11 actionable local drafts, 6 reviewed no-contact snapshots, and 1 unsupported low-signal snapshot',
        ''
      ].join('\n')
    });

    await expect(
      execa(process.execPath, [join(root, 'scripts/issue9-refresh-preflight.mjs')], {
        cwd: root,
        env: {
          PATH: `${bin}:${process.env.PATH ?? ''}`
        },
        reject: true
      })
    ).rejects.toMatchObject({
      stderr: expect.stringContaining('Issue #9 body does not match docs/local/public-preview-issue-9-body-2026-05-23.md')
    });
  });
});
