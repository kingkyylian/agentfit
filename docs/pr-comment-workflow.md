# PR Comment Workflow

Use this workflow when you want AgentFit to post the Markdown report directly on pull requests.

```yaml
name: AgentFit PR Report

on:
  pull_request:
    paths:
      - AGENTS.md
      - CLAUDE.md
      - GEMINI.md
      - .cursor/rules/**
      - .github/copilot-instructions.md
      - .github/instructions/**
      - package.json
      - pnpm-lock.yaml
      - yarn.lock
      - package-lock.json

permissions:
  contents: read
  pull-requests: read
  issues: write

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
          version: 0.1.8
          adapter: dry-run
          run-tasks: true
          fail-below-score: 70
          task-count: 5
          timeout-seconds: 900
          budget-usd: 1
          format: markdown
      - uses: actions/github-script@v8
        if: always()
        with:
          script: |
            const fs = require('fs');
            const marker = '<!-- agentfit-report -->';
            const report = fs.readFileSync('${{ steps.agentfit.outputs.report-path }}', 'utf8');
            const body = `${marker}\n${report}`;
            const { owner, repo } = context.repo;
            const issue_number = context.issue.number;
            const comments = await github.paginate(github.rest.issues.listComments, {
              owner,
              repo,
              issue_number,
              per_page: 100
            });
            const previous = comments.find((comment) =>
              comment.user.type === 'Bot' && comment.body.includes(marker)
            );

            if (previous) {
              await github.rest.issues.updateComment({
                owner,
                repo,
                comment_id: previous.id,
                body
              });
            } else {
              await github.rest.issues.createComment({
                owner,
                repo,
                issue_number,
                body
              });
            }
```

Set `run-tasks: false` if you only want deterministic discovery, reference, command, and task-generation checks without executing generated tasks.
