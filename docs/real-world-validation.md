# Real-World Validation

AgentFit does not need a private network for early feedback. It needs a small set of public repositories where agent instruction files already exist and a repeatable process for finding useful signal without spamming maintainers.

## Goal

Collect 10-20 dry-run snapshots from public repositories and turn them into one of three outputs:

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

Use GitHub code search first:

```text
path:AGENTS.md
path:CLAUDE.md
path:.cursor/rules
path:.github/copilot-instructions.md
"pnpm" path:AGENTS.md
"monorepo" path:AGENTS.md
"run tests" path:CLAUDE.md
"packages/" path:AGENTS.md
"apps/" path:AGENTS.md
```

Then prioritize manually by activity, repo size, instruction-file substance, and whether the report would be understandable to an outside maintainer.

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
| `redis/RedisInsight` | `AGENTS.md`, Cursor, Copilot | TypeScript | desktop/web app | 85 | stale E2E command docs | yes, opened |
| `grafana/mimir` | `AGENTS.md`, `CLAUDE.md` | Go | monorepo | 93 | healthy instruction files | permission only |
| `projen/projen` | `AGENTS.md`, `CLAUDE.md`, Copilot | TypeScript | tooling repo | 93 | healthy instruction files | permission only |
| `Dart-Code/Dart-Code` | `AGENTS.md` | TypeScript | editor extension | 93 | healthy instruction file | permission only |
| `javascript-obfuscator/javascript-obfuscator` | `CLAUDE.md` | TypeScript | library | 85 | optional alias examples flagged too hard | no, AgentFit issue |
| `zapier/zapier-platform` | `CLAUDE.md`, Copilot | JavaScript | packages | 78 | broad scope/safety scoring | no |
| `snyk/snyk-intellij-plugin` | Cursor rules | Kotlin | plugin | 65 | no root contract / no verification command | no |

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
| 2026-05-11 | `redis/RedisInsight` | https://github.com/redis/RedisInsight/issues/5887 | stale E2E commands in Cursor rules | open |
| 2026-05-11 | `kingkyylian/agentfit` | https://github.com/kingkyylian/agentfit/issues/7 | noisy optional alias command checks | open |

## No-Network Preview Plan

The 10-20 validation target does not require knowing maintainers personally. Use a public, low-pressure funnel:

1. Run dry-run snapshots on public repos that already publish agent instructions.
2. Contact maintainers only for concrete, reproducible drift that can be checked in under five minutes.
3. Convert noisy findings into AgentFit product issues instead of external outreach.
4. Ask broadly for repo suggestions after the first 10 snapshots, not for stars.
5. Request permission before using healthy named reports as launch proof.

The first public preview should say: AgentFit found one real stale-command issue, one product false-positive class, and several healthy instruction files. That is a stronger story than a generic launch pitch.

## Next Public Preview Queue

Use these only if another 5-10 snapshots are needed before the broader launch:

| Repository | Why Next | Contact Threshold |
| --- | --- | --- |
| `pingcap/tidb` | large Go monorepo with `AGENTS.md` | concrete stale command or broken reference only |
| `appsmithorg/appsmith` | active TypeScript monorepo with Cursor rules | concrete stale command or broken reference only |
| `eggjs/egg` | framework repo with agent instructions | concrete stale command only |
| `kubernetes/kops` | infrastructure repo with `AGENTS.md` | concrete stale command or missing referenced file only |
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
2. Run dry-run snapshots on the best 10-20.
3. Keep 3-5 strong public examples.
4. Open maintainer issues for only the clearest actionable findings.
5. Convert false positives into AgentFit issues.
6. Update [real-world.md](real-world.md) with any snapshot that is useful, reproducible, and fair.
7. Use the strongest findings in the X, Hacker News, and Reddit posts from [launch-outreach.md](launch-outreach.md).

Success is not a star count. Success is at least three understandable reports, one maintainer response or repo suggestion, and one product improvement found before the larger launch.

## Sprint Logs

- [2026-05-11 initial validation sprint](validation-sprint-2026-05-11.md)
