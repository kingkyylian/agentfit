# AgentFit Report

**Score:** 70/100 (C)

3 failed checks found.

Generated: 2026-05-21T11:22:42.937Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 15/20 | 2 instruction files discovered; 10 nested scope issues found. |
| Command freshness | 0/15 | 2 static command issues found. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 5 deterministic task previews generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 0/10 | Safety guardrails were not found. |
| Reproducibility | 10/10 | Reproducible setup and verification guidance found. |

## Failed Checks

- 10 nested scopes do not have local instruction files.
- Documented command references missing package script "test:e2e".
- Safety guardrails were not found.

## Caps

None.

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| AGENTS.md | agents | . | 11 | 0 |
| CLAUDE.md | claude | . | 11 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the test package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the typecheck package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the lint package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the lint:fix package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the build package script | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Static Issues

| Category | Source | Severity | Message |
| --- | --- | --- | --- |
| command | AGENTS.md | error | Documented command references missing package script "test:e2e". |
| command | CLAUDE.md | error | Documented command references missing package script "test:e2e". |
| scope | apps/desktop | warning | No nested instruction file found for apps/desktop. |
| scope | packages/artifacts | warning | No nested instruction file found for packages/artifacts. |
| scope | packages/core | warning | No nested instruction file found for packages/core. |
| scope | packages/exporters | warning | No nested instruction file found for packages/exporters. |
| scope | packages/i18n | warning | No nested instruction file found for packages/i18n. |
| scope | packages/providers | warning | No nested instruction file found for packages/providers. |
| scope | packages/runtime | warning | No nested instruction file found for packages/runtime. |
| scope | packages/shared | warning | No nested instruction file found for packages/shared. |
| scope | packages/templates | warning | No nested instruction file found for packages/templates. |
| scope | packages/ui | warning | No nested instruction file found for packages/ui. |

## Command Resolutions

| Command | Source | Script | Package | Status |
| --- | --- | --- | --- | --- |
| pnpm test | AGENTS.md:186 | test | package.json | resolved |
| pnpm test:e2e | AGENTS.md:187 | test:e2e | package.json | missing |
| pnpm lint | AGENTS.md:188 | lint | package.json | resolved |
| pnpm typecheck | AGENTS.md:189 | typecheck | package.json | resolved |
| pnpm build | AGENTS.md:190 | build | package.json | resolved |
| pnpm test               # vitest watch | CLAUDE.md:95 | test | package.json | resolved |
| pnpm test:e2e           # playwright | CLAUDE.md:96 | test:e2e | package.json | missing |
| pnpm lint               # biome check | CLAUDE.md:97 | lint | package.json | resolved |
| pnpm typecheck          # tsc --noEmit across workspace | CLAUDE.md:98 | typecheck | package.json | resolved |
| pnpm build              # produce signed Mac/Win installers | CLAUDE.md:99 | build | package.json | resolved |

## Signal Findings

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | AGENTS.md:186 | Test command guidance. |
| reproducibility | AGENTS.md:187 | Test command guidance. |
| reproducibility | AGENTS.md:189 | Build command guidance. |
| reproducibility | AGENTS.md:190 | Build command guidance. |
| reproducibility | CLAUDE.md:93 | Deterministic or reproducible workflow guidance. |
| reproducibility | CLAUDE.md:93 | Setup command guidance. |
| reproducibility | CLAUDE.md:95 | Test command guidance. |
| reproducibility | CLAUDE.md:96 | Test command guidance. |
| reproducibility | CLAUDE.md:97 | Test command guidance. |
| reproducibility | CLAUDE.md:98 | Build command guidance. |
| reproducibility | CLAUDE.md:99 | Build command guidance. |
