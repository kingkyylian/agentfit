# Internal Launch Validation Summary - 2026-05-19

## Decision

AgentFit is ready for a narrow public preview focused on repo suggestions and report sanity checks. It is not ready for a broad launch post that names healthy repositories as examples.

The validation evidence is strong enough to say dry-run mode can produce useful signal across real repositories, and the product has already absorbed false-positive fixes discovered during the corpus sprint.

## Evidence

The 2026-05-18 corpus sprint completed the full 30-candidate queue from `examples/corpus/real-world-candidates.yml`.

Results:

- 30 total corpus candidates.
- 30 reviewed dry-run snapshots.
- 15 healthy internal baselines.
- 9 actionable local maintainer-contact drafts.
- 5 snapshotted no-contact reports.
- 1 unsupported low-signal report.
- 0 unresolved noisy AgentFit reports.
- 3 product fixes applied from corpus runs.

All snapshots were metadata-only dry runs:

- no generated tasks were executed
- no model-provider calls were made
- no real agent adapters were selected
- no maintainer issues were opened

## Product Fixes From Validation

Validation produced three AgentFit fixes:

1. Prevented a path-bearing sibling heading from leaking into later unscoped command sections. This cleared false missing-script findings in a monorepo report.
2. Allowed root workspace scripts to satisfy nested instruction commands when the scoped package lacks the script. This cleared a false nested command finding.
3. Treated prose like "run from the monorepo root" as repository-root guidance instead of parsing a generic word as a literal working directory.

These are launch-positive because the corpus did not just provide examples; it hardened the evaluator before public preview.

## Current Public Claims Allowed

Allowed:

- AgentFit has 30 reviewed public dry-run snapshots.
- Dry-run mode does not call model providers.
- Dry-run mode does not execute generated tasks.
- The sprint produced 15 healthy internal baselines, 9 actionable local drafts, 5 reviewed no-contact snapshots, and 1 unsupported snapshot.
- The validation sprint found and fixed three AgentFit product issues.
- A prior stale-command finding became a merged upstream RedisInsight PR.

Avoid:

- naming healthy repositories as endorsements
- presenting scores as judgments of project quality
- implying maintainers consented to public example use
- implying actionable local drafts have already been reported upstream
- claiming real adapter validation from this sprint

## Launch Gate

Proceed with public preview only. Delay broad launch until at least one condition is true:

- issue `#9` receives 3 or more external repo suggestions
- a maintainer grants permission to reference a healthy named example
- another concrete stale-command or broken-reference finding is verified and approved for outreach
- a developer outside the project asks for a report or GitHub Action setup

## Verification Evidence

Latest checkpoint verification passed:

- `rtk pnpm typecheck`
- `rtk pnpm test`
- `rtk pnpm lint`
- `rtk pnpm build`
- `rtk pnpm smoke:package`
- `rtk pnpm corpus:check`
- `rtk node dist/index.js corpus --limit 30`

Before posting or shipping new package changes, rerun the project verification commands from `AGENTS.md`.
