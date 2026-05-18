# AgentFit Report

**Score:** 93/100 (A)

No failed checks.

Generated: 2026-05-18T17:26:06.007Z

**Task execution:** Static dry-run preview; generated tasks were not executed.

Run `agentfit eval --run-tasks` or select a real adapter to execute tasks in worktrees.

## Score Breakdown

| Check | Score | Notes |
| --- | ---: | --- |
| Instruction discoverability | 20/20 | 3 instruction files discovered. |
| Command freshness | 8/15 | Commands were found but not executed. |
| Reference integrity | 15/15 | All instruction references resolve. |
| Evaluation pass rate | 20/20 | 5 deterministic task previews generated; no tasks were executed. |
| Diff discipline | 10/10 | No task diffs were captured because runs were previews. |
| Safety guardrails | 10/10 | Safety guardrails found. |
| Reproducibility | 10/10 | Reproducible setup and verification guidance found. |

## Failed Checks

None.

## Caps

None.

## Instruction Files

| Path | Kind | Scope | Commands | Imports |
| --- | --- | --- | ---: | ---: |
| .github/copilot-instructions.md | copilot | .github | 13 | 0 |
| AGENTS.md | agents | . | 13 | 0 |
| CLAUDE.md | claude | . | 13 | 0 |

## Evaluation Runs

| Task | Adapter | Status | Verification | Diff | Cost |
| --- | --- | --- | --- | ---: | ---: |
| Make a safe change covered by deck-kayenta/src/kayenta/edit/editMetricModal.spec.tsx | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Make a safe change covered by deck-kayenta/src/kayenta/edit/editMetricValidation.spec.ts | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Make a safe change covered by deck-kayenta/src/kayenta/edit/filterTemplateSelector.spec.tsx | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Make a safe change covered by deck-kayenta/src/kayenta/edit/filterTemplatesValidation.spec.ts | dry-run | preview | not executed | 0 files, +0/-0 | - |
| Make a safe change covered by deck-kayenta/src/kayenta/edit/inlineTemplateEditor.spec.tsx | dry-run | preview | not executed | 0 files, +0/-0 | - |

## Command Resolutions

Showing first 25 of 33 command resolutions. JSON output contains the complete set.

| Command | Source | Script | Package | Status |
| --- | --- | --- | --- | --- |
| yarn build | .github/copilot-instructions.md:44 | build | deck/package.json | resolved |
| yarn build               # Production build | .github/copilot-instructions.md:75 | build | deck/package.json | resolved |
| yarn test                # Run unit tests | .github/copilot-instructions.md:76 | test | deck/package.json | resolved |
| yarn lint                # ESLint check | .github/copilot-instructions.md:77 | lint | deck/package.json | resolved |
| yarn prettier:check      # Check formatting | .github/copilot-instructions.md:78 | prettier:check | deck/package.json | resolved |
| yarn prettier            # Apply formatting | .github/copilot-instructions.md:79 | prettier | deck/package.json | resolved |
| npm run build | .github/copilot-instructions.md:85 | build | deck-kayenta/package.json | resolved |
| npm run test | .github/copilot-instructions.md:86 | test | deck-kayenta/package.json | resolved |
| npm run lint | .github/copilot-instructions.md:87 | lint | deck-kayenta/package.json | resolved |
| yarn lint | .github/copilot-instructions.md:95 | lint | deck-kayenta/package.json | resolved |
| yarn lint | .github/copilot-instructions.md:125 | lint | deck-kayenta/package.json | resolved |
| yarn build | AGENTS.md:44 | build | deck/package.json | resolved |
| yarn build               # Production build | AGENTS.md:75 | build | deck/package.json | resolved |
| yarn test                # Run unit tests | AGENTS.md:76 | test | deck/package.json | resolved |
| yarn lint                # ESLint check | AGENTS.md:77 | lint | deck/package.json | resolved |
| yarn prettier:check      # Check formatting | AGENTS.md:78 | prettier:check | deck/package.json | resolved |
| yarn prettier            # Apply formatting | AGENTS.md:79 | prettier | deck/package.json | resolved |
| npm run build | AGENTS.md:85 | build | deck-kayenta/package.json | resolved |
| npm run test | AGENTS.md:86 | test | deck-kayenta/package.json | resolved |
| npm run lint | AGENTS.md:87 | lint | deck-kayenta/package.json | resolved |
| yarn lint | AGENTS.md:95 | lint | deck-kayenta/package.json | resolved |
| yarn lint | AGENTS.md:125 | lint | deck-kayenta/package.json | resolved |
| yarn build | CLAUDE.md:44 | build | deck/package.json | resolved |
| yarn build               # Production build | CLAUDE.md:75 | build | deck/package.json | resolved |
| yarn test                # Run unit tests | CLAUDE.md:76 | test | deck/package.json | resolved |

## Signal Findings

| Category | Source | Evidence |
| --- | --- | --- |
| reproducibility | .github/copilot-instructions.md:44 | Build command guidance. |
| reproducibility | .github/copilot-instructions.md:75 | Build command guidance. |
| reproducibility | .github/copilot-instructions.md:76 | Test command guidance. |
| reproducibility | .github/copilot-instructions.md:77 | Test command guidance. |
| reproducibility | .github/copilot-instructions.md:78 | Test command guidance. |
| reproducibility | .github/copilot-instructions.md:85 | Build command guidance. |
| reproducibility | .github/copilot-instructions.md:86 | Test command guidance. |
| reproducibility | AGENTS.md:44 | Build command guidance. |
| reproducibility | AGENTS.md:75 | Build command guidance. |
| reproducibility | AGENTS.md:76 | Test command guidance. |
| reproducibility | AGENTS.md:77 | Test command guidance. |
| reproducibility | AGENTS.md:78 | Test command guidance. |
| reproducibility | AGENTS.md:85 | Build command guidance. |
| reproducibility | AGENTS.md:86 | Test command guidance. |
| reproducibility | CLAUDE.md:44 | Build command guidance. |
| reproducibility | CLAUDE.md:75 | Build command guidance. |
| reproducibility | CLAUDE.md:76 | Test command guidance. |
| reproducibility | CLAUDE.md:77 | Test command guidance. |
| reproducibility | CLAUDE.md:78 | Test command guidance. |
| reproducibility | CLAUDE.md:85 | Build command guidance. |
| reproducibility | CLAUDE.md:86 | Test command guidance. |
| safety | .github/copilot-instructions.md:129 | Do-not-run or do-not-expose boundary for risky actions. |
| safety | AGENTS.md:129 | Do-not-run or do-not-expose boundary for risky actions. |
| safety | CLAUDE.md:129 | Do-not-run or do-not-expose boundary for risky actions. |
