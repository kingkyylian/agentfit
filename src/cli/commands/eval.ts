import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Command } from 'commander';
import { createCodexAdapter } from '../../adapters/codex.js';
import { createDryRunAdapter } from '../../adapters/dry-run.js';
import { classifyCommand } from '../../core/command-extractor.js';
import { loadAgentFitConfig } from '../../core/config.js';
import { discoverInstructionFiles } from '../../core/discovery.js';
import { evaluateTasks } from '../../core/evaluator.js';
import { executionModeForRuns, isPreviewRun } from '../../core/execution-mode.js';
import { collectInstructionSignalFindings } from '../../core/instruction-signals.js';
import { resolveInstructionReferences } from '../../core/references.js';
import { attachScoreToReport } from '../../core/scoring.js';
import { collectStaticAnalysis } from '../../core/static-checks.js';
import { generateFitnessTasks } from '../../core/task-suite.js';
import { renderBadgeSvg } from '../../report/badge.js';
import { renderJsonReport } from '../../report/json.js';
import { renderMarkdownReport } from '../../report/markdown.js';
import type { AgentFitReport, EvaluationRun, ExtractedCommand, ReferenceIssue } from '../../types.js';

type EvalOptions = {
  adapter: 'dry-run' | 'codex';
  format: 'text' | 'json' | 'markdown' | 'badge';
  output?: string;
  jsonOutput?: string;
  markdownOutput?: string;
  badgeOutput?: string;
  tasks?: string;
  timeoutSeconds?: string;
  budgetUsd?: string;
  runTasks?: boolean;
  keepWorktrees?: boolean;
};

export function evalCommand(getCwd: () => string = () => process.cwd()): Command {
  return new Command('eval')
    .description('Evaluate agent instruction fitness.')
    .option('--adapter <adapter>', 'evaluation adapter', 'dry-run')
    .option('--format <format>', 'report format', 'text')
    .option('--output <path>', 'write report to path')
    .option('--json-output <path>', 'also write the JSON report to path')
    .option('--markdown-output <path>', 'also write the Markdown report to path')
    .option('--badge-output <path>', 'also write the SVG badge to path')
    .option('--tasks <count>', 'number of generated tasks to include')
    .option('--timeout-seconds <seconds>', 'maximum seconds for each task run')
    .option('--budget-usd <amount>', 'maximum adapter budget in USD')
    .option('--run-tasks', 'execute generated tasks in isolated worktrees')
    .option('--keep-worktrees', 'keep evaluation worktrees after running tasks')
    .action(async (rawOptions: EvalOptions) => {
      const options = validateEvalOptions(rawOptions);
      const cwd = getCwd();
      const config = await loadAgentFitConfig(cwd);
      const root = path.resolve(cwd, config.root);
      const taskCount = options.tasks ? Number.parseInt(options.tasks, 10) : config.evaluation.taskCount;
      const timeoutSeconds = options.timeoutSeconds
        ? Number.parseInt(options.timeoutSeconds, 10)
        : config.evaluation.timeoutSeconds;
      const budgetUsd = options.budgetUsd ? Number.parseFloat(options.budgetUsd) : config.evaluation.budgetUsd;
      const instructionFiles = await discoverInstructionFiles(root, config.instructions.include);
      const configuredCommands = configuredCommandsFromConfig(config.commands);
      const referenceIssues = await collectReferenceIssues(root, instructionFiles.map((file) => file.path));
      const staticAnalysis = await collectStaticAnalysis(root, instructionFiles, { configuredCommands });
      const signalFindings = await collectInstructionSignalFindings(root, instructionFiles, configuredCommands);
      const tasks = await generateFitnessTasks(root, {
        taskCount,
        allowExternalServices: config.evaluation.allowExternalServices,
        configuredChecks: config.commands.verify
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
                timeoutMs: timeoutSeconds * 1000,
                budgetUsd
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
        staticIssues: staticAnalysis.issues,
        commandResolutions: staticAnalysis.commandResolutions,
        signalFindings,
        tasks,
        runs,
        caps: [],
        generatedAt: new Date().toISOString()
      };
      const report = attachScoreToReport(baseReport, {
        safetyGuardrailsFound: signalFindings.some((finding) => finding.category === 'safety'),
        reproducibilitySignalsFound: signalFindings.some((finding) => finding.category === 'reproducibility'),
        configuredCommands,
        hasExposedSecrets: staticAnalysis.issues.some((issue) => issue.category === 'secret'),
        setupCommandFailed: runs.some((run) =>
          run.verification.some((result) => result.command.includes('install') && result.exitCode !== 0)
        )
      });
      const rendered = renderOutput(report, options.format);

      if (options.output) {
        await writeReportFile(cwd, options.output, rendered);
      } else {
        process.stdout.write(rendered);
      }

      await writeAdditionalReports(cwd, report, options);

      if (report.score < config.report.failBelowScore) {
        process.exitCode = 1;
      }
    });
}

function configuredCommandsFromConfig(commands: { setup: string[]; verify: string[] }): ExtractedCommand[] {
  return [
    ...commands.setup.map((value) => configuredCommand(value, 'setup')),
    ...commands.verify.map((value) => configuredCommand(value, 'verify'))
  ];
}

function configuredCommand(value: string, section: 'setup' | 'verify'): ExtractedCommand {
  const kind = classifyCommand(value);

  return {
    value,
    sourcePath: `agentfit.config.yml#commands.${section}`,
    line: 0,
    kind: section === 'verify' && kind === 'unknown' ? 'test' : kind
  };
}

function validateEvalOptions(options: EvalOptions): EvalOptions {
  if (!['dry-run', 'codex'].includes(options.adapter)) {
    throw new Error(`Unsupported adapter: ${options.adapter}`);
  }

  if (!['text', 'json', 'markdown', 'badge'].includes(options.format)) {
    throw new Error(`Unsupported format: ${options.format}`);
  }

  if (options.tasks !== undefined) {
    if (!isPositiveIntegerLiteral(options.tasks)) {
      throw new Error('--tasks must be a positive integer.');
    }
  }

  if (options.timeoutSeconds !== undefined) {
    if (!isPositiveIntegerLiteral(options.timeoutSeconds)) {
      throw new Error('--timeout-seconds must be a positive integer.');
    }
  }

  if (options.budgetUsd !== undefined) {
    if (!isNonNegativeNumberLiteral(options.budgetUsd)) {
      throw new Error('--budget-usd must be a non-negative number.');
    }
  }

  return options;
}

function isPositiveIntegerLiteral(value: string): boolean {
  return /^[1-9]\d*$/.test(value);
}

function isNonNegativeNumberLiteral(value: string): boolean {
  return /^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(value);
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
    textExecutionSummary(report),
    textRunSummary(report),
    ''
  ].join('\n');
}

function textExecutionSummary(report: ReturnType<typeof attachScoreToReport>): string {
  const executionMode = executionModeForRuns(report.runs);
  if (executionMode === 'preview') {
    return 'Task execution: static dry-run preview; generated tasks were not executed.';
  }

  if (executionMode === 'none') {
    return 'Task execution: no generated tasks were executed.';
  }

  if (executionMode === 'mixed') {
    return 'Task execution: mixed preview and executed runs.';
  }

  return 'Task execution: generated tasks executed in worktrees.';
}

function textRunSummary(report: ReturnType<typeof attachScoreToReport>): string {
  const previewedRuns = report.runs.filter(isPreviewRun).length;
  const executedRuns = report.runs.filter((run) => run.status !== 'skipped' && !isPreviewRun(run)).length;

  if (previewedRuns > 0) {
    return `Runs: ${executedRuns} executed, ${previewedRuns} previewed`;
  }

  return `Runs: ${executedRuns}`;
}

async function writeAdditionalReports(
  cwd: string,
  report: ReturnType<typeof attachScoreToReport>,
  options: Pick<EvalOptions, 'jsonOutput' | 'markdownOutput' | 'badgeOutput'>
): Promise<void> {
  const outputs = [
    optionalOutput(options.jsonOutput, renderJsonReport(report)),
    optionalOutput(options.markdownOutput, renderMarkdownReport(report)),
    optionalOutput(options.badgeOutput, renderBadgeSvg({ score: report.score }))
  ].filter((output): output is { filePath: string; content: string } => output !== undefined);

  for (const output of outputs) {
    await writeReportFile(cwd, output.filePath, output.content);
  }
}

async function writeReportFile(cwd: string, filePath: string, content: string): Promise<void> {
  const resolvedPath = path.resolve(cwd, filePath);
  await mkdir(path.dirname(resolvedPath), { recursive: true });
  await writeFile(resolvedPath, content);
}

function optionalOutput(filePath: string | undefined, content: string): { filePath: string; content: string } | undefined {
  if (filePath === undefined) {
    return undefined;
  }

  return { filePath, content };
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
