# AgentFit Report

**Score:** 83/100 (B)

1 failed check found.

Generated: 2026-05-18T16:56:53.876Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 20/20 | 1 instruction file discovered. |
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
| AGENTS.md | agents | . | 13 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Make a harmless README wording change and run verification | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Signal Findings

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | AGENTS.md:10 | Test command guidance. |
| reproducibility | AGENTS.md:11 | Test command guidance. |
| reproducibility | AGENTS.md:12 | Test command guidance. |
| reproducibility | AGENTS.md:21 | Deterministic or reproducible workflow guidance. |
| reproducibility | AGENTS.md:22 | Deterministic or reproducible workflow guidance. |
| reproducibility | AGENTS.md:36 | Deterministic or reproducible workflow guidance. |
| reproducibility | AGENTS.md:47 | Deterministic or reproducible workflow guidance. |
| reproducibility | AGENTS.md:150 | Test command guidance. |
| reproducibility | AGENTS.md:154 | Test command guidance. |
| reproducibility | AGENTS.md:156 | Test command guidance. |
| reproducibility | AGENTS.md:158 | Test command guidance. |
| reproducibility | AGENTS.md:159 | Test command guidance. |
| reproducibility | AGENTS.md:167 | Test command guidance. |
| reproducibility | AGENTS.md:174 | Test command guidance. |
| reproducibility | AGENTS.md:179 | Deterministic or reproducible workflow guidance. |
