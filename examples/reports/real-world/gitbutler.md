# AgentFit Report

**Score:** 78/100 (C)

2 failed checks found.

Generated: 2026-05-18T17:01:35.023Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 15/20 | 6 instruction files discovered; 9 nested scope issues found. |
| Command freshness | 8/15 | Commands were found but not executed. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 5 deterministic task previews generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 0/10 | Safety guardrails were not found. |
| Reproducibility | 10/10 | Reproducible setup and verification guidance found. |

## Failed Checks

- 9 nested scopes do not have local instruction files.
- Safety guardrails were not found.

## Caps

None.

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| .github/copilot-instructions.md | copilot | .github | 35 | 0 |
| AGENTS.md | agents | . | 0 | 0 |
| apps/lite/AGENTS.md | agents | apps/lite | 0 | 0 |
| claude.md | claude | . | 0 | 0 |
| crates/AGENTS.md | agents | crates | 6 | 0 |
| crates/but/AGENTS.md | agents | crates/but | 0 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the test package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:ct package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:e2e package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:e2e:blackbox package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the test:e2e:playwright package script | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Static Issues

| Category | Source | Severity | Message |
| --- | --- | --- | --- |
| scope | apps/desktop | warning | No nested instruction file found for apps/desktop. |
| scope | apps/web | warning | No nested instruction file found for apps/web. |
| scope | packages/but-sdk | warning | No nested instruction file found for packages/but-sdk. |
| scope | packages/core | warning | No nested instruction file found for packages/core. |
| scope | packages/no-cross-domain-imports | warning | No nested instruction file found for packages/no-cross-domain-imports. |
| scope | packages/no-relative-imports | warning | No nested instruction file found for packages/no-relative-imports. |
| scope | packages/shared | warning | No nested instruction file found for packages/shared. |
| scope | packages/svelte-comment-injector | warning | No nested instruction file found for packages/svelte-comment-injector. |
| scope | packages/ui | warning | No nested instruction file found for packages/ui. |

## Command Resolutions

| Command | Source | Script | Package | Status |
| --- | --- | --- | --- | --- |
| pnpm build | .github/copilot-instructions.md:94 | build | package.json | resolved |
| pnpm build:desktop | .github/copilot-instructions.md:97 | build:desktop | package.json | resolved |
| pnpm tauri build --features devtools --config crates/gitbutler-tauri/tauri.conf.nightly.json | .github/copilot-instructions.md:100 | tauri | package.json | resolved |
| pnpm lint | .github/copilot-instructions.md:118 | lint | package.json | resolved |
| pnpm format | .github/copilot-instructions.md:124 | format | package.json | resolved |
| pnpm prettier | .github/copilot-instructions.md:127 | prettier | package.json | resolved |
| pnpm format && pnpm rustfmt | .github/copilot-instructions.md:245 | format | package.json | resolved |
| pnpm lint && cargo clippy --all-targets | .github/copilot-instructions.md:246 | lint | package.json | resolved |
| pnpm test && cargo test | .github/copilot-instructions.md:247 | test | package.json | resolved |
| pnpm build | .github/copilot-instructions.md:248 | build | package.json | resolved |
| pnpm begood && cargo clippy --fix --all-targets | .github/copilot-instructions.md:251 | begood | package.json | resolved |
| pnpm build:sdk && pnpm format | crates/AGENTS.md:110 | build:sdk | package.json | resolved |

## Signal Findings

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | .github/copilot-instructions.md:61 | Setup command guidance. |
| reproducibility | .github/copilot-instructions.md:66 | Build command guidance. |
| reproducibility | .github/copilot-instructions.md:69 | Build command guidance. |
| reproducibility | .github/copilot-instructions.md:94 | Build command guidance. |
| reproducibility | .github/copilot-instructions.md:97 | Build command guidance. |
| reproducibility | .github/copilot-instructions.md:100 | Build command guidance. |
| reproducibility | .github/copilot-instructions.md:107 | Test command guidance. |
| reproducibility | .github/copilot-instructions.md:247 | Test command guidance. |
| reproducibility | .github/copilot-instructions.md:248 | Build command guidance. |
| reproducibility | .github/copilot-instructions.md:291 | Setup command guidance. |
| reproducibility | apps/lite/AGENTS.md:10 | Deterministic or reproducible workflow guidance. |
| reproducibility | crates/AGENTS.md:83 | Deterministic or reproducible workflow guidance. |
| reproducibility | crates/AGENTS.md:94 | Test command guidance. |
