# Launch Plan

## Positioning

AgentFit answers one question: is this repository actually ready for coding agents?

The hook is empirical evaluation instead of another instruction-file checklist. Agent instruction files are code. Test them.

## 60-Second Demo

1. Start in a repository with `AGENTS.md`.
2. Run:

```bash
npx agentfit eval --adapter dry-run
```

3. Show discovered instruction files, command checks, reference issues, and the final score.
4. Open the Markdown report.
5. Fix one stale command or missing reference.
6. Run AgentFit again and show the score improve.

## Launch Checklist

- Publish a README with the badge, command, sample output, and comparison table.
- Ship dry-run scoring and reports first.
- Add GitHub Action documentation for PR checks.
- Open starter issues for adapters, fixtures, examples, and docs.
- Record a terminal GIF after the CLI writes real reports.

## Good First Issues

- Add more instruction file fixtures.
- Add examples for monorepos with nested `AGENTS.md`.
- Improve safety guardrail detection.
- Add a Claude Code adapter once non-interactive execution is stable.
- Add report examples from popular open-source repositories.

## Channels

- Hacker News
- X
- Reddit `r/LocalLLaMA`
- AI engineering Discords
- Maintainers of AGENTS.md and Cursor rule template repositories
