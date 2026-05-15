# Validation Sprint: 2026-05-15

Follow-up validation pass after the GitHub Community search-query suggestion. All runs use local AgentFit dry-run mode unless explicitly noted. Generated tasks are not executed and no model providers are called.

## Scope

The first pass used the 2026-05-15 search candidate scan from [real-world-validation.md](real-world-validation.md). The goal was to validate the new candidate discovery workflow before contacting anyone.

| Repository | Commit | Instruction Source | Initial Result | After Product Fix | Triage |
| --- | --- | --- | ---: | ---: | --- |
| `DataDog/lading` | `f06a75d` | `AGENTS.md` | 75/100 (C) | 83/100 (B) | AgentFit repo-local command false positive fixed |
| `meltano/meltano` | `0dbb53e` | `AGENTS.md`, `CLAUDE.md` | 83/100 (B) | 83/100 (B) | Python `uv`/`nox` command extraction improved |

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

## Meltano

`meltano/meltano` was selected because it is an active Python data tooling repo with concise root `AGENTS.md` guidance and both `AGENTS.md` and `CLAUDE.md` present.

The first dry-run report scored `83/100 (B)` with only the broad safety-guardrail finding remaining. It was not a maintainer contact candidate. Manual review showed another AgentFit command-extraction gap: the report only recognized a prose `pytest` mention and missed the concrete Python task-runner commands:

```text
uv sync --all-extras --all-groups
uv run pytest tests/path/to/test.py::test_function
nox -t test
nox -s pytest
nox -t lint
nox -s typing
```

The product fix adds modern Python task-runner prefixes and classification terms for `uv`, `nox`, `ruff`, `mypy`, and `ty`. After the fix, the score stayed `83/100 (B)`, but the report extracted 17 command snippets and surfaced setup, test, lint, and build evidence from the actual instruction commands instead of relying on a prose tool mention.

Triage:

- No maintainer contact.
- No external issue.
- Keep as internal proof that validation reports need command extraction depth, not just final score movement.

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
