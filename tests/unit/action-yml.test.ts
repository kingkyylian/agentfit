import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import yaml from 'js-yaml';
import { describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);

type CompositeAction = {
  runs: {
    steps: Array<{
      name?: string;
      run?: string;
    }>;
  };
};

describe('action.yml', () => {
  it('rejects invalid fail-below-score inputs before passing the action', async () => {
    const action = yaml.load(await readFile('action.yml', 'utf8')) as CompositeAction;
    const collectStep = action.runs.steps.find((step) => step.name === 'Collect outputs');
    const root = await mkdtemp(join(tmpdir(), 'agentfit-action-'));

    await mkdir(join(root, '.agentfit/reports'), { recursive: true });
    await writeFile(join(root, '.agentfit/reports/agentfit.json'), JSON.stringify({ score: 80 }));

    await expect(
      execFileAsync('bash', ['-euo', 'pipefail', '-c', collectStep?.run ?? ''], {
        cwd: root,
        env: {
          ...process.env,
          AGENTFIT_FAIL_BELOW_SCORE: 'not-a-number',
          GITHUB_OUTPUT: join(root, 'github-output')
        }
      })
    ).rejects.toMatchObject({ code: 1 });
  });
});
