import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Command } from 'commander';
import { createCodexAdapter } from '../../adapters/codex.js';
import { createDryRunAdapter } from '../../adapters/dry-run.js';
import { loadAgentFitConfig } from '../../core/config.js';
import { discoverInstructionFiles } from '../../core/discovery.js';
import { evaluateTasks } from '../../core/evaluator.js';
import { resolveInstructionReferences } from '../../core/references.js';
import { attachScoreToReport } from '../../core/scoring.js';
import { generateFitnessTasks } from '../../core/task-suite.js';
import { renderBadgeSvg } from '../../report/badge.js';
import { renderJsonReport } from '../../report/json.js';
import { renderMarkdownReport } from '../../report/markdown.js';
import type { AgentFitReport, EvaluationRun, ReferenceIssue } from '../../types.js';

type EvalOptions = {
  adapter: 'dry-run' | 'codex';
  format: 'text' | 'json' | 'markdown' | 'badge';
  output?: string;
  tasks?: string;
  runTasks?: boolean;
  keepWorktrees?: boolean;
};

export function evalCommand(): Command {
  return new Command('eval')
    .description('Evaluate agent instruction fitness.')
    .option('--adapter <adapter>', 'evaluation adapter', 'dry-run')
    .option('--format <format>', 'report format', 'text')
    .option('--output <path>', 'write report to path')
    .option('--tasks <count>', 'number of generated tasks to include')
    .option('--run-tasks', 'execute generated tasks in isolated worktrees')
    .option('--keep-worktrees', 'keep evaluation worktrees after running tasks')
    .action(async (rawOptions: EvalOptions) => {
      const options = validateEvalOptions(rawOptions);
      const config = await loadAgentFitConfig(process.cwd());
      const root = path.resolve(process.cwd(), config.root);
      const taskCount = options.tasks ? Number.parseInt(options.tasks, 10) : config.evaluation.taskCount;
      const instructionFiles = await discoverInstructionFiles(root, config.instructions.include);
      const referenceIssues = await collectReferenceIssues(root, instructionFiles.map((file) => file.path));
      const tasks = await generateFitnessTasks(root, {
        taskCount,
        allowExternalServices: config.evaluation.allowExternalServices
      });
      const shouldRunTasks = options.runTasks === true || options.adapter === 'codex';
      const runs = shouldRunTasks
        ? await evaluateTasks(
            optionalFields(
              {
                root,
                adapter: options.adapter === 'codex' ? createCodexAdapter() : createDryRunAdapter(),
                tasks,
                worktreeDir: config.evaluation.worktreeDir,
                timeoutMs: config.evaluation.timeoutSeconds * 1000,
                budgetUsd: config.evaluation.budgetUsd
              },
              {
                keepWorktrees: options.keepWorktrees
              }
            )
          )
        : deterministicRuns(options.adapter, tasks);

      const baseReport: AgentFitReport = {
        score: 0,
        grade: 'F',
        summary: '',
        instructionFiles,
        referenceIssues,
        tasks,
        runs,
        caps: [],
        generatedAt: new Date().toISOString()
      };
      const report = attachScoreToReport(baseReport, {
        safetyGuardrailsFound: hasSafetyGuardrails(instructionFiles),
        reproducibilitySignalsFound: hasReproducibilitySignals(instructionFiles),
        setupCommandFailed: runs.some((run) =>
          run.verification.some((result) => result.command.includes('install') && result.exitCode !== 0)
        )
      });
      const rendered = renderOutput(report, options.format);

      if (options.output) {
        await mkdir(path.dirname(path.resolve(options.output)), { recursive: true });
        await writeFile(options.output, rendered);
      } else {
        process.stdout.write(rendered);
      }

      if (report.score < config.report.failBelowScore) {
        process.exitCode = 1;
      }
    });
}

function validateEvalOptions(options: EvalOptions): EvalOptions {
  if (!['dry-run', 'codex'].includes(options.adapter)) {
    throw new Error(`Unsupported adapter: ${options.adapter}`);
  }

  if (!['text', 'json', 'markdown', 'badge'].includes(options.format)) {
    throw new Error(`Unsupported format: ${options.format}`);
  }

  if (options.tasks !== undefined) {
    const parsed = Number.parseInt(options.tasks, 10);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new Error('--tasks must be a positive integer.');
    }
  }

  return options;
}

async function collectReferenceIssues(root: string, paths: string[]): Promise<ReferenceIssue[]> {
  const issues: ReferenceIssue[] = [];

  for (const sourcePath of paths) {
    const content = await readFile(path.join(root, sourcePath), 'utf8');
    const result = await resolveInstructionReferences({ root, sourcePath, content });
    issues.push(...result.issues);
  }

  return issues;
}

function deterministicRuns(adapter: EvalOptions['adapter'], tasks: AgentFitReport['tasks']): EvaluationRun[] {
  const now = new Date().toISOString();
  return tasks.map((task) => ({
    id: `${adapter}-${task.id}`,
    adapter,
    task,
    startedAt: now,
    finishedAt: now,
    status: 'passed',
    verification: [],
    diffStat: {
      filesChanged: 0,
      insertions: 0,
      deletions: 0
    },
    message: 'Deterministic dry-run completed. Re-run with --run-tasks to execute isolated worktree checks.'
  }));
}

function hasSafetyGuardrails(instructionFiles: AgentFitReport['instructionFiles']): boolean {
  return instructionFiles.some((file) =>
    file.commands.some((command) => command.value.includes('git status')) ||
    file.importedPaths.some((importedPath) => importedPath.toLowerCase().includes('security')) ||
    file.path === 'AGENTS.md'
  );
}

function hasReproducibilitySignals(instructionFiles: AgentFitReport['instructionFiles']): boolean {
  return instructionFiles.some((file) =>
    file.commands.some((command) => command.kind === 'setup' || command.kind === 'build' || command.kind === 'test')
  );
}

function renderOutput(report: ReturnType<typeof attachScoreToReport>, format: EvalOptions['format']): string {
  if (format === 'json') {
    return renderJsonReport(report);
  }

  if (format === 'markdown') {
    return renderMarkdownReport(report);
  }

  if (format === 'badge') {
    return renderBadgeSvg({ score: report.score });
  }

  return [
    `AgentFit score: ${report.score}/100 (${report.grade})`,
    report.summary,
    `Instruction files: ${report.instructionFiles.length}`,
    `Reference issues: ${report.referenceIssues.length}`,
    `Tasks: ${report.tasks.length}`,
    `Runs: ${report.runs.filter((run) => run.status !== 'skipped').length}`,
    ''
  ].join('\n');
}

function optionalFields<T extends object, U extends object>(base: T, optional: U): T & Partial<U> {
  const result: T & Partial<U> = { ...base };

  for (const [key, value] of Object.entries(optional)) {
    if (value !== undefined) {
      Object.assign(result, { [key]: value });
    }
  }

  return result;
}
