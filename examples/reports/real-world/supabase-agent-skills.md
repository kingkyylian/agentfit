# AgentFit Report

**Score:** 83/100 (B)

1 failed check found.

Generated: 2026-05-21T10:47:59.359Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 20/20 | 2 instruction files discovered. |
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
| AGENTS.md | agents | . | 7 | 0 |
| CLAUDE.md | claude | . | 7 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the test package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:sanity package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the build:release package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Make a safe change covered by test/sanity.test.ts | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Make a harmless README wording change and run verification | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Command Resolutions

| Command | Source | Script | Package | Status |
| --- | --- | --- | --- | --- |
| pnpm test                        # Run tests | AGENTS.md:28 | test | package.json | resolved |
| pnpm test | AGENTS.md:31 | test | package.json | resolved |
| pnpm test | AGENTS.md:59 | test | package.json | resolved |
| pnpm test                        # Run tests | CLAUDE.md:28 | test | package.json | resolved |
| pnpm test | CLAUDE.md:31 | test | package.json | resolved |
| pnpm test | CLAUDE.md:59 | test | package.json | resolved |

## Signal Findings

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | AGENTS.md:11 | Setup command guidance. |
| reproducibility | AGENTS.md:27 | Setup command guidance. |
| reproducibility | AGENTS.md:28 | Test command guidance. |
| reproducibility | AGENTS.md:31 | Test command guidance. |
| reproducibility | AGENTS.md:59 | Test command guidance. |
| reproducibility | CLAUDE.md:11 | Setup command guidance. |
| reproducibility | CLAUDE.md:27 | Setup command guidance. |
| reproducibility | CLAUDE.md:28 | Test command guidance. |
| reproducibility | CLAUDE.md:31 | Test command guidance. |
| reproducibility | CLAUDE.md:59 | Test command guidance. |
