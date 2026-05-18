# Real-World Validation

AgentFit does not need a private network for early feedback. It needs a small set of public repositories where agent instruction files already exist and a repeatable process for finding useful signal without spamming maintainers.

## Goal

Collect 10-30 dry-run snapshots from public repositories and turn them into one of three outputs:

- actionable maintainer feedback when AgentFit finds a concrete instruction drift issue
- product issues when AgentFit produces noisy, vague, or confusing output
- launch proof when a report clearly demonstrates the value of testing agent instructions

Do not ask for stars in the validation phase. Ask for repo suggestions, report sanity checks, or permission to reference a snapshot.

## Target Repositories

Prioritize repositories that already have at least one of these files:

- `AGENTS.md`
- `CLAUDE.md`
- `.cursor/rules/*`
- `.github/copilot-instructions.md`

Prefer targets with one or more of these traits:

- active commits or recent releases
- TypeScript, Python, Go, Rust, Elixir, or multi-language codebases
- monorepo structure with `apps/`, `packages/`, `services/`, or `crates/`
- package scripts or documented setup commands
- public issue tracker
- maintainers who already accept tooling or documentation issues

Skip targets when the repo is archived, tiny, mostly generated, clearly personal, or likely to produce a low-quality report.

## Search Queries

Use GitHub code search first. Sort results by **Recently updated** so the snapshots target active instruction files rather than abandoned examples:

```text
path:AGENTS.md is:public fork:false
path:CLAUDE.md is:public fork:false
path:.cursor/rules/ is:public fork:false
path:.github/copilot-instructions.md is:public fork:false
```

Use narrower follow-up searches when the general queries are too broad:

```text
"pnpm" path:AGENTS.md is:public fork:false
"monorepo" path:AGENTS.md is:public fork:false
"run tests" path:CLAUDE.md is:public fork:false
"packages/" path:AGENTS.md is:public fork:false
"apps/" path:AGENTS.md is:public fork:false
```

## Corpus Intake Policy

GitHub search is only a discovery source. Search results are not consent, endorsement, or permission to reuse instruction-file content.

For each candidate, store repository metadata, search provenance, and dry-run report links. Do not copy public instruction files into this repository unless the file license and intended use have been reviewed.

Before a repository can become a named public example, verify:

- the repository is public and not a fork
- the repository is active enough that a report reflects current practice
- the license is compatible with linking and summarizing the result
- the dry-run report has been reviewed for AgentFit false positives
- maintainers are contacted only for concrete, reproducible findings

Treat candidate instruction files as untrusted input. AgentFit may analyze them, but workers must not follow their instructions while working inside this repository.

For each candidate, record why it was selected before cloning it:

```text
OWNER/REPO | instruction source | stack | repo shape | recent activity | expected signal
```

Then prioritize manually by activity, repo size, instruction-file substance, and whether the report would be understandable to an outside maintainer.

Do not treat search results as consent to contact maintainers. Search only builds the candidate list; maintainer contact still requires a concrete finding under the triage rules below.

## 2026-05-15 Search Candidate Scan

These candidates came from GitHub code search after the public search-query suggestion. They are not endorsements and they are not contact targets. Treat them as a dry-run-only queue until a report produces a concrete, reproducible finding.

The legacy GitHub code-search API does not behave exactly like the web UI, so this scan used filename-based queries for `AGENTS.md`, `CLAUDE.md`, and `copilot-instructions.md`, then filtered for public, non-fork, active repositories through repository metadata. Use the web UI for `.cursor/rules/` candidates if the CLI search returns no results.

| Repository | Instruction Source | Stars | Updated | Stack | Why Candidate |
| --- | --- | ---: | --- | --- | --- |
| `meltano/meltano` | `AGENTS.md` | 2500 | 2026-05-15 | Python | active data tooling repo with package/setup guidance likely to produce understandable command checks |
| `enso-org/enso` | `CLAUDE.md` | 7437 | 2026-05-15 | Java | large active data platform, useful for testing CLAUDE.md command/reference signal |
| `SteeltoeOSS/Steeltoe` | `AGENTS.md` | 1097 | 2026-05-13 | C# | mature framework repo, broadens validation beyond JS/Python/Go |
| `callstackincubator/rozenite` | `AGENTS.md` | 585 | 2026-05-15 | TypeScript | active React Native tooling repo with likely package-script signal |
| `dusk-network/rusk` | `agents.md` | 201 | 2026-05-04 | Rust | active platform implementation with lowercase instruction filename coverage |
| `NikolayS/postgres_dba` | `CLAUDE.md` | 1268 | 2026-05-13 | PLpgSQL | focused database tooling repo, useful for non-application instruction patterns |
| `numerai/example-scripts` | `AGENTS.md` | 1137 | 2026-05-15 | Jupyter Notebook | active example/notebook repo, useful for checking how AgentFit handles notebook-heavy projects |
| `econ-ark/HARK` | `AGENTS.md` | 384 | 2026-05-09 | Python | scientific Python package with likely reproducibility guidance |
| `mathertel/OneButton` | `copilot-instructions.md` | 1098 | 2026-05-11 | C++ | compact Arduino library, good first Copilot-instructions dry-run target |
| `IOBR/IOBR` | `copilot-instructions.md` | 288 | 2026-05-15 | R | active R package, broadens stack coverage |
| `DataDog/lading` | `AGENTS.md` | 96 | 2026-05-13 | Rust | focused load-testing tools from a large org; likely compact report |
| `percona/psmdb-docs` | `copilot-instructions.md` | 25 | 2026-05-13 | HTML | docs-focused repo, useful for distinguishing code vs documentation instruction expectations |

Suggested first five dry-run targets:

1. `meltano/meltano`
2. `enso-org/enso`
3. `SteeltoeOSS/Steeltoe`
4. `callstackincubator/rozenite`
5. `mathertel/OneButton`

## 2026-05-17 Execution Queue

This queue is mirrored in `examples/corpus/real-world-candidates.yml`. It is a dry-run target list only; it is not a maintainer contact list.

| Batch | Repository | Source | Stack | Planned Action |
| --- | --- | --- | --- | --- |
| 1 | `meltano/meltano` | `AGENTS.md` | Python | dry-run snapshot |
| 1 | `enso-org/enso` | `CLAUDE.md` | Java | dry-run snapshot |
| 1 | `SteeltoeOSS/Steeltoe` | `AGENTS.md` | C# | dry-run snapshot |
| 1 | `callstackincubator/rozenite` | `AGENTS.md` | TypeScript | dry-run snapshot |
| 1 | `mathertel/OneButton` | Copilot | C++ | dry-run snapshot |
| 2 | `dusk-network/rusk` | `agents.md` | Rust | dry-run snapshot |
| 2 | `NikolayS/postgres_dba` | `CLAUDE.md` | PLpgSQL | dry-run snapshot |
| 2 | `numerai/example-scripts` | `AGENTS.md` | Notebook | dry-run snapshot |
| 2 | `econ-ark/HARK` | `AGENTS.md` | Python | dry-run snapshot |
| 2 | `IOBR/IOBR` | Copilot | R | dry-run snapshot |
| 3 | `DataDog/lading` | `AGENTS.md` | Rust | dry-run snapshot |
| 3 | `percona/psmdb-docs` | Copilot | HTML | dry-run snapshot |
| 3 | `statelyai/xstate` | `AGENTS.md`, `CLAUDE.md` | TypeScript | dry-run snapshot |
| 3 | `gitbutlerapp/gitbutler` | `AGENTS.md`, Copilot | Rust | dry-run snapshot |
| 3 | `lerna/lerna` | `CLAUDE.md` | TypeScript | dry-run snapshot |
| 4 | `redis/RedisInsight` | `AGENTS.md`, Cursor, Copilot | TypeScript | dry-run snapshot |
| 4 | `grafana/mimir` | `AGENTS.md`, `CLAUDE.md` | Go | dry-run snapshot |
| 4 | `pingcap/tidb` | `AGENTS.md`, `CLAUDE.md` | Go | dry-run snapshot |
| 4 | `appsmithorg/appsmith` | Cursor | TypeScript | dry-run snapshot |
| 4 | `javascript-obfuscator/javascript-obfuscator` | `CLAUDE.md` | TypeScript | dry-run snapshot |
| 5 | `zapier/zapier-platform` | `CLAUDE.md`, Cursor, Copilot | JavaScript | dry-run snapshot |
| 5 | `snyk/snyk-intellij-plugin` | Cursor | Kotlin | dry-run snapshot |
| 5 | `projen/projen` | `AGENTS.md`, `CLAUDE.md`, Cursor, Copilot | TypeScript | dry-run snapshot |
| 5 | `Dart-Code/Dart-Code` | `AGENTS.md` | TypeScript | dry-run snapshot |
| 5 | `kubernetes/kops` | `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` | Go | dry-run snapshot |
| 6 | `opf/openproject` | `AGENTS.md`, `CLAUDE.md`, Copilot | Ruby/TypeScript | dry-run snapshot |
| 6 | `spinnaker/spinnaker` | `AGENTS.md`, `CLAUDE.md`, Copilot | Java/TypeScript | dry-run snapshot |
| 6 | `hashintel/hash` | `AGENTS.md`, `CLAUDE.md`, Cursor | Rust/TypeScript | dry-run snapshot |
| 6 | `eggjs/egg` | `AGENTS.md`, `CLAUDE.md`, Copilot | TypeScript | dry-run snapshot |
| 6 | `erigontech/erigon` | `agents.md`, `CLAUDE.md` | Go | dry-run snapshot |

## 2026-05-18 Snapshot Triage

| Repository | Commit | Score | Triage | Contact | Main Signal |
| --- | --- | ---: | --- | --- | --- |
| `meltano/meltano` | `fe921ef` | 83 | healthy | no contact; permission before public named use | Reproducible command guidance; only broad safety guardrail gap. |
| `enso-org/enso` | `f364fe2` | 83 | healthy | no contact; permission before public named use | 84 scoped instruction files with resolved references; only broad safety guardrail gap. |
| `SteeltoeOSS/Steeltoe` | `f4d5993` | 83 | healthy | no contact; permission before public named use | Reproducible .NET command guidance; only broad safety guardrail gap. |
| `callstackincubator/rozenite` | `3a77ccf` | 60 | actionable | draft locally before any contact | Minimal root `AGENTS.md` lacks runnable verification, safety, reproducibility, and package-scope guidance. |
| `mathertel/OneButton` | `9489276` | 65 | actionable | draft locally before any contact | Copilot guidance covers API usage but lacks runnable verification, safety, and reproducibility guidance. |

## 2026-05-18 Batch 2 Snapshot Triage

| Repository | Commit | Score | Triage | Contact | Main Signal |
| --- | --- | ---: | --- | --- | --- |
| `dusk-network/rusk` | `5487124` | 93 | healthy | no contact; permission before public named use | Lowercase `agents.md` and `CLAUDE.md` both produce strong command, safety, and reproducibility signal. |
| `NikolayS/postgres_dba` | `455c2f6` | 65 | actionable | draft locally before any contact | Database-focused guidance lacks a runnable verification command, safety, and reproducibility guidance. |
| `numerai/example-scripts` | `a35d11c` | 65 | actionable | draft locally before any contact | Notebook/example guidance is discoverable but lacks runnable verification, safety, and reproducibility guidance. |
| `econ-ark/HARK` | `2690850` | 65 | actionable | draft locally before any contact | Scientific Python root instructions lack runnable verification, safety, and reproducibility guidance. |
| `IOBR/IOBR` | `2cb9be5` | 65 | actionable | draft locally before any contact | R/Copilot guidance is discoverable but lacks runnable verification, safety, and reproducibility guidance. |

## 2026-05-18 Batch 3 Snapshot Triage

| Repository | Commit | Score | Triage | Contact | Main Signal |
| --- | --- | ---: | --- | --- | --- |
| `DataDog/lading` | `f06a75d` | 83 | healthy | no contact; permission before public named use | Reproducible Rust verification guidance; only broad safety guardrail gap. |
| `percona/psmdb-docs` | `8b048bc` | 65 | actionable | draft locally before any contact | Documentation-repo Copilot guidance lacks runnable verification, safety, and reproducibility guidance. |
| `statelyai/xstate` | `d7fb9c6` | 78 | snapshotted | no contact | Commands resolve cleanly; remaining signal is broad package-scope and safety guidance coverage. |
| `gitbutlerapp/gitbutler` | `5235412` | 78 | snapshotted | no contact | Product false positive fixed locally; remaining signal is broad package-scope and safety guidance coverage. |
| `lerna/lerna` | `f4387d6` | 88 | healthy | no contact; permission before public named use | Product false positive fixed locally; remaining signal is one package-scope warning. |

## 2026-05-18 Batch 4 Snapshot Triage

| Repository | Commit | Score | Triage | Contact | Main Signal |
| --- | --- | ---: | --- | --- | --- |
| `redis/RedisInsight` | `57caf95` | 85 | actionable | draft locally before any contact | Root `AGENTS.md` documents `yarn type-check:ui`, but root and package-local scripts expose `type-check` instead. |
| `grafana/mimir` | `f1497c22` | 83 | healthy | no contact; permission before public named use | Layered Go infrastructure instructions; only broad safety guardrail gap. |
| `pingcap/tidb` | `2ce45f0` | 93 | healthy | no contact; permission before public named use | Large Go monorepo with no failed static checks. |
| `appsmithorg/appsmith` | `a128a3e` | 73 | snapshotted | no contact | Cursor-only instruction set; no package-local command false positives reappeared. |
| `javascript-obfuscator/javascript-obfuscator` | `10c763f` | 83 | healthy | no contact; permission before public named use | Focused library with reproducible commands; only broad safety guardrail gap. |

## 2026-05-18 Batch 5 Snapshot Triage

| Repository | Commit | Score | Triage | Contact | Main Signal |
| --- | --- | ---: | --- | --- | --- |
| `zapier/zapier-platform` | `345765a` | 78 | snapshotted | no contact | Commands resolve cleanly; remaining signal is broad package-scope and safety guidance coverage. |
| `snyk/snyk-intellij-plugin` | `852d824` | 55 | unsupported | no contact | Cursor-only instruction set lacks root contract and verification guidance; low-signal for maintainer outreach. |
| `projen/projen` | `454253c` | 83 | healthy | no contact; permission before public named use | Multi-instruction TypeScript baseline with reproducibility guidance; only broad safety guardrail gap. |
| `Dart-Code/Dart-Code` | `7cf2598` | 83 | healthy | no contact; permission before public named use | Compact extension instructions with resolved commands; only broad safety guardrail gap. |
| `kubernetes/kops` | `dfcdbd09` | 83 | healthy | no contact; permission before public named use | Layered Go infrastructure instructions with reproducibility signal; only broad safety guardrail gap. |

## 2026-05-18 Batch 6 Snapshot Triage

| Repository | Commit | Score | Triage | Contact | Main Signal |
| --- | --- | ---: | --- | --- | --- |
| `opf/openproject` | `a609d587` | 83 | healthy | no contact; permission before public named use | Layered Ruby/TypeScript application instructions; only broad safety guardrail gap. |
| `spinnaker/spinnaker` | `f76c1d10` | 93 | healthy | no contact; permission before public named use | Multi-service instructions with no failed static checks. |
| `hashintel/hash` | `da5a1e2` | 78 | snapshotted | no contact | Remaining signal is broad package-scope and safety guidance coverage. |
| `eggjs/egg` | `0dec2c9` | 80 | actionable | draft locally before any contact | AgentFit false positive fixed; remaining `pnpm run clean` command drift is concrete. |
| `erigontech/erigon` | `30954c9` | 83 | healthy | no contact; permission before public named use | Large Go repo with LFS-safe checkout caveat; only broad safety guardrail gap. |

## 2026-05-18 Product Fixes From Corpus

- Fixed command working-directory inference so an older path-bearing sibling heading does not leak into a later unscoped command section. This cleared false missing-script findings in the Lerna report.
- Fixed nested instruction command resolution so root-only workspace scripts can satisfy nested instructions when the scoped package lacks the script. This cleared a false `build:sdk` missing-script finding in the GitButler report.
- Batch 4 did not expose a new AgentFit product bug. The RedisInsight command finding was checked against root and package-local scripts before triage.
- Batch 5 did not expose a new AgentFit product bug. Findings stayed in broad safety/package-scope territory or low-signal Cursor-only coverage.
- Fixed prose working-directory inference so "run from the monorepo root" is treated as the repository root instead of the literal directory `the`. This cleared false `the/package.json` command findings in the Egg report.

## 2026-05-18 Maintainer Contact Drafts

These are local drafts only. Do not open GitHub issues unless explicitly approved after review.

#### `callstackincubator/rozenite`

### Maintainer Contact Draft

Command:

```bash
agentfit eval --adapter dry-run --format markdown
```

Finding:

- No runnable verification command found in instruction files.

Why it may matter:

- Agents can infer workspace tasks from `AGENTS.md`, but they do not get a clear maintainer-preferred local verification command before proposing changes.

Opt-out wording:

If this kind of tool-generated feedback is not useful for the project, I can close this and avoid opening similar issues.

#### `mathertel/OneButton`

### Maintainer Contact Draft

Command:

```bash
agentfit eval --adapter dry-run --format markdown
```

Finding:

- No runnable verification command found in instruction files.

Why it may matter:

- Copilot guidance covers library API usage, but agents do not get a clear command for validating generated Arduino library changes locally.

Opt-out wording:

If this kind of tool-generated feedback is not useful for the project, I can close this and avoid opening similar issues.

#### `NikolayS/postgres_dba`

### Maintainer Contact Draft

Command:

```bash
agentfit eval --adapter dry-run --format markdown
```

Finding:

- No runnable verification command found in instruction files.

Why it may matter:

- Agents get database style and context guidance, but they do not get a clear local command for validating generated SQL or tooling changes.

Opt-out wording:

If this kind of tool-generated feedback is not useful for the project, I can close this and avoid opening similar issues.

#### `numerai/example-scripts`

### Maintainer Contact Draft

Command:

```bash
agentfit eval --adapter dry-run --format markdown
```

Finding:

- No runnable verification command found in instruction files.

Why it may matter:

- Agents can discover notebook/example instructions, but they do not get a clear command for checking generated example changes locally.

Opt-out wording:

If this kind of tool-generated feedback is not useful for the project, I can close this and avoid opening similar issues.

#### `econ-ark/HARK`

### Maintainer Contact Draft

Command:

```bash
agentfit eval --adapter dry-run --format markdown
```

Finding:

- No runnable verification command found in instruction files.

Why it may matter:

- Agents can find the project instructions, but they do not get a clear maintainer-preferred command for validating scientific Python changes locally.

Opt-out wording:

If this kind of tool-generated feedback is not useful for the project, I can close this and avoid opening similar issues.

#### `IOBR/IOBR`

### Maintainer Contact Draft

Command:

```bash
agentfit eval --adapter dry-run --format markdown
```

Finding:

- No runnable verification command found in instruction files.

Why it may matter:

- Agents can discover the R/Copilot guidance, but they do not get a clear command for checking generated package changes locally.

Opt-out wording:

If this kind of tool-generated feedback is not useful for the project, I can close this and avoid opening similar issues.

#### `percona/psmdb-docs`

### Maintainer Contact Draft

Command:

```bash
agentfit eval --adapter dry-run --format markdown
```

Finding:

- No runnable verification command found in instruction files.

Why it may matter:

- Agents can discover the documentation guidance, but they do not get a clear command for validating generated docs changes locally.

Opt-out wording:

If this kind of tool-generated feedback is not useful for the project, I can close this and avoid opening similar issues.

#### `redis/RedisInsight`

### Maintainer Contact Draft

Command:

```bash
agentfit eval --adapter dry-run --format markdown
```

Finding:

- `AGENTS.md` documents `yarn type-check:ui`, but the root `package.json` does not define `type-check:ui`.

Why it may matter:

- Agents following the root pre-commit guidance may run a command that fails immediately instead of the current package-local UI type check, `yarn --cwd redisinsight/ui type-check`.

Opt-out wording:

If this kind of tool-generated feedback is not useful for the project, I can close this and avoid opening similar issues.

#### `eggjs/egg`

### Maintainer Contact Draft

Command:

```bash
agentfit eval --adapter dry-run --format markdown
```

Finding:

- `.github/copilot-instructions.md` and `tegg/CLAUDE.md` document `pnpm run clean`, but the root `package.json` does not define a `clean` script.

Why it may matter:

- Agents following the documented validation workflow may run a command that fails immediately; the current root script list includes `clean-dist`, not `clean`.

Opt-out wording:

If this kind of tool-generated feedback is not useful for the project, I can close this and avoid opening similar issues.

Follow-up snapshots:

| Repository | Commit | Initial Result | After Product Fix | Triage |
| --- | --- | ---: | ---: | --- |
| `DataDog/lading` | `f06a75d` | 75/100 (C) | 83/100 (B) | AgentFit repo-local command false positive fixed in `5245bec`; no maintainer contact |
| `meltano/meltano` | `0dbb53e` | 83/100 (B) | 83/100 (B) | Python `uv`/`nox` command extraction improved; no maintainer contact |
| `SteeltoeOSS/Steeltoe` | `f4d5993` | 65/100 (D) | 83/100 (B) | AgentFit `.NET` command extraction false negative fixed locally; no maintainer contact |
| `callstackincubator/rozenite` | `60a157e` | 60/100 (D) | n/a | Minimal root `AGENTS.md` lacks verification/safety/repro guidance and nested scope coverage; no maintainer contact |

## Starter Candidate Seeds

These are seed candidates found through GitHub code search on 2026-05-11. They are not endorsements and they are not contact targets yet. Run AgentFit first, inspect the report, and contact maintainers only when the result is concrete and useful.

| Repository | Instruction Source | Stars | Updated | Stack | First Pass |
| --- | --- | ---: | --- | --- | --- |
| `pingcap/tidb` | `AGENTS.md` | 40076 | 2026-05-11 | Go | high-signal large monorepo |
| `appsmithorg/appsmith` | `.cursor/rules/*` | 39784 | 2026-05-11 | TypeScript | high-signal monorepo |
| `lerna/lerna` | `CLAUDE.md` | 36074 | 2026-05-09 | TypeScript | likely clear tooling docs |
| `statelyai/xstate` | `AGENTS.md` | 29590 | 2026-05-11 | TypeScript | high-visibility library |
| `gitbutlerapp/gitbutler` | `AGENTS.md` | 20793 | 2026-05-11 | Rust | active agent-aware repo |
| `eggjs/egg` | `AGENTS.md` | 19000 | 2026-05-10 | TypeScript | framework repo |
| `gnachman/iTerm2` | `CLAUDE.md` | 17528 | 2026-05-11 | Objective-C | mature desktop app |
| `kubernetes/kops` | `AGENTS.md` | 16610 | 2026-05-11 | Go | infrastructure repo |
| `umijs/qiankun` | `AGENTS.md` | 16601 | 2026-04-19 | TypeScript | established frontend repo |
| `javascript-obfuscator/javascript-obfuscator` | `CLAUDE.md` | 16024 | 2026-04-27 | TypeScript | focused library |
| `opf/openproject` | `AGENTS.md` | 15042 | 2026-05-11 | Ruby | large application |
| `spinnaker/spinnaker` | `AGENTS.md` | 9724 | 2026-05-09 | Java | multi-service platform |
| `redis/RedisInsight` | `.cursor/rules/*` | 8444 | 2026-05-11 | TypeScript | desktop/web app |
| `grafana/mimir` | `AGENTS.md` | 5085 | 2026-05-11 | Go | production infrastructure |
| `erigontech/erigon` | `agents.md` | 3565 | 2026-05-11 | Go | active infra repo |
| `projen/projen` | `.cursor/rules/*` | 2926 | 2026-05-11 | TypeScript | tooling repo |
| `Dart-Code/Dart-Code` | `AGENTS.md` | 1594 | 2026-05-11 | TypeScript | editor extension |
| `hashintel/hash` | `.cursor/rules/*` | 1561 | 2026-05-11 | Rust | complex product repo |
| `zapier/zapier-platform` | `.cursor/rules/*` | 496 | 2026-05-07 | JavaScript | smaller docs/tooling repo |
| `snyk/snyk-intellij-plugin` | `.cursor/rules/*` | 66 | 2026-05-11 | Kotlin | focused plugin repo |

Start with 5 diverse repositories before running the full list:

1. `statelyai/xstate`
2. `gitbutlerapp/gitbutler`
3. `lerna/lerna`
4. `redis/RedisInsight`
5. `grafana/mimir`

## Candidate Table

Track candidates before contacting anyone:

| Repository | Instruction Files | Stack | Shape | Score | Main Signal | Contact? |
| --- | --- | --- | --- | ---: | --- | --- |
| `statelyai/xstate` | `AGENTS.md`, `CLAUDE.md` | TypeScript | monorepo | 88 | summarized nested scope gaps | no |
| `gitbutlerapp/gitbutler` | `AGENTS.md`, Copilot | Rust | monorepo | 88 | summarized nested scope gaps | no |
| `lerna/lerna` | `CLAUDE.md` | TypeScript | monorepo | 88 | safety guardrail recognized after fix | no |
| `redis/RedisInsight` | `AGENTS.md`, Cursor, Copilot | TypeScript | desktop/web app | 85 | stale E2E command docs | yes, PR merged |
| `grafana/mimir` | `AGENTS.md`, `CLAUDE.md` | Go | monorepo | 93 | healthy instruction files | permission only |
| `projen/projen` | `AGENTS.md`, `CLAUDE.md`, Copilot | TypeScript | tooling repo | 93 | healthy instruction files | permission only |
| `Dart-Code/Dart-Code` | `AGENTS.md` | TypeScript | editor extension | 93 | healthy instruction file | permission only |
| `javascript-obfuscator/javascript-obfuscator` | `CLAUDE.md` | TypeScript | library | 85 -> 93 | optional alias examples flagged too hard, then fixed | no |
| `zapier/zapier-platform` | `CLAUDE.md`, Copilot | JavaScript | packages | 78 | broad scope/safety scoring | no |
| `snyk/snyk-intellij-plugin` | Cursor rules | Kotlin | plugin | 65 | no root contract / no verification command | no |
| `eggjs/egg` | `AGENTS.md`, `CLAUDE.md`, Copilot | TypeScript | framework monorepo | 65 -> 80 | decorator call false positive fixed; active upstream PR overlaps remaining command drift | no |
| `kubernetes/kops` | `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` | Go | infrastructure repo | 93 | healthy instruction files | permission only |
| `umijs/qiankun` | package `AGENTS.md` files | TypeScript | monorepo | 88 | summarized nested scope gaps | no |
| `erigontech/erigon` | `AGENTS.md`, `CLAUDE.md` | Go | infrastructure repo | 93 | healthy signal, but checkout required Git LFS caveat | no |
| `gnachman/iTerm2` | `AGENTS.md`, `CLAUDE.md` | Objective-C | desktop app | 93 | healthy instruction files | permission only |
| `pingcap/tidb` | `AGENTS.md`, `CLAUDE.md` | Go | large monorepo | 83 | broad reproducibility signal only | no |
| `appsmithorg/appsmith` | Cursor rules | TypeScript | application monorepo | 75 -> 83 | package-local command false positives cleared in `0.1.10` rerun | no |
| `opf/openproject` | `AGENTS.md`, `CLAUDE.md`, Copilot | Ruby/TypeScript | large application | 93 | healthy layered instruction files | permission only |
| `spinnaker/spinnaker` | `AGENTS.md`, `CLAUDE.md`, Copilot | Java/TypeScript | multi-service monorepo | 85 -> 93 | package-local command false positives cleared in `0.1.10` rerun | no |
| `hashintel/hash` | `AGENTS.md`, `CLAUDE.md`, Cursor | Rust/TypeScript | product monorepo | 80 -> 88 | package-local command false positives cleared in `0.1.10` rerun | no |

Use these labels:

- `actionable`: concrete finding a maintainer can verify quickly
- `healthy`: useful positive example, but no maintainer contact needed
- `noisy`: AgentFit output needs product work before public use
- `unsupported`: repo shape is not a good fit yet

## Snapshot Workflow

Run dry-run snapshots only at first:

```bash
mkdir -p /tmp/agentfit-real-world/reports
git clone --depth 1 https://github.com/OWNER/REPO.git /tmp/agentfit-real-world/REPO
cd /tmp/agentfit-real-world/REPO
npx @kingkyylian/agentfit@latest eval --adapter dry-run --format markdown --output /tmp/agentfit-real-world/reports/REPO.md --json-output /tmp/agentfit-real-world/reports/REPO.json
```

Record the commit:

```bash
git rev-parse --short HEAD
```

Use `--run-tasks` only after all of these are true:

- dependencies install cleanly
- generated tasks are harmless and bounded
- verification commands are local and deterministic
- the target repo is not production-connected by default
- the result is worth the extra risk

For launch validation, dry-run reports are enough unless the point being demonstrated requires command execution.

## Triage Rules

Open a maintainer issue only when the report has a specific, reproducible finding:

- documented command references a missing package script
- `@file` or similar instruction reference points to a missing file
- a clear nested workspace lacks local instructions
- safety or verification guidance is absent in a repo that asks agents to modify code

Do not contact maintainers for vague scores, broad style opinions, or findings that require them to understand AgentFit internals.

When the signal is noisy, create an AgentFit issue instead. Examples:

- monorepo scope detection flags too many generated packages
- command parser mistakes prose for a runnable command
- report wording is too hard to interpret
- healthy repos score lower than expected for unclear reasons

## Maintainer Contact Policy

Keep contact useful and sparse:

- one issue or message per repository
- no star requests
- no generic launch pitch
- include the exact command and top finding
- offer to close the issue if they do not want tool-generated feedback
- do not imply endorsement

Prefer opening an issue only after running AgentFit locally and confirming the finding is still present.

## Contact Log

| Date | Repository | Link | Reason | Outcome |
| --- | --- | --- | --- | --- |
| 2026-05-11 | `redis/RedisInsight` | https://github.com/redis/RedisInsight/issues/5887 | stale E2E commands in Cursor rules | closed after PR merge |
| 2026-05-11 | `redis/RedisInsight` | https://github.com/redis/RedisInsight/pull/5889 | fix stale E2E Cursor rule commands | merged |
| 2026-05-11 | `kingkyylian/agentfit` | https://github.com/kingkyylian/agentfit/issues/7 | noisy optional alias command checks | fixed locally |
| 2026-05-11 | `kingkyylian/agentfit` | https://github.com/kingkyylian/agentfit/issues/8 | noisy package-local command checks | fixed and released in `0.1.10` |
| 2026-05-11 | `kingkyylian/agentfit` | https://github.com/kingkyylian/agentfit/issues/9 | public repo suggestion funnel | open |

## No-Network Preview Plan

The validation target does not require knowing maintainers personally. Use a public, low-pressure funnel:

1. Run dry-run snapshots on public repos that already publish agent instructions.
2. Contact maintainers only for concrete, reproducible drift that can be checked in under five minutes.
3. Convert noisy findings into AgentFit product issues instead of external outreach.
4. Ask broadly for repo suggestions after the first 10 snapshots, not for stars.
5. Request permission before using healthy named reports as launch proof.

The first public preview should say: AgentFit ran 30 dry-run snapshots, found one real stale-command issue that became a merged upstream PR, kept additional maintainer-contact drafts local until approved, shipped two false-positive fixes in `0.1.8`, released the package-local command false-positive fix in `0.1.10`, and fixed another command-resolution false positive during the corpus pass. That is a stronger story than a generic launch pitch.

## Next Public Preview Queue

Use these only if another 5-10 snapshots are needed after the public repo-suggestion issue has had time to collect input:

| Repository | Why Next | Contact Threshold |
| --- | --- | --- |
| Suggested repos from issue #9 | direct user interest | concrete stale command or broken reference only |
| `pingcap/tidb` follow-up | broad reproducibility signal | no external contact without a narrower finding |
| `appsmithorg/appsmith` follow-up | package-local command parser fixture | rerun clean in `0.1.10`; no maintainer contact |
| `spinnaker/spinnaker` follow-up | package-local command parser fixture | rerun clean in `0.1.10`; no maintainer contact |
| `hashintel/hash` follow-up | package-local command parser fixture | rerun clean in `0.1.10`; no maintainer contact |
| `projen/projen` follow-up | healthy baseline candidate | permission request only |
| `grafana/mimir` follow-up | healthy baseline candidate | permission request only |
| `Dart-Code/Dart-Code` follow-up | healthy single-file baseline | permission request only |

## Issue Template

```text
Hi, I maintain AgentFit, a local-first checker for AGENTS.md / coding-agent instruction files.

I ran a dry-run snapshot on this repo because it already has agent instructions. It did not execute generated tasks or call model providers.

Command:
npx @kingkyylian/agentfit@latest eval --adapter dry-run --format markdown

Finding:
- <one concrete finding>

Why it may matter:
<one sentence explaining how a coding agent could be misled>

This may be useful as a quick docs/tooling cleanup. If tool-generated issues are not welcome here, feel free to close this and I will not follow up.
```

## Public Call Template

Use this before a broad launch:

```text
I am looking for 5-10 public repos that already use AGENTS.md, CLAUDE.md, Cursor rules, or Copilot instructions.

I will run AgentFit in dry-run mode and share the report if it finds concrete instruction drift: stale commands, missing references, or monorepo scope gaps.

No model-provider calls, no generated task execution, and no endorsement implied.

Repo: https://github.com/kingkyylian/agentfit
```

## Validation Sprint

One focused pass should be enough before public launch:

1. Find 30 candidate repositories.
2. Run dry-run snapshots on the best corpus candidates. Thirty are complete.
3. Keep 3-5 strong public examples.
4. Open maintainer issues for only the clearest actionable findings.
5. Convert false positives into AgentFit issues.
6. Update [real-world.md](real-world.md) with any snapshot that is useful, reproducible, and fair.
7. Use the strongest findings in the X, Hacker News, and Reddit posts from [launch-outreach.md](launch-outreach.md).

Success is not a star count. Success is at least three understandable reports, one maintainer response or repo suggestion, and one product improvement found before the larger launch.

## Sprint Logs

- [2026-05-11 initial validation sprint](validation-sprint-2026-05-11.md)
- [2026-05-15 search follow-up sprint](validation-sprint-2026-05-15.md)
- [2026-05-18 metadata corpus validation sprint](validation-sprint-2026-05-18.md)
