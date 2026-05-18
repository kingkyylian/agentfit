# AgentFit Report

**Score:** 83/100 (B)

1 failed check found.

Generated: 2026-05-18T17:14:04.060Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 20/20 | 1 instruction file discovered. |
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
| AGENTS.md | agents | . | 9 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the test package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the lint package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the lint:fix package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the build package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the build-tests package script | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Command Resolutions

| Command | Source | Script | Package | Status |
| --- | --- | --- | --- | --- |
| npm run lint | AGENTS.md:63 | lint | package.json | resolved |
| npm run lint:fix | AGENTS.md:64 | lint:fix | package.json | resolved |
| npm run build | AGENTS.md:65 | build | package.json | resolved |
| npm run test <...test-file-globs> | AGENTS.md:66 | test | package.json | resolved |
| npm run test | AGENTS.md:67 | test | package.json | resolved |
| npm run test-grammar | AGENTS.md:68 | test-grammar | package.json | resolved |

## Signal Findings

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | AGENTS.md:62 | Setup command guidance. |
| reproducibility | AGENTS.md:65 | Build command guidance. |
| reproducibility | AGENTS.md:66 | Test command guidance. |
| reproducibility | AGENTS.md:67 | Test command guidance. |
| reproducibility | AGENTS.md:68 | Test command guidance. |
