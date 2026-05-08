import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';
import { z } from 'zod';
import { DEFAULT_INSTRUCTION_PATTERNS } from './discovery.js';

const configSchema = z.object({
  version: z.literal(1),
  root: z.string().min(1),
  instructions: z.object({
    include: z.array(z.string().min(1)).min(1)
  }),
  commands: z.object({
    setup: z.array(z.string()),
    verify: z.array(z.string())
  }),
  evaluation: z.object({
    adapter: z.enum(['dry-run', 'codex']),
    taskCount: z.number().int().positive(),
    timeoutSeconds: z.number().int().positive(),
    budgetUsd: z.number().nonnegative(),
    worktreeDir: z.string().min(1),
    allowExternalServices: z.boolean()
  }),
  report: z.object({
    formats: z.array(z.enum(['json', 'markdown'])).min(1),
    failBelowScore: z.number().int().min(0).max(100)
  })
});

const partialConfigSchema = z.object({
  version: z.literal(1).optional(),
  root: z.string().min(1).optional(),
  instructions: z
    .object({
      include: z.array(z.string().min(1)).min(1).optional()
    })
    .optional(),
  commands: z
    .object({
      setup: z.array(z.string()).optional(),
      verify: z.array(z.string()).optional()
    })
    .optional(),
  evaluation: z
    .object({
      adapter: z.enum(['dry-run', 'codex']).optional(),
      taskCount: z.number().int().positive().optional(),
      timeoutSeconds: z.number().int().positive().optional(),
      budgetUsd: z.number().nonnegative().optional(),
      worktreeDir: z.string().min(1).optional(),
      allowExternalServices: z.boolean().optional()
    })
    .optional(),
  report: z
    .object({
      formats: z.array(z.enum(['json', 'markdown'])).min(1).optional(),
      failBelowScore: z.number().int().min(0).max(100).optional()
    })
    .optional()
});

export type AgentFitConfig = z.infer<typeof configSchema>;
export type AgentFitUserConfig = z.infer<typeof partialConfigSchema>;

export const DEFAULT_CONFIG: AgentFitConfig = {
  version: 1,
  root: '.',
  instructions: {
    include: DEFAULT_INSTRUCTION_PATTERNS
  },
  commands: {
    setup: [],
    verify: []
  },
  evaluation: {
    adapter: 'dry-run',
    taskCount: 5,
    timeoutSeconds: 900,
    budgetUsd: 1,
    worktreeDir: '.agentfit/worktrees',
    allowExternalServices: false
  },
  report: {
    formats: ['json', 'markdown'],
    failBelowScore: 70
  }
};

export async function loadAgentFitConfig(root: string = process.cwd()): Promise<AgentFitConfig> {
  const configPath = path.join(root, 'agentfit.config.yml');
  const userConfig = (await fileExists(configPath))
    ? parseAgentFitConfig(await readFile(configPath, 'utf8'), configPath)
    : {};

  return mergeConfig(userConfig);
}

export function parseAgentFitConfig(content: string, sourcePath = 'agentfit.config.yml'): AgentFitUserConfig {
  const loaded = yaml.load(content) ?? {};
  const parsed = partialConfigSchema.safeParse(loaded);

  if (!parsed.success) {
    throw new Error(formatConfigError(parsed.error, sourcePath));
  }

  return parsed.data;
}

export function mergeConfig(userConfig: AgentFitUserConfig): AgentFitConfig {
  const merged = {
    ...DEFAULT_CONFIG,
    ...userConfig,
    instructions: {
      ...DEFAULT_CONFIG.instructions,
      ...userConfig.instructions
    },
    commands: {
      ...DEFAULT_CONFIG.commands,
      ...userConfig.commands
    },
    evaluation: {
      ...DEFAULT_CONFIG.evaluation,
      ...userConfig.evaluation
    },
    report: {
      ...DEFAULT_CONFIG.report,
      ...userConfig.report
    }
  };

  const parsed = configSchema.safeParse(merged);
  if (!parsed.success) {
    throw new Error(formatConfigError(parsed.error, 'agentfit.config.yml'));
  }

  return parsed.data;
}

function formatConfigError(error: z.ZodError, sourcePath: string): string {
  const details = error.issues
    .map((issue) => `${issue.path.join('.') || '<root>'}: ${issue.message}`)
    .join('\n');

  return `Invalid ${sourcePath}\n${details}`;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}
