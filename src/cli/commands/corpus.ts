import { existsSync, readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import {
  loadRealWorldCorpus,
  summarizeRealWorldCorpus,
  type RealWorldCorpus,
  type RealWorldCorpusStatus
} from '../../core/real-world-corpus.js';

type CorpusOptions = {
  manifest?: string;
  status?: RealWorldCorpusStatus;
  limit?: string;
  output?: string;
  format: 'text' | 'json';
};

const defaultManifestPath = 'examples/corpus/real-world-candidates.yml';
const validStatuses: RealWorldCorpusStatus[] = [
  'candidate',
  'snapshotted',
  'actionable',
  'healthy',
  'noisy',
  'unsupported'
];

export function corpusCommand(getCwd: () => string = () => process.cwd()): Command {
  return new Command('corpus')
    .description('List and validate real-world AgentFit corpus candidates.')
    .option('--manifest <path>', 'candidate manifest path')
    .option('--status <status>', 'filter by candidate status')
    .option('--limit <count>', 'maximum candidates to print')
    .option('--output <path>', 'write output to path')
    .option('--format <format>', 'output format', 'text')
    .action(async (rawOptions: CorpusOptions) => {
      const options = validateCorpusOptions(rawOptions);
      const cwd = getCwd();
      const manifestPath = resolveManifestPath(cwd, options.manifest);
      const corpus = await loadRealWorldCorpus(manifestPath);
      const rendered = renderCorpus(corpus, options);

      if (options.output) {
        const outputPath = path.resolve(cwd, options.output);
        await mkdir(path.dirname(outputPath), { recursive: true });
        await writeFile(outputPath, rendered);
      } else {
        process.stdout.write(rendered);
      }
    });
}

function resolveManifestPath(cwd: string, manifest: string | undefined): string {
  if (manifest !== undefined) {
    return path.resolve(cwd, manifest);
  }

  const localManifest = path.resolve(cwd, defaultManifestPath);
  if (existsSync(localManifest)) {
    return localManifest;
  }

  return path.join(findPackageRoot(import.meta.url), defaultManifestPath);
}

function validateCorpusOptions(options: CorpusOptions): CorpusOptions {
  if (options.format !== 'text' && options.format !== 'json') {
    throw new Error(`Unsupported corpus format: ${options.format}`);
  }

  if (options.status !== undefined && !validStatuses.includes(options.status)) {
    throw new Error(`Unsupported corpus status: ${options.status}`);
  }

  if (options.limit !== undefined && !/^[1-9]\d*$/.test(options.limit)) {
    throw new Error('--limit must be a positive integer.');
  }

  return options;
}

function renderCorpus(corpus: RealWorldCorpus, options: CorpusOptions): string {
  const candidates = corpus.candidates
    .filter((candidate) => options.status === undefined || candidate.status === options.status)
    .slice(0, options.limit === undefined ? undefined : Number.parseInt(options.limit, 10));

  if (options.format === 'json') {
    return `${JSON.stringify({ ...summarizeRealWorldCorpus(corpus), candidates }, null, 2)}\n`;
  }

  return [
    `Real-world corpus: ${corpus.candidates.length} candidates`,
    `Updated: ${corpus.updatedAt}`,
    `Shown: ${candidates.length}`,
    '',
    ...candidates.flatMap((candidate, index) => [
      `${index + 1}. ${candidate.repo} [${candidate.status}]`,
      `   Sources: ${candidate.instructionSources.join(', ')}`,
      `   Stack: ${candidate.stack}`,
      `   Shape: ${candidate.shape}`,
      `   Query: ${candidate.searchQuery}`,
      `   Signal: ${candidate.expectedSignal}`,
      `   Contact: ${candidate.contactPolicy}`
    ]),
    ''
  ].join('\n');
}

function findPackageRoot(moduleUrl: string): string {
  let dir = path.dirname(fileURLToPath(moduleUrl));

  while (true) {
    const packageJsonPath = path.join(dir, 'package.json');
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as { name?: string };
      if (packageJson.name === '@kingkyylian/agentfit') {
        return dir;
      }
    }

    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error('Unable to locate AgentFit package root.');
    }
    dir = parent;
  }
}
