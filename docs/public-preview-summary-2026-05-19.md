# Public Preview Summary - 2026-05-19

## Purpose

This is the public-preview brief for AgentFit after the 30-repository dry-run validation sprint. Use it for repo-suggestion asks and report sanity-check requests, not for a broad launch post.

Do not name healthy repositories as endorsements. The only named external example in public copy should be a concrete, already-public outcome such as the RedisInsight stale-command PR.

## Short Version

```text
AgentFit is CI for AGENTS.md and coding-agent instructions.

I ran 30 dry-run snapshots against public repositories that already use AGENTS.md, CLAUDE.md, Cursor rules, or Copilot instructions.

Result:
- 15 healthy internal baselines
- 9 actionable local drafts
- 5 reviewed no-contact snapshots
- 1 unsupported low-signal snapshot
- 3 AgentFit product fixes found during validation

Dry-run mode did not call model providers and did not execute generated tasks.

I am looking for more public repos to sanity-check with dry-run reports.
```

## Preview Thread

Post:

```text
I am looking for public repos that already use AGENTS.md, CLAUDE.md, Cursor rules, Copilot instructions, or similar coding-agent guidance.

I will run AgentFit in dry-run mode and share concrete instruction drift if it finds any: stale commands, broken references, or monorepo scope gaps.

Dry-run mode does not call model providers or execute generated tasks.

Repo suggestions:
https://github.com/kingkyylian/agentfit/issues/9
```

Reply 1:

```text
I have run 30 public dry-run snapshots so far.

Useful signal:
- 15 healthy internal baselines
- 9 actionable local drafts
- 5 reviewed no-contact snapshots
- 1 unsupported low-signal snapshot
- 3 AgentFit product fixes from noisy validation reports

The clearest external finding so far became a merged upstream RedisInsight PR:
https://github.com/redis/RedisInsight/pull/5889
```

Reply 2:

```text
No endorsement is implied by any repo being tested.

If a report is noisy, I turn it into an AgentFit issue instead of bothering maintainers. If it finds concrete drift that can be verified quickly, I may share a narrow maintainer issue.

Current scope: repo suggestions and report sanity checks, not a broad launch.
```

## GitHub Community Draft

Suggested title:

```text
Looking for public repos with AGENTS.md / coding-agent instructions to dry-run validate
```

Body:

```text
I am building AgentFit, a local-first checker for AGENTS.md, CLAUDE.md, Cursor rules, Copilot instructions, and similar coding-agent guidance.

I am looking for public repositories that already use these files so I can run dry-run validation and sanity-check the reports.

What AgentFit checks in dry-run mode:

- stale documented commands
- broken @file references
- missing nested monorepo instruction coverage
- safety and reproducibility guidance
- before/after report changes

Dry-run mode does not call model providers and does not execute generated tasks.

I have run 30 public dry-run snapshots so far. The current internal triage is 15 healthy baselines, 9 actionable local drafts, 5 reviewed no-contact snapshots, and 1 unsupported low-signal snapshot.

The same validation work found noisy AgentFit behavior too, so I fixed command working-directory inference, nested workspace script resolution, and prose cwd parsing on `main`.

If you know a public repo that already has AGENTS.md, CLAUDE.md, Cursor rules, Copilot instructions, or similar guidance, please suggest it here:
https://github.com/kingkyylian/agentfit/issues/9

No endorsement is implied by any repo being tested. If a report is noisy, I turn it into an AgentFit issue instead of bothering maintainers. If it finds concrete drift that can be verified quickly, I may share a narrow maintainer issue.

Repo:
https://github.com/kingkyylian/agentfit
```

## Do Not Use Yet

- Do not post to Hacker News or Reddit from this brief.
- Do not publish named healthy examples without explicit permission.
- Do not open maintainer issues from the local drafts without explicit approval.
- Do not imply that public search results consented to being validation examples.
