import { readFile } from 'node:fs/promises';
import yaml from 'js-yaml';
import { describe, expect, it } from 'vitest';
import { createProgram } from '../../src/cli/index.js';

type PackageJson = {
  version: string;
};

type CompositeAction = {
  inputs: {
    version: {
      default: string;
    };
  };
};

type Workflow = {
  jobs: {
    agentfit: {
      steps: Array<{
        uses?: string;
        with?: Record<string, unknown>;
      }>;
    };
  };
};

type ConsumerSmokeWorkflow = {
  jobs: {
    'consumer-smoke': {
      steps: Array<{
        id?: string;
        uses?: string;
        with?: Record<string, unknown>;
      }>;
    };
  };
};

type IssueTemplate = {
  body: Array<{
    id?: string;
    attributes?: {
      placeholder?: string;
    };
  }>;
};

const versionedDocs = [
  'README.md',
  'docs/github-action.md',
  'docs/pr-comment-workflow.md',
  'docs/launch.md'
];

describe('release version consistency', () => {
  it('keeps executable and workflow defaults aligned with package.json', async () => {
    const packageVersion = await readPackageVersion();
    const cliSource = await readFile('src/cli/index.ts', 'utf8');
    const action = yaml.load(await readFile('action.yml', 'utf8')) as CompositeAction;
    const workflow = yaml.load(await readFile('.github/workflows/agentfit.yml', 'utf8')) as Workflow;
    const consumerSmoke = yaml.load(
      await readFile('.github/workflows/action-consumer-smoke.yml', 'utf8')
    ) as ConsumerSmokeWorkflow;
    const bugReport = yaml.load(
      await readFile('.github/ISSUE_TEMPLATE/bug_report.yml', 'utf8')
    ) as IssueTemplate;
    const consumerSmokeStep = consumerSmoke.jobs['consumer-smoke'].steps.find(
      (step) => step.id === 'agentfit'
    );

    expect(createProgram().version()).toBe(packageVersion);
    expect(versionLiterals(cliSource)).not.toContain(packageVersion);
    expect(action.inputs.version.default).toBe(packageVersion);
    expect(workflow.jobs.agentfit.steps.find((step) => step.uses === './')?.with?.version).toBe(packageVersion);
    expect(consumerSmokeStep).toEqual(
      expect.objectContaining({
        uses: 'kingkyylian/agentfit@v1',
        with: expect.objectContaining({
          version: packageVersion
        })
      })
    );
    expect(bugReport.body.find((item) => item.id === 'version')?.attributes?.placeholder).toBe(packageVersion);
  });

  it('keeps public version-pinned docs aligned with package.json', async () => {
    const packageVersion = await readPackageVersion();

    for (const filePath of versionedDocs) {
      const literals = versionLiterals(await readFile(filePath, 'utf8'));

      expect(literals, filePath).not.toHaveLength(0);
      expect(literals, filePath).toEqual([packageVersion]);
    }
  });
});

async function readPackageVersion(): Promise<string> {
  const packageJson = JSON.parse(await readFile('package.json', 'utf8')) as PackageJson;
  return packageJson.version;
}

function versionLiterals(content: string): string[] {
  return [...new Set(content.match(/\b\d+\.\d+\.\d+\b/g) ?? [])];
}
