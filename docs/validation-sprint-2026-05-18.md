# Validation Sprint: 2026-05-18

Corpus validation pass for the metadata-only real-world candidate workflow. All runs used local AgentFit dry-run mode from this repository. Generated tasks were not executed, no real adapter was selected, and no maintainer contact was made.

## Scope

The sprint used the first fifteen repositories from the 30-candidate corpus queue in [real-world-validation.md](real-world-validation.md). The goal was to verify that the corpus workflow can move from metadata queue to checked-in report snapshots with clear triage.

| Repository | Commit | Instruction Source | Result | Triage |
| --- | --- | --- | ---: | --- |
| `meltano/meltano` | `fe921ef` | `AGENTS.md`, `CLAUDE.md` | 83/100 (B) | healthy |
| `enso-org/enso` | `f364fe2` | `CLAUDE.md` | 83/100 (B) | healthy |
| `SteeltoeOSS/Steeltoe` | `f4d5993` | `AGENTS.md` | 83/100 (B) | healthy |
| `callstackincubator/rozenite` | `3a77ccf` | `AGENTS.md` | 60/100 (D) | actionable |
| `mathertel/OneButton` | `9489276` | `copilot-instructions.md` | 65/100 (D) | actionable |
| `dusk-network/rusk` | `5487124` | `agents.md`, `CLAUDE.md` | 93/100 (A) | healthy |
| `NikolayS/postgres_dba` | `455c2f6` | `CLAUDE.md`, Cursor rules | 65/100 (D) | actionable |
| `numerai/example-scripts` | `a35d11c` | `AGENTS.md` | 65/100 (D) | actionable |
| `econ-ark/HARK` | `2690850` | `AGENTS.md` | 65/100 (D) | actionable |
| `IOBR/IOBR` | `2cb9be5` | `CLAUDE.md`, `copilot-instructions.md` | 65/100 (D) | actionable |
| `DataDog/lading` | `f06a75d` | `AGENTS.md` | 83/100 (B) | healthy |
| `percona/psmdb-docs` | `8b048bc` | `copilot-instructions.md` | 65/100 (D) | actionable |
| `statelyai/xstate` | `d7fb9c6` | `AGENTS.md`, `CLAUDE.md` | 78/100 (C) | snapshotted |
| `gitbutlerapp/gitbutler` | `5235412` | `AGENTS.md`, Copilot instructions | 78/100 (C) | snapshotted |
| `lerna/lerna` | `f4387d6` | `CLAUDE.md` | 88/100 (B) | healthy |

## Report Outputs

The reviewed dry-run reports are checked in under `examples/reports/real-world`:

- [meltano.md](../examples/reports/real-world/meltano.md)
- [enso.md](../examples/reports/real-world/enso.md)
- [steeltoe.md](../examples/reports/real-world/steeltoe.md)
- [rozenite.md](../examples/reports/real-world/rozenite.md)
- [onebutton.md](../examples/reports/real-world/onebutton.md)
- [rusk.md](../examples/reports/real-world/rusk.md)
- [postgres-dba.md](../examples/reports/real-world/postgres-dba.md)
- [numerai-example-scripts.md](../examples/reports/real-world/numerai-example-scripts.md)
- [hark.md](../examples/reports/real-world/hark.md)
- [iobr.md](../examples/reports/real-world/iobr.md)
- [lading.md](../examples/reports/real-world/lading.md)
- [psmdb-docs.md](../examples/reports/real-world/psmdb-docs.md)
- [xstate.md](../examples/reports/real-world/xstate.md)
- [gitbutler.md](../examples/reports/real-world/gitbutler.md)
- [lerna.md](../examples/reports/real-world/lerna.md)

The matching JSON reports are checked in beside each Markdown report for repeatable summary extraction.

## Findings

### Healthy Baselines

Meltano, Enso, and Steeltoe each scored 83/100 with one broad failed check:

```text
Safety guardrails were not found.
```

Rusk scored 93/100 with no failed checks. It is an internal baseline for lowercase `agents.md` discovery plus layered `CLAUDE.md` handling.

Lading scored 83/100 with the same broad safety-only signal as Meltano, Enso, and Steeltoe. Lerna scored 88/100 after a local AgentFit command-resolution fix, with only one package-scope warning remaining.

These are not maintainer-contact candidates. They are internal baselines showing that AgentFit can discover instruction files and command guidance across Python, Java, C#, Rust, and TypeScript repositories without producing stale-command or broken-reference findings after product-noise fixes.

Do not use these repository names in public launch copy without explicit permission.

### Rozenite

Rozenite scored 60/100. The report found one root `AGENTS.md`, generated deterministic dry-run task previews, and reported:

```text
28 nested scopes do not have local instruction files.
No runnable verification command found in instruction files.
Safety guardrails were not found.
Reproducibility instructions were not found.
No verification command found in instruction files.
```

The maintainer-contact draft stays local in [real-world-validation.md](real-world-validation.md). Do not open an issue without explicit approval.

### OneButton

OneButton scored 65/100. The report found one Copilot instruction file and reported:

```text
No runnable verification command found in instruction files.
Safety guardrails were not found.
Reproducibility instructions were not found.
No verification command found in instruction files.
```

The maintainer-contact draft stays local in [real-world-validation.md](real-world-validation.md). Do not open an issue without explicit approval.

### Batch 2 Verification Gaps

Postgres DBA, Numerai example-scripts, HARK, and IOBR each scored 65/100. The common failed checks were:

```text
No runnable verification command found in instruction files.
Safety guardrails were not found.
Reproducibility instructions were not found.
No verification command found in instruction files.
```

These are actionable only as local maintainer-contact drafts. Do not open issues without explicit approval.

### Batch 3 Review

Psmdb Docs scored 65/100 with the same verification/safety/reproducibility guidance gaps as the actionable Batch 2 reports. Its maintainer-contact draft stays local.

XState and GitButler are reviewed snapshots with no maintainer contact. Their remaining findings are broad package-scope and safety guidance coverage, not concrete stale-command or broken-reference findings.

## Product Issues Found And Fixed

Batch 3 exposed two AgentFit command-resolution false positives:

- Lerna's global common commands were incorrectly resolved against `/__fixtures__/package.json` because an older path-bearing sibling heading leaked into a later unscoped command section.
- GitButler's `pnpm build:sdk` command in `crates/AGENTS.md` was incorrectly resolved against `crates/package.json` even though the root package defines the workspace script.

Regression coverage was added in `tests/unit/static-checks.test.ts`, and both reports were regenerated after the fixes.

## Decision

The sprint produced:

- 30 total corpus candidates.
- 15 reviewed dry-run snapshots.
- 6 healthy internal baselines.
- 7 actionable local maintainer-contact drafts.
- 2 snapshotted no-contact reports.
- 0 unresolved noisy AgentFit reports.
- 2 product fixes applied from Batch 3.

Next action should be one of:

- ask for approval before opening any actionable maintainer issue,
- continue with Batch 4 dry-run snapshots,
- prepare an internal launch-validation summary that does not name healthy examples as endorsements.

## Verification

- Command: `rtk pnpm typecheck`
  - Result: passed.
- Command: `rtk pnpm test`
  - Result: passed, 18 test files and 98 tests.
- Command: `rtk pnpm lint`
  - Result: passed.
- Command: `rtk pnpm build`
  - Result: passed.
- Command: `rtk pnpm smoke:package`
  - Result: passed for `@kingkyylian/agentfit@0.1.12`.
- Command: `rtk pnpm corpus:check`
  - Result: passed.
- Command: `rtk node dist/index.js corpus --limit 10`
  - Result: printed the first ten corpus entries, with four `healthy` and six `actionable` entries.
