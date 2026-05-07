# AgentFit

Is your repo actually ready for coding agents?

AgentFit runs local fitness tests for `AGENTS.md`, `CLAUDE.md`, Cursor rules, Copilot instructions, and other agent harness files. It checks whether instructions are discoverable, commands still work, references resolve, and coding agents can complete small repo-specific tasks in isolated worktrees.

![AgentFit 82/100](https://img.shields.io/badge/AgentFit-82%2F100-4c8fbd)

```bash
npx agentfit@latest eval --adapter dry-run
```

```text
AgentFit score: 82/100 (B)
AgentFit score 82/100 (B).
Instruction files: 2
Reference issues: 1
Tasks: 5
Task execution: static dry-run preview; generated tasks were not executed.
Runs: 0 executed, 5 previewed
```

Compare instruction changes before and after a PR:

```bash
npx agentfit@latest compare examples/reports/demo-before.json examples/reports/demo-after.json --format markdown
```

```text
AgentFit improved by 28 points: 65/100 (D) -> 93/100 (A).
Fixed checks: No nested instruction file found for packages/api.; Documented command references missing package script "lint".; No runnable verification command found in instruction files.; 1 instruction reference is missing or invalid.
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

By default, dry-run mode performs deterministic discovery, reference, command, and task-generation checks. Use `--run-tasks` or a real adapter when you want generated tasks executed in isolated worktrees.

## GitHub Action

```yaml
- uses: kyylian/agentfit@v1
  with:
    version: 0.1.0
    adapter: dry-run
    fail-below-score: 70
    task-count: 5
    timeout-seconds: 900
    budget-usd: 1
    format: markdown
```

See [docs/github-action.md](docs/github-action.md).

## 60-Second Demo

The included demo starts with a stale `AGENTS.md`:

- missing `@docs/setup.md`
- stale `pnpm lint` command
- no runnable verification command
- no nested instruction file for `packages/api`

Run the before/after reports and compare them:

```bash
cd examples/demo/bad
npx agentfit@latest eval --format markdown --output ../../reports/demo-before.md --json-output ../../reports/demo-before.json --tasks 5 || true

cd ../fixed
npx agentfit@latest eval --format markdown --output ../../reports/demo-after.md --json-output ../../reports/demo-after.json --tasks 5

cd ../../..
npx agentfit@latest compare examples/reports/demo-before.json examples/reports/demo-after.json --format markdown
```

```text
AgentFit improved by 28 points: 65/100 (D) -> 93/100 (A).
```

See [docs/demo.md](docs/demo.md).

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
