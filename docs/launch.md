# Launch Plan

## Positioning

AgentFit answers one question: is this repository actually ready for coding agents?

The hook is empirical evaluation instead of another instruction-file checklist. Agent instruction files are code. Test them.

## Current Status

- NPM package: `@kingkyylian/agentfit@0.1.5`.
- GitHub Action tag: `kingkyylian/agentfit@v1`.
- Repository metadata: description, homepage, and discovery topics are configured.
- Local full verification passed on 2026-05-10.
- Manual `AgentFit Consumer Smoke` workflow passed on 2026-05-10 with `kingkyylian/agentfit@v1`, `version: 0.1.5`, `run-tasks: true`, and score `100/100 (A)`.
- Starter issues are open for real-world snapshots, monorepo fixtures, an animated terminal demo, Codex adapter smoke tests, and scoring signal improvements.
- README includes a terminal demo asset at [assets/agentfit-terminal-demo.svg](assets/agentfit-terminal-demo.svg).
- Social preview is configured from [assets/social-preview.svg](assets/social-preview.svg).
- Launch copy and outreach templates live in [launch-outreach.md](launch-outreach.md).
- Real-world validation workflow lives in [real-world-validation.md](real-world-validation.md).
- Initial validation sprint log lives in [validation-sprint-2026-05-11.md](validation-sprint-2026-05-11.md).

## 60-Second Demo

1. Start in `examples/demo/bad`, a repo with a stale `AGENTS.md`.
2. Run:

```bash
npx @kingkyylian/agentfit@latest eval --format markdown --output ../../reports/demo-before.md --json-output ../../reports/demo-before.json --tasks 5 || true
```

3. Show the score: `65/100 (D)`.
4. Point to the four failures: missing `@docs/setup.md`, stale `pnpm lint`, no runnable verification command, and missing `packages/api/AGENTS.md`.
5. Move to `examples/demo/fixed`.
6. Run AgentFit again:

```bash
npx @kingkyylian/agentfit@latest eval --format markdown --output ../../reports/demo-after.md --json-output ../../reports/demo-after.json --tasks 5
```

7. Show the fixed score: `93/100 (A)`.
8. From the project root, run:

```bash
npx @kingkyylian/agentfit@latest compare examples/reports/demo-before.json examples/reports/demo-after.json --format markdown
```

9. Show the before/after delta as the launch hook: `AgentFit improved by 28 points`.

## Launch Checklist

- Publish a README with the badge, command, sample output, and comparison table.
- Configure GitHub repository description, homepage, and topics.
- Confirm the configured GitHub social preview still matches the current launch positioning.
- Ship dry-run scoring and reports first.
- Add GitHub Action documentation for PR checks.
- Ship `agentfit compare` examples for before/after instruction changes.
- Open starter issues for adapters, fixtures, examples, and docs.
- Add the terminal demo asset to README.
- Run a real-world validation sprint against 10-20 public repositories with agent instruction files.
- Publish one launch post per channel, not a generic cross-post.

## Release Order

1. Run `pnpm install --frozen-lockfile`.
2. Run `pnpm typecheck`, `pnpm test`, `pnpm lint`, `pnpm build`, and `pnpm smoke:package`.
3. Confirm `pnpm smoke:package` validates the packed tarball contents, executable CLI entrypoint, and reported CLI version.
4. Publish the npm CLI package as `@kingkyylian/agentfit@0.1.5`.
5. Push the GitHub repository and create the `v1` Action tag after the npm package is available.
6. Smoke-test the Action with the manual `AgentFit Consumer Smoke` workflow, which uses `kingkyylian/agentfit@v1` and `version: 0.1.5`.

## Real-World Validation Plan

The goal is not friend-based social proof. The goal is to collect public, reproducible evidence that AgentFit finds useful signal in repositories that already use `AGENTS.md`, `CLAUDE.md`, Cursor rules, or Copilot instructions.

1. Build a candidate list of 30 public repositories using GitHub code search queries from [real-world-validation.md](real-world-validation.md).
2. Run deterministic dry-run snapshots against 10-20 candidates without executing generated tasks.
3. Classify each result as actionable drift, healthy example, noisy signal, or unsupported repository.
4. Open maintainer issues only when the report has a concrete finding: missing referenced file, stale documented command, or clear nested scope gap.
5. Turn false positives and confusing output into AgentFit issues before public launch posts.
6. Launch with the before/after demo plus 3-5 real-world signals, not a feature list.
7. Reply to every technical question with report output, a repro command, or a scoped product issue.

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
