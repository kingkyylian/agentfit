# Agent Instructions

Use the setup notes in @docs/setup.md before making changes.

Run setup once:

```bash
pnpm install --frozen-lockfile
```

Run verification before opening a PR:

```bash
pnpm test
pnpm lint
pnpm build
```

Keep changes focused and check `git status --short` before summarizing work.
