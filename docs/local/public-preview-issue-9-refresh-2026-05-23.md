# Issue #9 Refresh Packet - 2026-05-23

## Status

- Target: https://github.com/kingkyylian/agentfit/issues/9
- State: comment posted and issue body updated after explicit approval
- Posted comment: https://github.com/kingkyylian/agentfit/issues/9#issuecomment-4525279626
- Updated issue body source: [public-preview-issue-9-body-2026-05-23.md](public-preview-issue-9-body-2026-05-23.md) (`docs/local/public-preview-issue-9-body-2026-05-23.md`)
- Approval required before reposting: yes; do not repost the same refresh
- External signal accounting: this is a funnel refresh only and must not increment the `0/5` external signal counter

## Live Preflight Evidence

- `gh issue view 9 --repo kingkyylian/agentfit --comments --json number,title,state,url,body,comments,labels,updatedAt`: passed on 2026-05-23; issue remained open with the 34-candidate 2026-05-21 public state and no external suggestion comments.
- `gh api repos/kingkyylian/agentfit --jq '.has_discussions'`: passed on 2026-05-23; result `false`.
- `pnpm corpus:check`: passed on 2026-05-23; `37` total, `16/12/8/1` split, empty queue.
- `AGENTFIT_APPROVE_ISSUE9_REFRESH=1 node scripts/issue9-refresh-preflight.mjs --post`: passed on 2026-05-23 and posted the refresh comment.
- Post-check `gh issue view 9 --repo kingkyylian/agentfit --comments --json number,title,state,url,body,comments,labels,updatedAt`: passed on 2026-05-23; issue remained open and included https://github.com/kingkyylian/agentfit/issues/9#issuecomment-4525279626.

## Guardrails

- Do not repost this packet without explicit approval.
- Do not combine this with a public-channel post or maintainer outreach in the same step.
- Do not name healthy repositories as endorsements.
- Do not contact maintainers from the local drafts.
- Do not count the issue refresh as an external signal.
- After posting, record the public comment URL in [public-preview-execution-log.md](../public-preview-execution-log.md).

## Exact Comment Body

Source file: [public-preview-issue-9-refresh-2026-05-23.txt](public-preview-issue-9-refresh-2026-05-23.txt)

```text
Update while this stays open: I ran one more dry-run-only continuation pass while waiting for external suggestions.

Current local corpus manifest:
- 37 reviewed public candidates
- 16 healthy internal baselines
- 12 actionable local drafts
- 8 reviewed no-contact snapshots
- 1 unsupported low-signal snapshot

The latest continuation added three public-code-search candidates:
- two reviewed no-contact monorepo snapshots
- one local verification-guidance draft

I have not contacted those maintainers; they remain local-only unless outreach is explicitly approved.

I am still looking for public repos that already use AGENTS.md, CLAUDE.md, GEMINI.md, Cursor rules, Copilot instructions, or similar coding-agent guidance. Repo URL plus any sensitive paths to avoid is enough.

Dry-run policy remains unchanged: no model-provider calls, no generated task execution, no endorsement implied, and noisy reports become AgentFit product issues instead of maintainer outreach.
```

## Post Command

Preferred safe path if a repost is explicitly approved:

```bash
node scripts/issue9-refresh-preflight.mjs
AGENTFIT_APPROVE_ISSUE9_REFRESH=1 node scripts/issue9-refresh-preflight.mjs --post
```

Lower-level post command, for reference only:

```bash
gh issue comment 9 --repo kingkyylian/agentfit --body-file docs/local/public-preview-issue-9-refresh-2026-05-23.txt
```

## Final Preflight Before Posting

Run these immediately before any repost, even if they passed earlier:

```bash
node scripts/issue9-refresh-preflight.mjs
```

Proceed only if issue `#9` is still open, no outside party has already created an external signal on the issue, GitHub Discussions are still unavailable or intentionally unused, the corpus still reports `37` total with `16/12/8/1` split and an empty queue, and reposting the same refresh is still intentional.

## After Posting

1. Done: re-read issue `#9` and captured the posted comment URL.
2. Done: update [public-preview-execution-log.md](../public-preview-execution-log.md) with a `Public funnel` row.
3. Done: keep external signal counter at `0/5`; no outside party has replied yet.
4. Done: run `git diff --check` and `pnpm corpus:check`.
