# GitHub Action

AgentFit can run in pull requests that change agent instruction files.

```yaml
name: AgentFit

on:
  pull_request:
    paths:
      - AGENTS.md
      - CLAUDE.md
      - GEMINI.md
      - .cursor/rules/**
      - .github/copilot-instructions.md
      - .github/instructions/**

env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true

jobs:
  agentfit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: 22
          package-manager-cache: false
      - run: corepack enable
      - run: pnpm install --frozen-lockfile
      - id: agentfit
        uses: kingkyylian/agentfit@v1
        with:
          version: 0.1.4
          adapter: dry-run
          run-tasks: true
          fail-below-score: 70
          task-count: 5
          timeout-seconds: 900
          budget-usd: 1
          format: markdown
```

## Inputs

| Input | Default | Description |
| --- | --- | --- |
| `version` | `0.1.4` | AgentFit npm package version to run through `npm exec`. |
| `adapter` | `dry-run` | Evaluation adapter to run. |
| `fail-below-score` | `70` | Fail the job when the JSON report score is below this value. |
| `task-count` | `5` | Number of generated fitness tasks. |
| `run-tasks` | `false` | Execute generated tasks in isolated worktrees. Install dependencies first when this is `true`. |
| `timeout-seconds` | `900` | Maximum seconds for each task run. |
| `budget-usd` | `1` | Maximum adapter budget in USD. |
| `format` | `markdown` | Human report format. |

The action generates the human report and JSON report from one `agentfit eval` invocation, so real-agent adapters do not run the same task batch twice.

## Outputs

| Output | Description |
| --- | --- |
| `score` | Final AgentFit score. |
| `report-path` | Markdown report path. |
| `json-path` | JSON report path. |

## PR Comment

For a complete workflow that creates or updates one AgentFit pull request comment, see [pr-comment-workflow.md](pr-comment-workflow.md).

## Before/After Compare

For PRs that update agent instructions, store a baseline report from the target branch and compare it with the PR report:

```yaml
- name: Compare AgentFit reports
  run: |
    npx @kingkyylian/agentfit@latest compare before.json after.json \
      --format markdown \
      --output agentfit-compare.md \
      --fail-on-regression
```

Use the compare output as the PR comment body when you want reviewers to see whether an instruction change improved or regressed the repository.
