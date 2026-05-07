# AgentFit Report

**Score:** 65/100 (D)

AgentFit score 65/100 (D).

Generated: 2026-05-07T12:24:02.709Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 15/20 | 1 instruction file discovered; 1 nested scope issue found. |
| Command freshness | 0/15 | 2 static command issues found. |
| Reference integrity | 0/15 | 1 reference error found. |
| Evaluation pass rate | 20/20 | 2 deterministic task previews generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 10/10 | Safety guardrails found. |
| Reproducibility | 10/10 | Reproducible setup and verification guidance found. |

## Failed Checks

- No nested instruction file found for packages/api.
- Documented command references missing package script "lint".
- No runnable verification command found in instruction files.
- 1 instruction reference is missing or invalid.

## Caps

None.

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| AGENTS.md | agents | . | 2 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the test package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Make a harmless README wording change and run verification | dry-run | preview | not executed | 0 files, +0/-0 | - |
## Reference Issues

| Source | Target | Severity | Message |
| --- | --- | --- | --- |
| AGENTS.md:3 | docs/setup.md | error | Referenced file does not exist: docs/setup.md |

## Static Issues

| Category | Source | Severity | Message |
| --- | --- | --- | --- |
| command | AGENTS.md | error | Documented command references missing package script "lint". |
| command | AGENTS.md | error | No runnable verification command found in instruction files. |
| scope | packages/api | warning | No nested instruction file found for packages/api. |
