# Validation Sprint: 2026-05-11

Initial real-world validation sprint for public repositories with existing agent instruction files. All runs used local AgentFit dry-run mode. Generated tasks were not executed and no model providers were called.

## Scope

Five repositories from the starter candidate list in [real-world-validation.md](real-world-validation.md):

| Repository | Commit | Instruction Source | Result | Triage |
| --- | --- | --- | ---: | --- |
| `statelyai/xstate` | `fb3876f` | `AGENTS.md`, `CLAUDE.md` | 88/100 (B) | scope warning summarized |
| `gitbutlerapp/gitbutler` | `92ec892` | `AGENTS.md`, Copilot instructions | 88/100 (B) | scope warning summarized |
| `lerna/lerna` | `f4387d6` | `CLAUDE.md` | 88/100 (B) | safety signal fixed; scope warning remains |
| `redis/RedisInsight` | `94fab1d` | `AGENTS.md`, Cursor rules, Copilot instructions | 85/100 (B) | actionable candidate |
| `grafana/mimir` | `f58ce6a0` | `AGENTS.md`, `CLAUDE.md` | 93/100 (A) | healthy example candidate |

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

The likely current commands are package-local under `tests/e2e-playwright`: `npm test`, `npm run test:chromium`, and `npm run test:electron`. A maintainer issue draft is available in [redisinsight-issue-draft.md](redisinsight-issue-draft.md).

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

1. Ask before opening the RedisInsight maintainer issue.
2. Use Mimir as a healthy internal benchmark, not public launch copy yet.
3. Run a second validation batch after deciding whether to contact RedisInsight.
