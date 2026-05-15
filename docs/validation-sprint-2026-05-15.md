# Validation Sprint: 2026-05-15

Follow-up validation pass after the GitHub Community search-query suggestion. All runs use local AgentFit dry-run mode unless explicitly noted. Generated tasks are not executed and no model providers are called.

## Scope

The first pass used the 2026-05-15 search candidate scan from [real-world-validation.md](real-world-validation.md). The goal was to validate the new candidate discovery workflow before contacting anyone.

| Repository | Commit | Instruction Source | Initial Result | After Product Fix | Triage |
| --- | --- | --- | ---: | ---: | --- |
| `DataDog/lading` | `f06a75d` | `AGENTS.md` | 75/100 (C) | 83/100 (B) | AgentFit repo-local command false positive fixed |

## DataDog/lading

`DataDog/lading` was selected because it is a focused Rust load-testing tool with a compact root `AGENTS.md`. The first dry-run report was not a maintainer contact candidate. It exposed an AgentFit parser gap:

```text
No runnable verification command found in instruction files.
No verification command found in instruction files.
```

Manual review showed the instructions clearly document repo-local verification commands:

```text
ci/validate
ci/test
ci/kani <crate>
ci/check
ci/clippy
ci/fmt
```

AgentFit only recognized package-manager and common tool prefixes in inline backtick snippets, so it missed commands under repo-local directories such as `ci/`.

## Product Fix

The fix teaches command extraction to recognize repo-local verification commands under directories such as `ci/`, `scripts/`, `tools/`, and `bin/` when the command name carries verification, lint, build, or setup signal.

Commit:

```text
5245bec fix: detect repo-local verification commands
```

Regression coverage was added in:

- `tests/unit/command-extractor.test.ts`
- `tests/unit/static-checks.test.ts`

After the fix, the `DataDog/lading` dry-run report moved from:

```text
AgentFit score 75/100 (C).
Caps: no verification command found: max score 75
```

to:

```text
AgentFit score 83/100 (B).
Failed Checks: Safety guardrails were not found.
Caps: None.
Static Issues: None.
```

## Triage

- No maintainer contact.
- No external issue.
- Keep as internal proof that public dry-run validation can find AgentFit product fixes before broader launch.
- Continue the candidate queue with another dry-run-only target before deciding whether this belongs in a `0.1.11` release.

## Verification

- Command: `pnpm typecheck`
  - Result: passed.
- Command: `pnpm test`
  - Result: passed, 17 test files and 80 tests.
- Command: `pnpm lint`
  - Result: passed.
- Command: `pnpm build`
  - Result: passed.
- Command: `pnpm smoke:package`
  - Result: passed for `@kingkyylian/agentfit@0.1.10`.
- Command: `git diff --check`
  - Result: passed.
