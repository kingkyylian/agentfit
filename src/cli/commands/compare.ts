import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { Command } from 'commander';
import {
  compareReports,
  renderCompareMarkdown,
  renderCompareText,
  type CompareResult
} from '../../core/compare.js';
import type { AgentFitReport } from '../../types.js';

type CompareOptions = {
  format: 'text' | 'json' | 'markdown';
  output?: string;
  failOnRegression?: boolean;
};

type ComparableReport = AgentFitReport & {
  failedChecks?: string[];
};

export function compareCommand(): Command {
  return new Command('compare')
    .description('Compare two AgentFit JSON reports.')
    .argument('<before>', 'baseline AgentFit JSON report')
    .argument('<after>', 'new AgentFit JSON report')
    .option('--format <format>', 'output format', 'text')
    .option('--output <path>', 'write comparison to path')
    .option('--fail-on-regression', 'exit non-zero when the score decreases')
    .action(async (beforePath: string, afterPath: string, rawOptions: CompareOptions) => {
      const options = validateCompareOptions(rawOptions);
      const before = await readReport(beforePath);
      const after = await readReport(afterPath);
      const result = compareReports(before, after);
      const rendered = renderCompare(result, options.format);

      if (options.output) {
        await mkdir(path.dirname(path.resolve(options.output)), { recursive: true });
        await writeFile(options.output, rendered);
      } else {
        process.stdout.write(rendered);
      }

      if (options.failOnRegression === true && result.direction === 'regressed') {
        process.exitCode = 1;
      }
    });
}

function validateCompareOptions(options: CompareOptions): CompareOptions {
  if (!['text', 'json', 'markdown'].includes(options.format)) {
    throw new Error(`Unsupported compare format: ${options.format}`);
  }

  return options;
}

async function readReport(filePath: string): Promise<ComparableReport> {
  const content = await readFile(filePath, 'utf8');
  const parsed = JSON.parse(content) as Partial<ComparableReport>;

  if (typeof parsed.score !== 'number' || typeof parsed.grade !== 'string') {
    throw new Error(`Invalid AgentFit report: ${filePath}`);
  }

  return parsed as ComparableReport;
}

function renderCompare(result: CompareResult, format: CompareOptions['format']): string {
  if (format === 'json') {
    return `${JSON.stringify(result, null, 2)}\n`;
  }

  if (format === 'markdown') {
    return renderCompareMarkdown(result);
  }

  return renderCompareText(result);
}
