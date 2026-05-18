# Corpus Validation Sprint Execution Implementation Plan

> **For agentic workers:** Execute this plan task-by-task. In Codex, use `executing-plans` inline unless the user explicitly asks for subagents or parallel agent work. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the real-world corpus from a 5-repo seed into a 30-repo metadata queue, run the first 5 dry-run snapshots, and turn each result into clear triage.

**Architecture:** Keep GitHub search, cloning, and snapshot generation outside AgentFit's default dry-run adapter. Use the checked-in corpus manifest as the source of truth, store only AgentFit-generated reports in `examples/reports/real-world`, and capture triage decisions in docs before any maintainer contact. Product fixes only happen after a report is classified as noisy and reproduced locally.

**Tech Stack:** AgentFit CLI, TypeScript build output, GitHub public repositories, YAML corpus manifest, Markdown/JSON report outputs, local `/private/tmp` snapshot workspace.

---

## Execution Rules

- Do not copy public instruction-file bodies into this repository.
- Do not run `--run-tasks` during this sprint.
- Do not use real agent adapters during this sprint.
- Do not contact maintainers from search results alone.
- Use local `node /Users/kyylian/agentfit/dist/index.js` for snapshots after building AgentFit.
- Clone public repos under `/private/tmp/agentfit-real-world/repos`, not inside `/Users/kyylian/agentfit`.
- Store generated report outputs under `examples/reports/real-world` only after reviewing them.
- Commit in small batches after validation passes.

## File Structure

- Modify: `examples/corpus/real-world-candidates.yml`
  - Expand from 5 seed repositories to 30 metadata-only candidates.
- Modify: `docs/real-world-validation.md`
  - Add a 2026-05-17 execution queue and triage table.
- Modify: `docs/real-world.md`
  - Add links only for reviewed report snapshots.
- Create: `examples/reports/real-world/meltano.md`
- Create: `examples/reports/real-world/meltano.json`
- Create: `examples/reports/real-world/enso.md`
- Create: `examples/reports/real-world/enso.json`
- Create: `examples/reports/real-world/steeltoe.md`
- Create: `examples/reports/real-world/steeltoe.json`
- Create: `examples/reports/real-world/rozenite.md`
- Create: `examples/reports/real-world/rozenite.json`
- Create: `examples/reports/real-world/onebutton.md`
- Create: `examples/reports/real-world/onebutton.json`

## Candidate Expansion Target

The manifest must contain these 30 repositories after Task 2:

```text
meltano/meltano
enso-org/enso
SteeltoeOSS/Steeltoe
callstackincubator/rozenite
mathertel/OneButton
dusk-network/rusk
NikolayS/postgres_dba
numerai/example-scripts
econ-ark/HARK
IOBR/IOBR
DataDog/lading
percona/psmdb-docs
statelyai/xstate
gitbutlerapp/gitbutler
lerna/lerna
redis/RedisInsight
grafana/mimir
pingcap/tidb
appsmithorg/appsmith
javascript-obfuscator/javascript-obfuscator
zapier/zapier-platform
snyk/snyk-intellij-plugin
projen/projen
Dart-Code/Dart-Code
kubernetes/kops
opf/openproject
spinnaker/spinnaker
hashintel/hash
eggjs/egg
erigontech/erigon
```

## Task 1: Baseline Verification

**Files:**
- Read: `package.json`
- Read: `examples/corpus/real-world-candidates.yml`
- Read: `docs/real-world-validation.md`

- [ ] **Step 1: Confirm the worktree starts clean**

Run:

```bash
rtk git status --short
```

Expected:

```text
ok
```

- [ ] **Step 2: Build the local CLI used for snapshots**

Run:

```bash
rtk pnpm build
```

Expected: build exits 0 and writes `dist/index.js`.

- [ ] **Step 3: Validate current corpus tooling**

Run:

```bash
rtk pnpm corpus:check
rtk node dist/index.js corpus --status candidate --limit 5
```

Expected: `corpus:check` exits 0 and the second command prints 5 candidates.

- [ ] **Step 4: Commit**

No commit for this task. It is a read-only baseline.

## Task 2: Expand Manifest To 30 Candidates

**Files:**
- Modify: `examples/corpus/real-world-candidates.yml`
- Modify: `docs/real-world-validation.md`

- [ ] **Step 1: Add 25 more metadata-only candidates**

Append entries for these repositories to `examples/corpus/real-world-candidates.yml`, preserving the existing 5 seed entries:

```yaml
  - repo: dusk-network/rusk
    instructionSources:
      - agents.md
    searchQuery: filename:AGENTS.md is:public fork:false
    stack: Rust
    shape: platform implementation repository
    recentActivity: active on 2026-05-04 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: lowercase instruction filename and Rust verification guidance
    contactPolicy: no contact before report review
  - repo: NikolayS/postgres_dba
    instructionSources:
      - CLAUDE.md
    searchQuery: path:CLAUDE.md is:public fork:false
    stack: PLpgSQL
    shape: focused database tooling repository
    recentActivity: active on 2026-05-13 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: database-specific instruction patterns outside app code
    contactPolicy: no contact before report review
  - repo: numerai/example-scripts
    instructionSources:
      - AGENTS.md
    searchQuery: path:AGENTS.md is:public fork:false
    stack: Jupyter Notebook
    shape: example and notebook repository
    recentActivity: active on 2026-05-15 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: notebook-heavy project handling
    contactPolicy: no contact before report review
  - repo: econ-ark/HARK
    instructionSources:
      - AGENTS.md
    searchQuery: path:AGENTS.md is:public fork:false
    stack: Python
    shape: scientific Python package
    recentActivity: active on 2026-05-09 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: reproducibility guidance in scientific software
    contactPolicy: no contact before report review
  - repo: IOBR/IOBR
    instructionSources:
      - copilot-instructions.md
    searchQuery: path:.github/copilot-instructions.md is:public fork:false
    stack: R
    shape: active R package
    recentActivity: active on 2026-05-15 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: Copilot instruction handling outside common JS stacks
    contactPolicy: no contact before report review
  - repo: DataDog/lading
    instructionSources:
      - AGENTS.md
    searchQuery: path:AGENTS.md is:public fork:false
    stack: Rust
    shape: focused load-testing tools
    recentActivity: active on 2026-05-13 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: compact infrastructure tool report
    contactPolicy: no contact before report review
  - repo: percona/psmdb-docs
    instructionSources:
      - copilot-instructions.md
    searchQuery: path:.github/copilot-instructions.md is:public fork:false
    stack: HTML
    shape: documentation repository
    recentActivity: active on 2026-05-13 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: documentation-repo instruction expectations
    contactPolicy: no contact before report review
  - repo: statelyai/xstate
    instructionSources:
      - AGENTS.md
      - CLAUDE.md
    searchQuery: path:AGENTS.md is:public fork:false
    stack: TypeScript
    shape: package monorepo
    recentActivity: active on 2026-05-11 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: high-visibility monorepo scope signal
    contactPolicy: no contact before report review
  - repo: gitbutlerapp/gitbutler
    instructionSources:
      - AGENTS.md
      - copilot-instructions.md
    searchQuery: path:AGENTS.md is:public fork:false
    stack: Rust
    shape: desktop application monorepo
    recentActivity: active on 2026-05-11 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: layered agent guidance in Rust desktop code
    contactPolicy: no contact before report review
  - repo: lerna/lerna
    instructionSources:
      - CLAUDE.md
    searchQuery: path:CLAUDE.md is:public fork:false
    stack: TypeScript
    shape: tooling monorepo
    recentActivity: active on 2026-05-09 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: clear package command and safety guidance
    contactPolicy: no contact before report review
  - repo: redis/RedisInsight
    instructionSources:
      - AGENTS.md
      - .cursor/rules
      - .github/copilot-instructions.md
    searchQuery: path:.cursor/rules/ is:public fork:false
    stack: TypeScript
    shape: desktop and web application
    recentActivity: active on 2026-05-11 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: stale command regression guard after prior upstream fix
    contactPolicy: no contact unless a new concrete drift is reproduced
  - repo: grafana/mimir
    instructionSources:
      - AGENTS.md
      - CLAUDE.md
    searchQuery: path:AGENTS.md is:public fork:false
    stack: Go
    shape: infrastructure monorepo
    recentActivity: active on 2026-05-11 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: healthy layered instruction baseline
    contactPolicy: permission before public named use
  - repo: pingcap/tidb
    instructionSources:
      - AGENTS.md
      - CLAUDE.md
    searchQuery: path:AGENTS.md is:public fork:false
    stack: Go
    shape: large infrastructure monorepo
    recentActivity: active on 2026-05-11 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: large monorepo reproducibility signal
    contactPolicy: no contact before report review
  - repo: appsmithorg/appsmith
    instructionSources:
      - .cursor/rules
    searchQuery: path:.cursor/rules/ is:public fork:false
    stack: TypeScript
    shape: application monorepo
    recentActivity: active on 2026-05-11 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: Cursor rules and package-local command resolution
    contactPolicy: no contact before report review
  - repo: javascript-obfuscator/javascript-obfuscator
    instructionSources:
      - CLAUDE.md
    searchQuery: path:CLAUDE.md is:public fork:false
    stack: TypeScript
    shape: focused library
    recentActivity: active on 2026-04-27 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: reproducibility command guidance without broad monorepo noise
    contactPolicy: no contact before report review
  - repo: zapier/zapier-platform
    instructionSources:
      - CLAUDE.md
      - .github/copilot-instructions.md
    searchQuery: path:.github/copilot-instructions.md is:public fork:false
    stack: JavaScript
    shape: package repository
    recentActivity: active on 2026-05-07 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: safety scoring and package scope gaps
    contactPolicy: no contact before report review
  - repo: snyk/snyk-intellij-plugin
    instructionSources:
      - .cursor/rules
    searchQuery: path:.cursor/rules/ is:public fork:false
    stack: Kotlin
    shape: focused IDE plugin
    recentActivity: active on 2026-05-11 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: Cursor-only instruction coverage
    contactPolicy: no contact before report review
  - repo: projen/projen
    instructionSources:
      - AGENTS.md
      - CLAUDE.md
      - .github/copilot-instructions.md
    searchQuery: path:AGENTS.md is:public fork:false
    stack: TypeScript
    shape: tooling repository
    recentActivity: active on 2026-05-11 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: healthy multi-instruction baseline
    contactPolicy: permission before public named use
  - repo: Dart-Code/Dart-Code
    instructionSources:
      - AGENTS.md
    searchQuery: path:AGENTS.md is:public fork:false
    stack: TypeScript
    shape: editor extension
    recentActivity: active on 2026-05-11 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: compact extension instruction baseline
    contactPolicy: permission before public named use
  - repo: kubernetes/kops
    instructionSources:
      - AGENTS.md
      - CLAUDE.md
      - GEMINI.md
    searchQuery: path:AGENTS.md is:public fork:false
    stack: Go
    shape: infrastructure repository
    recentActivity: active on 2026-05-11 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: multiple agent instruction formats in Go infrastructure
    contactPolicy: permission before public named use
  - repo: opf/openproject
    instructionSources:
      - AGENTS.md
      - CLAUDE.md
      - .github/copilot-instructions.md
    searchQuery: path:AGENTS.md is:public fork:false
    stack: Ruby and TypeScript
    shape: large application
    recentActivity: active on 2026-05-11 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: layered instruction files in a large application
    contactPolicy: permission before public named use
  - repo: spinnaker/spinnaker
    instructionSources:
      - AGENTS.md
      - CLAUDE.md
      - .github/copilot-instructions.md
    searchQuery: path:AGENTS.md is:public fork:false
    stack: Java and TypeScript
    shape: multi-service monorepo
    recentActivity: active on 2026-05-09 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: service-scope instruction and package command behavior
    contactPolicy: no contact before report review
  - repo: hashintel/hash
    instructionSources:
      - AGENTS.md
      - CLAUDE.md
      - .cursor/rules
    searchQuery: path:.cursor/rules/ is:public fork:false
    stack: Rust and TypeScript
    shape: product monorepo
    recentActivity: active on 2026-05-11 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: complex product monorepo instruction layering
    contactPolicy: no contact before report review
  - repo: eggjs/egg
    instructionSources:
      - AGENTS.md
      - CLAUDE.md
      - .github/copilot-instructions.md
    searchQuery: path:AGENTS.md is:public fork:false
    stack: TypeScript
    shape: framework monorepo
    recentActivity: active on 2026-05-10 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: framework monorepo command parsing and scope signal
    contactPolicy: no contact before report review
  - repo: erigontech/erigon
    instructionSources:
      - AGENTS.md
      - CLAUDE.md
    searchQuery: filename:AGENTS.md is:public fork:false
    stack: Go
    shape: infrastructure repository
    recentActivity: active on 2026-05-11 scan
    licenseStatus: unverified
    status: candidate
    expectedSignal: large Go repository with possible Git LFS checkout caveat
    contactPolicy: no contact before report review
```

- [ ] **Step 2: Validate manifest count**

Run:

```bash
rtk pnpm corpus:check
rtk node -e "const fs=require('fs'); const yaml=require('js-yaml'); const data=yaml.load(fs.readFileSync('examples/corpus/real-world-candidates.yml','utf8')); console.log(data.candidates.length);"
```

Expected:

```text
30
```

- [ ] **Step 3: Add the execution queue to docs**

Add this section to `docs/real-world-validation.md` after `## 2026-05-15 Search Candidate Scan`:

```markdown
## 2026-05-17 Execution Queue

This queue is mirrored in `examples/corpus/real-world-candidates.yml`. It is a dry-run target list only; it is not a maintainer contact list.

| Batch | Repository | Source | Stack | Planned Action |
| --- | --- | --- | --- | --- |
| 1 | `meltano/meltano` | `AGENTS.md` | Python | dry-run snapshot |
| 1 | `enso-org/enso` | `CLAUDE.md` | Java | dry-run snapshot |
| 1 | `SteeltoeOSS/Steeltoe` | `AGENTS.md` | C# | dry-run snapshot |
| 1 | `callstackincubator/rozenite` | `AGENTS.md` | TypeScript | dry-run snapshot |
| 1 | `mathertel/OneButton` | Copilot | C++ | dry-run snapshot |
| 2 | `dusk-network/rusk` | `agents.md` | Rust | queue only |
| 2 | `NikolayS/postgres_dba` | `CLAUDE.md` | PLpgSQL | queue only |
| 2 | `numerai/example-scripts` | `AGENTS.md` | Notebook | queue only |
| 2 | `econ-ark/HARK` | `AGENTS.md` | Python | queue only |
| 2 | `IOBR/IOBR` | Copilot | R | queue only |
```

- [ ] **Step 4: Commit**

```bash
rtk git add examples/corpus/real-world-candidates.yml docs/real-world-validation.md
rtk git commit -m "docs: expand real-world validation queue"
```

## Task 3: Generate First Five Dry-Run Snapshots

**Files:**
- Create: `examples/reports/real-world/meltano.md`
- Create: `examples/reports/real-world/meltano.json`
- Create: `examples/reports/real-world/enso.md`
- Create: `examples/reports/real-world/enso.json`
- Create: `examples/reports/real-world/steeltoe.md`
- Create: `examples/reports/real-world/steeltoe.json`
- Create: `examples/reports/real-world/rozenite.md`
- Create: `examples/reports/real-world/rozenite.json`
- Create: `examples/reports/real-world/onebutton.md`
- Create: `examples/reports/real-world/onebutton.json`
- Modify: `examples/corpus/real-world-candidates.yml`

- [ ] **Step 1: Prepare external workspace**

Run:

```bash
rtk mkdir -p /private/tmp/agentfit-real-world/repos /private/tmp/agentfit-real-world/reports
```

Expected: command exits 0.

- [ ] **Step 2: Clone and snapshot `meltano/meltano`**

Run:

```bash
rtk git clone --depth 1 https://github.com/meltano/meltano.git /private/tmp/agentfit-real-world/repos/meltano
rtk git -C /private/tmp/agentfit-real-world/repos/meltano rev-parse --short HEAD
rtk node /Users/kyylian/agentfit/dist/index.js eval --adapter dry-run --format markdown --output /private/tmp/agentfit-real-world/reports/meltano.md --json-output /private/tmp/agentfit-real-world/reports/meltano.json
rtk cp /private/tmp/agentfit-real-world/reports/meltano.md /Users/kyylian/agentfit/examples/reports/real-world/meltano.md
rtk cp /private/tmp/agentfit-real-world/reports/meltano.json /Users/kyylian/agentfit/examples/reports/real-world/meltano.json
```

Expected: dry-run report is generated without executing generated tasks.

- [ ] **Step 3: Clone and snapshot `enso-org/enso`**

Run:

```bash
rtk git clone --depth 1 https://github.com/enso-org/enso.git /private/tmp/agentfit-real-world/repos/enso
rtk git -C /private/tmp/agentfit-real-world/repos/enso rev-parse --short HEAD
rtk node /Users/kyylian/agentfit/dist/index.js eval --adapter dry-run --format markdown --output /private/tmp/agentfit-real-world/reports/enso.md --json-output /private/tmp/agentfit-real-world/reports/enso.json
rtk cp /private/tmp/agentfit-real-world/reports/enso.md /Users/kyylian/agentfit/examples/reports/real-world/enso.md
rtk cp /private/tmp/agentfit-real-world/reports/enso.json /Users/kyylian/agentfit/examples/reports/real-world/enso.json
```

Expected: dry-run report is generated without executing generated tasks.

- [ ] **Step 4: Clone and snapshot `SteeltoeOSS/Steeltoe`**

Run:

```bash
rtk git clone --depth 1 https://github.com/SteeltoeOSS/Steeltoe.git /private/tmp/agentfit-real-world/repos/steeltoe
rtk git -C /private/tmp/agentfit-real-world/repos/steeltoe rev-parse --short HEAD
rtk node /Users/kyylian/agentfit/dist/index.js eval --adapter dry-run --format markdown --output /private/tmp/agentfit-real-world/reports/steeltoe.md --json-output /private/tmp/agentfit-real-world/reports/steeltoe.json
rtk cp /private/tmp/agentfit-real-world/reports/steeltoe.md /Users/kyylian/agentfit/examples/reports/real-world/steeltoe.md
rtk cp /private/tmp/agentfit-real-world/reports/steeltoe.json /Users/kyylian/agentfit/examples/reports/real-world/steeltoe.json
```

Expected: dry-run report is generated without executing generated tasks.

- [ ] **Step 5: Clone and snapshot `callstackincubator/rozenite`**

Run:

```bash
rtk git clone --depth 1 https://github.com/callstackincubator/rozenite.git /private/tmp/agentfit-real-world/repos/rozenite
rtk git -C /private/tmp/agentfit-real-world/repos/rozenite rev-parse --short HEAD
rtk node /Users/kyylian/agentfit/dist/index.js eval --adapter dry-run --format markdown --output /private/tmp/agentfit-real-world/reports/rozenite.md --json-output /private/tmp/agentfit-real-world/reports/rozenite.json
rtk cp /private/tmp/agentfit-real-world/reports/rozenite.md /Users/kyylian/agentfit/examples/reports/real-world/rozenite.md
rtk cp /private/tmp/agentfit-real-world/reports/rozenite.json /Users/kyylian/agentfit/examples/reports/real-world/rozenite.json
```

Expected: dry-run report is generated without executing generated tasks.

- [ ] **Step 6: Clone and snapshot `mathertel/OneButton`**

Run:

```bash
rtk git clone --depth 1 https://github.com/mathertel/OneButton.git /private/tmp/agentfit-real-world/repos/onebutton
rtk git -C /private/tmp/agentfit-real-world/repos/onebutton rev-parse --short HEAD
rtk node /Users/kyylian/agentfit/dist/index.js eval --adapter dry-run --format markdown --output /private/tmp/agentfit-real-world/reports/onebutton.md --json-output /private/tmp/agentfit-real-world/reports/onebutton.json
rtk cp /private/tmp/agentfit-real-world/reports/onebutton.md /Users/kyylian/agentfit/examples/reports/real-world/onebutton.md
rtk cp /private/tmp/agentfit-real-world/reports/onebutton.json /Users/kyylian/agentfit/examples/reports/real-world/onebutton.json
```

Expected: dry-run report is generated without executing generated tasks.

- [ ] **Step 7: Confirm snapshot reports exist**

Run:

```bash
rtk ls examples/reports/real-world/meltano.md examples/reports/real-world/enso.md examples/reports/real-world/steeltoe.md examples/reports/real-world/rozenite.md examples/reports/real-world/onebutton.md
```

Expected: all five markdown files are listed.

- [ ] **Step 8: Commit**

Commit after Task 4 triage updates are complete, not here.

## Task 4: Triage First Five Snapshots

**Files:**
- Modify: `examples/corpus/real-world-candidates.yml`
- Modify: `docs/real-world-validation.md`
- Modify: `docs/real-world.md`

- [ ] **Step 1: Extract snapshot summaries**

Run:

```bash
rtk node -e "const fs=require('fs'); for (const name of ['meltano','enso','steeltoe','rozenite','onebutton']) { const r=JSON.parse(fs.readFileSync(`examples/reports/real-world/${name}.json`,'utf8')); console.log(`${name}: ${r.score}/100 ${r.grade} | failed=${(r.failedChecks||[]).length} | instructions=${r.instructionFiles.length}`); }"
```

Expected: one summary line per snapshot.

- [ ] **Step 2: Review failed checks for maintainer-actionability**

Run:

```bash
rtk rg -n "Failed checks|Documented command|Referenced file|No runnable verification|nested scopes|Safety guardrails|Reproducibility" examples/reports/real-world/meltano.md examples/reports/real-world/enso.md examples/reports/real-world/steeltoe.md examples/reports/real-world/rozenite.md examples/reports/real-world/onebutton.md
```

Expected: matching report lines show whether each issue is concrete or broad.

- [ ] **Step 3: Set manifest statuses**

Use these exact triage rules in `examples/corpus/real-world-candidates.yml` for the first five repositories:

```text
actionable: stale command, broken reference, or concrete missing local instruction scope that a maintainer can verify in under 5 minutes
healthy: score is high and failed checks are absent or not maintainer-facing
noisy: failed checks are likely AgentFit parser/scoring/report false positives
unsupported: repo shape makes the report misleading for the current product
```

Also add `commit` and `reportPath` for each first-batch candidate:

```yaml
    reportPath: examples/reports/real-world/meltano.md
```

Add `commit` only after the matching `git rev-parse --short HEAD` command has produced a concrete hash. Do not save a first-batch manifest entry with a blank, fake, or descriptive commit value.

- [ ] **Step 4: Add sprint triage table**

Add this section to `docs/real-world-validation.md`:

```markdown
## 2026-05-17 Snapshot Triage

| Repository | Commit | Score | Triage | Contact | Main Signal |
| --- | --- | ---: | --- | --- | --- |
```

Add one row per first-batch repository only after its JSON report and commit hash are available. A valid row has a concrete short commit hash, numeric score, one triage label from `actionable`, `healthy`, `noisy`, or `unsupported`, and a short report-derived signal.

- [ ] **Step 5: Link reviewed reports**

Add links to `docs/real-world.md` only for snapshots classified as `healthy`, `actionable`, or `noisy` after review. Do not add reports classified as `unsupported`.

Use this format:

```markdown
- [meltano.md](../examples/reports/real-world/meltano.md)
```

- [ ] **Step 6: Commit**

```bash
rtk git add examples/reports/real-world examples/corpus/real-world-candidates.yml docs/real-world-validation.md docs/real-world.md
rtk git commit -m "docs: add first corpus validation snapshots"
```

## Task 5: Product Fix Gate

**Files:**
- Modify only the AgentFit source files directly tied to a reproduced noisy report.
- Modify or create focused tests for each product fix.

- [ ] **Step 1: Decide whether a product fix is needed**

Run:

```bash
rtk rg -n "status: noisy" examples/corpus/real-world-candidates.yml
```

Expected:

- no output: skip Task 5 and continue to Task 6
- one or more lines: continue with Step 2

- [ ] **Step 2: For each noisy report, write the smallest failing test**

Pick the relevant existing test file based on failure type:

```text
command parser false positive -> tests/unit/command-extractor.test.ts
reference false positive -> tests/unit/references.test.ts
scope false positive -> tests/unit/static-checks.test.ts
report wording issue -> tests/unit/markdown-report.test.ts
manifest/corpus issue -> tests/unit/real-world-corpus.test.ts or tests/unit/cli-smoke.test.ts
```

Run the focused test:

```bash
rtk pnpm test -- tests/unit/static-checks.test.ts
```

Expected: fail for the noisy behavior before changing production code.

- [ ] **Step 3: Implement the smallest source fix**

Change only the source module proven by Step 2. Do not refactor unrelated scoring or report code in the same commit.

- [ ] **Step 4: Verify the fix**

Run:

```bash
rtk pnpm test -- tests/unit/static-checks.test.ts
rtk pnpm typecheck
```

Expected: focused test and typecheck pass.

- [ ] **Step 5: Re-run affected snapshot**

Use the same external clone and report paths from Task 3 for the affected repository:

```bash
rtk pnpm build
rtk node /Users/kyylian/agentfit/dist/index.js eval --adapter dry-run --format markdown --output /private/tmp/agentfit-real-world/reports/meltano.md --json-output /private/tmp/agentfit-real-world/reports/meltano.json
rtk node /Users/kyylian/agentfit/dist/index.js eval --adapter dry-run --format markdown --output /private/tmp/agentfit-real-world/reports/enso.md --json-output /private/tmp/agentfit-real-world/reports/enso.json
rtk node /Users/kyylian/agentfit/dist/index.js eval --adapter dry-run --format markdown --output /private/tmp/agentfit-real-world/reports/steeltoe.md --json-output /private/tmp/agentfit-real-world/reports/steeltoe.json
rtk node /Users/kyylian/agentfit/dist/index.js eval --adapter dry-run --format markdown --output /private/tmp/agentfit-real-world/reports/rozenite.md --json-output /private/tmp/agentfit-real-world/reports/rozenite.json
rtk node /Users/kyylian/agentfit/dist/index.js eval --adapter dry-run --format markdown --output /private/tmp/agentfit-real-world/reports/onebutton.md --json-output /private/tmp/agentfit-real-world/reports/onebutton.json
```

Run only the snapshot command for repositories classified as `noisy`; leave the other commands unused.

- [ ] **Step 6: Commit**

```bash
rtk git add src tests examples/reports/real-world docs/real-world-validation.md examples/corpus/real-world-candidates.yml
rtk git commit -m "fix: reduce corpus validation noise"
```

## Task 6: Final Verification And Decision

**Files:**
- No new files.

- [ ] **Step 1: Run full project verification**

Run:

```bash
rtk pnpm typecheck
rtk pnpm test
rtk pnpm lint
rtk pnpm build
rtk pnpm smoke:package
rtk pnpm corpus:check
```

Expected: every command exits 0.

- [ ] **Step 2: Confirm final corpus state**

Run:

```bash
rtk node dist/index.js corpus --limit 10
rtk git status --short
```

Expected: first command prints corpus entries; second command is clean after commits.

- [ ] **Step 3: Decide public action**

Use this decision table:

```text
0 actionable, 0 noisy: publish an internal validation update only
0 actionable, 1+ noisy: fix product noise before any public claim
1+ actionable: draft maintainer issue only for concrete reproduced findings
3+ healthy: ask permission before using named healthy examples in launch copy
```

- [ ] **Step 4: Create maintainer-contact drafts only when justified**

For each `actionable` report, draft locally first in `docs/real-world-validation.md` using this exact shape:

```markdown
### Maintainer Contact Draft

Command:

```bash
agentfit eval --adapter dry-run --format markdown
```

Finding:

- Use one concrete failed check from the reviewed AgentFit report.

Why it may matter:

- Explain the practical effect in one sentence tied to that failed check.

Opt-out wording:

If this kind of tool-generated feedback is not useful for the project, I can close this and avoid opening similar issues.
```

Do not open GitHub issues in this task unless explicitly approved after review.

## Acceptance Criteria

- Manifest contains exactly 30 candidates.
- First five candidates have `commit`, `reportPath`, and non-`candidate` status after triage.
- First five dry-run reports exist as JSON and Markdown.
- No generated task execution happened.
- No real adapter execution happened.
- No maintainer contact happened without explicit approval.
- Any noisy AgentFit behavior is either fixed with a failing-first test or captured as a product follow-up in `docs/real-world-validation.md`.
- Full verification passes after commits.

## Commit Plan

```text
docs: expand real-world validation queue
docs: add first corpus validation snapshots
fix: reduce corpus validation noise
```

Only create the third commit if Task 5 finds and fixes real product noise.
