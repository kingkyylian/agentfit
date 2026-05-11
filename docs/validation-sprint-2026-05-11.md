# Validation Sprint: 2026-05-11

Real-world validation sprint for public repositories with existing agent instruction files. All runs used local AgentFit dry-run mode. Generated tasks were not executed and no model providers were called.

## Scope

Fifteen repositories from the starter candidate list in [real-world-validation.md](real-world-validation.md):

| Repository | Commit | Instruction Source | Result | Triage |
| --- | --- | --- | ---: | --- |
| `statelyai/xstate` | `fb3876f` | `AGENTS.md`, `CLAUDE.md` | 88/100 (B) | scope warning summarized |
| `gitbutlerapp/gitbutler` | `92ec892` | `AGENTS.md`, Copilot instructions | 88/100 (B) | scope warning summarized |
| `lerna/lerna` | `f4387d6` | `CLAUDE.md` | 88/100 (B) | safety signal fixed; scope warning remains |
| `redis/RedisInsight` | `94fab1d` | `AGENTS.md`, Cursor rules, Copilot instructions | 85/100 (B) | maintainer issue and PR merged |
| `grafana/mimir` | `f58ce6a0` | `AGENTS.md`, `CLAUDE.md` | 93/100 (A) | healthy example candidate |
| `projen/projen` | `b1186ce` | `AGENTS.md`, `CLAUDE.md`, Copilot instructions | 93/100 (A) | healthy example candidate |
| `Dart-Code/Dart-Code` | `075e4a2` | `AGENTS.md` | 93/100 (A) | healthy example candidate |
| `javascript-obfuscator/javascript-obfuscator` | `10c763f` | `CLAUDE.md` | 85 -> 93 | AgentFit product issue fixed |
| `zapier/zapier-platform` | `6a3ffbf` | `CLAUDE.md`, Copilot instructions | 78/100 (C) | no maintainer contact |
| `snyk/snyk-intellij-plugin` | `2a8b015` | Cursor rules | 65/100 (D) | unsupported / low-signal |
| `eggjs/egg` | `0dec2c9` | `AGENTS.md`, `CLAUDE.md`, Copilot instructions | 65 -> 80 | AgentFit decorator false positive fixed; upstream PR overlaps remaining command drift |
| `kubernetes/kops` | `bdd8be4` | `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` | 93/100 (A) | healthy example candidate |
| `umijs/qiankun` | `8f386c3` | `AGENTS.md`, package instructions | 88/100 (B) | scope warning summarized |
| `erigontech/erigon` | `ddf60f0` | `AGENTS.md`, `CLAUDE.md` | 93/100 (A) | healthy signal with Git LFS checkout caveat |
| `gnachman/iTerm2` | `e867712` | `AGENTS.md`, `CLAUDE.md` | 93/100 (A) | healthy example candidate |

## Product Issues Found And Fixed

The first run exposed false positives in AgentFit itself:

- Scoped package names such as `@xstate/store`, `@gitbutler/ui`, and `@kingkyylian/agentfit@latest` were treated as missing file references.
- Package-manager options such as `yarn --cwd tests/e2e test` and `pnpm --filter @scope/package test` were treated as missing package scripts.
- Vendored instruction files under `vendor/**` were counted as first-party instructions.
- Explicit safety boundaries in `CLAUDE.md`, such as "NEVER run versioning or publishing commands", were not counted as safety guardrails.
- Multiple monorepo scope warnings drove discoverability to zero and filled failed checks with repetitive package-level messages.
- TypeScript decorator calls such as `@Hello(HelloType.FOO)` were treated as missing `@file` references because the parser saw `.FOO` as a file extension.

These were fixed before recording the final table:

- `src/core/references.ts` now requires explicit relative/absolute paths or file extensions for `@...` references.
- `src/core/static-checks.ts` now skips common package-manager options before extracting script names.
- `src/core/discovery.ts` now ignores `vendor/**` by default.
- `src/cli/commands/eval.ts` now recognizes explicit do-not-run and approval-gated safety language in any discovered instruction file.
- `src/core/scoring.ts` now caps root-covered monorepo scope penalties and summarizes multiple missing local instruction warnings.
- `src/core/references.ts` now rejects call/decorator tokens with parentheses before treating an `@...` token as a file reference.

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

The maintainer asked for a PR. PR opened, linked back to the issue, and was merged on 2026-05-11:

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

The fix teaches command freshness checks to ignore package script commands when they are presented as optional alias examples. Re-running the snapshot after the fix moves the report to:

```text
AgentFit score 93/100 (A).
Failed Checks: None.
```

### Egg

AgentFit initially reported one real command issue and one AgentFit false positive in `tegg/CLAUDE.md`:

```text
Documented command references missing package script "clean".
Referenced file does not exist: Hello(HelloType.FOO
```

Manual command verification confirmed that `pnpm run clean` is not a root package script and `pnpm --filter @eggjs/tegg-runtime run clean` also has no matching package script. `pnpm run clean-dist` is the closest root script.

The reference finding was an AgentFit bug. `@Hello(HelloType.FOO)` is a TypeScript decorator call, not an instruction import. After the parser fix, Egg moved from:

```text
AgentFit score 65/100 (D).
Reference integrity: 0/15.
```

to:

```text
AgentFit score 80/100 (B).
Reference integrity: 15/15.
```

Do not open a maintainer issue for Egg right now. Upstream PR `eggjs/egg#5935` already reorganizes agent instructions and appears to remove or relocate the stale `pnpm` guidance, so a new external issue would likely duplicate active work.

### Kops, iTerm2, And Erigon

Kops and iTerm2 are healthy internal examples:

```text
kubernetes/kops: 93/100 (A), no failed checks.
gnachman/iTerm2: 93/100 (A), no failed checks.
```

Erigon also reported 93/100 with no failed checks, but the clone required a Git LFS-smudge-disabled checkout. Keep it as an internal signal only unless it is re-run from a clean LFS-capable checkout.

### Qiankun

Qiankun has clean command and reference integrity. The remaining finding is a summarized monorepo scope warning:

```text
3 nested scopes do not have local instruction files.
```

This is not specific enough for maintainer contact. Keep it as another root-covered monorepo scope example.

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

1. Include the optional-alias and decorator-reference fixes in the next patch release before using those results in public launch copy.
2. Use Mimir, Projen, Dart-Code, Kops, and iTerm2 as healthy internal benchmarks, not public named examples unless permission is requested.
3. For public preview, lead with the demo and the merged RedisInsight fix rather than broad score claims.
