# AgentFit Report

**Score:** 88/100 (B)

1 failed check found.

Generated: 2026-05-18T17:01:34.981Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 15/20 | 1 instruction file discovered; 1 nested scope issue found. |
| Command freshness | 8/15 | Commands were found but not executed. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 5 deterministic task previews generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 10/10 | Safety guardrails found. |
| Reproducibility | 10/10 | Reproducible setup and verification guidance found. |

## Failed Checks

- No nested instruction file found for packages/lerna.

## Caps

None.

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| CLAUDE.md | claude | . | 16 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the test package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the lint package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the build package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the e2e-build-package-publish package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the e2e-start-local-registry package script | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Static Issues

| Category | Source | Severity | Message |
| --- | --- | --- | --- |
| scope | packages/lerna | warning | No nested instruction file found for packages/lerna. |

## Command Resolutions

| Command | Source | Script | Package | Status |
| --- | --- | --- | --- | --- |
| npm run format:check # run npm run format:write and commit the result if this check fails | CLAUDE.md:14 | format:check | package.json | resolved |
| npm run lint # run linting across all packages | CLAUDE.md:15 | lint | package.json | resolved |
| npm run test # run all unit tests | CLAUDE.md:16 | test | package.json | resolved |
| npm run build | CLAUDE.md:145 | build | package.json | resolved |
| npm run test | CLAUDE.md:150 | test | package.json | resolved |
| npm run format:write | CLAUDE.md:161 | format:write | package.json | resolved |
| npm run format:check | CLAUDE.md:164 | format:check | package.json | resolved |
| npm run lint | CLAUDE.md:167 | lint | package.json | resolved |
| npm run e2e-build-package-publish | CLAUDE.md:181 | e2e-build-package-publish | package.json | resolved |

## Signal Findings

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | CLAUDE.md:14 | Test command guidance. |
| reproducibility | CLAUDE.md:16 | Test command guidance. |
| reproducibility | CLAUDE.md:105 | Deterministic or reproducible workflow guidance. |
| reproducibility | CLAUDE.md:142 | Setup command guidance. |
| reproducibility | CLAUDE.md:145 | Build command guidance. |
| reproducibility | CLAUDE.md:150 | Test command guidance. |
| reproducibility | CLAUDE.md:164 | Test command guidance. |
| reproducibility | CLAUDE.md:181 | Build command guidance. |
| safety | CLAUDE.md:116 | Do-not-run or do-not-expose boundary for risky actions. |
