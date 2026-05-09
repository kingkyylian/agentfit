#!/usr/bin/env node
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { Command } from 'commander';
import { fileURLToPath } from 'node:url';
import { evalCommand } from './commands/eval.js';
import { initCommand } from './commands/init.js';
import { doctorCommand } from './commands/doctor.js';
import { compareCommand } from './commands/compare.js';

type PackageMetadata = {
  name?: string;
  version?: string;
};

export function createProgram(): Command {
  const program = new Command();

  program
    .name('agentfit')
    .description('Local-first fitness tests for AI coding-agent instruction files.')
    .version(readPackageVersion());

  program.addCommand(initCommand());
  program.addCommand(doctorCommand());
  program.addCommand(evalCommand());
  program.addCommand(compareCommand());

  return program;
}

export function isCliEntrypoint(moduleUrl: string, argvPath: string | undefined): boolean {
  if (!argvPath) {
    return false;
  }

  const modulePath = fileURLToPath(moduleUrl);
  try {
    return realpathSync(modulePath) === realpathSync(argvPath);
  } catch {
    return path.resolve(modulePath) === path.resolve(argvPath);
  }
}

function readPackageVersion(moduleUrl: string = import.meta.url): string {
  let dir = path.dirname(fileURLToPath(moduleUrl));

  while (true) {
    const packageJsonPath = path.join(dir, 'package.json');
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as PackageMetadata;
      if (packageJson.name === '@kingkyylian/agentfit' && typeof packageJson.version === 'string') {
        return packageJson.version;
      }
    }

    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error('Unable to locate AgentFit package metadata.');
    }
    dir = parent;
  }
}

if (isCliEntrypoint(import.meta.url, process.argv[1])) {
  createProgram().parseAsync(process.argv).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  });
}
