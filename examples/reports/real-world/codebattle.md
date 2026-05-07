# AgentFit Report

**Score:** 80/100 (B)

AgentFit score 80/100 (B).

Generated: 2026-05-07T18:07:58.141Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 15/20 | 2 instruction files discovered; 1 nested scope issue found. |
| Command freshness | 0/15 | 3 static command issues found. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 5 deterministic task previews generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 10/10 | Safety guardrails found. |
| Reproducibility | 10/10 | Reproducible setup and verification guidance found. |

## Failed Checks

- No nested instruction file found for apps/codebattle.
- Documented command references missing package script "build".
- Documented command references missing package script "test".
- Documented command references missing package script "lint".

## Caps

None.

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| AGENTS.md | agents | . | 11 | 0 |
| CLAUDE.md | claude | . | 20 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Make a safe change covered by apps/codebattle/assets/js/__tests__/ContributorsList.test.jsx | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Make a safe change covered by apps/codebattle/assets/js/__tests__/CreateGameDialog.test.jsx | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Make a safe change covered by apps/codebattle/assets/js/__tests__/Registration.test.jsx | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Make a safe change covered by apps/codebattle/assets/js/__tests__/RootContainer.test.jsx | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Make a safe change covered by apps/codebattle/assets/js/__tests__/TournamentHeader.test.jsx | dry-run | preview | not executed | 0 files, +0/-0 | - |
## Static Issues

| Category | Source | Severity | Message |
| --- | --- | --- | --- |
| command | AGENTS.md | error | Documented command references missing package script "build". |
| command | AGENTS.md | error | Documented command references missing package script "test". |
| command | AGENTS.md | error | Documented command references missing package script "lint". |
| scope | apps/codebattle | warning | No nested instruction file found for apps/codebattle. |
