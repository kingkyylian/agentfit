# AgentFit Report

**Score:** 80/100 (B)

2 failed checks found.

Generated: 2026-05-18T17:29:12.906Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 15/20 | 5 instruction files discovered; 15 nested scope issues found. |
| Command freshness | 0/15 | 1 static command issue found. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 5 deterministic task previews generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 10/10 | Safety guardrails found. |
| Reproducibility | 10/10 | Reproducible setup and verification guidance found. |

## Failed Checks

- 15 nested scopes do not have local instruction files.
- Documented command references missing package script "clean".

## Caps

None.

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| .github/copilot-instructions.md | copilot | .github | 26 | 0 |
| AGENTS.md | agents | . | 7 | 0 |
| CLAUDE.md | claude | . | 0 | 1 |
| packages/skills/CLAUDE.md | claude | packages/skills | 0 | 0 |
| tegg/CLAUDE.md | claude | tegg | 23 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the test package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:cov package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the typecheck package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the lint package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the build package script | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Static Issues

| Category | Source | Severity | Message |
| --- | --- | --- | --- |
| command | tegg/CLAUDE.md | error | Documented command references missing package script "clean". |
| scope | packages/cluster | warning | No nested instruction file found for packages/cluster. |
| scope | packages/cookies | warning | No nested instruction file found for packages/cookies. |
| scope | packages/core | warning | No nested instruction file found for packages/core. |
| scope | packages/egg | warning | No nested instruction file found for packages/egg. |
| scope | packages/errors | warning | No nested instruction file found for packages/errors. |
| scope | packages/extend2 | warning | No nested instruction file found for packages/extend2. |
| scope | packages/koa | warning | No nested instruction file found for packages/koa. |
| scope | packages/koa-static-cache | warning | No nested instruction file found for packages/koa-static-cache. |
| scope | packages/logger | warning | No nested instruction file found for packages/logger. |
| scope | packages/path-matching | warning | No nested instruction file found for packages/path-matching. |
| scope | packages/router | warning | No nested instruction file found for packages/router. |
| scope | packages/supertest | warning | No nested instruction file found for packages/supertest. |
| scope | packages/tsconfig | warning | No nested instruction file found for packages/tsconfig. |
| scope | packages/typings | warning | No nested instruction file found for packages/typings. |
| scope | packages/utils | warning | No nested instruction file found for packages/utils. |

## Command Resolutions

Showing first 25 of 33 command resolutions. JSON output contains the complete set.

| Command | Source | Script | Package | Status |
| --- | --- | --- | --- | --- |
| pnpm run build | .github/copilot-instructions.md:29 | build | package.json | resolved |
| pnpm run lint | .github/copilot-instructions.md:32 | lint | package.json | resolved |
| pnpm run build | .github/copilot-instructions.md:57 | build | package.json | resolved |
| pnpm run test | .github/copilot-instructions.md:62 | test | package.json | resolved |
| pnpm run test:cov | .github/copilot-instructions.md:63 | test:cov | package.json | resolved |
| pnpm run lint | .github/copilot-instructions.md:68 | lint | package.json | resolved |
| pnpm --filter=egg run test | .github/copilot-instructions.md:86 | test | package.json | resolved |
| pnpm --filter=@eggjs/core run build | .github/copilot-instructions.md:87 | build | package.json | resolved |
| pnpm run build | .github/copilot-instructions.md:95 | build | package.json | resolved |
| pnpm run build | .github/copilot-instructions.md:111 | build | package.json | resolved |
| pnpm run lint | .github/copilot-instructions.md:114 | lint | package.json | resolved |
| pnpm run test | .github/copilot-instructions.md:117 | test | package.json | resolved |
| pnpm run build | .github/copilot-instructions.md:182 | build | package.json | resolved |
| pnpm run build | .github/copilot-instructions.md:220 | build | package.json | resolved |
| pnpm run lint | .github/copilot-instructions.md:221 | lint | package.json | resolved |
| pnpm run test | .github/copilot-instructions.md:223 | test | package.json | resolved |
| pnpm run build | AGENTS.md:22 | build | package.json | resolved |
| pnpm run test | AGENTS.md:23 | test | package.json | resolved |
| pnpm run lint | AGENTS.md:24 | lint | package.json | resolved |
| pnpm run typecheck | AGENTS.md:25 | typecheck | package.json | resolved |
| pnpm --filter=egg run test | AGENTS.md:26 | test | package.json | resolved |
| pnpm run build               # Build all packages including tegg (runs build in all workspaces) | tegg/CLAUDE.md:63 | build | package.json | resolved |
| pnpm run clean               # Clean all build artifacts including tegg (removes dist, tsbuildinfo) | tegg/CLAUDE.md:64 | clean | package.json | missing |
| pnpm test                    # Run vitest tests for all packages (from monorepo root) | tegg/CLAUDE.md:72 | test | package.json | resolved |
| pnpm run test:cov            # Run tests with coverage | tegg/CLAUDE.md:73 | test:cov | package.json | resolved |

## Signal Findings

Showing first 25 of 34 signal findings. JSON output contains the complete set.

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | .github/copilot-instructions.md:19 | Deterministic or reproducible workflow guidance. |
| reproducibility | .github/copilot-instructions.md:26 | Setup command guidance. |
| reproducibility | .github/copilot-instructions.md:29 | Build command guidance. |
| reproducibility | .github/copilot-instructions.md:57 | Build command guidance. |
| reproducibility | .github/copilot-instructions.md:62 | Test command guidance. |
| reproducibility | .github/copilot-instructions.md:63 | Test command guidance. |
| reproducibility | .github/copilot-instructions.md:86 | Test command guidance. |
| reproducibility | .github/copilot-instructions.md:87 | Build command guidance. |
| reproducibility | .github/copilot-instructions.md:95 | Build command guidance. |
| reproducibility | .github/copilot-instructions.md:111 | Build command guidance. |
| reproducibility | .github/copilot-instructions.md:117 | Test command guidance. |
| reproducibility | .github/copilot-instructions.md:182 | Build command guidance. |
| reproducibility | .github/copilot-instructions.md:220 | Build command guidance. |
| reproducibility | .github/copilot-instructions.md:223 | Test command guidance. |
| reproducibility | AGENTS.md:21 | Setup command guidance. |
| reproducibility | AGENTS.md:22 | Build command guidance. |
| reproducibility | AGENTS.md:23 | Test command guidance. |
| reproducibility | AGENTS.md:25 | Build command guidance. |
| reproducibility | AGENTS.md:26 | Test command guidance. |
| reproducibility | AGENTS.md:96 | Deterministic or reproducible workflow guidance. |
| reproducibility | tegg/CLAUDE.md:63 | Build command guidance. |
| reproducibility | tegg/CLAUDE.md:64 | Build command guidance. |
| reproducibility | tegg/CLAUDE.md:72 | Test command guidance. |
| reproducibility | tegg/CLAUDE.md:73 | Test command guidance. |
| reproducibility | tegg/CLAUDE.md:74 | Test command guidance. |
