# AgentFit

Is your repo actually ready for coding agents?

AgentFit scores whether `AGENTS.md`, `CLAUDE.md`, Cursor rules, Copilot instructions, and other agent harness files are usable in practice. It checks whether instructions are discoverable, commands still work, references resolve, nested packages are covered, and coding agents can complete small repo-specific tasks in isolated worktrees.

![npm](https://img.shields.io/npm/v/@kingkyylian/agentfit)
![AgentFit 95/100](https://img.shields.io/badge/AgentFit-95%2F100-2ea043)

```bash
npx @kingkyylian/agentfit@latest eval --adapter dry-run
```

```text
AgentFit score: 93/100 (A)
AgentFit score 93/100 (A).
Instruction files: 1
Reference issues: 0
Tasks: 5
Task execution: static dry-run preview; generated tasks were not executed.
Runs: 0 executed, 5 previewed
```

Execute generated tasks in isolated worktrees when you want command-level proof:

```bash
npx @kingkyylian/agentfit@latest eval --adapter dry-run --run-tasks
```

AgentFit's own repository currently scores `95/100 (A)` with `5 of 5` generated task runs executed.

## The 60-Second Pitch

Start with a stale `AGENTS.md`:

```text
- missing @docs/setup.md
- stale pnpm lint command
- no runnable verification command
- no nested instruction file for packages/api
```

Then fix the instructions and compare:

```bash
npx @kingkyylian/agentfit@latest compare examples/reports/demo-before.json examples/reports/demo-after.json --format markdown
```

```text
AgentFit improved by 28 points: 65/100 (D) -> 93/100 (A).
Fixed checks:
- No nested instruction file found for packages/api.
- Documented command references missing package script "lint".
- No runnable verification command found in instruction files.
- 1 instruction reference is missing or invalid.
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
- uses: kingkyylian/agentfit@v1
  with:
    version: 0.1.2
    adapter: dry-run
    run-tasks: true
    fail-below-score: 70
    task-count: 5
    timeout-seconds: 900
    budget-usd: 1
    format: markdown
```

See [docs/github-action.md](docs/github-action.md).

AgentFit uses this Action on its own repository with `run-tasks: true` and a minimum score of `90`.

For a complete workflow that updates a pull request comment with the AgentFit report, see [docs/pr-comment-workflow.md](docs/pr-comment-workflow.md).

## 60-Second Demo

The included demo starts with a stale `AGENTS.md`:

- missing `@docs/setup.md`
- stale `pnpm lint` command
- no runnable verification command
- no nested instruction file for `packages/api`

Run the before/after reports and compare them:

```bash
cd examples/demo/bad
npx @kingkyylian/agentfit@latest eval --format markdown --output ../../reports/demo-before.md --json-output ../../reports/demo-before.json --tasks 5 || true

cd ../fixed
npx @kingkyylian/agentfit@latest eval --format markdown --output ../../reports/demo-after.md --json-output ../../reports/demo-after.json --tasks 5

cd ../../..
npx @kingkyylian/agentfit@latest compare examples/reports/demo-before.json examples/reports/demo-after.json --format markdown
```

```text
AgentFit improved by 28 points: 65/100 (D) -> 93/100 (A).
```

See [docs/demo.md](docs/demo.md).

## Real-World Examples

Dry-run snapshots from public repositories:

| Repository | Score | Signal |
| --- | ---: | --- |
| `hexlet-codebattle/codebattle` | 80/100 (B) | stale documented scripts and a nested scope gap |
| `Brendonovich/MacroGraph` | 73/100 (C) | broad monorepo scope coverage gaps |
| `skybrush-io/skybrush-server` | 93/100 (A) | healthy single instruction file |

See [docs/real-world.md](docs/real-world.md).

## Good First Issues

- Add instruction fixtures for more ecosystems.
- Add examples for nested monorepo instructions.
- Improve safety and reproducibility signal detection.
- Add adapter smoke tests for Codex CLI.
- Add more real-world dry-run snapshots.

## License

MIT

## Contributing

Keep changes local-first, deterministic by default, and transparent in reports. Real-agent adapters should be optional and must report skipped runs clearly when unavailable.

See [CONTRIBUTING.md](CONTRIBUTING.md).
