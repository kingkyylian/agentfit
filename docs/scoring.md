# Scoring

AgentFit scores repositories out of 100. The score is intentionally transparent: every report includes the category breakdown, failed checks, and any caps that changed the final score.

## Weights

| Category | Points | What It Measures |
| --- | ---: | --- |
| Instruction discoverability | 20 | Agent instruction files exist, are recognized, and include readable content. |
| Command freshness | 15 | Documented setup and verification commands are present and still succeed during evaluation. |
| Reference integrity | 15 | Markdown `@path` references resolve inside the repository. |
| Evaluation pass rate | 20 | Fitness tasks complete successfully. Skipped runs do not count as passes. |
| Diff discipline | 10 | Agent changes stay small enough for the task. |
| Safety guardrails | 10 | Instructions include safe operating boundaries for generated changes. |
| Reproducibility | 10 | Instructions explain setup, verification, and repeatable local workflow. |

## Caps And Hard Fails

- Exposed secrets in instruction files are a hard fail: score `0`.
- If a setup command cannot run, the maximum score is `60`.
- If no verification command is found, the maximum score is `75`.
- If a real adapter exceeds the configured budget, the run stops and the report marks a budget failure.

Caps are applied after the weighted score is calculated, so the report still shows the underlying category performance.

Secret detection is intentionally high-confidence. AgentFit currently flags obvious OpenAI API keys, AWS access key IDs, GitHub tokens, and private key blocks in discovered instruction files.

Safety and reproducibility scoring is evidence-backed. JSON reports include `signalFindings`, and Markdown reports include a Signal Findings table with the category, source location, and detected guidance, such as approval boundaries for risky changes or exact reproduction steps.

## Grades

| Score | Grade |
| ---: | --- |
| 90-100 | A |
| 80-89 | B |
| 70-79 | C |
| 60-69 | D |
| 0-59 | F |

## Interpreting Results

High scores mean a coding agent can discover the instructions, follow current commands, resolve referenced docs, and complete small repo-specific tasks without large unrelated diffs.

Low scores are meant to be actionable. Start with failed checks, then fix caps. A capped score usually means the repo is not ready for automated agent work even if other categories look healthy.

## Execution Modes

Reports include an `executionMode` field in JSON and a task execution note in Markdown:

| Mode | Meaning |
| --- | --- |
| `preview` | Default deterministic dry-run. AgentFit generated task records but did not execute them in worktrees. |
| `executed` | Generated tasks were executed through `--run-tasks` or a real adapter. |
| `mixed` | The report contains both preview and executed runs. |
| `none` | No task runs were recorded. |

Use `agentfit eval --run-tasks` for local worktree execution, or select a real adapter when you want agent behavior measured rather than previewed.
