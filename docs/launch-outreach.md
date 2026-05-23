# Launch Outreach

## Core Message

Agent instruction files rot. AgentFit tests whether `AGENTS.md`, `CLAUDE.md`, Cursor rules, and Copilot instructions still work by checking commands, references, nested scopes, and generated repo-specific tasks.

Short version:

```text
AgentFit is CI for AGENTS.md and coding-agent instructions.
```

Problem version:

```text
Your README has tests. Your code has tests. Your AGENTS.md probably does not.
```

## Current Objective

Do not optimize for repository popularity metrics yet. Optimize for five external repo suggestions or report sanity checks from people who maintain repositories with coding-agent instructions.

The first-touch message should not be a product announcement. Lead with the validation result:

- 30 public dry-run snapshots
- 15 healthy internal baselines, 9 actionable local drafts, 5 reviewed no-contact snapshots, and 1 unsupported low-signal snapshot
- one stale-command issue that became a merged upstream RedisInsight PR
- three AgentFit product fixes found during validation
- a narrow ask for public repos to dry-run validate

The copy-ready 30-snapshot brief lives in [public-preview-summary-2026-05-19.md](public-preview-summary-2026-05-19.md). Do not name healthy repositories as endorsements in public preview copy.

## Demo Script

Use the before/after demo as the launch hook:

README asset:

```text
docs/assets/agentfit-terminal-demo.svg
```

```bash
cd examples/demo/bad
npx @kingkyylian/agentfit@latest eval --format markdown --output ../../reports/demo-before.md --json-output ../../reports/demo-before.json --tasks 5 || true

cd ../fixed
npx @kingkyylian/agentfit@latest eval --format markdown --output ../../reports/demo-after.md --json-output ../../reports/demo-after.json --tasks 5

cd ../../..
npx @kingkyylian/agentfit@latest compare examples/reports/demo-before.json examples/reports/demo-after.json --format markdown
```

Show this output:

```text
AgentFit improved by 28 points: 65/100 (D) -> 93/100 (A).
```

Then show the self-check:

```bash
npx @kingkyylian/agentfit@latest eval --adapter dry-run --run-tasks
```

Key line:

```text
AgentFit score: 100/100 (A)
```

## X Post

```text
I ran AgentFit against 30 public repos that already have coding-agent instructions.

Useful signal:
- 15 healthy internal baselines
- 9 actionable local drafts
- 5 reviewed no-contact snapshots
- 1 unsupported low-signal snapshot
- one stale-command issue became a merged upstream PR
- 3 AgentFit product fixes from noisy validation reports

I am looking for more public repos with AGENTS.md, CLAUDE.md, Cursor rules, or Copilot instructions to dry-run validate.

Repo suggestions:
https://github.com/kingkyylian/agentfit/issues/9
```

Follow-up:

```text
AgentFit is a local-first checker for AGENTS.md, CLAUDE.md, Cursor rules, Copilot instructions, and similar repo guidance.

Dry-run mode does not call model providers or execute generated tasks.

It checks for stale commands, broken @file references, missing nested monorepo instructions, and before/after report changes.

Repo:
https://github.com/kingkyylian/agentfit

Repo suggestions:
https://github.com/kingkyylian/agentfit/issues/9
```

Follow-up 2:

```text
The clearest external finding so far was RedisInsight Cursor rules documenting stale root E2E commands.

The maintainers requested a PR and merged it:
https://github.com/redis/RedisInsight/pull/5889
```

## Hacker News

Title:

```text
Show HN: AgentFit - CI checks for AGENTS.md and coding-agent instructions
```

Body:

```text
I built AgentFit because agent instruction files are starting to behave like code: they have dependencies, references, commands, and regressions, but usually no tests.

AgentFit is a local-first CLI and GitHub Action that scores AGENTS.md, CLAUDE.md, Cursor rules, Copilot instructions, and similar files. It checks whether commands still exist, references resolve, nested packages are covered, and generated repo-specific tasks can be verified in isolated git worktrees.

The demo repo goes from 65/100 to 93/100 after fixing a missing referenced doc, stale lint command, missing verification command, and missing nested package instruction file.

Install:
npx @kingkyylian/agentfit@latest eval --adapter dry-run

Repo:
https://github.com/kingkyylian/agentfit
```

## Reddit

Use a practical title. Avoid hype.

```text
I made a local-first checker for AGENTS.md / coding-agent instruction files
```

Post:

```text
I have been seeing more repos add AGENTS.md, CLAUDE.md, Cursor rules, and Copilot instructions, but most of these files are never tested.

AgentFit checks whether those instructions are still usable:
- command freshness
- broken @file references
- nested monorepo coverage
- generated repo-specific fitness tasks
- before/after score comparison
- GitHub Action support

It is local-first by default. Dry-run mode does not call model providers.

Example:
npx @kingkyylian/agentfit@latest eval --adapter dry-run

Repo:
https://github.com/kingkyylian/agentfit

I am looking for repos with real agent instruction files to test against.
```

## Public Repo Request

```text
I am looking for 5-10 public repos that already use AGENTS.md, CLAUDE.md, Cursor rules, or Copilot instructions.

I will run AgentFit in dry-run mode and share the report if it finds concrete instruction drift: stale commands, missing references, or monorepo scope gaps.

No model-provider calls, no generated task execution, and no endorsement implied.

https://github.com/kingkyylian/agentfit
```

## First Preview Thread

Use this before a broad launch. It should feel like a request for help, not a finished product announcement.

Post:

```text
I am looking for public repos that already use AGENTS.md, CLAUDE.md, Cursor rules, Copilot instructions, or similar coding-agent guidance.

I will run AgentFit in dry-run mode and share concrete instruction drift if it finds any: stale commands, broken references, or monorepo scope gaps.

Dry-run mode does not call model providers or execute generated tasks.

Repo suggestions:
https://github.com/kingkyylian/agentfit/issues/9
```

Reply 1:

```text
I have run 30 dry-run snapshots so far.

Useful signal:
- 15 healthy internal baselines
- 9 actionable local drafts
- 5 reviewed no-contact snapshots
- 1 unsupported low-signal snapshot
- one stale-command issue became a merged upstream RedisInsight PR
- 3 AgentFit product fixes from noisy validation reports

RedisInsight PR:
https://github.com/redis/RedisInsight/pull/5889
```

Reply 2:

```text
No endorsement is implied by any repo being tested.

If a report is noisy, I turn it into an AgentFit issue instead of bothering maintainers. If it finds concrete drift that can be verified quickly, I may share a narrow maintainer issue.
```

## GitHub Community Draft

Use this after the X preview has had a few hours to settle. Post it as a discussion-style request for repo suggestions and report sanity checks, not as a launch announcement.

Suggested title:

```text
Looking for public repos with AGENTS.md / coding-agent instructions to dry-run validate
```

Body:

```text
I am building AgentFit, a local-first checker for AGENTS.md, CLAUDE.md, Cursor rules, Copilot instructions, and similar coding-agent guidance.

I am looking for public repositories that already use these files so I can run dry-run validation and sanity-check the reports.

What AgentFit checks in dry-run mode:

- stale documented commands
- broken @file references
- missing nested monorepo instruction coverage
- safety and reproducibility guidance
- before/after report changes

Dry-run mode does not call model providers and does not execute generated tasks.

I have run 30 public dry-run snapshots so far. The current internal triage is 15 healthy baselines, 9 actionable local drafts, 5 reviewed no-contact snapshots, and 1 unsupported low-signal snapshot.

The clearest external finding was a stale-command issue in RedisInsight Cursor rules; the maintainers requested a PR and merged the fix:
https://github.com/redis/RedisInsight/pull/5889

The same validation work found noisy AgentFit behavior too, so I fixed package-local command resolution, command extraction, and working-directory inference during the 0.1.13 cycle:
https://github.com/kingkyylian/agentfit/issues/8

If you know a public repo that already has AGENTS.md, CLAUDE.md, Cursor rules, Copilot instructions, or similar guidance, please suggest it here:
https://github.com/kingkyylian/agentfit/issues/9

No endorsement is implied by any repo being tested. If a report is noisy, I turn it into an AgentFit issue instead of bothering maintainers. If it finds concrete drift that can be verified quickly, I may share a narrow maintainer issue.

Repo:
https://github.com/kingkyylian/agentfit
```

Optional addendum if linking back to X:

```text
I started with a short X thread here:
https://x.com/KaganIs66551/status/2053875763275768289
```

Reply when someone suggests GitHub code search instead of a specific repo:

```text
Thanks, this is useful. I will use these searches to build a dry-run-only candidate list and sort by recently updated so the reports target active instructions.

I am still keeping the repo suggestion issue open for concrete suggestions, but I will treat search results as candidates only, not as consent to contact maintainers.

The validation flow stays the same: dry-run first, no model-provider calls, no generated task execution, and maintainer contact only for concrete stale commands, broken references, or clear monorepo scope gaps.
```

## Maintainer Outreach

Use this for projects that already have `AGENTS.md`, `CLAUDE.md`, `.cursor/rules`, or Copilot instructions:

```text
Hi, I maintain AgentFit, a local-first checker for AGENTS.md / coding-agent instruction files.

I ran a dry-run snapshot on this repo because it already has agent instructions. It did not execute generated tasks or call model providers.

Command:
npx @kingkyylian/agentfit@latest eval --adapter dry-run --format markdown

Finding:
- <one concrete finding>

Why it may matter:
<one sentence explaining how a coding agent could be misled>

This may be useful as a quick docs/tooling cleanup. If tool-generated issues are not welcome here, feel free to close this and I will not follow up.
```

Use this when asking permission to include a named report:

```text
Hi, I ran AgentFit in dry-run mode against this repo while collecting public examples of AGENTS.md / coding-agent instruction checks.

The snapshot is only a static report. It does not execute generated tasks or call model providers.

I would like to include the report as a real-world example. No endorsement implied, and I can remove it if you prefer.

Tool:
https://github.com/kingkyylian/agentfit
```

## First Feedback Funnel

Use [feedback-triage.md](feedback-triage.md) to classify every suggestion before contact or public use.

- First 3-5 reports: public repositories found through GitHub code search.
- First maintainer contact: only when AgentFit finds a concrete, reproducible issue.
- First X post: proof-led validation summary plus one real-world finding, not a generic product pitch.
- First Discord/Slack posts: ask for repos to test, not for promotion.
- First Hacker News or Reddit post: before/after demo plus 3-5 public report signals.

Do not lead with broad quality claims. Lead with the concrete failure mode: instruction drift.

Do not ask for promotion in validation messages. Ask for repo suggestions, report sanity checks, or permission to reference a snapshot.

## 7-Day Feedback Cadence

The goal is five external repo suggestions or report sanity checks. Stop and re-evaluate after five real external signals, even if the post metrics look small.

| Day | Action | Success Signal |
| --- | --- | --- |
| 1 | Post the proof-led X thread and reply once with the RedisInsight PR. | One reply, quote, DM, or issue comment with a repo suggestion. |
| 1 | Pin or repost issue `#9` as the single call to action. | People know where to leave repo URLs. |
| 2 | Post the GitHub Community draft as a request for repo suggestions. | One external comment or reaction from a maintainer/developer. |
| 3 | Ask 3 healthy baseline repos for permission to reference a named dry-run report. | One yes/no response, not silence. |
| 4 | Run one suggested repo or one new public candidate and share only concrete output. | A fresh report artifact or product issue. |
| 5 | Follow up with the best single concrete finding or clean baseline. | One technical reply or repo suggestion. |
| 6 | Prepare HN/Reddit only if there is new external proof. | A sharper title backed by feedback, not a generic launch. |
| 7 | Decide whether to broaden launch or run another validation batch. | At least five external signals, or a clear reason to iterate messaging. |

Do not post broad launch copy to Hacker News or Reddit until at least one of these is true:

- issue `#9` has 3+ external repo suggestions
- a healthy named example gives permission to be referenced
- another concrete stale-command or broken-reference finding is verified
- a developer outside the project asks for a report or Action setup

## Public Preview Without A Network

Use this sequence when there is no existing friend or maintainer network to lean on:

1. Post the repo-request message first, not the full launch pitch.
2. Pin the ask to public repos that already have `AGENTS.md`, `CLAUDE.md`, Cursor rules, or Copilot instructions.
3. Say dry-run mode does not call model providers and does not execute generated tasks.
4. Share only concrete examples: stale commands, missing references, monorepo scope gaps, or healthy reports with permission.
5. Follow up with the 30-snapshot result thread: one external maintainer issue that became a merged PR, 15 healthy internal baselines, 9 actionable local drafts, 5 reviewed no-contact snapshots, 1 unsupported low-signal snapshot, and 3 product fixes from validation.

Preview result copy:

```text
I ran AgentFit against 30 public repos that already have coding-agent instructions.

Useful signal so far:
- 15 healthy internal baselines
- 9 actionable local drafts
- 5 reviewed no-contact snapshots
- 1 unsupported low-signal snapshot
- one stale-command issue opened upstream, followed by a maintainer-requested PR that merged
- 3 AgentFit product fixes from noisy validation reports

I am looking for more public repos with AGENTS.md, CLAUDE.md, Cursor rules, or Copilot instructions to sanity-check before a broader launch.

https://github.com/kingkyylian/agentfit
Repo suggestions:
https://github.com/kingkyylian/agentfit/issues/9
```

Current 37-candidate repo-request copy:

```text
I am still looking for public repos that already use AGENTS.md, CLAUDE.md, GEMINI.md, Cursor rules, Copilot instructions, or similar coding-agent guidance.

AgentFit's current dry-run corpus tracks 37 reviewed public candidates:
- 16 healthy internal baselines
- 12 actionable local drafts
- 8 reviewed no-contact snapshots
- 1 unsupported low-signal snapshot

Dry-run mode does not call model providers or execute generated tasks.

If a report finds concrete drift, I can share a narrow finding: stale commands, broken references, or clear monorepo scope gaps. If a report is noisy, I turn it into an AgentFit product issue instead of bothering maintainers.

Repo suggestions:
https://github.com/kingkyylian/agentfit/issues/9
```

Use the RedisInsight issue as the concrete example only when the link helps the conversation:

```text
Example finding: Cursor rules documented root E2E scripts that no longer exist, while the current Playwright commands live under a package directory.

Issue: https://github.com/redis/RedisInsight/issues/5887
PR: https://github.com/redis/RedisInsight/pull/5889
```

Use this when linking the repo-suggestion issue directly:

```text
I opened a low-pressure repo suggestion issue for AgentFit dry-run validation.

If your repo already has AGENTS.md, CLAUDE.md, Cursor rules, Copilot instructions, or similar coding-agent guidance, drop it here:
https://github.com/kingkyylian/agentfit/issues/9

Dry-run mode does not call model providers or execute generated tasks. If a report is noisy, I turn it into an AgentFit issue instead of bothering maintainers.
```

Current public issue `#9` funnel state:

```text
The repo-suggestion issue was refreshed again on 2026-05-23 after explicit approval:
https://github.com/kingkyylian/agentfit/issues/9#issuecomment-4525279626

The issue body was also updated on 2026-05-23 so the current public funnel state is:
- 37 reviewed public dry-run candidates
- 16 healthy internal baselines
- 12 actionable local drafts
- 8 reviewed no-contact snapshots
- 1 unsupported low-signal snapshot

The refresh is funnel maintenance only. It does not count as an external signal, and it should not be reposted unless there is new explicit approval and a reason to refresh again.

GitHub Discussions are currently disabled for the repository, so issue #9 is the single GitHub-native suggestion funnel.
```

## 2026-05-22 Approval Packet

This section is local-only. Do not post, comment, open issues, or contact maintainers from this packet without explicit approval.

Current evidence:

- Local corpus: `37` reviewed public dry-run candidates.
- Triage split: `16` healthy internal baselines, `12` actionable local drafts, `8` reviewed no-contact snapshots, `1` unsupported low-signal snapshot.
- External signal counter: `0/5`.
- Issue `#9` body and latest refresh comment publicly reflect the `37`-candidate update.
- GitHub Discussions are disabled, so issue `#9` remains the single GitHub-native funnel.
- No 2026-05-22 maintainer outreach, issue update, public channel post, model-provider call, generated task execution, or real adapter run has happened.
- 2026-05-23 pre-post live recheck: issue `#9` was still open, still had only the 34-candidate progress comment, and GitHub Discussions were still disabled.
- 2026-05-23 after explicit approval: the 37-candidate issue `#9` refresh was posted at https://github.com/kingkyylian/agentfit/issues/9#issuecomment-4525279626 and the issue body was updated to the same 37-candidate baseline. This is funnel maintenance only and does not count as an external signal.

Posted public-funnel refresh:

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

This issue update was posted after explicit approval and should not be counted as an external signal. It is a funnel refresh only. Count a signal only if someone outside the project replies with a repo suggestion, asks for a report sanity-check, grants permission, responds as a maintainer, or creates another concrete feedback path.

Preferred next action if one maintainer outreach is approved:

1. `smithery-ai/cli`: concrete command drift in `CLAUDE.md`; no previous contact history in this project.
2. `OpenCoworkAI/open-codesign`: concrete `pnpm test:e2e` drift; mention only the stale command, not broad score findings.
3. `eggjs/egg`: concrete `pnpm run clean` drift; still eligible, but older than the 2026-05-21 continuation drafts.

Do not start with `netresearch/composer-patches-plugin` unless the user specifically wants verification-guidance outreach. It is useful but less concrete than stale command drift.

Preferred next action if a public channel post is approved:

- Use the `Current 37-candidate repo-request copy` above.
- Keep the ask narrow: public repos with agent instruction files.
- Point back to issue `#9`.
- Do not name healthy repositories as proof unless permission has been granted.
- Do not post Hacker News or Reddit yet; `docs/launch.md` still requires stronger external proof.

Decision rule:

- If the goal is to reduce friction with minimal public surface area, issue `#9` has already been refreshed; wait for replies before reposting.
- If the goal is to actively seek new suggestions, post the 37-candidate repo-request copy in one public channel.
- If the goal is to create a concrete external signal quickly, ask approval for exactly one narrow stale-command maintainer outreach.
- Do not do multiple channels or multiple maintainer contacts in the same step; wait for signal and record the outcome in [public-preview-execution-log.md](public-preview-execution-log.md).

## Follow-Up Issues

Open these after the first public feedback batch:

- Add more real-world dry-run snapshots.
- Keep optional alias/example command detection covered by regression tests.
- Add a terminal recording to the README.
- Add an `agentfit init --from-repo` improvement if users ask for scaffolding.
- Improve monorepo examples.
- Add real-agent adapter smoke tests once non-interactive execution is stable.
