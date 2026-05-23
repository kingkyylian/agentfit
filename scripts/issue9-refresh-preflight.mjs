#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const commentBodyRelativePath = 'docs/local/public-preview-issue-9-refresh-2026-05-23.txt';
const packetRelativePath = 'docs/local/public-preview-issue-9-refresh-2026-05-23.md';
const issueBodyRelativePath = 'docs/local/public-preview-issue-9-body-2026-05-23.md';
const commentBodyPath = path.join(repoRoot, commentBodyRelativePath);
const packetPath = path.join(repoRoot, packetRelativePath);
const issueBodyPath = path.join(repoRoot, issueBodyRelativePath);
const issueRepo = 'kingkyylian/agentfit';
const issueNumber = '9';
const postCommand =
  `gh issue comment ${issueNumber} --repo ${issueRepo} --body-file ${commentBodyRelativePath}`;

function fail(message) {
  console.error(message);
  process.exit(1);
}

function run(command, args, options = {}) {
  try {
    return execFileSync(command, args, {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      ...options
    });
  } catch (error) {
    const stderr = error?.stderr?.toString().trim();
    const stdout = error?.stdout?.toString().trim();
    const details = [stdout, stderr].filter(Boolean).join('\n');
    fail(`${command} ${args.join(' ')} failed${details ? `:\n${details}` : '.'}`);
  }
}

function normalizeText(value) {
  return value.replace(/\r\n/g, '\n').trim();
}

function parseArgs(argv) {
  const args = new Set(argv);
  const allowed = new Set(['--skip-live', '--post', '--help']);
  const unknown = argv.filter((arg) => !allowed.has(arg));
  if (unknown.length > 0) {
    fail(`Unknown option: ${unknown.join(', ')}`);
  }
  if (args.has('--help')) {
    console.log([
      'Usage: node scripts/issue9-refresh-preflight.mjs [--skip-live] [--post]',
      '',
      'Default: validate local artifacts and live gates, then print the guarded post command.',
      '--skip-live: validate only local artifacts.',
      '--post: post the prepared issue #9 refresh after all gates pass and AGENTFIT_APPROVE_ISSUE9_REFRESH=1 is set.'
    ].join('\n'));
    process.exit(0);
  }
  return {
    skipLive: args.has('--skip-live'),
    post: args.has('--post')
  };
}

function validateLocalArtifacts() {
  if (!existsSync(commentBodyPath)) {
    fail(`Missing issue refresh body file: ${commentBodyRelativePath}`);
  }
  if (!existsSync(packetPath)) {
    fail(`Missing issue refresh packet file: ${packetRelativePath}`);
  }
  if (!existsSync(issueBodyPath)) {
    fail(`Missing issue body file: ${issueBodyRelativePath}`);
  }

  const commentBody = readFileSync(commentBodyPath, 'utf8');
  if (!commentBody.includes('Current local corpus manifest:')) {
    fail(`${commentBodyRelativePath} is missing the corpus manifest section.`);
  }
  if (!commentBody.includes('- 37 reviewed public candidates')) {
    fail(`${commentBodyRelativePath} must mention 37 reviewed public candidates.`);
  }
  if (!commentBody.includes('Dry-run policy remains unchanged')) {
    fail(`${commentBodyRelativePath} is missing the dry-run policy reminder.`);
  }
  if (commentBody.includes('## Post Command') || commentBody.includes('# Issue #9 Refresh Packet')) {
    fail(`${commentBodyRelativePath} appears to contain packet metadata instead of only the comment body.`);
  }

  const issueBody = readFileSync(issueBodyPath, 'utf8');
  if (!issueBody.includes('Current baseline:')) {
    fail(`${issueBodyRelativePath} is missing the current baseline section.`);
  }
  if (!issueBody.includes('- 37 reviewed public dry-run candidates in the current corpus manifest')) {
    fail(`${issueBodyRelativePath} must mention 37 reviewed public dry-run candidates.`);
  }
  if (!issueBody.includes('16 healthy internal baselines, 12 actionable local drafts, 8 reviewed no-contact snapshots, and 1 unsupported low-signal snapshot')) {
    fail(`${issueBodyRelativePath} must mention the 16/12/8/1 split.`);
  }
  if (issueBody.includes('34 reviewed public dry-run candidates')
    || issueBody.includes('11 actionable local drafts')
    || issueBody.includes('6 reviewed no-contact snapshots')) {
    fail(`${issueBodyRelativePath} still contains the older 34-candidate baseline.`);
  }

  const packet = readFileSync(packetPath, 'utf8');
  if (!packet.includes(postCommand)) {
    fail(`${packetRelativePath} does not document the guarded post command.`);
  }
  if (!packet.includes(issueBodyRelativePath)) {
    fail(`${packetRelativePath} does not document the issue body source file.`);
  }
  if (!packet.includes('Final Preflight Before Posting')) {
    fail(`${packetRelativePath} is missing the final preflight checklist.`);
  }
}

function validateIssueState() {
  const issue = JSON.parse(run('gh', [
    'issue',
    'view',
    issueNumber,
    '--repo',
    issueRepo,
    '--comments',
    '--json',
    'number,title,state,url,body,comments,updatedAt'
  ]));

  if (issue.state !== 'OPEN') {
    fail(`Issue #${issueNumber} is ${issue.state}; refusing to proceed.`);
  }

  const expectedIssueBody = normalizeText(readFileSync(issueBodyPath, 'utf8'));
  if (normalizeText(issue.body ?? '') !== expectedIssueBody) {
    fail(`Issue #${issueNumber} body does not match ${issueBodyRelativePath}; update or reassess public funnel state before posting.`);
  }

  const hasCurrentRefreshComment = (issue.comments ?? []).some(
    (comment) => comment?.author?.login === 'kingkyylian'
      && comment?.body?.includes('- 37 reviewed public candidates')
      && comment?.body?.includes('Dry-run policy remains unchanged')
  );
  if (!hasCurrentRefreshComment) {
    fail(`Issue #${issueNumber} is missing the 37-candidate refresh comment.`);
  }

  const externalComments = (issue.comments ?? []).filter(
    (comment) => comment?.author?.login !== 'kingkyylian'
  );
  if (externalComments.length > 0) {
    fail(`Issue #${issueNumber} has ${externalComments.length} external comment(s); reassess signal state before posting.`);
  }
}

function validateDiscussionsState() {
  const hasDiscussions = run('gh', ['api', `repos/${issueRepo}`, '--jq', '.has_discussions']).trim();
  if (hasDiscussions !== 'false') {
    fail(`GitHub Discussions state is ${hasDiscussions}; reassess the funnel before posting.`);
  }
}

function writeCorpusSnapshot() {
  const sourceCliPath = path.join(repoRoot, 'src/cli/index.ts');
  const packedCliPath = path.join(repoRoot, 'dist/index.js');
  const manifestPath = path.join(repoRoot, 'examples/corpus/real-world-candidates.yml');
  const outputPath = '/tmp/agentfit-corpus-check.json';

  if (existsSync(sourceCliPath)) {
    run('pnpm', ['corpus:check']);
    return outputPath;
  }

  if (!existsSync(packedCliPath)) {
    fail('No source or packed AgentFit CLI found for corpus validation.');
  }

  run(process.execPath, [
    packedCliPath,
    'corpus',
    '--manifest',
    manifestPath,
    '--format',
    'json',
    '--output',
    outputPath
  ]);
  return outputPath;
}

function validateCorpusState() {
  const corpusPath = writeCorpusSnapshot();

  const corpus = JSON.parse(readFileSync(corpusPath, 'utf8'));
  const candidates = corpus.candidates ?? [];
  const counts = new Map();
  for (const candidate of candidates) {
    counts.set(candidate.status, (counts.get(candidate.status) ?? 0) + 1);
  }

  const expected = [
    ['healthy', 16],
    ['actionable', 12],
    ['snapshotted', 8],
    ['unsupported', 1]
  ];
  const matchesCounts = candidates.length === 37
    && expected.every(([status, count]) => counts.get(status) === count);
  if (!matchesCounts) {
    fail(`Corpus split changed; expected 37 with 16/12/8/1.`);
  }
  if ((corpus.queue ?? []).length !== 0) {
    fail('Corpus queue is not empty; resolve it before posting.');
  }
}

const { skipLive, post } = parseArgs(process.argv.slice(2));

validateLocalArtifacts();

if (post && process.env.AGENTFIT_APPROVE_ISSUE9_REFRESH !== '1') {
  fail('Refusing to post without AGENTFIT_APPROVE_ISSUE9_REFRESH=1.');
}
if (post && skipLive) {
  fail('Refusing to post when --skip-live is set.');
}

if (skipLive) {
  console.log('Preflight mode: local artifact checks only.');
} else {
  validateIssueState();
  validateDiscussionsState();
  validateCorpusState();
  console.log('Preflight mode: live issue, repository, corpus, and public-funnel gates passed.');
}

if (post) {
  run('gh', [
    'issue',
    'comment',
    issueNumber,
    '--repo',
    issueRepo,
    '--body-file',
    commentBodyRelativePath
  ], { stdio: 'inherit' });
} else {
  console.log(`Prepared post command: ${postCommand}`);
  console.log('No issue comment was posted.');
}
