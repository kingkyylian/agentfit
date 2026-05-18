# AgentFit Report

**Score:** 83/100 (B)

1 failed check found.

Generated: 2026-05-18T17:08:20.634Z

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
| AGENTS.md | agents | . | 21 | 0 |
| CLAUDE.md | claude | . | 0 | 1 |
| docs/CLAUDE.md | claude | docs | 0 | 0 |
| integration/CLAUDE.md | claude | integration | 5 | 0 |
| operations/helm/CLAUDE.md | claude | operations/helm | 6 | 0 |
| pkg/CLAUDE.md | claude | pkg | 0 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Make a harmless README wording change and run verification | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Signal Findings

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | AGENTS.md:53 | Build command guidance. |
| reproducibility | AGENTS.md:81 | Test command guidance. |
| reproducibility | integration/CLAUDE.md:16 | Test command guidance. |
| reproducibility | integration/CLAUDE.md:22 | Test command guidance. |
| reproducibility | integration/CLAUDE.md:25 | Test command guidance. |
| reproducibility | integration/CLAUDE.md:28 | Test command guidance. |
| reproducibility | operations/helm/CLAUDE.md:18 | Build command guidance. |
| reproducibility | operations/helm/CLAUDE.md:18 | Test command guidance. |
| reproducibility | operations/helm/CLAUDE.md:46 | Test command guidance. |
| reproducibility | operations/helm/CLAUDE.md:91 | Test command guidance. |
