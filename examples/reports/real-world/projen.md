# AgentFit Report

**Score:** 83/100 (B)

1 failed check found.

Generated: 2026-05-18T17:14:04.057Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 20/20 | 4 instruction files discovered. |
| Command freshness | 8/15 | Commands were found but not executed. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 5 deterministic task previews generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 0/10 | Safety guardrails were not found. |
| Reproducibility | 10/10 | Reproducible setup and verification guidance found. |

## Failed Checks

- Safety guardrails were not found.

## Caps

None.

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| .cursor/rules/project.md | cursor | .cursor/rules | 13 | 0 |
| .github/copilot-instructions.md | copilot | .github | 13 | 0 |
| AGENTS.md | agents | . | 13 | 0 |
| CLAUDE.md | claude | . | 13 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Exercise the test package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the build package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the audit package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the bump package script | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Exercise the bundle:task-runner package script | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Signal Findings

Showing first 25 of 32 signal findings. JSON output contains the complete set.

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | .cursor/rules/project.md:13 | Build command guidance. |
| reproducibility | .cursor/rules/project.md:14 | Test command guidance. |
| reproducibility | .cursor/rules/project.md:15 | Build command guidance. |
| reproducibility | .cursor/rules/project.md:46 | Build command guidance. |
| reproducibility | .cursor/rules/project.md:48 | Test command guidance. |
| reproducibility | .cursor/rules/project.md:49 | Build command guidance. |
| reproducibility | .cursor/rules/project.md:51 | Build command guidance. |
| reproducibility | .cursor/rules/project.md:56 | Test command guidance. |
| reproducibility | .github/copilot-instructions.md:13 | Build command guidance. |
| reproducibility | .github/copilot-instructions.md:14 | Test command guidance. |
| reproducibility | .github/copilot-instructions.md:15 | Build command guidance. |
| reproducibility | .github/copilot-instructions.md:46 | Build command guidance. |
| reproducibility | .github/copilot-instructions.md:48 | Test command guidance. |
| reproducibility | .github/copilot-instructions.md:49 | Build command guidance. |
| reproducibility | .github/copilot-instructions.md:51 | Build command guidance. |
| reproducibility | .github/copilot-instructions.md:56 | Test command guidance. |
| reproducibility | AGENTS.md:13 | Build command guidance. |
| reproducibility | AGENTS.md:14 | Test command guidance. |
| reproducibility | AGENTS.md:15 | Build command guidance. |
| reproducibility | AGENTS.md:46 | Build command guidance. |
| reproducibility | AGENTS.md:48 | Test command guidance. |
| reproducibility | AGENTS.md:49 | Build command guidance. |
| reproducibility | AGENTS.md:51 | Build command guidance. |
| reproducibility | AGENTS.md:56 | Test command guidance. |
| reproducibility | CLAUDE.md:13 | Build command guidance. |
