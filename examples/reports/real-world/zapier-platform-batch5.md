# AgentFit Report

**Score:** 78/100 (C)

2 failed checks found.

Generated: 2026-05-18T17:14:04.037Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 15/20 | 3 instruction files discovered; 4 nested scope issues found. |
| Command freshness | 8/15 | Commands were found but not executed. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 5 deterministic task previews generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 0/10 | Safety guardrails were not found. |
| Reproducibility | 10/10 | Reproducible setup and verification guidance found. |

## Failed Checks

- 4 nested scopes do not have local instruction files.
- Safety guardrails were not found.

## Caps

None.

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| .cursor/rules/main.md | cursor | .cursor/rules | 5 | 0 |
| .github/copilot-instructions.md | copilot | .github | 4 | 0 |
| CLAUDE.md | claude | . | 1 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the test package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the lint package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the lint:fix package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the bump package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the generate-types package script | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Static Issues

| Category | Source | Severity | Message |
| --- | --- | --- | --- |
| scope | packages/cli | warning | No nested instruction file found for packages/cli. |
| scope | packages/core | warning | No nested instruction file found for packages/core. |
| scope | packages/legacy-scripting-runner | warning | No nested instruction file found for packages/legacy-scripting-runner. |
| scope | packages/schema | warning | No nested instruction file found for packages/schema. |

## Command Resolutions

| Command | Source | Script | Package | Status |
| --- | --- | --- | --- | --- |
| pnpm validate | .cursor/rules/main.md:28 | validate | package.json | resolved |
| pnpm test | .cursor/rules/main.md:47 | test | package.json | resolved |
| pnpm validate | .cursor/rules/main.md:48 | validate | package.json | resolved |
| pnpm test | .cursor/rules/main.md:50 | test | package.json | resolved |
| pnpm validate | .github/copilot-instructions.md:28 | validate | package.json | resolved |
| pnpm test | .github/copilot-instructions.md:47 | test | package.json | resolved |
| pnpm validate | .github/copilot-instructions.md:48 | validate | package.json | resolved |
| pnpm validate | CLAUDE.md:20 | validate | package.json | resolved |

## Signal Findings

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | .cursor/rules/main.md:28 | Test command guidance. |
| reproducibility | .cursor/rules/main.md:47 | Test command guidance. |
| reproducibility | .cursor/rules/main.md:48 | Test command guidance. |
| reproducibility | .cursor/rules/main.md:50 | Test command guidance. |
| reproducibility | .github/copilot-instructions.md:28 | Test command guidance. |
| reproducibility | .github/copilot-instructions.md:47 | Test command guidance. |
| reproducibility | .github/copilot-instructions.md:48 | Test command guidance. |
| reproducibility | CLAUDE.md:20 | Test command guidance. |
