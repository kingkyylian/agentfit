# AgentFit Report

**Score:** 93/100 (A)

No failed checks.

Generated: 2026-05-18T16:43:52.892Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 20/20 | 2 instruction files discovered. |
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
| CLAUDE.md | claude | . | 19 | 0 |
| agents.md | agents | . | 37 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Make a harmless README wording change and run verification | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Signal Findings

Showing first 25 of 29 signal findings. JSON output contains the complete set.

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | agents.md:21 | Test command guidance. |
| reproducibility | agents.md:26 | Test command guidance. |
| reproducibility | agents.md:31 | Test command guidance. |
| reproducibility | agents.md:36 | Test command guidance. |
| reproducibility | agents.md:41 | Test command guidance. |
| reproducibility | agents.md:46 | Test command guidance. |
| reproducibility | agents.md:51 | Test command guidance. |
| reproducibility | agents.md:65 | Setup command guidance. |
| reproducibility | agents.md:77 | Test command guidance. |
| reproducibility | agents.md:84 | Test command guidance. |
| reproducibility | agents.md:122 | Test command guidance. |
| reproducibility | agents.md:123 | Test command guidance. |
| reproducibility | agents.md:124 | Test command guidance. |
| reproducibility | agents.md:125 | Test command guidance. |
| reproducibility | agents.md:127 | Test command guidance. |
| reproducibility | agents.md:128 | Test command guidance. |
| reproducibility | agents.md:136 | Setup command guidance. |
| reproducibility | agents.md:143 | Build command guidance. |
| reproducibility | CLAUDE.md:33 | Setup command guidance. |
| reproducibility | CLAUDE.md:40 | Build command guidance. |
| reproducibility | CLAUDE.md:41 | Test command guidance. |
| reproducibility | CLAUDE.md:47 | Test command guidance. |
| reproducibility | CLAUDE.md:48 | Test command guidance. |
| reproducibility | CLAUDE.md:49 | Test command guidance. |
| reproducibility | CLAUDE.md:62 | Test command guidance. |
