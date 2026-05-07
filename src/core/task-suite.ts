import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import type { FitnessTask } from '../types.js';

export type GenerateFitnessTasksOptions = {
  taskCount?: number;
  recentPaths?: string[];
  allowExternalServices?: boolean;
};

const externalServicePattern = /\b(docker|compose|supabase|firebase|aws|gcloud|az|vercel|netlify|curl|wget|ssh)\b/i;

export async function generateFitnessTasks(
  root: string,
  options: GenerateFitnessTasksOptions = {}
): Promise<FitnessTask[]> {
  const taskCount = options.taskCount ?? 5;
  const scriptRunner = await detectProjectScriptRunner(root);
  const tasks = [
    ...(await tasksFromPackageScripts(root, options.allowExternalServices ?? false, scriptRunner)),
    ...(await tasksFromTestFiles(root, scriptRunner)),
    ...tasksFromRecentPaths(options.recentPaths ?? [], scriptRunner),
    fallbackTask(scriptRunner)
  ];

  return uniqueTasks(tasks).slice(0, taskCount);
}

async function tasksFromPackageScripts(
  root: string,
  allowExternalServices: boolean,
  scriptRunner: string
): Promise<FitnessTask[]> {
  const packageJsonPath = path.join(root, 'package.json');
  const packageJson = await readJsonFile<{ scripts?: Record<string, string> }>(packageJsonPath);
  const scripts = packageJson?.scripts ?? {};

  return Object.entries(scripts)
    .filter(([name, command]) => isFitnessScriptCandidate(name, command))
    .filter(([, command]) => allowExternalServices || !externalServicePattern.test(command))
    .sort(([left], [right]) => compareScriptNames(left, right))
    .map(([name, command]) => ({
      id: `script-${slug(name)}`,
      title: `Exercise the ${name} package script`,
      prompt: [
        `Make a minimal repository-appropriate change that should keep the ${name} script passing.`,
        `Run ${scriptRunner} ${name} and report the result.`
      ].join(' '),
      expectedChecks: [`${scriptRunner} ${name}`],
      filesLikelyTouched: ['package.json'],
      command
    }))
    .map(({ command: _command, ...task }) => task);
}

const interactiveScriptPattern = /^(dev|start|serve|preview|watch)(?::|$)/i;
const lifecycleScriptPattern = /^(pre|post)(pack|publish|publishOnly|install|version)$|^prepare$/i;
const verificationPriority = [
  /^test(?::|$)/i,
  /^typecheck$/i,
  /^lint(?::|$)/i,
  /^build$/i,
  /^(check|verify|ci)$/i
];

function isFitnessScriptCandidate(name: string, command: string): boolean {
  if (interactiveScriptPattern.test(name) || lifecycleScriptPattern.test(name)) {
    return false;
  }

  return !/\b(--watch|--serve|--dev|watch|nodemon|vite\s+--host|next\s+dev)\b/i.test(command);
}

function compareScriptNames(left: string, right: string): number {
  const leftPriority = scriptPriority(left);
  const rightPriority = scriptPriority(right);

  if (leftPriority !== rightPriority) {
    return leftPriority - rightPriority;
  }

  return left.localeCompare(right);
}

function scriptPriority(name: string): number {
  const index = verificationPriority.findIndex((pattern) => pattern.test(name));
  return index === -1 ? verificationPriority.length : index;
}

async function detectProjectScriptRunner(root: string): Promise<string> {
  const packageJson = await readJsonFile<{ packageManager?: string }>(path.join(root, 'package.json'));
  return detectScriptRunner(root, packageJson?.packageManager);
}

function detectScriptRunner(root: string, packageManager: string | undefined): string {
  if (packageManager?.startsWith('pnpm@')) {
    return 'pnpm run';
  }

  if (packageManager?.startsWith('yarn@')) {
    return 'yarn run';
  }

  if (packageManager?.startsWith('bun@')) {
    return 'bun run';
  }

  if (existsSync(path.join(root, 'pnpm-lock.yaml'))) {
    return 'pnpm run';
  }

  if (existsSync(path.join(root, 'yarn.lock'))) {
    return 'yarn run';
  }

  if (existsSync(path.join(root, 'bun.lockb')) || existsSync(path.join(root, 'bun.lock'))) {
    return 'bun run';
  }

  return 'npm run';
}

async function tasksFromTestFiles(root: string, scriptRunner: string): Promise<FitnessTask[]> {
  const testFiles = await fg(
    ['**/*.test.{ts,tsx,js,jsx}', '**/*.spec.{ts,tsx,js,jsx}'],
    {
      cwd: root,
      onlyFiles: true,
      unique: true,
      dot: false,
      ignore: ['**/node_modules/**', '**/dist/**']
    }
  );

  return testFiles.map(normalizePath).sort().map((filePath) => ({
    id: `test-${slug(path.posix.basename(filePath).replace(/\.[^.]+$/, ''))}`,
    title: `Make a safe change covered by ${filePath}`,
    prompt: `Inspect ${filePath}, make a tiny behavior-preserving improvement nearby, and run the relevant test command.`,
    expectedChecks: [`${scriptRunner} test`],
    filesLikelyTouched: [filePath]
  }));
}

function tasksFromRecentPaths(recentPaths: string[], scriptRunner: string): FitnessTask[] {
  return [...new Set(recentPaths.map(normalizePath))]
    .filter((filePath) => filePath && !externalServicePattern.test(filePath))
    .sort()
    .map((filePath) => ({
      id: `recent-${slug(filePath)}`,
      title: `Make a focused change near ${filePath}`,
      prompt: `Inspect ${filePath}, make a minimal repository-appropriate improvement, and run verification.`,
      expectedChecks: [`${scriptRunner} test`],
      filesLikelyTouched: [filePath]
    }));
}

function fallbackTask(scriptRunner: string): FitnessTask {
  return {
    id: 'fallback-readme-wording',
    title: 'Make a harmless README wording change and run verification',
    prompt: 'Make a small wording-only README improvement, then run the configured verification command.',
    expectedChecks: [`${scriptRunner} test`],
    filesLikelyTouched: ['README.md']
  };
}

function uniqueTasks(tasks: FitnessTask[]): FitnessTask[] {
  const seen = new Set<string>();
  return tasks.filter((task) => {
    if (seen.has(task.id)) {
      return false;
    }
    seen.add(task.id);
    return true;
  });
}

async function readJsonFile<T>(filePath: string): Promise<T | undefined> {
  try {
    return JSON.parse(await readFile(filePath, 'utf8')) as T;
  } catch {
    return undefined;
  }
}

function slug(value: string): string {
  return value
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function normalizePath(value: string): string {
  return value.split(path.sep).join('/');
}
