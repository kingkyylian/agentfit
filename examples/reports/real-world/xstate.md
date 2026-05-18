# AgentFit Report

**Score:** 78/100 (C)

2 failed checks found.

Generated: 2026-05-18T16:56:53.893Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 15/20 | 2 instruction files discovered; 14 nested scope issues found. |
| Command freshness | 8/15 | Commands were found but not executed. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 5 deterministic task previews generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 0/10 | Safety guardrails were not found. |
| Reproducibility | 10/10 | Reproducible setup and verification guidance found. |

## Failed Checks

- 14 nested scopes do not have local instruction files.
- Safety guardrails were not found.

## Caps

None.

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| AGENTS.md | agents | . | 5 | 0 |
| CLAUDE.md | claude | . | 5 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the test package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:core package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:core:watch package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:store package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:store:watch package script | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Static Issues

| Category | Source | Severity | Message |
| --- | --- | --- | --- |
| scope | packages/core | warning | No nested instruction file found for packages/core. |
| scope | packages/xstate-immer | warning | No nested instruction file found for packages/xstate-immer. |
| scope | packages/xstate-inspect | warning | No nested instruction file found for packages/xstate-inspect. |
| scope | packages/xstate-react | warning | No nested instruction file found for packages/xstate-react. |
| scope | packages/xstate-solid | warning | No nested instruction file found for packages/xstate-solid. |
| scope | packages/xstate-store | warning | No nested instruction file found for packages/xstate-store. |
| scope | packages/xstate-store-angular | warning | No nested instruction file found for packages/xstate-store-angular. |
| scope | packages/xstate-store-preact | warning | No nested instruction file found for packages/xstate-store-preact. |
| scope | packages/xstate-store-react | warning | No nested instruction file found for packages/xstate-store-react. |
| scope | packages/xstate-store-solid | warning | No nested instruction file found for packages/xstate-store-solid. |
| scope | packages/xstate-store-svelte | warning | No nested instruction file found for packages/xstate-store-svelte. |
| scope | packages/xstate-store-vue | warning | No nested instruction file found for packages/xstate-store-vue. |
| scope | packages/xstate-svelte | warning | No nested instruction file found for packages/xstate-svelte. |
| scope | packages/xstate-vue | warning | No nested instruction file found for packages/xstate-vue. |

## Command Resolutions

| Command | Source | Script | Package | Status |
| --- | --- | --- | --- | --- |
| pnpm test | AGENTS.md:9 | test | package.json | resolved |
| pnpm test:core | AGENTS.md:10 | test:core | package.json | resolved |
| pnpm test:store | AGENTS.md:11 | test:store | package.json | resolved |
| pnpm typecheck | AGENTS.md:12 | typecheck | package.json | resolved |
| pnpm test | CLAUDE.md:9 | test | package.json | resolved |
| pnpm test:core | CLAUDE.md:10 | test:core | package.json | resolved |
| pnpm test:store | CLAUDE.md:11 | test:store | package.json | resolved |
| pnpm typecheck | CLAUDE.md:12 | typecheck | package.json | resolved |

## Signal Findings

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | AGENTS.md:9 | Test command guidance. |
| reproducibility | AGENTS.md:10 | Test command guidance. |
| reproducibility | AGENTS.md:11 | Test command guidance. |
| reproducibility | AGENTS.md:12 | Build command guidance. |
| reproducibility | CLAUDE.md:9 | Test command guidance. |
| reproducibility | CLAUDE.md:10 | Test command guidance. |
| reproducibility | CLAUDE.md:11 | Test command guidance. |
| reproducibility | CLAUDE.md:12 | Build command guidance. |
