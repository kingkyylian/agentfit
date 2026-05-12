# Attention Funnel Implementation Plan

> **For agentic workers:** Execute this plan task-by-task. In Codex, use `executing-plans` inline unless the user explicitly asks for subagents or parallel agent work. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Reframe AgentFit outreach from a product announcement into a proof-led request for real-world repo feedback.

**Architecture:** Keep the product unchanged. Update the README, launch docs, outreach copy, and GitHub repo-suggestion issue so every first-touch message leads with empirical evidence: 20 public dry-run snapshots, one merged upstream PR, and package-local false positives fixed in `0.1.10`.

**Tech Stack:** Markdown docs, GitHub issue body, existing npm/GitHub Action release artifacts.

---

## File Structure

- Modify `README.md`: move proof closer to the first screen and make the repo-suggestion ask explicit.
- Modify `docs/launch-outreach.md`: replace generic product-launch copy with proof-led, channel-specific copy and a 7-day feedback cadence.
- Modify `docs/launch.md`: record the new attention strategy and public preview gate.
- Modify GitHub issue `#9`: make the body more active and easier to respond to.
- Create `docs/superpowers/plans/2026-05-12-attention-funnel.md`: durable implementation plan for this work.

## Task 1: README Proof Block

**Files:**
- Modify: `README.md`

- [x] **Step 1: Move real-world proof closer to the install command**

Add a compact proof block after the first dry-run command:

```markdown
## Why This Exists

AgentFit has been tested against 20 public repositories that already publish coding-agent instructions. The first validation pass found one stale-command issue that became a merged upstream RedisInsight PR, and it exposed AgentFit false positives that were fixed through `0.1.10`.

The current feedback ask is narrow: suggest public repos with `AGENTS.md`, `CLAUDE.md`, Cursor rules, Copilot instructions, or similar guidance so AgentFit can run deterministic dry-run validation.
```

- [x] **Step 2: Keep the existing detailed Real-World Validation section**

Do not remove the RedisInsight links. Keep the detailed section later in the README for readers who want evidence.

- [x] **Step 3: Verify README does not start as a generic feature list**

Run:

```bash
rtk sed -n '1,120p' README.md
```

Expected: the first 120 lines include the install command, proof block, and repo-suggestion link.

## Task 2: Outreach Copy

**Files:**
- Modify: `docs/launch-outreach.md`

- [x] **Step 1: Add a current objective**

Add a section near the top:

```markdown
## Current Objective

Do not optimize for repository popularity metrics yet. Optimize for five external repo suggestions or report sanity checks from people who maintain repositories with coding-agent instructions.
```

- [x] **Step 2: Replace the first X post with a proof-led ask**

Use this copy:

```text
I ran AgentFit against 20 public repos that already have coding-agent instructions.

Useful signal:
- one stale-command issue became a merged upstream PR
- two AgentFit false-positive classes were fixed in 0.1.8
- package-local command false positives were fixed in 0.1.10

I am looking for more public repos with AGENTS.md, CLAUDE.md, Cursor rules, or Copilot instructions to dry-run validate.

Repo suggestions:
https://github.com/kingkyylian/agentfit/issues/9
```

- [x] **Step 3: Add a 7-day feedback cadence**

Add a checklist that sequences X, GitHub issue, GitHub Community, maintainer permission asks, and delayed HN/Reddit.

## Task 3: Launch Plan Alignment

**Files:**
- Modify: `docs/launch.md`

- [x] **Step 1: Update positioning**

Add:

```markdown
The next milestone is not a broad launch. It is collecting five external repo suggestions or report sanity checks.
```

- [x] **Step 2: Update public preview gate**

Make the gate concrete:

```markdown
Do not post to Hacker News or Reddit until at least one of these is true:

- issue `#9` has 3+ external repo suggestions
- a healthy named example gives permission to be referenced
- another concrete stale-command or broken-reference finding is verified
```

## Task 4: Issue #9 Body

**Files:**
- Remote: GitHub issue `#9`

- [x] **Step 1: Rewrite the issue body with a lower-friction ask**

Use:

```markdown
I am collecting public repositories that already have coding-agent instruction files so AgentFit can dry-run validate real-world guidance.

Good suggestions have one or more of:

- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`
- `.cursor/rules/*`
- `.github/copilot-instructions.md`
- `.github/instructions/**`

What I need from you:

- repo URL
- which instruction files it uses, if you know
- anything sensitive to avoid or handle carefully

What I will do:

- run AgentFit in dry-run mode
- avoid model-provider calls
- avoid executing generated tasks
- share only concrete drift, such as stale commands, broken references, or clear monorepo scope gaps
- turn noisy reports into AgentFit product issues instead of bothering maintainers

Current baseline: 20 public dry-run snapshots, one stale-command finding that became a merged upstream RedisInsight PR, and AgentFit false positives fixed through `0.1.10`.

No endorsement is implied by a repo being tested or mentioned.
```

- [x] **Step 2: Verify the issue body**

Run:

```bash
rtk gh issue view 9 --repo kingkyylian/agentfit --json body
```

Expected: the body includes "What I need from you" and `0.1.10`.

## Task 5: Verification And Commit

**Files:**
- All modified docs

- [x] **Step 1: Run text checks**

```bash
rtk rg -n "stars|perfect|AI-ready|release pending|fix on main" README.md docs/launch-outreach.md docs/launch.md
```

Expected: no stale launch claims or promotion-focused asks.

- [x] **Step 2: Run project verification**

```bash
rtk pnpm install --frozen-lockfile
rtk pnpm typecheck
rtk pnpm test
rtk pnpm lint
rtk pnpm build
rtk pnpm smoke:package
```

Expected: all pass.

- [x] **Step 3: Commit**

```bash
rtk git add README.md docs/launch-outreach.md docs/launch.md docs/superpowers/plans/2026-05-12-attention-funnel.md
rtk git commit -m "docs: sharpen attention funnel"
rtk git push origin main
```

Expected: main pushes cleanly. Do not move `v1`; it remains pinned to the `0.1.10` release commit.
