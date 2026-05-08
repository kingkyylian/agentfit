# Contributing

Thanks for helping improve AgentFit.

## Development

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm lint
pnpm build
pnpm smoke:package
```

Before sending a change, run the same verification commands used by CI.

## Product Principles

- Keep AgentFit local-first and deterministic by default.
- Do not add provider network calls to the dry-run adapter.
- Keep real-agent adapters optional and explicit.
- Reports must be transparent about whether generated tasks were previewed, executed by dry-run verification, or executed by a real adapter.
- Prefer small, explainable scoring changes over broad heuristics that are hard to audit.

## Good First Contributions

- Add fixtures for more agent instruction ecosystems.
- Add examples for nested monorepo instructions.
- Improve safety and reproducibility signal detection.
- Add adapter smoke tests.
- Generate dry-run reports for more public repositories.

## Pull Requests

Include:

- a short description of the behavior change
- any new report output examples
- tests for scoring, discovery, static checks, or CLI behavior when relevant
- the verification commands you ran

If a change affects scoring, update or add tests that show the before/after behavior.
