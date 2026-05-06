#!/usr/bin/env node
import { Command } from 'commander';
import { fileURLToPath } from 'node:url';
import { evalCommand } from './commands/eval.js';
import { initCommand } from './commands/init.js';
import { doctorCommand } from './commands/doctor.js';
import { compareCommand } from './commands/compare.js';

export function createProgram(): Command {
  const program = new Command();

  program
    .name('agentfit')
    .description('Local-first fitness tests for AI coding-agent instruction files.')
    .version('0.1.0');

  program.addCommand(initCommand());
  program.addCommand(doctorCommand());
  program.addCommand(evalCommand());
  program.addCommand(compareCommand());

  return program;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  createProgram().parseAsync(process.argv).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  });
}
