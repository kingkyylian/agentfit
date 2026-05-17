# AgentFit Report

**Score:** 93/100 (A)

No failed checks.

Generated: 2026-05-17T12:44:28.093Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 20/20 | 2 instruction files discovered. |
| Command freshness | 8/15 | Commands were found but not executed. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 4 deterministic task previews generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 10/10 | Safety guardrails found. |
| Reproducibility | 10/10 | Reproducible setup and verification guidance found. |

## Failed Checks

None.

## Caps

None.

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| AGENTS.md | agents | . | 4 | 1 |
| packages/api/AGENTS.md | agents | packages/api | 0 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the test package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the lint package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the build package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Make a harmless README wording change and run verification | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Command Resolutions

| Command | Source | Script | Package | Status |
| --- | --- | --- | --- | --- |
| pnpm test | AGENTS.md:14 | test | package.json | resolved |
| pnpm lint | AGENTS.md:15 | lint | package.json | resolved |
| pnpm build | AGENTS.md:16 | build | package.json | resolved |

## Signal Findings

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | AGENTS.md:8 | Setup command guidance. |
| reproducibility | AGENTS.md:14 | Test command guidance. |
| reproducibility | AGENTS.md:16 | Build command guidance. |
| safety | AGENTS.md:20 | Do-not-run or do-not-expose boundary for risky actions. |
