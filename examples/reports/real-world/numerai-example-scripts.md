# AgentFit Report

**Score:** 65/100 (D)

4 failed checks found. 1 score cap applied.

Generated: 2026-05-18T16:43:52.901Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 20/20 | 3 instruction files discovered. |
| Command freshness | 0/15 | 1 static command issue found. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 1 deterministic task preview generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 0/10 | Safety guardrails were not found. |
| Reproducibility | 0/10 | Reproducibility instructions were not found. |

## Failed Checks

- No runnable verification command found in instruction files.
- Safety guardrails were not found.
- Reproducibility instructions were not found.
- No verification command found in instruction files.

## Caps

- no verification command found: max score 75

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| AGENTS.md | agents | . | 6 | 0 |
| numerai/AGENTS.md | agents | numerai | 1 | 0 |
| numerai/agents/AGENTS.md | agents | numerai/agents | 1 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Make a harmless README wording change and run verification | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Static Issues

| Category | Source | Severity | Message |
| --- | --- | --- | --- |
| command | AGENTS.md | error | No runnable verification command found in instruction files. |
