# AgentFit Report

**Score:** 73/100 (C)

2 failed checks found.

Generated: 2026-05-18T17:08:20.700Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 10/20 | 16 instruction files discovered. |
| Command freshness | 8/15 | Commands were found but not executed. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 5 deterministic task previews generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 0/10 | Safety guardrails were not found. |
| Reproducibility | 10/10 | Reproducible setup and verification guidance found. |

## Failed Checks

- No root-level instruction file was discovered.
- Safety guardrails were not found.

## Caps

None.

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| .cursor/rules/README.md | cursor | .cursor/rules | 0 | 0 |
| .cursor/rules/agent-behavior.mdc | cursor | .cursor/rules | 0 | 0 |
| .cursor/rules/backend.mdc | cursor | .cursor/rules | 0 | 0 |
| .cursor/rules/build/docker.mdc | cursor | .cursor/rules/build | 1 | 0 |
| .cursor/rules/commit/semantic-pr-validator.mdc | cursor | .cursor/rules/commit | 0 | 0 |
| .cursor/rules/frontend.mdc | cursor | .cursor/rules | 7 | 0 |
| .cursor/rules/index.mdc | cursor | .cursor/rules | 0 | 0 |
| .cursor/rules/infra.mdc | cursor | .cursor/rules | 0 | 0 |
| .cursor/rules/playwright.mdc | cursor | .cursor/rules | 6 | 0 |
| .cursor/rules/quality/performance-optimizer.mdc | cursor | .cursor/rules/quality | 0 | 0 |
| .cursor/rules/quality/react-hook-best-practices.mdc | cursor | .cursor/rules/quality | 0 | 0 |
| .cursor/rules/regen-helm-schema.mdc | cursor | .cursor/rules | 0 | 0 |
| .cursor/rules/testing/test-generator.mdc | cursor | .cursor/rules/testing | 0 | 0 |
| .cursor/rules/verification/bug-fix-verifier.mdc | cursor | .cursor/rules/verification | 0 | 0 |
| .cursor/rules/verification/feature-verifier.mdc | cursor | .cursor/rules/verification | 0 | 0 |
| .cursor/rules/verification/workflow-validator.mdc | cursor | .cursor/rules/verification | 0 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Make a safe change covered by app/client/packages/ast/src/actionCreator/index.test.ts | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Make a safe change covered by app/client/packages/design-system/ads/src/Badge/Badge.test.tsx | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Make a safe change covered by app/client/packages/design-system/ads/src/Divider/Divider.test.tsx | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Make a safe change covered by app/client/packages/design-system/ads/src/Icon/Icon.test.tsx | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Make a safe change covered by app/client/packages/design-system/ads/src/Link/Link.test.tsx | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Command Resolutions

| Command | Source | Script | Package | Status |
| --- | --- | --- | --- | --- |
| yarn run test:unit | .cursor/rules/frontend.mdc:33 | test:unit | app/client/package.json | resolved |
| yarn run lint | .cursor/rules/frontend.mdc:35 | lint | app/client/package.json | resolved |
| yarn run prettier | .cursor/rules/frontend.mdc:36 | prettier | app/client/package.json | resolved |
| yarn run check-types | .cursor/rules/frontend.mdc:37 | check-types | app/client/package.json | resolved |
| yarn test:pw:flake-check --grep "test name" | .cursor/rules/playwright.mdc:122 | test:pw:flake-check | app/client/package.json | resolved |
| yarn test:pw:regression | .cursor/rules/playwright.mdc:162 | test:pw:regression | app/client/package.json | resolved |
| yarn test:pw:sanity | .cursor/rules/playwright.mdc:162 | test:pw:sanity | app/client/package.json | resolved |
| yarn test:pw:smoke | .cursor/rules/playwright.mdc:162 | test:pw:smoke | app/client/package.json | resolved |

## Signal Findings

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | .cursor/rules/build/docker.mdc:76 | Setup command guidance. |
| reproducibility | .cursor/rules/frontend.mdc:33 | Test command guidance. |
| reproducibility | .cursor/rules/frontend.mdc:37 | Test command guidance. |
| reproducibility | .cursor/rules/playwright.mdc:122 | Test command guidance. |
| reproducibility | .cursor/rules/playwright.mdc:162 | Test command guidance. |
| reproducibility | .cursor/rules/playwright.mdc:163 | Test command guidance. |
