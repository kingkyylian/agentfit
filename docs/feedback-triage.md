# Feedback Triage

Use this runbook for every public repo suggestion, report sanity-check request, or new public candidate during the AgentFit public preview.

The goal is five real external signals, not broad launch metrics. A signal can be a repo suggestion, maintainer reply, report sanity-check, permission response, concrete drift finding, or product issue created from a noisy report.

## Intake

Record the source and minimum context before running anything:

- source: issue `#9`, GitHub Community, X, direct maintainer request, or code-search candidate
- repo URL
- visible instruction files, if known
- constraints from the suggester, such as sensitive paths or "do not contact maintainers"
- whether this is a maintainer/user suggestion or only a public search candidate

Use this template in local notes or an issue comment:

```text
Repo:
Source:
Suggested by:
Instruction files:
Constraints:
Consent level: suggested | public-candidate | maintainer-requested
Next action:
```

## Dry-Run Command

Start with deterministic dry-run only:

```bash
npx @kingkyylian/agentfit@latest eval --adapter dry-run --format markdown --output agentfit-report.md --json-output agentfit-report.json
```

Keep generated task execution off for first contact. Do not run real adapters unless a maintainer explicitly asks for it.

If the repo needs custom setup or a monorepo subdirectory, note that as a product or documentation follow-up before contacting maintainers.

## Classification

Classify each report into exactly one bucket:

| Bucket | Definition | Next Action |
| --- | --- | --- |
| `actionable-drift` | Concrete stale command, broken reference, or clear nested scope gap. | Prepare a narrow maintainer draft with the command and one finding. |
| `healthy-baseline` | No failed checks and no obvious noisy claim. | Keep internal unless permission is granted to name it publicly. |
| `product-noise` | AgentFit finding is false positive, confusing, or too broad. | Open or update an AgentFit issue; do not contact the repo maintainer. |
| `unsupported` | Repo shape is outside current AgentFit capabilities. | Record the reason and consider a future fixture or enhancement. |
| `needs-context` | The report may be valid, but evidence is too indirect. | Gather stronger evidence or skip maintainer contact. |

## Maintainer Contact Gate

Contact maintainers only when all of these are true:

- the finding is concrete and reproducible from a dry-run report
- the report points to a specific file, command, reference, or nested path
- the likely fix is narrow documentation/tooling cleanup
- no maintainer or suggester asked to avoid contact
- the message can be written without implying endorsement or project quality judgment

Do not contact maintainers for healthy baselines, low-signal scores, broad quality claims, or product-noise reports.

Use the maintainer outreach template in [launch-outreach.md](launch-outreach.md).

## Product Issue Gate

Open or update an AgentFit issue when:

- a command is parsed from prose that should not be treated as a runnable command
- a workspace/package command is reported stale even though the repo has a valid root or package script
- instruction discovery misses a common agent file pattern
- a report is technically correct but not useful enough for maintainer contact
- a repository shape repeatedly lands in `unsupported`

Add the report JSON or the smallest relevant excerpt. Avoid copying unrelated repository content.

## Public Use Gate

Do not name a healthy repository publicly unless a maintainer or project representative grants permission.

Actionable drift can be mentioned publicly only after it is already public through an issue or PR, or after permission is granted.

For public preview copy, prefer aggregate counts:

- reviewed dry-run snapshots
- actionable local drafts
- product fixes found from validation
- merged upstream fixes that are already public

## External Signal Counter

Track the first five external signals before broad launch:

```text
1.
2.
3.
4.
5.
```

After five signals, re-evaluate the launch gate in [launch.md](launch.md):

- continue preview if suggestions are useful but sparse
- run another validation batch if no external suggestions arrive
- prepare a broader launch only if there is new external proof

## Completion Checklist

Before marking a suggestion handled:

- dry-run report was generated or the blocker is recorded
- classification bucket is assigned
- maintainer contact decision is documented
- product issue decision is documented
- no healthy named example is used publicly without permission
- any public claim links to report output, a GitHub issue, a PR, or aggregate validation counts
