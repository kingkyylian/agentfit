# AgentFit Report

**Score:** 78/100 (C)

2 failed checks found.

Generated: 2026-05-22T14:33:18.481Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 15/20 | 1 instruction file discovered; 6 nested scope issues found. |
| Command freshness | 8/15 | Commands were found but not executed. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 5 deterministic task previews generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 0/10 | Safety guardrails were not found. |
| Reproducibility | 10/10 | Reproducible setup and verification guidance found. |

## Failed Checks

- 6 nested scopes do not have local instruction files.
- Safety guardrails were not found.

## Caps

None.

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| AGENTS.md | agents | . | 5 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the test package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the lint package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the lint:knip package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the lint:prettier package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the lint:sherif package script | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Static Issues

| Category | Source | Severity | Message |
| --- | --- | --- | --- |
| scope | packages/docs | warning | No nested instruction file found for packages/docs. |
| scope | packages/e2e | warning | No nested instruction file found for packages/e2e. |
| scope | packages/examples | warning | No nested instruction file found for packages/examples. |
| scope | packages/nuqs | warning | No nested instruction file found for packages/nuqs. |
| scope | packages/res | warning | No nested instruction file found for packages/res. |
| scope | packages/scripts | warning | No nested instruction file found for packages/scripts. |

## Command Resolutions

| Command | Source | Script | Package | Status |
| --- | --- | --- | --- | --- |
| pnpm build | AGENTS.md:39 | build | package.json | resolved |
| pnpm test | AGENTS.md:40 | test | package.json | resolved |
| pnpm test | AGENTS.md:96 | test | package.json | resolved |

## Signal Findings

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | AGENTS.md:39 | Build command guidance. |
| reproducibility | AGENTS.md:40 | Test command guidance. |
| reproducibility | AGENTS.md:96 | Test command guidance. |
