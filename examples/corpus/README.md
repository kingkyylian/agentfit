# Real-World Candidate Corpus

This directory stores metadata for public repositories that may be useful AgentFit dry-run targets.

It is not a dataset of instruction-file contents. Keep instruction files in their source repositories and store only repository names, search provenance, triage status, and generated report links.

## Workflow

1. Find candidates with GitHub advanced search sorted by `Recently updated`.
2. Add metadata to `real-world-candidates.yml`.
3. Run `pnpm corpus:check`.
4. Clone the target outside this repository.
5. Run `agentfit eval --adapter dry-run`.
6. Review the report for false positives before deciding whether the signal is actionable, healthy, noisy, or unsupported.

## Status Values

- `candidate`: selected from search, not snapshotted yet
- `snapshotted`: dry-run report generated and stored
- `actionable`: concrete maintainer-facing finding exists
- `healthy`: useful positive example, no maintainer issue needed
- `noisy`: AgentFit needs product work before external use
- `unsupported`: repository shape is not a good current target
