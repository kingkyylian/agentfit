# AgentFit Report

**Score:** 73/100 (C)

AgentFit score 73/100 (C).

Generated: 2026-05-07T18:07:58.143Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 0/20 | 1 instruction file discovered; 34 nested scope issues found. |
| Command freshness | 8/15 | Commands were found but not executed. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 5 deterministic task previews generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 10/10 | Safety guardrails found. |
| Reproducibility | 10/10 | Reproducible setup and verification guidance found. |

## Failed Checks

- No nested instruction file found for apps/desktop.
- No nested instruction file found for apps/server.
- No nested instruction file found for apps/storybook.
- No nested instruction file found for apps/web.
- No nested instruction file found for packages/action-history.
- No nested instruction file found for packages/api-contract.
- No nested instruction file found for packages/atom-solid.
- No nested instruction file found for packages/base-packages.
- No nested instruction file found for packages/clipboard.
- No nested instruction file found for packages/config.
- No nested instruction file found for packages/effect-server-fn.
- No nested instruction file found for packages/http-client.
- No nested instruction file found for packages/icons.
- No nested instruction file found for packages/json.
- No nested instruction file found for packages/option.
- No nested instruction file found for packages/package-sdk.
- No nested instruction file found for packages/packages.
- No nested instruction file found for packages/playground.
- No nested instruction file found for packages/project-domain.
- No nested instruction file found for packages/project-editor.
- No nested instruction file found for packages/project-runtime.
- No nested instruction file found for packages/project-ui.
- No nested instruction file found for packages/runtime.
- No nested instruction file found for packages/runtime-rendering.
- No nested instruction file found for packages/runtime-serde.
- No nested instruction file found for packages/server-backend.
- No nested instruction file found for packages/server-domain.
- No nested instruction file found for packages/server-frontend.
- No nested instruction file found for packages/typesystem.
- No nested instruction file found for packages/typesystem-old.
- No nested instruction file found for packages/ui.
- No nested instruction file found for packages/utils.
- No nested instruction file found for packages/web-backend.
- No nested instruction file found for packages/web-domain.

## Caps

None.

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| AGENTS.md | agents | . | 4 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the test package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the typecheck package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the lint package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the lint:fix package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the desktop package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
## Static Issues

| Category | Source | Severity | Message |
| --- | --- | --- | --- |
| scope | apps/desktop | warning | No nested instruction file found for apps/desktop. |
| scope | apps/server | warning | No nested instruction file found for apps/server. |
| scope | apps/storybook | warning | No nested instruction file found for apps/storybook. |
| scope | apps/web | warning | No nested instruction file found for apps/web. |
| scope | packages/action-history | warning | No nested instruction file found for packages/action-history. |
| scope | packages/api-contract | warning | No nested instruction file found for packages/api-contract. |
| scope | packages/atom-solid | warning | No nested instruction file found for packages/atom-solid. |
| scope | packages/base-packages | warning | No nested instruction file found for packages/base-packages. |
| scope | packages/clipboard | warning | No nested instruction file found for packages/clipboard. |
| scope | packages/config | warning | No nested instruction file found for packages/config. |
| scope | packages/effect-server-fn | warning | No nested instruction file found for packages/effect-server-fn. |
| scope | packages/http-client | warning | No nested instruction file found for packages/http-client. |
| scope | packages/icons | warning | No nested instruction file found for packages/icons. |
| scope | packages/json | warning | No nested instruction file found for packages/json. |
| scope | packages/option | warning | No nested instruction file found for packages/option. |
| scope | packages/package-sdk | warning | No nested instruction file found for packages/package-sdk. |
| scope | packages/packages | warning | No nested instruction file found for packages/packages. |
| scope | packages/playground | warning | No nested instruction file found for packages/playground. |
| scope | packages/project-domain | warning | No nested instruction file found for packages/project-domain. |
| scope | packages/project-editor | warning | No nested instruction file found for packages/project-editor. |
| scope | packages/project-runtime | warning | No nested instruction file found for packages/project-runtime. |
| scope | packages/project-ui | warning | No nested instruction file found for packages/project-ui. |
| scope | packages/runtime | warning | No nested instruction file found for packages/runtime. |
| scope | packages/runtime-rendering | warning | No nested instruction file found for packages/runtime-rendering. |
| scope | packages/runtime-serde | warning | No nested instruction file found for packages/runtime-serde. |
| scope | packages/server-backend | warning | No nested instruction file found for packages/server-backend. |
| scope | packages/server-domain | warning | No nested instruction file found for packages/server-domain. |
| scope | packages/server-frontend | warning | No nested instruction file found for packages/server-frontend. |
| scope | packages/typesystem | warning | No nested instruction file found for packages/typesystem. |
| scope | packages/typesystem-old | warning | No nested instruction file found for packages/typesystem-old. |
| scope | packages/ui | warning | No nested instruction file found for packages/ui. |
| scope | packages/utils | warning | No nested instruction file found for packages/utils. |
| scope | packages/web-backend | warning | No nested instruction file found for packages/web-backend. |
| scope | packages/web-domain | warning | No nested instruction file found for packages/web-domain. |
