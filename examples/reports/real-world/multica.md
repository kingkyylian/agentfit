# AgentFit Report

**Score:** 88/100 (B)

1 failed check found.

Generated: 2026-05-21T10:48:08.581Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 15/20 | 2 instruction files discovered; 8 nested scope issues found. |
| Command freshness | 8/15 | Commands were found but not executed. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 5 deterministic task previews generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 10/10 | Safety guardrails found. |
| Reproducibility | 10/10 | Reproducible setup and verification guidance found. |

## Failed Checks

- 8 nested scopes do not have local instruction files.

## Caps

None.

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| AGENTS.md | agents | . | 5 | 0 |
| CLAUDE.md | claude | . | 47 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the test package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the typecheck package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the lint package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the build package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the clean package script | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Static Issues

| Category | Source | Severity | Message |
| --- | --- | --- | --- |
| scope | apps/desktop | warning | No nested instruction file found for apps/desktop. |
| scope | apps/docs | warning | No nested instruction file found for apps/docs. |
| scope | apps/web | warning | No nested instruction file found for apps/web. |
| scope | packages/core | warning | No nested instruction file found for packages/core. |
| scope | packages/eslint-config | warning | No nested instruction file found for packages/eslint-config. |
| scope | packages/tsconfig | warning | No nested instruction file found for packages/tsconfig. |
| scope | packages/ui | warning | No nested instruction file found for packages/ui. |
| scope | packages/views | warning | No nested instruction file found for packages/views. |

## Command Resolutions

| Command | Source | Script | Package | Status |
| --- | --- | --- | --- | --- |
| pnpm typecheck        # TypeScript check | AGENTS.md:41 | typecheck | package.json | resolved |
| pnpm test             # TS unit tests (Vitest) | AGENTS.md:42 | test | package.json | resolved |
| pnpm build            # Build all frontend apps | CLAUDE.md:88 | build | package.json | resolved |
| pnpm typecheck        # TypeScript check (all packages + apps via turbo) | CLAUDE.md:89 | typecheck | package.json | resolved |
| pnpm lint             # ESLint | CLAUDE.md:90 | lint | package.json | resolved |
| pnpm test             # TS tests (Vitest, all packages + apps via turbo) | CLAUDE.md:91 | test | package.json | resolved |
| pnpm --filter @multica/desktop build      # Compile TS → JS (reads .env.production) | CLAUDE.md:115 | build | apps/desktop/package.json | resolved |
| pnpm test | CLAUDE.md:304 | test | package.json | resolved |
| pnpm typecheck        # TypeScript type errors only | CLAUDE.md:351 | typecheck | package.json | resolved |
| pnpm test             # TS unit tests only (Vitest, all packages) | CLAUDE.md:352 | test | package.json | resolved |

## Signal Findings

Showing first 25 of 30 signal findings. JSON output contains the complete set.

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | AGENTS.md:40 | Setup command guidance. |
| reproducibility | AGENTS.md:41 | Test command guidance. |
| reproducibility | AGENTS.md:42 | Test command guidance. |
| reproducibility | AGENTS.md:43 | Test command guidance. |
| reproducibility | AGENTS.md:44 | Test command guidance. |
| reproducibility | CLAUDE.md:79 | Setup command guidance. |
| reproducibility | CLAUDE.md:85 | Setup command guidance. |
| reproducibility | CLAUDE.md:88 | Build command guidance. |
| reproducibility | CLAUDE.md:89 | Test command guidance. |
| reproducibility | CLAUDE.md:91 | Test command guidance. |
| reproducibility | CLAUDE.md:96 | Build command guidance. |
| reproducibility | CLAUDE.md:98 | Test command guidance. |
| reproducibility | CLAUDE.md:104 | Test command guidance. |
| reproducibility | CLAUDE.md:105 | Test command guidance. |
| reproducibility | CLAUDE.md:106 | Test command guidance. |
| reproducibility | CLAUDE.md:112 | Test command guidance. |
| reproducibility | CLAUDE.md:115 | Build command guidance. |
| reproducibility | CLAUDE.md:139 | Setup command guidance. |
| reproducibility | CLAUDE.md:289 | Test command guidance. |
| reproducibility | CLAUDE.md:304 | Test command guidance. |
| reproducibility | CLAUDE.md:309 | Test command guidance. |
| reproducibility | CLAUDE.md:344 | Test command guidance. |
| reproducibility | CLAUDE.md:351 | Build command guidance. |
| reproducibility | CLAUDE.md:352 | Test command guidance. |
| reproducibility | CLAUDE.md:353 | Test command guidance. |
