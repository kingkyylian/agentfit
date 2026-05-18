# Validation Sprint: 2026-05-18

Corpus validation pass for the metadata-only real-world candidate workflow. All runs used local AgentFit dry-run mode from this repository. Generated tasks were not executed, no real adapter was selected, and no maintainer contact was made.

## Scope

The sprint used the first twenty-five repositories from the 30-candidate corpus queue in [real-world-validation.md](real-world-validation.md). The goal was to verify that the corpus workflow can move from metadata queue to checked-in report snapshots with clear triage.

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
| `redis/RedisInsight` | `57caf95` | `AGENTS.md`, Cursor rules, Copilot instructions | 85/100 (B) | actionable |
| `grafana/mimir` | `f1497c22` | `AGENTS.md`, `CLAUDE.md` | 83/100 (B) | healthy |
| `pingcap/tidb` | `2ce45f0` | `AGENTS.md`, `CLAUDE.md` | 93/100 (A) | healthy |
| `appsmithorg/appsmith` | `a128a3e` | Cursor rules | 73/100 (C) | snapshotted |
| `javascript-obfuscator/javascript-obfuscator` | `10c763f` | `CLAUDE.md` | 83/100 (B) | healthy |
| `zapier/zapier-platform` | `345765a` | `CLAUDE.md`, Cursor rules, Copilot instructions | 78/100 (C) | snapshotted |
| `snyk/snyk-intellij-plugin` | `852d824` | Cursor rules | 55/100 (F) | unsupported |
| `projen/projen` | `454253c` | `AGENTS.md`, `CLAUDE.md`, Cursor rules, Copilot instructions | 83/100 (B) | healthy |
| `Dart-Code/Dart-Code` | `7cf2598` | `AGENTS.md` | 83/100 (B) | healthy |
| `kubernetes/kops` | `dfcdbd09` | `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` | 83/100 (B) | healthy |

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
- [redisinsight.md](../examples/reports/real-world/redisinsight.md)
- [mimir.md](../examples/reports/real-world/mimir.md)
- [tidb.md](../examples/reports/real-world/tidb.md)
- [appsmith.md](../examples/reports/real-world/appsmith.md)
- [javascript-obfuscator-batch4.md](../examples/reports/real-world/javascript-obfuscator-batch4.md)
- [zapier-platform-batch5.md](../examples/reports/real-world/zapier-platform-batch5.md)
- [snyk-intellij-plugin-batch5.md](../examples/reports/real-world/snyk-intellij-plugin-batch5.md)
- [projen.md](../examples/reports/real-world/projen.md)
- [dart-code.md](../examples/reports/real-world/dart-code.md)
- [kops.md](../examples/reports/real-world/kops.md)

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

### Batch 4 Review

RedisInsight scored 85/100. The report found strong safety and reproducibility guidance, but surfaced one concrete command drift:

```text
Documented command references missing package script "type-check:ui".
```

Manual review confirmed the root package defines `type-check`, while the UI package defines `type-check`; no root `type-check:ui` script exists. The current documented equivalent is `yarn --cwd redisinsight/ui type-check`. This stays as a local maintainer-contact draft only.

Mimir and JavaScript Obfuscator each scored 83/100 with only broad safety guardrail findings. TiDB scored 93/100 with no failed checks. These are healthy internal baselines; do not name them publicly without permission.

Appsmith scored 73/100 with a Cursor-only root-contract signal and broad safety guidance gap:

```text
No root-level instruction file was discovered.
Safety guardrails were not found.
```

No package-local command false positive reappeared, so this remains a reviewed no-contact snapshot.

### Batch 5 Review

Zapier Platform scored 78/100 with no stale-command or broken-reference findings. Its remaining findings are broad package-scope and safety coverage:

```text
4 nested scopes do not have local instruction files.
Safety guardrails were not found.
```

Snyk IntelliJ Plugin scored 55/100 from one Cursor rule and no root instruction contract. This remains unsupported / low-signal for launch evidence rather than a maintainer-contact candidate.

Projen, Dart-Code, and Kops each scored 83/100. They all have clean reference integrity and useful reproducibility signal; their only failed check is the broad safety guardrail finding. Treat them as healthy internal baselines, not public named examples without permission.

## Product Issues Found And Fixed

Batch 3 exposed two AgentFit command-resolution false positives:

- Lerna's global common commands were incorrectly resolved against `/__fixtures__/package.json` because an older path-bearing sibling heading leaked into a later unscoped command section.
- GitButler's `pnpm build:sdk` command in `crates/AGENTS.md` was incorrectly resolved against `crates/package.json` even though the root package defines the workspace script.

Regression coverage was added in `tests/unit/static-checks.test.ts`, and both reports were regenerated after the fixes.

Batch 4 did not expose a new AgentFit product bug. The RedisInsight command finding was manually checked against root and package-local scripts and appears to be real instruction drift.

Batch 5 did not expose a new AgentFit product bug. The low Snyk score reflects a Cursor-only instruction shape, and the other findings are broad safety or package-scope signals.

## Decision

The sprint produced:

- 30 total corpus candidates.
- 25 reviewed dry-run snapshots.
- 12 healthy internal baselines.
- 8 actionable local maintainer-contact drafts.
- 4 snapshotted no-contact reports.
- 1 unsupported low-signal report.
- 0 unresolved noisy AgentFit reports.
- 2 product fixes applied from Batch 3.

Next action should be one of:

- ask for approval before opening any actionable maintainer issue,
- continue with Batch 6 dry-run snapshots,
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
- Command: `rtk node dist/index.js corpus --limit 25`
  - Result: printed the first twenty-five corpus entries, with twelve `healthy`, eight `actionable`, four `snapshotted`, and one `unsupported` entry.
