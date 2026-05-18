# AgentFit Report

**Score:** 78/100 (C)

2 failed checks found.

Generated: 2026-05-18T17:26:05.653Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 15/20 | 18 instruction files discovered; 8 nested scope issues found. |
| Command freshness | 8/15 | Commands were found but not executed. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 5 deterministic task previews generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 0/10 | Safety guardrails were not found. |
| Reproducibility | 10/10 | Reproducible setup and verification guidance found. |

## Failed Checks

- 8 nested scopes do not have local instruction files.
- Safety guardrails were not found.

## Caps

None.

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| .cursor/rules/ai-assistant-guidelines.mdc | cursor | .cursor/rules | 0 | 0 |
| .cursor/rules/ark-ui.mdc | cursor | .cursor/rules | 0 | 0 |
| .cursor/rules/git-commit-conventions.mdc | cursor | .cursor/rules | 0 | 0 |
| .cursor/rules/mastra.mdc | cursor | .cursor/rules | 0 | 0 |
| .cursor/rules/panda-css.mdc | cursor | .cursor/rules | 0 | 0 |
| .cursor/rules/rust-coding-style.mdc | cursor | .cursor/rules | 2 | 0 |
| .cursor/rules/rust-documentation.mdc | cursor | .cursor/rules | 1 | 0 |
| .cursor/rules/rust-error-handling.mdc | cursor | .cursor/rules | 0 | 0 |
| .cursor/rules/rust-testing-strategy.mdc | cursor | .cursor/rules | 1 | 0 |
| .cursor/rules/rust-tracing-practices.mdc | cursor | .cursor/rules | 0 | 0 |
| .cursor/rules/typescript-coding-guidelines.mdc | cursor | .cursor/rules | 0 | 0 |
| .cursor/rules/update-rules.mdc | cursor | .cursor/rules | 0 | 0 |
| .cursor/rules/zod.mdc | cursor | .cursor/rules | 0 | 0 |
| AGENTS.md | agents | . | 20 | 0 |
| CLAUDE.md | claude | . | 20 | 0 |
| libs/@hashintel/ds-components/AGENTS.md | agents | libs/@hashintel/ds-components | 13 | 0 |
| libs/@hashintel/ds-helpers/AGENTS.md | agents | libs/@hashintel/ds-helpers | 2 | 0 |
| libs/@hashintel/petrinaut/CLAUDE.md | claude | libs/@hashintel/petrinaut | 5 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the test package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:integration package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:playwright package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:stale-approvals package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:unit package script | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Static Issues

| Category | Source | Severity | Message |
| --- | --- | --- | --- |
| scope | apps/hash-ai-worker-ts | warning | No nested instruction file found for apps/hash-ai-worker-ts. |
| scope | apps/hash-api | warning | No nested instruction file found for apps/hash-api. |
| scope | apps/hash-external-services | warning | No nested instruction file found for apps/hash-external-services. |
| scope | apps/hash-frontend | warning | No nested instruction file found for apps/hash-frontend. |
| scope | apps/hash-graph | warning | No nested instruction file found for apps/hash-graph. |
| scope | apps/hash-integration-worker | warning | No nested instruction file found for apps/hash-integration-worker. |
| scope | apps/petrinaut-website | warning | No nested instruction file found for apps/petrinaut-website. |
| scope | apps/plugin-browser | warning | No nested instruction file found for apps/plugin-browser. |

## Command Resolutions

Showing first 25 of 27 command resolutions. JSON output contains the complete set.

| Command | Source | Script | Package | Status |
| --- | --- | --- | --- | --- |
| yarn test:unit | AGENTS.md:54 | test:unit | package.json | resolved |
| yarn test:integration | AGENTS.md:55 | test:integration | package.json | resolved |
| yarn lint | AGENTS.md:59 | lint | package.json | resolved |
| yarn lint:tsc | AGENTS.md:60 | lint:tsc | package.json | resolved |
| yarn lint:eslint | AGENTS.md:61 | lint:eslint | package.json | resolved |
| yarn lint:format | AGENTS.md:62 | lint:format | package.json | resolved |
| yarn fix:eslint | AGENTS.md:64 | fix:eslint | package.json | resolved |
| yarn fix:format | AGENTS.md:65 | fix:format | package.json | resolved |
| yarn test:unit | CLAUDE.md:54 | test:unit | package.json | resolved |
| yarn test:integration | CLAUDE.md:55 | test:integration | package.json | resolved |
| yarn lint | CLAUDE.md:59 | lint | package.json | resolved |
| yarn lint:tsc | CLAUDE.md:60 | lint:tsc | package.json | resolved |
| yarn lint:eslint | CLAUDE.md:61 | lint:eslint | package.json | resolved |
| yarn lint:format | CLAUDE.md:62 | lint:format | package.json | resolved |
| yarn fix:eslint | CLAUDE.md:64 | fix:eslint | package.json | resolved |
| yarn fix:format | CLAUDE.md:65 | fix:format | package.json | resolved |
| yarn build | libs/@hashintel/ds-components/AGENTS.md:231 | build | libs/@hashintel/ds-components/package.json | resolved |
| yarn build:ladle | libs/@hashintel/ds-components/AGENTS.md:232 | build:ladle | libs/@hashintel/ds-components/package.json | resolved |
| yarn lint:eslint | libs/@hashintel/ds-components/AGENTS.md:233 | lint:eslint | libs/@hashintel/ds-components/package.json | resolved |
| yarn lint:tsc | libs/@hashintel/ds-components/AGENTS.md:234 | lint:tsc | libs/@hashintel/ds-components/package.json | resolved |
| yarn test:unit | libs/@hashintel/ds-components/AGENTS.md:235 | test:unit | libs/@hashintel/ds-components/package.json | resolved |
| yarn test:snapshots | libs/@hashintel/ds-components/AGENTS.md:236 | test:snapshots | libs/@hashintel/ds-components/package.json | resolved |
| yarn lint:tsc | libs/@hashintel/ds-components/AGENTS.md:271 | lint:tsc | libs/@hashintel/ds-components/package.json | resolved |
| yarn build            # Library build | libs/@hashintel/petrinaut/CLAUDE.md:35 | build | libs/@hashintel/petrinaut/package.json | resolved |
| yarn lint:eslint      # Lint with oxlint | libs/@hashintel/petrinaut/CLAUDE.md:36 | lint:eslint | libs/@hashintel/petrinaut/package.json | resolved |

## Signal Findings

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | .cursor/rules/mastra.mdc:49 | Deterministic or reproducible workflow guidance. |
| reproducibility | AGENTS.md:54 | Test command guidance. |
| reproducibility | AGENTS.md:55 | Test command guidance. |
| reproducibility | AGENTS.md:77 | Test command guidance. |
| reproducibility | CLAUDE.md:54 | Test command guidance. |
| reproducibility | CLAUDE.md:55 | Test command guidance. |
| reproducibility | CLAUDE.md:77 | Test command guidance. |
| reproducibility | libs/@hashintel/ds-components/AGENTS.md:231 | Build command guidance. |
| reproducibility | libs/@hashintel/ds-components/AGENTS.md:232 | Build command guidance. |
| reproducibility | libs/@hashintel/ds-components/AGENTS.md:235 | Test command guidance. |
| reproducibility | libs/@hashintel/ds-components/AGENTS.md:236 | Test command guidance. |
| reproducibility | libs/@hashintel/petrinaut/CLAUDE.md:35 | Build command guidance. |
| reproducibility | libs/@hashintel/petrinaut/CLAUDE.md:37 | Test command guidance. |
| reproducibility | libs/@hashintel/petrinaut/CLAUDE.md:38 | Test command guidance. |
