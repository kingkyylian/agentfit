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

jobs:
  agentfit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - id: agentfit
        uses: your-org/agentfit@v1
        with:
          adapter: dry-run
          fail-below-score: 70
          task-count: 5
          format: markdown
```

## Inputs

| Input | Default | Description |
| --- | --- | --- |
| `adapter` | `dry-run` | Evaluation adapter to run. |
| `fail-below-score` | `70` | Fail the job when the JSON report score is below this value. |
| `task-count` | `5` | Number of generated fitness tasks. |
| `format` | `markdown` | Human report format. |

## Outputs

| Output | Description |
| --- | --- |
| `score` | Final AgentFit score. |
| `report-path` | Markdown report path. |
| `json-path` | JSON report path. |

## PR Comment

Add a comment step with `actions/github-script`:

```yaml
- uses: actions/github-script@v7
  if: always()
  with:
    script: |
      const fs = require('fs');
      const report = fs.readFileSync('${{ steps.agentfit.outputs.report-path }}', 'utf8');
      await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: report
      });
```
