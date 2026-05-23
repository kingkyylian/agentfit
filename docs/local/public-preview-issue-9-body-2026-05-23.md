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

Current baseline:

- AgentFit `0.1.13` is published on npm and `kingkyylian/agentfit@v1` points at it
- 37 reviewed public dry-run candidates in the current corpus manifest
- 16 healthy internal baselines, 12 actionable local drafts, 8 reviewed no-contact snapshots, and 1 unsupported low-signal snapshot
- the latest 37-candidate refresh is recorded at https://github.com/kingkyylian/agentfit/issues/9#issuecomment-4525279626
- one stale-command finding became a merged upstream RedisInsight PR
- three AgentFit product fixes came directly from validation noise
- latest parser/discovery fixes cover npm workspace `-w`, `bun x`, markdown Cursor rules, recursive workspace scripts, package-local command checks, and command working-directory inference

No endorsement is implied by a repo being tested or mentioned. Actionable local drafts are not maintainer contact targets unless outreach is explicitly approved.
