# AgentFit Report

**Score:** 75/100 (C)

2 failed checks found.

Generated: 2026-05-21T11:22:15.886Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 20/20 | 2 instruction files discovered. |
| Command freshness | 0/15 | 1 static command issue found. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 5 deterministic task previews generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 0/10 | Safety guardrails were not found. |
| Reproducibility | 10/10 | Reproducible setup and verification guidance found. |

## Failed Checks

- Documented command references missing package script "lint".
- Safety guardrails were not found.

## Caps

None.

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| AGENTS.md | agents | . | 0 | 0 |
| CLAUDE.md | claude | . | 4 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the test package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:install package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:installed package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:list package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:uninstall package script | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Static Issues

| Category | Source | Severity | Message |
| --- | --- | --- | --- |
| command | CLAUDE.md | error | Documented command references missing package script "lint". |

## Command Resolutions

| Command | Source | Script | Package | Status |
| --- | --- | --- | --- | --- |
| pnpm run build | CLAUDE.md:5 | build | package.json | resolved |
| pnpm test | CLAUDE.md:6 | test | package.json | resolved |
| pnpm run lint | CLAUDE.md:7 | lint | package.json | missing |

## Signal Findings

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | CLAUDE.md:5 | Build command guidance. |
| reproducibility | CLAUDE.md:6 | Test command guidance. |
