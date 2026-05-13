# AgentFit Report

**Score:** 83/100 (B)

AgentFit score 83/100 (B).

Generated: 2026-05-13T14:03:22.122Z

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
| CLAUDE.md | claude | . | 306 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the test package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:dev package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:devCompilePerformance package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:devRuntimePerformance package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:full package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
## Command Resolutions

| Command | Source | Script | Package | Status |
| --- | --- | --- | --- | --- |
| npm run build | CLAUDE.md:477 | build | package.json | resolved |
| npm run build:typings | CLAUDE.md:483 | build:typings | package.json | resolved |
| npm run eslint | CLAUDE.md:486 | eslint | package.json | resolved |
| npm test | CLAUDE.md:510 | test | package.json | resolved |
| yarn test | CLAUDE.md:512 | test | package.json | resolved |
| npm run test:full | CLAUDE.md:519 | test:full | package.json | resolved |
| yarn run test:full | CLAUDE.md:520 | test:full | package.json | resolved |
| npm run test:mocha | CLAUDE.md:523 | test:mocha | package.json | resolved |
| yarn run test:mocha | CLAUDE.md:524 | test:mocha | package.json | resolved |
| npm run test:mocha-coverage | CLAUDE.md:527 | test:mocha-coverage | package.json | resolved |
| yarn run test:mocha-coverage | CLAUDE.md:528 | test:mocha-coverage | package.json | resolved |
| npm run test:mocha-coverage:report | CLAUDE.md:531 | test:mocha-coverage:report | package.json | resolved |
| yarn run test:mocha-coverage:report | CLAUDE.md:532 | test:mocha-coverage:report | package.json | resolved |
| npm run test:mocha-memory-performance | CLAUDE.md:535 | test:mocha-memory-performance | package.json | resolved |
| yarn run test:mocha-memory-performance | CLAUDE.md:536 | test:mocha-memory-performance | package.json | resolved |
| npm run test:dev | CLAUDE.md:539 | test:dev | package.json | resolved |
| yarn run test:dev | CLAUDE.md:540 | test:dev | package.json | resolved |
| npm run test:devCompilePerformance | CLAUDE.md:543 | test:devCompilePerformance | package.json | resolved |
| yarn run test:devCompilePerformance | CLAUDE.md:544 | test:devCompilePerformance | package.json | resolved |
| npm run test:devRuntimePerformance | CLAUDE.md:547 | test:devRuntimePerformance | package.json | resolved |
| yarn run test:devRuntimePerformance | CLAUDE.md:548 | test:devRuntimePerformance | package.json | resolved |
| npm run eslint | CLAUDE.md:786 | eslint | package.json | resolved |
| yarn run eslint | CLAUDE.md:787 | eslint | package.json | resolved |
| npm run build | CLAUDE.md:1091 | build | package.json | resolved |
| yarn run build | CLAUDE.md:1092 | build | package.json | resolved |
| npm run build:typings | CLAUDE.md:1163 | build:typings | package.json | resolved |
| yarn run build:typings | CLAUDE.md:1164 | build:typings | package.json | resolved |
| npm run build | CLAUDE.md:1167 | build | package.json | resolved |
| yarn run build | CLAUDE.md:1168 | build | package.json | resolved |
| npm test | CLAUDE.md:556 | test | package.json | resolved |
| npm run build | CLAUDE.md:1175 | build | package.json | resolved |

## Signal Findings

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | CLAUDE.md:1091 | Build command guidance. |
| reproducibility | CLAUDE.md:1092 | Build command guidance. |
| reproducibility | CLAUDE.md:1138 | Setup command guidance. |
| reproducibility | CLAUDE.md:1140 | Setup command guidance. |
| reproducibility | CLAUDE.md:1163 | Build command guidance. |
| reproducibility | CLAUDE.md:1164 | Build command guidance. |
| reproducibility | CLAUDE.md:1167 | Build command guidance. |
| reproducibility | CLAUDE.md:1168 | Build command guidance. |
| reproducibility | CLAUDE.md:1175 | Build command guidance. |
| reproducibility | CLAUDE.md:1243 | Deterministic or reproducible workflow guidance. |
| reproducibility | CLAUDE.md:146 | Test command guidance. |
| reproducibility | CLAUDE.md:152 | Build command guidance. |
| reproducibility | CLAUDE.md:181 | Setup command guidance. |
| reproducibility | CLAUDE.md:477 | Build command guidance. |
| reproducibility | CLAUDE.md:483 | Build command guidance. |
| reproducibility | CLAUDE.md:505 | Setup command guidance. |
| reproducibility | CLAUDE.md:507 | Setup command guidance. |
| reproducibility | CLAUDE.md:510 | Test command guidance. |
| reproducibility | CLAUDE.md:512 | Test command guidance. |
| reproducibility | CLAUDE.md:519 | Test command guidance. |
| reproducibility | CLAUDE.md:520 | Test command guidance. |
| reproducibility | CLAUDE.md:523 | Test command guidance. |
| reproducibility | CLAUDE.md:524 | Test command guidance. |
| reproducibility | CLAUDE.md:527 | Test command guidance. |
| reproducibility | CLAUDE.md:528 | Test command guidance. |
| reproducibility | CLAUDE.md:531 | Test command guidance. |
| reproducibility | CLAUDE.md:532 | Test command guidance. |
| reproducibility | CLAUDE.md:535 | Test command guidance. |
| reproducibility | CLAUDE.md:536 | Test command guidance. |
| reproducibility | CLAUDE.md:539 | Test command guidance. |
| reproducibility | CLAUDE.md:540 | Test command guidance. |
| reproducibility | CLAUDE.md:543 | Test command guidance. |
| reproducibility | CLAUDE.md:544 | Test command guidance. |
| reproducibility | CLAUDE.md:547 | Test command guidance. |
| reproducibility | CLAUDE.md:548 | Test command guidance. |
| reproducibility | CLAUDE.md:556 | Test command guidance. |
| reproducibility | CLAUDE.md:592 | Test command guidance. |
| reproducibility | CLAUDE.md:599 | Test command guidance. |
| reproducibility | CLAUDE.md:602 | Test command guidance. |
| reproducibility | CLAUDE.md:605 | Test command guidance. |
| reproducibility | CLAUDE.md:608 | Test command guidance. |
| reproducibility | CLAUDE.md:611 | Test command guidance. |
| reproducibility | CLAUDE.md:614 | Test command guidance. |
| reproducibility | CLAUDE.md:623 | Test command guidance. |
| reproducibility | CLAUDE.md:626 | Test command guidance. |
| reproducibility | CLAUDE.md:629 | Test command guidance. |
| reproducibility | CLAUDE.md:632 | Test command guidance. |
| reproducibility | CLAUDE.md:635 | Test command guidance. |
| reproducibility | CLAUDE.md:638 | Test command guidance. |
| reproducibility | CLAUDE.md:641 | Test command guidance. |
| reproducibility | CLAUDE.md:651 | Test command guidance. |
| reproducibility | CLAUDE.md:654 | Test command guidance. |
| reproducibility | CLAUDE.md:657 | Test command guidance. |
| reproducibility | CLAUDE.md:660 | Test command guidance. |
| reproducibility | CLAUDE.md:663 | Test command guidance. |
| reproducibility | CLAUDE.md:666 | Test command guidance. |
| reproducibility | CLAUDE.md:669 | Test command guidance. |
| reproducibility | CLAUDE.md:672 | Test command guidance. |
| reproducibility | CLAUDE.md:675 | Test command guidance. |
| reproducibility | CLAUDE.md:678 | Test command guidance. |
| reproducibility | CLAUDE.md:684 | Test command guidance. |
| reproducibility | CLAUDE.md:687 | Test command guidance. |
| reproducibility | CLAUDE.md:690 | Test command guidance. |
| reproducibility | CLAUDE.md:693 | Test command guidance. |
| reproducibility | CLAUDE.md:699 | Test command guidance. |
| reproducibility | CLAUDE.md:706 | Test command guidance. |
| reproducibility | CLAUDE.md:709 | Test command guidance. |
| reproducibility | CLAUDE.md:712 | Test command guidance. |
| reproducibility | CLAUDE.md:715 | Test command guidance. |
| reproducibility | CLAUDE.md:718 | Test command guidance. |
| reproducibility | CLAUDE.md:721 | Test command guidance. |
| reproducibility | CLAUDE.md:742 | Test command guidance. |
| reproducibility | CLAUDE.md:743 | Test command guidance. |
| reproducibility | CLAUDE.md:744 | Test command guidance. |
