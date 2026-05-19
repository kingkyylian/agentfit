# Maintainer Outreach Shortlist - 2026-05-19

## Policy

This is a local shortlist only. Do not open issues or send messages without explicit approval.

Use one issue or message per repository. Do not ask for stars, do not pitch a launch, and do not imply endorsement.

## Recommended Action

Do not start with maintainer outreach. Start with the public preview ask in [public-preview-summary-2026-05-19.md](public-preview-summary-2026-05-19.md).

If outreach is approved after that, use only the narrowest concrete findings first.

## Shortlist

### 1. `eggjs/egg`

Status: best first candidate if explicit outreach approval is given.

Finding:

- `.github/copilot-instructions.md` and `tegg/CLAUDE.md` document `pnpm run clean`.
- The root `package.json` does not define a `clean` script.
- The current root script list includes `clean-dist`.

Why this is eligible:

- It is a concrete command drift finding.
- A maintainer can verify it quickly from the documented command and package scripts.
- AgentFit already fixed the false-positive prose cwd issue before this finding remained.

Draft:

```text
I ran AgentFit in dry-run mode against this repository's coding-agent instructions.

Command:
agentfit eval --adapter dry-run --format markdown

Finding:
.github/copilot-instructions.md and tegg/CLAUDE.md document `pnpm run clean`, but the root package.json does not define a `clean` script. The current root script list includes `clean-dist`.

Why it may matter:
Agents following the documented validation workflow may run a command that fails immediately.

If this kind of tool-generated feedback is not useful for the project, I can close this and avoid opening similar issues.
```

### 2. `redis/RedisInsight`

Status: concrete but defer by default.

Finding:

- Root `AGENTS.md` documents `yarn type-check:ui`.
- Root `package.json` does not define `type-check:ui`.
- The current documented equivalent appears to be `yarn --cwd redisinsight/ui type-check`.

Why this is not first:

- AgentFit already contacted this repository once on 2026-05-11, and the maintainers merged the related stale-command PR.
- The contact policy says one issue or message per repository.

Only use this if the user explicitly approves an exception or maintainers invite follow-up.

### 3. Verification-Guidance Drafts

Status: keep local for now.

Repositories:

- `callstackincubator/rozenite`
- `mathertel/OneButton`
- `NikolayS/postgres_dba`
- `numerai/example-scripts`
- `econ-ark/HARK`
- `IOBR/IOBR`
- `percona/psmdb-docs`

Common finding:

- No runnable verification command found in instruction files.

Why these are lower priority:

- The finding is useful, but less concrete than a stale command.
- These are better handled after public preview creates a clear expectation that maintainers are asking for report sanity checks.

## Decision

The serious next move is:

1. Post the public preview ask.
2. Wait for repo suggestions or explicit report-sanity-check interest.
3. If maintainer outreach is approved, start with `eggjs/egg`.
4. Keep all verification-guidance drafts local until there is a stronger signal that this feedback is welcome.
