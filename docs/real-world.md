# Real-World Examples

These are dry-run AgentFit snapshots from public open-source repositories that already contain agent instruction files. They are not endorsements or judgments of the projects. The goal is to show the kinds of signals AgentFit can surface without executing generated tasks.

Generated on 2026-05-07 with AgentFit 0.1.2.

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
npx @kingkyylian/agentfit@0.1.2 eval --adapter dry-run --format markdown
```

Use `--run-tasks` only after installing the target repository's dependencies and accepting that generated checks will execute in isolated worktrees.
