# AgentFit Report

**Score:** 83/100 (B)

1 failed check found.

Generated: 2026-05-18T16:23:25.671Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 20/20 | 84 instruction files discovered. |
| Command freshness | 8/15 | Commands were found but not executed. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 5 deterministic task previews generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 0/10 | Safety guardrails were not found. |
| Reproducibility | 10/10 | Reproducible setup and verification guidance found. |

## Failed Checks

- Safety guardrails were not found.

## Caps

None.

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| CLAUDE.md | claude | . | 2 | 0 |
| app/CLAUDE.md | claude | app | 5 | 0 |
| app/common/CLAUDE.md | claude | app/common | 0 | 0 |
| app/electron-client/CLAUDE.md | claude | app/electron-client | 1 | 0 |
| app/gui/CLAUDE.md | claude | app/gui | 0 | 0 |
| app/gui/integration-test/CLAUDE.md | claude | app/gui/integration-test | 3 | 0 |
| app/gui/src/dashboard/CLAUDE.md | claude | app/gui/src/dashboard | 1 | 0 |
| app/gui/src/project-view/CLAUDE.md | claude | app/gui/src/project-view | 0 | 0 |
| app/gui/src/project-view/components/GraphEditor/widgets/CLAUDE.md | claude | app/gui/src/project-view/components/GraphEditor/widgets | 0 | 0 |
| app/lang-markdown/CLAUDE.md | claude | app/lang-markdown | 0 | 0 |
| app/lezer-markdown/CLAUDE.md | claude | app/lezer-markdown | 1 | 0 |
| app/project-manager-shim/CLAUDE.md | claude | app/project-manager-shim | 1 | 0 |
| app/rust-ffi/CLAUDE.md | claude | app/rust-ffi | 0 | 0 |
| app/table-expression/CLAUDE.md | claude | app/table-expression | 0 | 0 |
| app/ydoc-channel/CLAUDE.md | claude | app/ydoc-channel | 0 | 0 |
| app/ydoc-inspect/CLAUDE.md | claude | app/ydoc-inspect | 0 | 0 |
| app/ydoc-server-polyglot/CLAUDE.md | claude | app/ydoc-server-polyglot | 3 | 0 |
| app/ydoc-server/CLAUDE.md | claude | app/ydoc-server | 2 | 0 |
| app/ydoc-shared/CLAUDE.md | claude | app/ydoc-shared | 1 | 0 |
| build_tools/CLAUDE.md | claude | build_tools | 0 | 0 |
| build_tools/base/CLAUDE.md | claude | build_tools/base | 0 | 0 |
| build_tools/build/CLAUDE.md | claude | build_tools/build | 1 | 0 |
| build_tools/ci-gen/CLAUDE.md | claude | build_tools/ci-gen | 0 | 0 |
| build_tools/ci_utils/CLAUDE.md | claude | build_tools/ci_utils | 0 | 0 |
| build_tools/cli/CLAUDE.md | claude | build_tools/cli | 0 | 0 |
| build_tools/enso-formatter/CLAUDE.md | claude | build_tools/enso-formatter | 1 | 0 |
| build_tools/install/CLAUDE.md | claude | build_tools/install | 1 | 0 |
| build_tools/install/config/CLAUDE.md | claude | build_tools/install/config | 0 | 0 |
| build_tools/install/installer/CLAUDE.md | claude | build_tools/install/installer | 1 | 0 |
| build_tools/install/uninstaller/CLAUDE.md | claude | build_tools/install/uninstaller | 0 | 0 |
| build_tools/macros/lib/CLAUDE.md | claude | build_tools/macros/lib | 0 | 0 |
| distribution/CLAUDE.md | claude | distribution | 0 | 0 |
| distribution/lib/Standard/AWS/0.0.0-dev/CLAUDE.md | claude | distribution/lib/Standard/AWS/0.0.0-dev | 0 | 0 |
| distribution/lib/Standard/Base/0.0.0-dev/CLAUDE.md | claude | distribution/lib/Standard/Base/0.0.0-dev | 0 | 0 |
| distribution/lib/Standard/CLAUDE.md | claude | distribution/lib/Standard | 0 | 0 |
| distribution/lib/Standard/Database/0.0.0-dev/CLAUDE.md | claude | distribution/lib/Standard/Database/0.0.0-dev | 0 | 0 |
| distribution/lib/Standard/DuckDB/0.0.0-dev/CLAUDE.md | claude | distribution/lib/Standard/DuckDB/0.0.0-dev | 0 | 0 |
| distribution/lib/Standard/Examples/0.0.0-dev/CLAUDE.md | claude | distribution/lib/Standard/Examples/0.0.0-dev | 0 | 0 |
| distribution/lib/Standard/Generic_JDBC/0.0.0-dev/CLAUDE.md | claude | distribution/lib/Standard/Generic_JDBC/0.0.0-dev | 0 | 0 |
| distribution/lib/Standard/Geo/0.0.0-dev/CLAUDE.md | claude | distribution/lib/Standard/Geo/0.0.0-dev | 0 | 0 |
| distribution/lib/Standard/Google/0.0.0-dev/CLAUDE.md | claude | distribution/lib/Standard/Google/0.0.0-dev | 0 | 0 |
| distribution/lib/Standard/Google_Api/0.0.0-dev/CLAUDE.md | claude | distribution/lib/Standard/Google_Api/0.0.0-dev | 0 | 0 |
| distribution/lib/Standard/Image/0.0.0-dev/CLAUDE.md | claude | distribution/lib/Standard/Image/0.0.0-dev | 0 | 0 |
| distribution/lib/Standard/Microsoft/0.0.0-dev/CLAUDE.md | claude | distribution/lib/Standard/Microsoft/0.0.0-dev | 0 | 0 |
| distribution/lib/Standard/Saas/0.0.0-dev/CLAUDE.md | claude | distribution/lib/Standard/Saas/0.0.0-dev | 0 | 0 |
| distribution/lib/Standard/Searcher/0.0.0-dev/CLAUDE.md | claude | distribution/lib/Standard/Searcher/0.0.0-dev | 0 | 0 |
| distribution/lib/Standard/Snowflake/0.0.0-dev/CLAUDE.md | claude | distribution/lib/Standard/Snowflake/0.0.0-dev | 0 | 0 |
| distribution/lib/Standard/Table/0.0.0-dev/CLAUDE.md | claude | distribution/lib/Standard/Table/0.0.0-dev | 0 | 0 |
| distribution/lib/Standard/Tableau/0.0.0-dev/CLAUDE.md | claude | distribution/lib/Standard/Tableau/0.0.0-dev | 0 | 0 |
| distribution/lib/Standard/Test/0.0.0-dev/CLAUDE.md | claude | distribution/lib/Standard/Test/0.0.0-dev | 0 | 0 |
| distribution/lib/Standard/Visualization/0.0.0-dev/CLAUDE.md | claude | distribution/lib/Standard/Visualization/0.0.0-dev | 0 | 0 |
| docs/CLAUDE.md | claude | docs | 0 | 0 |
| engine/CLAUDE.md | claude | engine | 0 | 0 |
| engine/language-server/CLAUDE.md | claude | engine/language-server | 0 | 0 |
| engine/polyglot-api/CLAUDE.md | claude | engine/polyglot-api | 0 | 0 |
| engine/runner/CLAUDE.md | claude | engine/runner | 0 | 0 |
| engine/runtime/CLAUDE.md | claude | engine/runtime | 0 | 0 |
| internal/CLAUDE.md | claude | internal | 1 | 0 |
| lib/java/CLAUDE.md | claude | lib/java | 0 | 0 |
| lib/rust/CLAUDE.md | claude | lib/rust | 0 | 0 |
| lib/rust/launcher-shims/CLAUDE.md | claude | lib/rust/launcher-shims | 0 | 0 |
| lib/rust/macro-utils/CLAUDE.md | claude | lib/rust/macro-utils | 0 | 0 |
| lib/rust/metamodel/CLAUDE.md | claude | lib/rust/metamodel | 0 | 0 |
| lib/rust/metamodel/lexpr/CLAUDE.md | claude | lib/rust/metamodel/lexpr | 0 | 0 |
| lib/rust/parser/CLAUDE.md | claude | lib/rust/parser | 0 | 0 |
| lib/rust/parser/debug/CLAUDE.md | claude | lib/rust/parser/debug | 1 | 0 |
| lib/rust/parser/debug/fuzz/CLAUDE.md | claude | lib/rust/parser/debug/fuzz | 3 | 0 |
| lib/rust/parser/generate-java/CLAUDE.md | claude | lib/rust/parser/generate-java | 0 | 0 |
| lib/rust/parser/jni/CLAUDE.md | claude | lib/rust/parser/jni | 1 | 0 |
| lib/rust/parser/macros/CLAUDE.md | claude | lib/rust/parser/macros | 0 | 0 |
| lib/rust/parser/schema/CLAUDE.md | claude | lib/rust/parser/schema | 0 | 0 |
| lib/rust/parser/src/syntax/tree/visitor/CLAUDE.md | claude | lib/rust/parser/src/syntax/tree/visitor | 0 | 0 |
| lib/rust/prelude/CLAUDE.md | claude | lib/rust/prelude | 0 | 0 |
| lib/rust/prelude/macros/CLAUDE.md | claude | lib/rust/prelude/macros | 0 | 0 |
| lib/rust/reflect/CLAUDE.md | claude | lib/rust/reflect | 0 | 0 |
| lib/rust/reflect/macros/CLAUDE.md | claude | lib/rust/reflect/macros | 0 | 0 |
| lib/rust/zst/CLAUDE.md | claude | lib/rust/zst | 0 | 0 |
| lib/scala/CLAUDE.md | claude | lib/scala | 0 | 0 |
| project/CLAUDE.md | claude | project | 0 | 0 |
| std-bits/CLAUDE.md | claude | std-bits | 0 | 0 |
| test/CLAUDE.md | claude | test | 0 | 0 |
| tools/CLAUDE.md | claude | tools | 0 | 0 |
| tools/enso4igv/CLAUDE.md | claude | tools/enso4igv | 0 | 0 |
| tools/http-test-helper/CLAUDE.md | claude | tools/http-test-helper | 0 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the bazel-clean package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the build:gui package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the build:icons package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the build:ide package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the build:ydoc-server-polyglot package script | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Command Resolutions

| Command | Source | Script | Package | Status |
| --- | --- | --- | --- | --- |
| pnpm compile | app/CLAUDE.md:64 | compile | package.json | resolved |
| pnpm run -r compile | app/CLAUDE.md:64 | compile | 9 workspace package.json files | resolved |
| pnpm test:integration          # headless | app/gui/integration-test/CLAUDE.md:22 | test:integration | app/gui/package.json | resolved |
| pnpm test-dev:integration      # UI mode | app/gui/integration-test/CLAUDE.md:23 | test-dev:integration | app/gui/package.json | resolved |
| pnpm run compile | app/ydoc-server-polyglot/CLAUDE.md:16 | compile | app/ydoc-server-polyglot/package.json | resolved |
| pnpm run test:unit | app/ydoc-shared/CLAUDE.md:44 | test:unit | app/ydoc-shared/package.json | resolved |

## Signal Findings

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | app/CLAUDE.md:64 | Build command guidance. |
| reproducibility | app/CLAUDE.md:65 | Build command guidance. |
| reproducibility | app/CLAUDE.md:70 | Test command guidance. |
| reproducibility | app/electron-client/CLAUDE.md:40 | Deterministic or reproducible workflow guidance. |
| reproducibility | app/gui/integration-test/CLAUDE.md:22 | Test command guidance. |
| reproducibility | app/gui/integration-test/CLAUDE.md:23 | Test command guidance. |
| reproducibility | app/gui/integration-test/CLAUDE.md:32 | Setup command guidance. |
| reproducibility | app/gui/src/dashboard/CLAUDE.md:71 | Test command guidance. |
| reproducibility | app/lezer-markdown/CLAUDE.md:7 | Build command guidance. |
| reproducibility | app/rust-ffi/CLAUDE.md:9 | Deterministic or reproducible workflow guidance. |
| reproducibility | app/ydoc-server-polyglot/CLAUDE.md:16 | Build command guidance. |
| reproducibility | app/ydoc-shared/CLAUDE.md:44 | Test command guidance. |
| reproducibility | build_tools/build/CLAUDE.md:33 | Test command guidance. |
| reproducibility | build_tools/install/CLAUDE.md:23 | Build command guidance. |
| reproducibility | build_tools/install/installer/CLAUDE.md:13 | Test command guidance. |
| reproducibility | internal/CLAUDE.md:8 | Setup command guidance. |
| reproducibility | lib/rust/parser/debug/fuzz/CLAUDE.md:8 | Setup command guidance. |
| reproducibility | lib/rust/parser/debug/fuzz/CLAUDE.md:11 | Build command guidance. |
| reproducibility | lib/rust/parser/jni/CLAUDE.md:20 | Build command guidance. |
| reproducibility | lib/rust/parser/schema/CLAUDE.md:8 | Deterministic or reproducible workflow guidance. |
| reproducibility | tools/http-test-helper/CLAUDE.md:22 | Deterministic or reproducible workflow guidance. |
