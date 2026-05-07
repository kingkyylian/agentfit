# Launch Plan

## Positioning

AgentFit answers one question: is this repository actually ready for coding agents?

The hook is empirical evaluation instead of another instruction-file checklist. Agent instruction files are code. Test them.

## 60-Second Demo

1. Start in `examples/demo/bad`, a repo with a stale `AGENTS.md`.
2. Run:

```bash
npx agentfit@latest eval --format markdown --output ../../reports/demo-before.md --json-output ../../reports/demo-before.json --tasks 5 || true
```

3. Show the score: `65/100 (D)`.
4. Point to the four failures: missing `@docs/setup.md`, stale `pnpm lint`, no runnable verification command, and missing `packages/api/AGENTS.md`.
5. Move to `examples/demo/fixed`.
6. Run AgentFit again:

```bash
npx agentfit@latest eval --format markdown --output ../../reports/demo-after.md --json-output ../../reports/demo-after.json --tasks 5
```

7. Show the fixed score: `93/100 (A)`.
8. From the project root, run:

```bash
npx agentfit@latest compare examples/reports/demo-before.json examples/reports/demo-after.json --format markdown
```

9. Show the before/after delta as the launch hook: `AgentFit improved by 28 points`.

## Launch Checklist

- Publish a README with the badge, command, sample output, and comparison table.
- Ship dry-run scoring and reports first.
- Add GitHub Action documentation for PR checks.
- Ship `agentfit compare` examples for before/after instruction changes.
- Open starter issues for adapters, fixtures, examples, and docs.
- Record a terminal GIF after the CLI writes real reports.

## Release Order

1. Run `pnpm install --frozen-lockfile`.
2. Run `pnpm typecheck`, `pnpm test`, `pnpm lint`, and `pnpm build`.
3. Run `npm pack --dry-run --json` and confirm the package includes `dist`, `README.md`, `LICENSE`, `action.yml`, and top-level docs.
4. Publish the npm CLI package as `agentfit@0.1.0`.
5. Push the GitHub repository and create the `v1` Action tag after the npm package is available.
6. Smoke-test the Action with `uses: kyylian/agentfit@v1` and `version: 0.1.0`.

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
