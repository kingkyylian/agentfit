import { Command } from 'commander';
import { execa } from 'execa';

export function doctorCommand(): Command {
  return new Command('doctor')
    .description('Check local AgentFit prerequisites.')
    .action(async () => {
      const checks = await Promise.all([
        checkCommand('git'),
        checkCommand('node'),
        checkCommand('pnpm'),
        checkCommand('codex', false)
      ]);

      for (const check of checks) {
        console.log(`${check.ok ? 'PASS' : check.required ? 'FAIL' : 'WARN'}  ${check.name}${check.detail ? ` - ${check.detail}` : ''}`);
      }

      if (checks.some((check) => check.required && !check.ok)) {
        process.exitCode = 1;
      }
    });
}

type DoctorCheck = {
  name: string;
  ok: boolean;
  required: boolean;
  detail?: string;
};

async function checkCommand(name: string, required = true): Promise<DoctorCheck> {
  const result = await execa('which', [name], { reject: false });
  return {
    name,
    ok: result.exitCode === 0,
    required,
    detail: result.exitCode === 0 ? result.stdout.trim() : 'not found'
  };
}
