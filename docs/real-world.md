# Real-World Examples

These are dry-run AgentFit snapshots from public open-source repositories that already contain agent instruction files. They are not endorsements or judgments of the projects. The goal is to show the kinds of signals AgentFit can surface without executing generated tasks.

New candidates should go through the corpus intake workflow in [real-world-validation.md](real-world-validation.md). The checked-in examples are report snapshots, not an instruction-file dataset.

Initial report examples were generated on 2026-05-07 with AgentFit 0.1.3. A 2026-05-11 validation sprint with AgentFit 0.1.8 is tracked in [validation-sprint-2026-05-11.md](validation-sprint-2026-05-11.md), and the 2026-05-18 metadata-corpus pass is tracked in [validation-sprint-2026-05-18.md](validation-sprint-2026-05-18.md). Additional dry-run snapshots were added on 2026-05-13 from local `main` after the signal-evidence reporting work.

Use [real-world-validation.md](real-world-validation.md) when adding more snapshots.

The 2026-05-18 sprint added thirty local dry-run snapshots from the metadata corpus. Fifteen are healthy internal baselines, nine have actionable instruction gaps that require local drafts before any maintainer contact, five were reviewed without contact, and one is a low-signal unsupported snapshot.

The 2026-05-21 public preview continuation mini-batch added four self-discovered dry-run snapshots after issue `#9` had no external suggestions yet. One is a healthy internal baseline, two are actionable local drafts, and one is a reviewed no-contact monorepo snapshot.

The 2026-05-22 public preview continuation mini-batch added three GitHub-code-search dry-run snapshots after issue `#9` still had no external suggestions. Two are reviewed no-contact monorepo snapshots, and one is an actionable local verification-guidance draft.

## Latest Validation Sprint

The 2026-05-18 metadata-corpus sprint completed the 30-candidate queue and produced:

- 30 reviewed dry-run snapshots
- 15 healthy internal baselines
- 9 actionable local maintainer-contact drafts
- 5 reviewed no-contact snapshots
- 1 unsupported low-signal snapshot
- 0 unresolved noisy AgentFit reports
- 3 AgentFit product fixes from corpus runs

The current corpus manifest now tracks 37 reviewed candidates after the 2026-05-22 continuation mini-batch:

- 16 healthy internal baselines
- 12 actionable local maintainer-contact drafts
- 8 reviewed no-contact snapshots
- 1 unsupported low-signal snapshot

All corpus runs were local dry runs. They did not call model providers, execute generated tasks, run real agent adapters, or open maintainer issues.

Do not publish named healthy examples without asking permission first. Use [validation-sprint-2026-05-18.md](validation-sprint-2026-05-18.md), [public-preview-summary-2026-05-19.md](public-preview-summary-2026-05-19.md), and [internal-launch-validation-summary-2026-05-19.md](internal-launch-validation-summary-2026-05-19.md) for launch planning.

## Prior Public Outcome

The 2026-05-11 sprint produced the clearest public maintainer outcome so far: one stale-command issue in RedisInsight Cursor rules, followed by a maintainer-requested PR that merged upstream.

That earlier sprint also found AgentFit false positives, including optional alias examples, TypeScript decorator calls, and package-local command freshness. Those fixes informed the later 30-candidate corpus pass.

| Repository | Language | Commit | Score | Main Signal |
| --- | --- | --- | ---: | --- |
| [hexlet-codebattle/codebattle](https://github.com/hexlet-codebattle/codebattle) | Elixir | `fd9ed72` | 80/100 (B) | Finds stale documented package scripts and a nested scope gap. |
| [Brendonovich/MacroGraph](https://github.com/Brendonovich/MacroGraph) | TypeScript | `c470082` | 73/100 (C) | Finds broad monorepo scope coverage gaps. |
| [skybrush-io/skybrush-server](https://github.com/skybrush-io/skybrush-server) | Python | `9920ca2` | 93/100 (A) | Finds a healthy single instruction file with no static failures. |
| [zapier/zapier-platform](https://github.com/zapier/zapier-platform) | JavaScript | `6a3ffbf` | 78/100 (C) | Finds four package scope gaps and missing safety guardrails. |
| [snyk/snyk-intellij-plugin](https://github.com/snyk/snyk-intellij-plugin) | Kotlin | `2a8b015` | 55/100 (F) | Finds only a Cursor rule, no root instruction contract, and no verification command. |
| [javascript-obfuscator/javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator) | TypeScript | `10c763f` | 83/100 (B) | Finds extensive reproducibility command guidance but no safety guardrails. |

## Reports

- [codebattle.md](../examples/reports/real-world/codebattle.md)
- [macrograph.md](../examples/reports/real-world/macrograph.md)
- [skybrush-server.md](../examples/reports/real-world/skybrush-server.md)
- [zapier-platform.md](../examples/reports/real-world/zapier-platform.md)
- [snyk-intellij-plugin.md](../examples/reports/real-world/snyk-intellij-plugin.md)
- [javascript-obfuscator.md](../examples/reports/real-world/javascript-obfuscator.md)
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
- [openproject.md](../examples/reports/real-world/openproject.md)
- [spinnaker.md](../examples/reports/real-world/spinnaker.md)
- [hash.md](../examples/reports/real-world/hash.md)
- [egg.md](../examples/reports/real-world/egg.md)
- [erigon.md](../examples/reports/real-world/erigon.md)
- [supabase-agent-skills.md](../examples/reports/real-world/supabase-agent-skills.md)
- [multica.md](../examples/reports/real-world/multica.md)
- [smithery-cli.md](../examples/reports/real-world/smithery-cli.md)
- [open-codesign.md](../examples/reports/real-world/open-codesign.md)
- [nuqs.md](../examples/reports/real-world/nuqs.md)
- [tinyhttp.md](../examples/reports/real-world/tinyhttp.md)
- [composer-patches-plugin.md](../examples/reports/real-world/composer-patches-plugin.md)

## Reproduce

Use the current package for new snapshots:

```bash
npx @kingkyylian/agentfit@latest eval --adapter dry-run --format markdown
```

Older checked-in examples preserve their original package versions for reproducibility. For example:

```bash
git clone --depth 1 https://github.com/hexlet-codebattle/codebattle.git /tmp/codebattle
cd /tmp/codebattle
npx @kingkyylian/agentfit@0.1.3 eval --adapter dry-run --format markdown
```

Use `--run-tasks` only after installing the target repository's dependencies and accepting that generated checks will execute in isolated worktrees.
