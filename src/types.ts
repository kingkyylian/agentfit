export type InstructionKind = 'agents' | 'claude' | 'gemini' | 'cursor' | 'copilot' | 'unknown';

export type CommandKind = 'setup' | 'test' | 'lint' | 'build' | 'unknown';

export type ExtractedCommand = {
  value: string;
  sourcePath: string;
  line: number;
  kind: CommandKind;
};

export type InstructionFile = {
  path: string;
  scope: string;
  kind: InstructionKind;
  bytes: number;
  importedPaths: string[];
  commands: ExtractedCommand[];
};

export type ReferenceIssue = {
  sourcePath: string;
  line: number;
  target: string;
  message: string;
  severity: 'error' | 'warning';
};

export type StaticIssue = {
  category: 'command' | 'scope';
  sourcePath: string;
  message: string;
  severity: 'error' | 'warning';
};

export type CommandResult = {
  command: string;
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
};

export type FitnessTask = {
  id: string;
  title: string;
  prompt: string;
  expectedChecks: string[];
  filesLikelyTouched: string[];
};

export type EvaluationRun = {
  id: string;
  adapter: 'dry-run' | 'codex';
  task: FitnessTask;
  startedAt: string;
  finishedAt: string;
  status: 'passed' | 'failed' | 'skipped';
  verification: CommandResult[];
  diffStat: {
    filesChanged: number;
    insertions: number;
    deletions: number;
  };
  costUsd?: number;
  message?: string;
};

export type AgentFitReport = {
  score: number;
  grade: string;
  summary: string;
  instructionFiles: InstructionFile[];
  referenceIssues: ReferenceIssue[];
  staticIssues?: StaticIssue[];
  tasks: FitnessTask[];
  runs: EvaluationRun[];
  caps: string[];
  generatedAt: string;
};
