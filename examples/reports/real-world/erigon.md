# AgentFit Report

**Score:** 83/100 (B)

1 failed check found.

Generated: 2026-05-18T17:29:37.781Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 20/20 | 6 instruction files discovered. |
| Command freshness | 8/15 | Commands were found but not executed. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 1 deterministic task preview generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 0/10 | Safety guardrails were not found. |
| Reproducibility | 10/10 | Reproducible setup and verification guidance found. |

## Failed Checks

- Safety guardrails were not found.

## Caps

None.

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| CLAUDE.md | claude | . | 12 | 0 |
| agents.md | agents | . | 12 | 0 |
| cl/agents.md | agents | cl | 0 | 0 |
| db/agents.md | agents | db | 0 | 0 |
| execution/stagedsync/agents.md | agents | execution/stagedsync | 0 | 0 |
| p2p/agents.md | agents | p2p | 0 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Make a harmless README wording change and run verification | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Signal Findings

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | agents.md:10 | Build command guidance. |
| reproducibility | agents.md:11 | Test command guidance. |
| reproducibility | agents.md:12 | Test command guidance. |
| reproducibility | agents.md:13 | Test command guidance. |
| reproducibility | agents.md:14 | Test command guidance. |
| reproducibility | agents.md:82 | Deterministic or reproducible workflow guidance. |
| reproducibility | agents.md:121 | Deterministic or reproducible workflow guidance. |
| reproducibility | agents.md:125 | Deterministic or reproducible workflow guidance. |
| reproducibility | CLAUDE.md:10 | Build command guidance. |
| reproducibility | CLAUDE.md:11 | Test command guidance. |
| reproducibility | CLAUDE.md:12 | Test command guidance. |
| reproducibility | CLAUDE.md:13 | Test command guidance. |
| reproducibility | CLAUDE.md:14 | Test command guidance. |
| reproducibility | CLAUDE.md:82 | Deterministic or reproducible workflow guidance. |
| reproducibility | CLAUDE.md:121 | Deterministic or reproducible workflow guidance. |
| reproducibility | CLAUDE.md:125 | Deterministic or reproducible workflow guidance. |
