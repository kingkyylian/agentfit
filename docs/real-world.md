# Real-World Examples

These are dry-run AgentFit snapshots from public open-source repositories that already contain agent instruction files. They are not endorsements or judgments of the projects. The goal is to show the kinds of signals AgentFit can surface without executing generated tasks.

Initial report examples were generated on 2026-05-07 with AgentFit 0.1.3. A newer 2026-05-11 validation sprint with AgentFit 0.1.8 is tracked in [validation-sprint-2026-05-11.md](validation-sprint-2026-05-11.md).

Use [real-world-validation.md](real-world-validation.md) when adding more snapshots.

## Latest Validation Sprint

The 2026-05-11 sprint ran 20 dry-run snapshots and produced:

- one external maintainer issue for stale E2E commands in RedisInsight Cursor rules, fixed by a merged upstream PR
- two AgentFit false-positive fixes: optional alias examples and TypeScript decorator calls
- one open AgentFit product issue for package-local command freshness
- healthy internal baselines from Mimir, Projen, Dart-Code, Kops, iTerm2, and OpenProject

Do not publish named healthy examples without asking permission first. Use the sprint log for internal launch planning.

| Repository | Language | Commit | Score | Main Signal |
| --- | --- | --- | ---: | --- |
| [hexlet-codebattle/codebattle](https://github.com/hexlet-codebattle/codebattle) | Elixir | `fd9ed72` | 80/100 (B) | Finds stale documented package scripts and a nested scope gap. |
| [Brendonovich/MacroGraph](https://github.com/Brendonovich/MacroGraph) | TypeScript | `c470082` | 73/100 (C) | Finds broad monorepo scope coverage gaps. |
| [skybrush-io/skybrush-server](https://github.com/skybrush-io/skybrush-server) | Python | `9920ca2` | 93/100 (A) | Finds a healthy single instruction file with no static failures. |

## Reports

- [codebattle.md](../examples/reports/real-world/codebattle.md)
- [macrograph.md](../examples/reports/real-world/macrograph.md)
- [skybrush-server.md](../examples/reports/real-world/skybrush-server.md)

## Reproduce

```bash
git clone --depth 1 https://github.com/hexlet-codebattle/codebattle.git /tmp/codebattle
cd /tmp/codebattle
npx @kingkyylian/agentfit@0.1.3 eval --adapter dry-run --format markdown
```

Use `--run-tasks` only after installing the target repository's dependencies and accepting that generated checks will execute in isolated worktrees.
