# AgentFit Report

**Score:** 78/100 (C)

2 failed checks found.

Generated: 2026-05-22T14:33:18.477Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 15/20 | 1 instruction file discovered; 18 nested scope issues found. |
| Command freshness | 8/15 | Commands were found but not executed. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 5 deterministic task previews generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 0/10 | Safety guardrails were not found. |
| Reproducibility | 10/10 | Reproducible setup and verification guidance found. |

## Failed Checks

- 18 nested scopes do not have local instruction files.
- Safety guardrails were not found.

## Caps

None.

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| CLAUDE.md | claude | . | 17 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the test package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:coverage package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:dev package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the lint package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the build package script | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Static Issues

| Category | Source | Severity | Message |
| --- | --- | --- | --- |
| scope | packages/accepts | warning | No nested instruction file found for packages/accepts. |
| scope | packages/app | warning | No nested instruction file found for packages/app. |
| scope | packages/content-disposition | warning | No nested instruction file found for packages/content-disposition. |
| scope | packages/cookie | warning | No nested instruction file found for packages/cookie. |
| scope | packages/cookie-signature | warning | No nested instruction file found for packages/cookie-signature. |
| scope | packages/dotenv | warning | No nested instruction file found for packages/dotenv. |
| scope | packages/encode-url | warning | No nested instruction file found for packages/encode-url. |
| scope | packages/etag | warning | No nested instruction file found for packages/etag. |
| scope | packages/forwarded | warning | No nested instruction file found for packages/forwarded. |
| scope | packages/jsonp | warning | No nested instruction file found for packages/jsonp. |
| scope | packages/proxy-addr | warning | No nested instruction file found for packages/proxy-addr. |
| scope | packages/rate-limit | warning | No nested instruction file found for packages/rate-limit. |
| scope | packages/req | warning | No nested instruction file found for packages/req. |
| scope | packages/res | warning | No nested instruction file found for packages/res. |
| scope | packages/router | warning | No nested instruction file found for packages/router. |
| scope | packages/send | warning | No nested instruction file found for packages/send. |
| scope | packages/type-is | warning | No nested instruction file found for packages/type-is. |
| scope | packages/url | warning | No nested instruction file found for packages/url. |

## Command Resolutions

| Command | Source | Script | Package | Status |
| --- | --- | --- | --- | --- |
| pnpm build | CLAUDE.md:41 | build | package.json | resolved |
| pnpm test | CLAUDE.md:44 | test | package.json | resolved |
| pnpm test:dev | CLAUDE.md:47 | test:dev | package.json | resolved |
| pnpm check  # runs Biome check | CLAUDE.md:50 | check | package.json | resolved |
| pnpm lint   # lint only | CLAUDE.md:51 | lint | package.json | resolved |
| pnpm format # format only | CLAUDE.md:52 | format | package.json | resolved |

## Signal Findings

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | CLAUDE.md:23 | Build command guidance. |
| reproducibility | CLAUDE.md:41 | Build command guidance. |
| reproducibility | CLAUDE.md:44 | Test command guidance. |
| reproducibility | CLAUDE.md:47 | Test command guidance. |
| reproducibility | CLAUDE.md:50 | Test command guidance. |
| reproducibility | CLAUDE.md:58 | Test command guidance. |
| reproducibility | CLAUDE.md:59 | Test command guidance. |
| reproducibility | CLAUDE.md:62 | Test command guidance. |
| reproducibility | CLAUDE.md:65 | Test command guidance. |
