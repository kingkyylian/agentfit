# Security Policy

AgentFit is a local-first CLI and GitHub Action for evaluating coding-agent
instruction files. It may inspect repository files, run configured verification
commands, and create isolated git worktrees when task execution is enabled.

## Reporting a Vulnerability

Please do not open public issues for security reports.

Use GitHub's private vulnerability reporting flow if it is available for this
repository. If it is not available, contact the maintainer privately through the
GitHub profile.

Include:

- affected AgentFit version or commit
- command, adapter, and flags used
- whether `--run-tasks` or a real-agent adapter was enabled
- minimal reproduction steps
- expected and observed behavior
- any logs with secrets removed

## Scope

Security-sensitive areas include:

- secret redaction in generated reports
- sandboxing and cleanup for generated task runs
- GitHub Action inputs and artifact handling
- command execution boundaries
- dependency installation or package publishing flows

AgentFit should remain deterministic and local-first by default. Reports that
show unexpected network access, implicit writes, leaked secrets, or unsafe
command execution are in scope.

## Supported Versions

Only the latest released version and the current `main` branch receive security
fixes.
