# AgentFit Demo

This demo shows the core AgentFit story: agent instructions drift, AgentFit catches the drift, and a focused fix improves the score.

## Broken Repository

`examples/demo/bad` contains a deliberately stale `AGENTS.md`:

- `@docs/setup.md` is referenced but missing.
- `pnpm lint` is documented but `package.json` has no `lint` script.
- no runnable verification command is available from the instructions.
- `packages/api` has a package but no nested `AGENTS.md`.

Run:

```bash
cd examples/demo/bad
npx agentfit@latest eval \
  --format markdown \
  --output ../../reports/demo-before.md \
  --json-output ../../reports/demo-before.json \
  --tasks 5 || true
```

Result:

```text
AgentFit score 65/100 (D).
Task execution: static dry-run preview; generated tasks were not executed.
Failed checks:
- No nested instruction file found for packages/api.
- Documented command references missing package script "lint".
- No runnable verification command found in instruction files.
- 1 instruction reference is missing or invalid.
```

## Fixed Repository

`examples/demo/fixed` fixes the same repo shape:

- adds `docs/setup.md`.
- adds runnable `test`, `lint`, and `build` scripts.
- documents setup and verification commands.
- adds `packages/api/AGENTS.md`.

Run:

```bash
cd examples/demo/fixed
npx agentfit@latest eval \
  --format markdown \
  --output ../../reports/demo-after.md \
  --json-output ../../reports/demo-after.json \
  --tasks 5
```

Result:

```text
AgentFit score 93/100 (A).
Failed checks: none.
```

## Compare

From the project root:

```bash
npx agentfit@latest compare \
  examples/reports/demo-before.json \
  examples/reports/demo-after.json \
  --format markdown
```

Result:

```text
AgentFit improved by 28 points: 65/100 (D) -> 93/100 (A).
```
