import type { CommandResult, EvaluationRun, FitnessTask } from '../types.js';

export type AdapterName = EvaluationRun['adapter'];

export type AdapterContext = {
  root: string;
  worktreePath: string;
  timeoutMs?: number;
  budgetUsd?: number;
};

export type AdapterRunResult = {
  status?: EvaluationRun['status'];
  message?: string;
  verification?: CommandResult[];
  costUsd?: number;
};

export type EvaluationAdapter = {
  name: AdapterName;
  prepare?: (context: AdapterContext) => Promise<void>;
  runTask: (context: AdapterContext, task: FitnessTask) => Promise<AdapterRunResult>;
  cleanup?: (context: AdapterContext) => Promise<void>;
};
