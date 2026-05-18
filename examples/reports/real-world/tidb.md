# AgentFit Report

**Score:** 93/100 (A)

No failed checks.

Generated: 2026-05-18T17:08:20.602Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 20/20 | 3 instruction files discovered. |
| Command freshness | 8/15 | Commands were found but not executed. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 1 deterministic task preview generated; no tasks were executed. |
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
| AGENTS.md | agents | . | 15 | 0 |
| CLAUDE.md | claude | . | 0 | 1 |
| dumpling/tests/AGENTS.md | agents | dumpling/tests | 3 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Make a harmless README wording change and run verification | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Signal Findings

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | AGENTS.md:17 | Deterministic or reproducible workflow guidance. |
| reproducibility | AGENTS.md:95 | Deterministic or reproducible workflow guidance. |
| reproducibility | AGENTS.md:163 | Deterministic or reproducible workflow guidance. |
| reproducibility | AGENTS.md:207 | Deterministic or reproducible workflow guidance. |
| reproducibility | dumpling/tests/AGENTS.md:12 | Deterministic or reproducible workflow guidance. |
| safety | AGENTS.md:197 | Do-not-run or do-not-expose boundary for risky actions. |
