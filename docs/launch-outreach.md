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

## Direct Message

```text
Hey, I built a small OSS tool that might be relevant if you use Codex, Claude Code, Cursor, or Copilot.

It is called AgentFit. It tests whether AGENTS.md / coding-agent instructions still work: commands, references, nested package coverage, and before/after score changes.

No pressure, but a star or a quick sanity check would help before I launch it more publicly:
https://github.com/kingkyylian/agentfit
```

## Maintainer Outreach

Use this for projects that already have `AGENTS.md`, `CLAUDE.md`, `.cursor/rules`, or Copilot instructions:

```text
Hi, I noticed this repo has agent instruction files. I built AgentFit, a local-first checker that scores whether those files still match the repo: commands, references, nested scopes, and generated verification tasks.

I would like to add a dry-run snapshot of your repo as a real-world example. No endorsement implied, and I can remove it if you prefer.

Tool: https://github.com/kingkyylian/agentfit
```

## First 100 Stars

- 0-10: direct messages to trusted developers.
- 10-25: X post with terminal demo.
- 25-50: targeted Discord/Slack communities where coding agents are already discussed.
- 50-100: Show HN and Reddit with the before/after demo.

Do not lead with "perfect" or "AI-ready". Lead with the concrete failure mode: instruction drift.

## Follow-Up Issues

Open these after the first public feedback batch:

- Add more real-world dry-run snapshots.
- Add a terminal recording to the README.
- Add an `agentfit init --from-repo` improvement if users ask for scaffolding.
- Improve monorepo examples.
- Add real-agent adapter smoke tests once non-interactive execution is stable.
