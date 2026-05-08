# AgentFit Agent Instructions

## Setup

```bash
pnpm install --frozen-lockfile
```

## Verification

Run these before claiming completion:

```bash
pnpm typecheck
pnpm test
pnpm lint
pnpm build
pnpm smoke:package
```

Check the working tree with `git status --short` before summarizing changes.

## Scope

- Keep the CLI local-first and deterministic by default.
- Do not add provider network calls to the dry-run adapter.
- Run real agent adapters only when the user explicitly selects them.
