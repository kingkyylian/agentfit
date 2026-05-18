# AgentFit Report

**Score:** 83/100 (B)

1 failed check found.

Generated: 2026-05-18T17:26:05.807Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 20/20 | 15 instruction files discovered. |
| Command freshness | 8/15 | Commands were found but not executed. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 5 deterministic task previews generated; no tasks were executed. |
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
| .github/copilot-instructions.md | copilot | .github | 1 | 0 |
| AGENTS.md | agents | . | 0 | 0 |
| CLAUDE.md | claude | . | 0 | 0 |
| app/AGENTS.md | agents | app | 0 | 0 |
| app/CLAUDE.md | claude | app | 0 | 0 |
| config/AGENTS.md | agents | config | 0 | 0 |
| config/CLAUDE.md | claude | config | 0 | 0 |
| db/AGENTS.md | agents | db | 0 | 0 |
| db/CLAUDE.md | claude | db | 0 | 0 |
| docker/dev/AGENTS.md | agents | docker/dev | 1 | 0 |
| docker/dev/CLAUDE.md | claude | docker/dev | 1 | 0 |
| frontend/AGENTS.md | agents | frontend | 3 | 0 |
| frontend/CLAUDE.md | claude | frontend | 3 | 0 |
| spec/AGENTS.md | agents | spec | 0 | 0 |
| spec/CLAUDE.md | claude | spec | 0 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the test package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the tslint_typechecks package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Make a safe change covered by extensions/op-blocknote-hocuspocus/test/closeEvents.test.ts | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Make a safe change covered by extensions/op-blocknote-hocuspocus/test/extensions/openProjectApi.test.ts | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Make a safe change covered by extensions/op-blocknote-hocuspocus/test/extensions/openProjectApi_withStubbedEnv.test.ts | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Command Resolutions

| Command | Source | Script | Package | Status |
| --- | --- | --- | --- | --- |
| npm test && cd .. | frontend/AGENTS.md:44 | test | frontend/package.json | resolved |
| npm test && cd .. | frontend/CLAUDE.md:44 | test | frontend/package.json | resolved |

## Signal Findings

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | .github/copilot-instructions.md:85 | Test command guidance. |
| reproducibility | AGENTS.md:35 | Deterministic or reproducible workflow guidance. |
| reproducibility | CLAUDE.md:35 | Deterministic or reproducible workflow guidance. |
| reproducibility | frontend/AGENTS.md:22 | Setup command guidance. |
| reproducibility | frontend/AGENTS.md:44 | Test command guidance. |
| reproducibility | frontend/CLAUDE.md:22 | Setup command guidance. |
| reproducibility | frontend/CLAUDE.md:44 | Test command guidance. |
