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
  const tasks = [
    ...(await tasksFromPackageScripts(root, options.allowExternalServices ?? false)),
    ...(await tasksFromTestFiles(root)),
    ...tasksFromRecentPaths(options.recentPaths ?? []),
    fallbackTask()
  ];

  return uniqueTasks(tasks).slice(0, taskCount);
}

async function tasksFromPackageScripts(
  root: string,
  allowExternalServices: boolean
): Promise<FitnessTask[]> {
  const packageJsonPath = path.join(root, 'package.json');
  const packageJson = await readJsonFile<{ scripts?: Record<string, string> }>(packageJsonPath);
  const scripts = packageJson?.scripts ?? {};

  return Object.entries(scripts)
    .filter(([, command]) => allowExternalServices || !externalServicePattern.test(command))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, command]) => ({
      id: `script-${slug(name)}`,
      title: `Exercise the ${name} package script`,
      prompt: [
        `Make a minimal repository-appropriate change that should keep the ${name} script passing.`,
        `Run npm run ${name} and report the result.`
      ].join(' '),
      expectedChecks: [`npm run ${name}`],
      filesLikelyTouched: ['package.json'],
      command
    }))
    .map(({ command: _command, ...task }) => task);
}

async function tasksFromTestFiles(root: string): Promise<FitnessTask[]> {
  const testFiles = await fg(
    ['**/*.test.{ts,tsx,js,jsx}', '**/*.spec.{ts,tsx,js,jsx}', 'tests/**/*.{ts,tsx,js,jsx}'],
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
    expectedChecks: ['npm run test'],
    filesLikelyTouched: [filePath]
  }));
}

function tasksFromRecentPaths(recentPaths: string[]): FitnessTask[] {
  return [...new Set(recentPaths.map(normalizePath))]
    .filter((filePath) => filePath && !externalServicePattern.test(filePath))
    .sort()
    .map((filePath) => ({
      id: `recent-${slug(filePath)}`,
      title: `Make a focused change near ${filePath}`,
      prompt: `Inspect ${filePath}, make a minimal repository-appropriate improvement, and run verification.`,
      expectedChecks: ['npm run test'],
      filesLikelyTouched: [filePath]
    }));
}

function fallbackTask(): FitnessTask {
  return {
    id: 'fallback-readme-wording',
    title: 'Make a harmless README wording change and run verification',
    prompt: 'Make a small wording-only README improvement, then run the configured verification command.',
    expectedChecks: ['npm run test'],
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
