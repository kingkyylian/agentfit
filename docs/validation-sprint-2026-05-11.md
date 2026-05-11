# Validation Sprint: 2026-05-11

Initial real-world validation sprint for public repositories with existing agent instruction files. All runs used local AgentFit dry-run mode. Generated tasks were not executed and no model providers were called.

## Scope

Five repositories from the starter candidate list in [real-world-validation.md](real-world-validation.md):

| Repository | Commit | Instruction Source | Result | Triage |
| --- | --- | --- | ---: | --- |
| `statelyai/xstate` | `fb3876f` | `AGENTS.md`, `CLAUDE.md` | 73/100 (C) | noisy scope signal |
| `gitbutlerapp/gitbutler` | `92ec892` | `AGENTS.md`, Copilot instructions | 73/100 (C) | noisy scope signal |
| `lerna/lerna` | `f4387d6` | `CLAUDE.md` | 88/100 (B) | safety signal fixed; scope warning remains |
| `redis/RedisInsight` | `94fab1d` | `AGENTS.md`, Cursor rules, Copilot instructions | 85/100 (B) | actionable candidate |
| `grafana/mimir` | `f58ce6a0` | `AGENTS.md`, `CLAUDE.md` | 93/100 (A) | healthy example candidate |

## Product Issues Found And Fixed

The first run exposed false positives in AgentFit itself:

- Scoped package names such as `@xstate/store`, `@gitbutler/ui`, and `@kingkyylian/agentfit@latest` were treated as missing file references.
- Package-manager options such as `yarn --cwd tests/e2e test` and `pnpm --filter @scope/package test` were treated as missing package scripts.
- Vendored instruction files under `vendor/**` were counted as first-party instructions.
- Explicit safety boundaries in `CLAUDE.md`, such as "NEVER run versioning or publishing commands", were not counted as safety guardrails.

These were fixed before recording the final table:

- `src/core/references.ts` now requires explicit relative/absolute paths or file extensions for `@...` references.
- `src/core/static-checks.ts` now skips common package-manager options before extracting script names.
- `src/core/discovery.ts` now ignores `vendor/**` by default.
- `src/cli/commands/eval.ts` now recognizes explicit do-not-run and approval-gated safety language in any discovered instruction file.

Regression coverage was added in:

- `tests/unit/references.test.ts`
- `tests/unit/static-checks.test.ts`
- `tests/unit/discovery.test.ts`
- `tests/unit/cli-smoke.test.ts`

## Findings

### RedisInsight

AgentFit reported three concrete command issues in `.cursor/rules/e2e-testing.mdc`:

```text
Documented command references missing package script "test:main".
Documented command references missing package script "test:electron".
Documented command references missing package script "test:all".
```

This is the only first-batch maintainer contact candidate. Before opening an external issue, verify whether these scripts are intended to be root-level scripts or package-local scripts that AgentFit cannot yet resolve.

### Mimir

After ignoring `vendor/**`, Mimir is a healthy example candidate:

```text
AgentFit score 93/100 (A).
Failed Checks: None.
```

Do not include it as a public named example until permission is requested or the project is referenced only as an internal validation signal.

### XState And GitButler

Both repos now have clean reference integrity. Remaining failures are nested scope warnings across monorepo packages.

Treat these as product signal before maintainer signal. Root-level instructions may intentionally cover many packages, so AgentFit needs a better way to distinguish missing local instructions from acceptable root coverage.

### Lerna

Lerna's `CLAUDE.md` contains an explicit safety boundary:

```text
Claude should NEVER run versioning or publishing commands.
```

AgentFit now recognizes that as a safety guardrail. The score moved from 78/100 (C) to 88/100 (B). The remaining issue is a nested scope warning for `packages/lerna`.

## Next Actions

1. Add a scoring or reporting refinement for monorepos where root instructions intentionally cover many packages.
2. Re-run the same five repositories after the monorepo scope refinement.
3. Ask before opening the RedisInsight maintainer issue.
4. Use Mimir as a healthy internal benchmark, not public launch copy yet.
