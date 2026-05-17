import { readFile } from 'node:fs/promises';
import yaml from 'js-yaml';
import { z } from 'zod';

const statusSchema = z.enum(['candidate', 'snapshotted', 'actionable', 'healthy', 'noisy', 'unsupported']);

const candidateSchema = z.object({
  repo: z.string().regex(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/),
  instructionSources: z.array(z.string().min(1)).min(1),
  searchQuery: z.string().min(1),
  stack: z.string().min(1),
  shape: z.string().min(1),
  recentActivity: z.string().min(1),
  licenseStatus: z.enum(['unverified', 'reviewed', 'incompatible']),
  status: statusSchema,
  expectedSignal: z.string().min(1),
  contactPolicy: z.string().min(1),
  reportPath: z.string().min(1).optional(),
  commit: z.string().min(7).optional()
});

const corpusSchema = z.object({
  version: z.literal(1),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  policy: z.object({
    contentUse: z.string().min(1),
    execution: z.string().min(1),
    contact: z.string().min(1)
  }),
  candidates: z.array(candidateSchema).min(1)
});

export type RealWorldCorpusStatus = z.infer<typeof statusSchema>;
export type RealWorldCorpusCandidate = z.infer<typeof candidateSchema>;
export type RealWorldCorpus = z.infer<typeof corpusSchema>;

export type RealWorldCorpusSummary = {
  total: number;
  byStatus: Partial<Record<RealWorldCorpusStatus, number>>;
  queue: RealWorldCorpusCandidate[];
};

export async function loadRealWorldCorpus(filePath: string): Promise<RealWorldCorpus> {
  return parseRealWorldCorpus(await readFile(filePath, 'utf8'));
}

export function parseRealWorldCorpus(content: string): RealWorldCorpus {
  const parsed = corpusSchema.safeParse(yaml.load(content));

  if (!parsed.success) {
    throw new Error(formatCorpusError(parsed.error));
  }

  assertUniqueRepos(parsed.data.candidates);
  return parsed.data;
}

export function summarizeRealWorldCorpus(corpus: RealWorldCorpus): RealWorldCorpusSummary {
  const byStatus: Partial<Record<RealWorldCorpusStatus, number>> = {};

  for (const candidate of corpus.candidates) {
    byStatus[candidate.status] = (byStatus[candidate.status] ?? 0) + 1;
  }

  return {
    total: corpus.candidates.length,
    byStatus,
    queue: corpus.candidates.filter((candidate) => candidate.status === 'candidate')
  };
}

function assertUniqueRepos(candidates: RealWorldCorpusCandidate[]): void {
  const seen = new Set<string>();

  for (const candidate of candidates) {
    const key = candidate.repo.toLowerCase();
    if (seen.has(key)) {
      throw new Error(`Duplicate corpus candidate: ${candidate.repo}`);
    }
    seen.add(key);
  }
}

function formatCorpusError(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join('.') || '<root>'}: ${issue.message}`)
    .join('\n');
}
