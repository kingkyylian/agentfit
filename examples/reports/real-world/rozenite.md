# AgentFit Report

**Score:** 60/100 (D)

5 failed checks found. 1 score cap applied.

Generated: 2026-05-18T16:23:25.443Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 15/20 | 1 instruction file discovered; 28 nested scope issues found. |
| Command freshness | 0/15 | 1 static command issue found. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 5 deterministic task previews generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 0/10 | Safety guardrails were not found. |
| Reproducibility | 0/10 | Reproducibility instructions were not found. |

## Failed Checks

- 28 nested scopes do not have local instruction files.
- No runnable verification command found in instruction files.
- Safety guardrails were not found.
- Reproducibility instructions were not found.
- No verification command found in instruction files.

## Caps

- no verification command found: max score 75

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| AGENTS.md | agents | . | 1 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the lint:all package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the build:all package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the checks:all package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the format:all package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the format:all:fix package script | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Static Issues

| Category | Source | Severity | Message |
| --- | --- | --- | --- |
| command | AGENTS.md | error | No runnable verification command found in instruction files. |
| scope | apps/playground | warning | No nested instruction file found for apps/playground. |
| scope | packages/agent-bridge | warning | No nested instruction file found for packages/agent-bridge. |
| scope | packages/agent-sdk | warning | No nested instruction file found for packages/agent-sdk. |
| scope | packages/agent-shared | warning | No nested instruction file found for packages/agent-shared. |
| scope | packages/chrome-extension | warning | No nested instruction file found for packages/chrome-extension. |
| scope | packages/cli | warning | No nested instruction file found for packages/cli. |
| scope | packages/controls-plugin | warning | No nested instruction file found for packages/controls-plugin. |
| scope | packages/expo-atlas-plugin | warning | No nested instruction file found for packages/expo-atlas-plugin. |
| scope | packages/file-system-plugin | warning | No nested instruction file found for packages/file-system-plugin. |
| scope | packages/metro | warning | No nested instruction file found for packages/metro. |
| scope | packages/middleware | warning | No nested instruction file found for packages/middleware. |
| scope | packages/mmkv-plugin | warning | No nested instruction file found for packages/mmkv-plugin. |
| scope | packages/network-activity-plugin | warning | No nested instruction file found for packages/network-activity-plugin. |
| scope | packages/overlay-plugin | warning | No nested instruction file found for packages/overlay-plugin. |
| scope | packages/performance-monitor-plugin | warning | No nested instruction file found for packages/performance-monitor-plugin. |
| scope | packages/plugin-bridge | warning | No nested instruction file found for packages/plugin-bridge. |
| scope | packages/react-navigation-plugin | warning | No nested instruction file found for packages/react-navigation-plugin. |
| scope | packages/redux-devtools-plugin | warning | No nested instruction file found for packages/redux-devtools-plugin. |
| scope | packages/repack | warning | No nested instruction file found for packages/repack. |
| scope | packages/require-profiler-plugin | warning | No nested instruction file found for packages/require-profiler-plugin. |
| scope | packages/rhf-plugin | warning | No nested instruction file found for packages/rhf-plugin. |
| scope | packages/runtime | warning | No nested instruction file found for packages/runtime. |
| scope | packages/sqlite-plugin | warning | No nested instruction file found for packages/sqlite-plugin. |
| scope | packages/storage-plugin | warning | No nested instruction file found for packages/storage-plugin. |
| scope | packages/tanstack-query-plugin | warning | No nested instruction file found for packages/tanstack-query-plugin. |
| scope | packages/tools | warning | No nested instruction file found for packages/tools. |
| scope | packages/vite-plugin | warning | No nested instruction file found for packages/vite-plugin. |
| scope | packages/web | warning | No nested instruction file found for packages/web. |
