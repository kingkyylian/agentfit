# Validation Sprint: 2026-05-11

Initial real-world validation sprint for public repositories with existing agent instruction files. All runs used local AgentFit dry-run mode. Generated tasks were not executed and no model providers were called.

## Scope

Ten repositories from the starter candidate list in [real-world-validation.md](real-world-validation.md):

| Repository | Commit | Instruction Source | Result | Triage |
| --- | --- | --- | ---: | --- |
| `statelyai/xstate` | `fb3876f` | `AGENTS.md`, `CLAUDE.md` | 88/100 (B) | scope warning summarized |
| `gitbutlerapp/gitbutler` | `92ec892` | `AGENTS.md`, Copilot instructions | 88/100 (B) | scope warning summarized |
| `lerna/lerna` | `f4387d6` | `CLAUDE.md` | 88/100 (B) | safety signal fixed; scope warning remains |
| `redis/RedisInsight` | `94fab1d` | `AGENTS.md`, Cursor rules, Copilot instructions | 85/100 (B) | maintainer issue and PR opened |
| `grafana/mimir` | `f58ce6a0` | `AGENTS.md`, `CLAUDE.md` | 93/100 (A) | healthy example candidate |
| `projen/projen` | `b1186ce` | `AGENTS.md`, `CLAUDE.md`, Copilot instructions | 93/100 (A) | healthy example candidate |
| `Dart-Code/Dart-Code` | `075e4a2` | `AGENTS.md` | 93/100 (A) | healthy example candidate |
| `javascript-obfuscator/javascript-obfuscator` | `10c763f` | `CLAUDE.md` | 85/100 (B) | AgentFit product issue |
| `zapier/zapier-platform` | `6a3ffbf` | `CLAUDE.md`, Copilot instructions | 78/100 (C) | no maintainer contact |
| `snyk/snyk-intellij-plugin` | `2a8b015` | Cursor rules | 65/100 (D) | unsupported / low-signal |

## Product Issues Found And Fixed

The first run exposed false positives in AgentFit itself:

- Scoped package names such as `@xstate/store`, `@gitbutler/ui`, and `@kingkyylian/agentfit@latest` were treated as missing file references.
- Package-manager options such as `yarn --cwd tests/e2e test` and `pnpm --filter @scope/package test` were treated as missing package scripts.
- Vendored instruction files under `vendor/**` were counted as first-party instructions.
- Explicit safety boundaries in `CLAUDE.md`, such as "NEVER run versioning or publishing commands", were not counted as safety guardrails.
- Multiple monorepo scope warnings drove discoverability to zero and filled failed checks with repetitive package-level messages.

These were fixed before recording the final table:

- `src/core/references.ts` now requires explicit relative/absolute paths or file extensions for `@...` references.
- `src/core/static-checks.ts` now skips common package-manager options before extracting script names.
- `src/core/discovery.ts` now ignores `vendor/**` by default.
- `src/cli/commands/eval.ts` now recognizes explicit do-not-run and approval-gated safety language in any discovered instruction file.
- `src/core/scoring.ts` now caps root-covered monorepo scope penalties and summarizes multiple missing local instruction warnings.

Regression coverage was added in:

- `tests/unit/references.test.ts`
- `tests/unit/static-checks.test.ts`
- `tests/unit/discovery.test.ts`
- `tests/unit/cli-smoke.test.ts`
- `tests/unit/scoring.test.ts`

## Findings

### RedisInsight

AgentFit reported three concrete command issues in `.cursor/rules/e2e-testing.mdc`:

```text
Documented command references missing package script "test:main".
Documented command references missing package script "test:electron".
Documented command references missing package script "test:all".
```

This is the only first-batch maintainer contact candidate. Before opening an external issue, verify whether these scripts are intended to be root-level scripts or package-local scripts that AgentFit cannot yet resolve.

Follow-up verification confirmed the commands are stale at the repository root:

```text
npm run test:main     -> Missing script: "test:main"
npm run test:electron -> Missing script: "test:electron"
npm run test:all      -> Missing script: "test:all"
```

The likely current commands are package-local under `tests/e2e-playwright`: `npm test`, `npm run test:chromium`, and `npm run test:electron`.

Maintainer issue opened:

```text
https://github.com/redis/RedisInsight/issues/5887
```

The issue stayed narrow: stale E2E commands in Cursor rules, no star request, no full AgentFit report dump, and no implied endorsement.

The maintainer asked for a PR. PR opened and linked back to the issue:

```text
https://github.com/redis/RedisInsight/pull/5889
```

### Javascript Obfuscator

AgentFit reported missing package scripts from `CLAUDE.md`:

```text
test:options
test:analyzers
test:transformers
lint:transformers
lint:analyzers
lint:fix
```

Manual review showed the commands appear under "Creating Test Aliases (Optional)" and "Creating Lint Aliases (Optional)" sections. The scripts are not present in root `package.json`, but the surrounding prose frames them as optional aliases that can be added.

Do not contact the maintainer for this one. It is a product-quality issue for AgentFit command freshness: optional/example alias sections should be downgraded or marked informational instead of hard command errors.

AgentFit issue opened:

```text
https://github.com/kingkyylian/agentfit/issues/7
```

### Projen And Dart-Code

Both are healthy examples:

```text
projen/projen: 93/100 (A), no failed checks.
Dart-Code/Dart-Code: 93/100 (A), no failed checks.
```

Use them as internal confidence signals. Ask permission before naming them as public proof.

### Zapier Platform

AgentFit found a lower score driven by missing safety guardrails and nested package scope warnings:

```text
4 nested scopes do not have local instruction files.
Safety guardrails were not found.
```

This is not specific enough for maintainer contact. Keep it as an internal example of monorepo scope and safety scoring.

### Snyk IntelliJ Plugin

AgentFit found only a Cursor rule under `.cursor/rules/general.mdc`, no root-level instruction file, and no verification command. The score is low, but the signal is weak because the repo may not intend the Cursor rule to be a complete agent contract.

Classify as unsupported / low-signal for launch evidence.

### Mimir

After ignoring `vendor/**`, Mimir is a healthy example candidate:

```text
AgentFit score 93/100 (A).
Failed Checks: None.
```

Do not include it as a public named example until permission is requested or the project is referenced only as an internal validation signal.

### XState And GitButler

Both repos now have clean reference integrity. Remaining failures are summarized nested scope warnings across monorepo packages:

```text
XState: 14 nested scopes do not have local instruction files.
GitButler: 9 nested scopes do not have local instruction files.
```

These are no longer maintainer contact candidates. They are useful launch examples for how AgentFit reports root-covered monorepo scope gaps without making the score look broken.

### Lerna

Lerna's `CLAUDE.md` contains an explicit safety boundary:

```text
Claude should NEVER run versioning or publishing commands.
```

AgentFit now recognizes that as a safety guardrail. The score moved from 78/100 (C) to 88/100 (B). The remaining issue is a nested scope warning for `packages/lerna`.

## Next Actions

1. Monitor the RedisInsight PR for maintainer review.
2. Fix or triage AgentFit issue #7 before using optional-alias findings in public launch copy.
3. Use Mimir, Projen, and Dart-Code as healthy internal benchmarks, not public named examples unless permission is requested.
4. For public preview, lead with the demo and the RedisInsight-style failure mode rather than broad score claims.
