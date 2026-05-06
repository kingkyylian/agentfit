# AgentFit

Is your repo actually ready for coding agents?

AgentFit runs local fitness tests for `AGENTS.md`, `CLAUDE.md`, Cursor rules, Copilot instructions, and other agent harness files. It checks whether instructions are discoverable, commands still work, references resolve, and coding agents can complete small repo-specific tasks in isolated worktrees.

![AgentFit 82/100](https://img.shields.io/badge/AgentFit-82%2F100-4c8fbd)

```bash
npx agentfit eval --adapter dry-run
```

```text
AgentFit score: 82/100

PASS  instruction files discovered
PASS  referenced files resolve
PASS  setup command completed
WARN  no nested instructions for packages/api
FAIL  documented pnpm lint command is missing from package.json

Report: .agentfit/reports/latest.md
```

Compare instruction changes before and after a PR:

```bash
npx agentfit compare before.json after.json --format markdown
```

```text
AgentFit improved by 23 points: 68/100 (D) -> 91/100 (A).
Fixed checks: No verification command found.; 1 instruction reference is missing or invalid.
```

## Why

Agent instruction files rot quickly. Setup commands change, nested packages get missed, references move, and teams guess whether one instruction change helped. AgentFit turns that guess into a repeatable score and report.

## What You Get

- deterministic instruction discovery
- command and reference checks
- generated repo-specific fitness tasks
- JSON and Markdown reports
- before/after report comparison
- SVG badge output
- GitHub Action support for PRs
- optional real-agent adapters, starting with Codex

## AgentFit Compared

| Tool Type | Checks Syntax | Runs Repo Tasks | Measures Agent Results | Local-First |
| --- | --- | --- | --- | --- |
| Heuristic linters | Yes | No | No | Usually |
| Observability tools | No | Sometimes | Yes | Usually no |
| AgentFit | Yes | Yes | Yes | Yes |

## Scoring

Scores are out of 100:

- 20 instruction discoverability
- 15 command freshness
- 15 reference integrity
- 20 evaluation pass rate
- 10 diff discipline
- 10 safety guardrails
- 10 reproducibility

See [docs/scoring.md](docs/scoring.md).

## GitHub Action

```yaml
- uses: your-org/agentfit@v1
  with:
    adapter: dry-run
    fail-below-score: 70
    task-count: 5
    format: markdown
```

See [docs/github-action.md](docs/github-action.md).

## 60-Second Demo

1. Run `npx agentfit eval --adapter dry-run`.
2. Open the Markdown report.
3. Fix a missing reference or stale command.
4. Run AgentFit again.
5. Compare the reports with `npx agentfit compare before.json after.json`.

## Good First Issues

- Add instruction fixtures for more ecosystems.
- Add examples for nested monorepo instructions.
- Improve safety and reproducibility signal detection.
- Add adapter smoke tests for Codex CLI.
- Generate reports for real open-source repositories.

## License

MIT

## Contributing

Keep changes local-first, deterministic by default, and transparent in reports. Real-agent adapters should be optional and must report skipped runs clearly when unavailable.
