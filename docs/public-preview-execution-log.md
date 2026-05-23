# Public Preview Execution Log

This log tracks public-preview execution after the `0.1.13` release. It is not launch copy. Use it to distinguish external signals from internal dry-run progress.

## Current State

- Date: 2026-05-23
- Public funnel: https://github.com/kingkyylian/agentfit/issues/9
- External signal counter: `0/5`
- Current corpus manifest: `37` reviewed public dry-run candidates
- Current triage split: `16` healthy, `12` actionable local drafts, `8` reviewed no-contact snapshots, `1` unsupported
- Public funnel status: issue `#9` body and latest refresh comment reflect the 37-candidate local corpus update: https://github.com/kingkyylian/agentfit/issues/9#issuecomment-4525279626
- Outreach status: no maintainer outreach sent from the 2026-05-21 or 2026-05-22 continuation work
- Selected next step pending signal or separate approval: wait for an outside reply on issue `#9`, or separately approve exactly one public-channel post or one narrow maintainer outreach.
- Launch status: broad launch still gated by [launch.md](launch.md)

## Timeline

| Date | Type | Action | Evidence | Result |
| --- | --- | --- | --- | --- |
| 2026-05-20 | Public funnel | Refreshed issue `#9` as the low-pressure repo suggestion funnel. | Issue `#9` body and `help wanted` label. | Open funnel for repo suggestions. |
| 2026-05-21 | Internal dry-run | Added `supabase/agent-skills` and `multica-ai/multica` continuation snapshots. | [real-world-validation.md](real-world-validation.md), [real-world-candidates.yml](../examples/corpus/real-world-candidates.yml). | One healthy baseline and one reviewed no-contact snapshot. |
| 2026-05-21 | Internal dry-run | Added `smithery-ai/cli` and `OpenCoworkAI/open-codesign` continuation snapshots. | [real-world-validation.md](real-world-validation.md), report files in `examples/reports/real-world/`. | Two concrete command-drift local drafts. |
| 2026-05-21 | Public funnel | Updated issue `#9` body and added a progress comment with 34-candidate status. | https://github.com/kingkyylian/agentfit/issues/9#issuecomment-4507749997 | Public funnel reflected the 34-candidate state; still no external suggestions. |
| 2026-05-21 | Process tracking | Updated [feedback-triage.md](feedback-triage.md) external signal counter. | `0/5 external signals` entry. | Completion blocker is explicit instead of implicit. |
| 2026-05-21 | Outreach prep | Added current 34-candidate repo-request copy to [launch-outreach.md](launch-outreach.md). | Local docs only. | Ready to post when a public channel is selected; not posted yet. |
| 2026-05-21 | Channel check | Checked whether GitHub Discussions are enabled for the repo. | `gh api repos/kingkyylian/agentfit` returned `has_discussions: false`. | No repository discussion was opened; issue `#9` remains the single GitHub funnel. |
| 2026-05-22 | Internal dry-run | Added `47ng/nuqs`, `tinyhttp/tinyhttp`, and `netresearch/composer-patches-plugin` continuation snapshots. | [real-world-validation.md](real-world-validation.md), report files in `examples/reports/real-world/`. | Two reviewed no-contact monorepo snapshots and one verification-guidance local draft. |
| 2026-05-23 | Readiness check | Rechecked issue `#9`, GitHub Discussions status, and the corpus manifest before any external action. | `gh issue view 9`, `gh api repos/kingkyylian/agentfit`, `pnpm corpus:check`. | Issue `#9` remains at 34 publicly, Discussions remain disabled, local corpus remains 37 with `16/12/8/1` split and empty queue. |
| 2026-05-23 | Outreach prep | Prepared the exact issue `#9` refresh body as a separate local file. | [public-preview-issue-9-refresh-2026-05-23.md](local/public-preview-issue-9-refresh-2026-05-23.md), [public-preview-issue-9-refresh-2026-05-23.txt](local/public-preview-issue-9-refresh-2026-05-23.txt). | Ready to post only after explicit approval; still not an external signal. |
| 2026-05-23 | Safety tooling | Added a guarded preflight helper for issue `#9` refresh. | `scripts/issue9-refresh-preflight.mjs`, `tests/unit/issue9-refresh-preflight.test.ts`. | Local artifact checks can run without posting; `--post` requires `AGENTFIT_APPROVE_ISSUE9_REFRESH=1` and live gates. |
| 2026-05-23 | Package hygiene | Kept the issue refresh packet, body file, and guarded helper local-only instead of publishing them in the npm tarball. | `package.json`, `scripts/package-smoke.mjs`, `scripts/issue9-refresh-preflight.mjs`. | Package smoke now rejects those local-only artifacts if they appear in the packed tarball; the helper remains covered by unit tests. |
| 2026-05-23 | Public funnel | Posted the approved 37-candidate refresh comment to issue `#9`. | https://github.com/kingkyylian/agentfit/issues/9#issuecomment-4525279626 | Public funnel now reflects the 37-candidate local corpus state; external signal counter remains `0/5`. |
| 2026-05-23 | Public funnel | Updated issue `#9` body to the same 37-candidate baseline after confirming the body still showed the older 34-candidate state. | [public-preview-issue-9-body-2026-05-23.md](local/public-preview-issue-9-body-2026-05-23.md) | Issue body and refresh comment now agree; external signal counter remains `0/5`. |
| 2026-05-23 | Guard hardening | Extended the issue refresh preflight helper to validate the local issue body artifact, live issue body sync, and presence of the 37-candidate refresh comment. | `scripts/issue9-refresh-preflight.mjs`, `tests/unit/issue9-refresh-preflight.test.ts` | Future preflight runs fail if issue `#9` body drifts back to the older 34-candidate baseline or no longer matches the local body source. |

## Actionable Local Drafts

These are local-only until outreach is explicitly approved:

- `eggjs/egg`: `pnpm run clean` command drift remains the best first candidate from the 30-candidate sprint.
- `smithery-ai/cli`: `CLAUDE.md` documents `pnpm run lint`, but root package scripts expose `check` instead of `lint`.
- `OpenCoworkAI/open-codesign`: `AGENTS.md` and `CLAUDE.md` document `pnpm test:e2e`, but checked package scripts do not define `test:e2e`.
- `netresearch/composer-patches-plugin`: `copilot-instructions.md` is discoverable but provides no runnable verification command.

## Do Not Count As External Signals

- Self-discovered public search candidates.
- Dry-run snapshots run without maintainer input.
- Local outreach drafts that were not sent.
- Healthy named examples without permission.
- Product documentation updates inside this repository.

## Next External-Signal Paths

1. A repo suggestion or report sanity-check request arrives on issue `#9`.
2. A public channel post asks for repo suggestions and points back to issue `#9`.
3. Explicit approval is given to send one concrete command-drift maintainer outreach draft.
4. A maintainer grants permission to reference a healthy named snapshot.

The issue `#9` body and refresh comment now reflect the 37-candidate baseline and should not be refreshed again without new explicit approval. This is funnel maintenance only and does not increment the external signal counter.

## Execution Gate Audit

| Gate | Authoritative Evidence | Current Status | Next Action |
| --- | --- | --- | --- |
| Broad launch requires five external signals. | [feedback-triage.md](feedback-triage.md), [launch.md](launch.md) | Not satisfied: `0/5`. | Do not run broad launch copy. |
| Issue `#9` refresh requires explicit approval. | [launch-outreach.md](launch-outreach.md), [public-preview-issue-9-refresh-2026-05-23.md](local/public-preview-issue-9-refresh-2026-05-23.md), [public-preview-issue-9-body-2026-05-23.md](local/public-preview-issue-9-body-2026-05-23.md) | Satisfied: comment posted and body updated on 2026-05-23 after explicit approval. | Do not refresh the same public funnel again without new approval. |
| Issue refresh does not count as an external signal. | [public-preview-issue-9-refresh-2026-05-23.md](local/public-preview-issue-9-refresh-2026-05-23.md), this ledger | Enforced: counter remains `0/5`. | Count a signal only if an outside party responds or creates another concrete feedback path. |
| Maintainer outreach requires separate explicit approval. | [launch-outreach.md](launch-outreach.md) | Not approved. | Do not contact maintainers or open external repo issues. |
| Public channel post requires separate explicit approval and one selected channel. | [launch-outreach.md](launch-outreach.md) | Not approved. | Do not post X, HN, Reddit, GitHub Community, or similar public copy. |
| Dry-run policy forbids model-provider calls and generated task execution by default. | [launch-outreach.md](launch-outreach.md), [real-world-validation.md](real-world-validation.md) | No real adapter or generated task run performed. | Keep local-first dry-run behavior unless explicitly selected. |

## Verification Snapshot

Latest local verification for the current dirty working tree:

- `gh issue view 9 --repo kingkyylian/agentfit --comments --json number,title,state,url,body,comments,labels,updatedAt`: passed on 2026-05-23; issue remained open with the 34-candidate 2026-05-21 public state and no external suggestion comments.
- `AGENTFIT_APPROVE_ISSUE9_REFRESH=1 node scripts/issue9-refresh-preflight.mjs --post`: passed on 2026-05-23; posted https://github.com/kingkyylian/agentfit/issues/9#issuecomment-4525279626.
- `gh issue view 9 --repo kingkyylian/agentfit --comments --json number,title,state,url,body,comments,labels,updatedAt`: passed after posting on 2026-05-23; issue remained open and included the 37-candidate refresh comment.
- `gh issue view 9 --repo kingkyylian/agentfit --json body,title,state,updatedAt,url`: passed on 2026-05-23 after the refresh comment; showed the issue body still had the older 34-candidate baseline.
- `gh issue edit 9 --repo kingkyylian/agentfit --body-file docs/local/public-preview-issue-9-body-2026-05-23.md`: passed on 2026-05-23; updated issue `#9` body to the 37-candidate baseline.
- `gh issue view 9 --repo kingkyylian/agentfit --json body,state,comments,updatedAt,url,labels`: passed on 2026-05-23 after the body update; issue body and latest refresh comment both reflect the 37-candidate baseline, and there are still no external comments.
- `gh api repos/kingkyylian/agentfit --jq '.has_discussions'`: passed on 2026-05-23; result `false`.
- `node scripts/issue9-refresh-preflight.mjs --skip-live`: passed on 2026-05-23 after the package hygiene update; `docs/local/` artifacts validated and no issue comment was posted.
- `node scripts/issue9-refresh-preflight.mjs`: passed on 2026-05-23 after the body-sync guard update; live issue, repository, corpus, and public-funnel gates passed and no issue comment was posted.
- `pnpm typecheck`: passed on 2026-05-23.
- `pnpm test`: passed on 2026-05-23 after the body-sync guard update, 19 files and 103 tests.
- `pnpm lint`: passed on 2026-05-23.
- `pnpm build`: passed on 2026-05-23.
- `pnpm smoke:package`: passed on 2026-05-23 after the package hygiene update; package smoke rejects any `docs/local/` file and `scripts/issue9-refresh-preflight.mjs` if they appear in the packed tarball.
- `pnpm corpus:check`: passed on 2026-05-23, `37` total with `16/12/8/1` split and empty queue.
- `pnpm test tests/unit/issue9-refresh-preflight.test.ts`: passed on 2026-05-23, 4 tests including packed-layout corpus validation and stale issue-body rejection.
- `git diff --check`: passed on 2026-05-23.
