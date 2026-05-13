# Adapters

Adapters run the generated fitness tasks. AgentFit keeps adapters small so deterministic checks remain useful without API keys or paid agent runs.

## Dry Run

`dry-run` is the default adapter. It validates discovery, references, command extraction, and configured verification commands without invoking an AI coding agent.

```bash
npx @kingkyylian/agentfit@latest eval --adapter dry-run
```

Use dry-run in CI when you want low-cost signal for instruction quality.

## Codex

The Codex adapter is intended for non-interactive Codex CLI evaluations. It should:

- detect whether `codex` is installed
- pass the task prompt and worktree path explicitly
- enforce timeout and budget options
- mark runs as skipped when Codex is unavailable
- capture verification results, diff stats, runtime, and cost when available

Use a zero budget when you want to smoke-test the Codex adapter path without running Codex:

```bash
npx @kingkyylian/agentfit@latest eval --adapter codex --budget-usd 0
```

Reports mark those runs as skipped instead of executed.

Example:

```bash
npx @kingkyylian/agentfit@latest eval --adapter codex --tasks 3 --budget-usd 1.00
```

## Adapter Result Contract

Each adapter returns structured `EvaluationRun` records:

- `status`: `passed`, `failed`, or `skipped`
- `verification`: commands and exit codes
- `diffStat`: files changed, insertions, and deletions
- `costUsd`: optional for paid adapters
- `message`: optional human-readable reason for skip or failure

Reports and scoring consume this contract rather than adapter-specific logs.
