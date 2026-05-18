# AgentFit Report

**Score:** 85/100 (B)

1 failed check found.

Generated: 2026-05-18T17:08:20.663Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 20/20 | 8 instruction files discovered. |
| Command freshness | 0/15 | 1 static command issue found. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 5 deterministic task previews generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 10/10 | Safety guardrails found. |
| Reproducibility | 10/10 | Reproducible setup and verification guidance found. |

## Failed Checks

- Documented command references missing package script "type-check:ui".

## Caps

None.

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| .cursor/rules/backend.mdc | cursor | .cursor/rules | 0 | 0 |
| .cursor/rules/code-quality.mdc | cursor | .cursor/rules | 3 | 0 |
| .cursor/rules/e2e-testing.mdc | cursor | .cursor/rules | 10 | 0 |
| .cursor/rules/frontend.mdc | cursor | .cursor/rules | 0 | 0 |
| .cursor/rules/git-safety.mdc | cursor | .cursor/rules | 0 | 0 |
| .cursor/rules/testing.mdc | cursor | .cursor/rules | 3 | 0 |
| .github/copilot-instructions.md | copilot | .github | 0 | 0 |
| AGENTS.md | agents | . | 18 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the test package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:api package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:api:integration package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:cov package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:cov:component package script | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Static Issues

| Category | Source | Severity | Message |
| --- | --- | --- | --- |
| command | AGENTS.md | error | Documented command references missing package script "type-check:ui". |

## Command Resolutions

| Command | Source | Script | Package | Status |
| --- | --- | --- | --- | --- |
| yarn lint | .cursor/rules/code-quality.mdc:9 | lint | package.json | resolved |
| yarn lint | .cursor/rules/code-quality.mdc:86 | lint | package.json | resolved |
| npm run lint                # ESLint check | .cursor/rules/e2e-testing.mdc:455 | lint | tests/e2e-playwright/package.json | resolved |
| npm run type-check          # TypeScript type check | .cursor/rules/e2e-testing.mdc:456 | type-check | package.json | resolved |
| yarn test              # Run all UI tests | AGENTS.md:48 | test | package.json | resolved |
| yarn test:api          # Run all API tests | AGENTS.md:51 | test:api | package.json | resolved |
| yarn --cwd tests/e2e-playwright test | AGENTS.md:54 | test | tests/e2e-playwright/package.json | resolved |
| yarn lint              # All code | AGENTS.md:76 | lint | package.json | resolved |
| yarn lint:ui           # Frontend only | AGENTS.md:77 | lint:ui | package.json | resolved |
| yarn lint:api          # Backend only | AGENTS.md:78 | lint:api | package.json | resolved |
| yarn type-check:ui     # Frontend TypeScript | AGENTS.md:81 | type-check:ui | package.json | missing |
| yarn test              # Frontend tests | AGENTS.md:84 | test | package.json | resolved |
| yarn test:api          # Backend tests | AGENTS.md:85 | test:api | package.json | resolved |
| yarn lint | AGENTS.md:110 | lint | package.json | resolved |
| yarn test | AGENTS.md:110 | test | package.json | resolved |

## Signal Findings

Showing first 25 of 28 signal findings. JSON output contains the complete set.

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | .cursor/rules/code-quality.mdc:73 | Setup command guidance. |
| reproducibility | .cursor/rules/e2e-testing.mdc:59 | Test command guidance. |
| reproducibility | .cursor/rules/e2e-testing.mdc:60 | Test command guidance. |
| reproducibility | .cursor/rules/e2e-testing.mdc:61 | Test command guidance. |
| reproducibility | .cursor/rules/e2e-testing.mdc:441 | Test command guidance. |
| reproducibility | .cursor/rules/e2e-testing.mdc:442 | Test command guidance. |
| reproducibility | .cursor/rules/e2e-testing.mdc:443 | Test command guidance. |
| reproducibility | .cursor/rules/e2e-testing.mdc:444 | Test command guidance. |
| reproducibility | .cursor/rules/e2e-testing.mdc:445 | Test command guidance. |
| reproducibility | .cursor/rules/e2e-testing.mdc:455 | Test command guidance. |
| reproducibility | .cursor/rules/e2e-testing.mdc:456 | Test command guidance. |
| reproducibility | .cursor/rules/testing.mdc:14 | Deterministic or reproducible workflow guidance. |
| reproducibility | .cursor/rules/testing.mdc:39 | Test command guidance. |
| reproducibility | .cursor/rules/testing.mdc:42 | Test command guidance. |
| reproducibility | .cursor/rules/testing.mdc:45 | Test command guidance. |
| reproducibility | AGENTS.md:48 | Test command guidance. |
| reproducibility | AGENTS.md:51 | Test command guidance. |
| reproducibility | AGENTS.md:54 | Test command guidance. |
| reproducibility | AGENTS.md:61 | Test command guidance. |
| reproducibility | AGENTS.md:64 | Test command guidance. |
| reproducibility | AGENTS.md:67 | Test command guidance. |
| reproducibility | AGENTS.md:81 | Test command guidance. |
| reproducibility | AGENTS.md:84 | Test command guidance. |
| reproducibility | AGENTS.md:85 | Test command guidance. |
| reproducibility | AGENTS.md:110 | Test command guidance. |
