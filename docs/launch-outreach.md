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
AgentFit score 100/100 (A).
```

## X Post

```text
I built AgentFit: CI for AGENTS.md and coding-agent instructions.

It checks whether your agent docs still work:
- stale setup/test commands
- broken @file references
- missing nested monorepo instructions
- before/after score regressions
- isolated worktree verification

npx @kingkyylian/agentfit@latest eval --adapter dry-run

Repo: https://github.com/kingkyylian/agentfit
```

Follow-up:

```text
The demo starts with a stale AGENTS.md:
- missing @docs/setup.md
- stale pnpm lint
- no runnable verification command
- no nested packages/api/AGENTS.md

AgentFit compare: 65/100 (D) -> 93/100 (A)
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
I have run 20 dry-run snapshots so far.

Useful signal:
- one stale-command issue became a merged upstream RedisInsight PR
- two AgentFit false-positive classes shipped as fixes in 0.1.8
- one noisy package-local command pattern became a product issue

RedisInsight PR:
https://github.com/redis/RedisInsight/pull/5889
```

Reply 2:

```text
No endorsement is implied by any repo being tested.

If a report is noisy, I turn it into an AgentFit issue instead of bothering maintainers. If it finds concrete drift that can be verified quickly, I may share a narrow maintainer issue.
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

- First 3-5 reports: public repositories found through GitHub code search.
- First maintainer contact: only when AgentFit finds a concrete, reproducible issue.
- First X post: terminal demo plus one real-world finding, not a generic product pitch.
- First Discord/Slack posts: ask for repos to test, not for stars.
- First Hacker News or Reddit post: before/after demo plus 3-5 public report signals.

Do not lead with "perfect" or "AI-ready". Lead with the concrete failure mode: instruction drift.

Do not ask for stars in validation messages. Ask for repo suggestions, report sanity checks, or permission to reference a snapshot.

## Public Preview Without A Network

Use this sequence when there is no existing friend or maintainer network to lean on:

1. Post the repo-request message first, not the full launch pitch.
2. Pin the ask to public repos that already have `AGENTS.md`, `CLAUDE.md`, Cursor rules, or Copilot instructions.
3. Say dry-run mode does not call model providers and does not execute generated tasks.
4. Share only concrete examples: stale commands, missing references, monorepo scope gaps, or healthy reports with permission.
5. Follow up with a small result thread after 20 snapshots: one external maintainer issue that became a merged PR, two AgentFit false-positive fixes released in `0.1.8`, one open product issue from noisy validation, and a few healthy baselines.

Preview result copy:

```text
I ran AgentFit against 20 public repos that already have coding-agent instructions.

Useful signal so far:
- one stale-command issue opened upstream, followed by a maintainer-requested PR that merged
- two AgentFit false-positive classes found and released in 0.1.8
- one noisy package-local command pattern turned into a product issue
- several healthy instruction files that score cleanly in dry-run mode

I am looking for more public repos with AGENTS.md, CLAUDE.md, Cursor rules, or Copilot instructions to sanity-check before a broader launch.

https://github.com/kingkyylian/agentfit
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

## Follow-Up Issues

Open these after the first public feedback batch:

- Add more real-world dry-run snapshots.
- Keep optional alias/example command detection covered by regression tests.
- Add a terminal recording to the README.
- Add an `agentfit init --from-repo` improvement if users ask for scaffolding.
- Improve monorepo examples.
- Add real-agent adapter smoke tests once non-interactive execution is stable.
