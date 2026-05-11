# RedisInsight Issue Record

Record for the maintainer issue opened on `redis/RedisInsight`.

## Status

- Repository: `redis/RedisInsight`
- Commit checked: `94fab1d`
- Duplicate issue search: no matching issues for `test:main`, `test:electron`, `test:all`, or `cursor rules e2e`
- Duplicate PR search: no matching PR for `test:main`; `e2e-testing` search returned unrelated E2E work and the already-merged AI instruction update PR
- AgentFit mode: dry-run only; no generated tasks executed; no model-provider calls
- Issue opened: https://github.com/redis/RedisInsight/issues/5887
- Maintainer-requested PR opened: https://github.com/redis/RedisInsight/pull/5889

## Evidence

`.cursor/rules/e2e-testing.mdc` documents these commands:

```bash
npm test                    # Main project tests (default)
npm run test:main           # Main project tests only
npm run test:electron       # Electron tests (auto-detects platform)
npm run test:all            # All projects
```

Root `package.json` has `test`, `test:api`, `test:api:integration`, `test:cov`, `test:cov:unit`, and `test:cov:component`, but no `test:main`, `test:electron`, or `test:all`.

Running the documented root commands returns:

```text
npm run test:main
npm error Missing script: "test:main"

npm run test:electron
npm error Missing script: "test:electron"

npm run test:all
npm error Missing script: "test:all"
```

The Playwright E2E package appears to use package-local commands instead:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:chromium": "playwright test --project=chromium",
    "test:electron": "playwright test --project=electron"
  }
}
```

`tests/e2e-playwright/README.md` also documents the package-local command set:

```text
npm test
npm run test:chromium
npm run test:electron
```

## Posted Title

Stale E2E test commands in Cursor rules

## Posted Body

````markdown
Hi, I noticed a small docs/tooling mismatch in the AI/Cursor instructions for E2E tests.

`.cursor/rules/e2e-testing.mdc` currently documents these commands:

```bash
npm test                    # Main project tests (default)
npm run test:main           # Main project tests only
npm run test:electron       # Electron tests (auto-detects platform)
npm run test:all            # All projects
```

From the repository root, three of those scripts do not exist:

```text
npm run test:main
npm error Missing script: "test:main"

npm run test:electron
npm error Missing script: "test:electron"

npm run test:all
npm error Missing script: "test:all"
```

It looks like the current Playwright E2E package commands live under `tests/e2e-playwright/` instead:

```json
{
  "test": "playwright test",
  "test:chromium": "playwright test --project=chromium",
  "test:electron": "playwright test --project=electron"
}
```

So the rule may need either package-local command examples, such as:

```bash
cd tests/e2e-playwright
npm test
npm run test:chromium
npm run test:electron
```

or root-level proxy scripts if the intent is for agents to run these from the repository root.

I found this with a dry-run AgentFit check while looking for real-world AGENTS.md / AI instruction drift examples. It did not execute generated tasks or call any model providers:

```bash
npx @kingkyylian/agentfit@latest eval --adapter dry-run --format markdown
```

No endorsement implied; this just looked like a concrete instruction drift issue that could mislead coding agents into running commands that fail immediately.
````

## Posting Notes

The posted issue stayed narrow. It did not ask for a star and did not include the full AgentFit report.
