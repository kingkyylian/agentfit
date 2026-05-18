import { readFile } from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import type { CommandResolution, ExtractedCommand, InstructionFile, StaticIssue } from '../types.js';

const verificationKinds = new Set(['test', 'lint', 'build']);

export type CollectStaticIssuesOptions = {
  configuredCommands?: ExtractedCommand[];
};

export type StaticAnalysis = {
  issues: StaticIssue[];
  commandResolutions: CommandResolution[];
};

export async function collectStaticIssues(
  root: string,
  instructionFiles: InstructionFile[],
  options: CollectStaticIssuesOptions = {}
): Promise<StaticIssue[]> {
  return (await collectStaticAnalysis(root, instructionFiles, options)).issues;
}

export async function collectStaticAnalysis(
  root: string,
  instructionFiles: InstructionFile[],
  options: CollectStaticIssuesOptions = {}
): Promise<StaticAnalysis> {
  const commandAnalysis = await collectCommandAnalysis(root, instructionFiles, options.configuredCommands ?? []);
  const scopeIssues = await collectScopeIssues(root, instructionFiles);
  const secretIssues = await collectSecretIssues(root, instructionFiles);

  return {
    issues: [...commandAnalysis.issues, ...scopeIssues, ...secretIssues],
    commandResolutions: commandAnalysis.commandResolutions
  };
}

export async function collectCommandResolutions(
  root: string,
  instructionFiles: InstructionFile[],
  configuredCommands: ExtractedCommand[] = []
): Promise<CommandResolution[]> {
  return (await collectCommandAnalysis(root, instructionFiles, configuredCommands)).commandResolutions;
}

type CommandAnalysis = {
  issues: StaticIssue[];
  commandResolutions: CommandResolution[];
};

type PackageJsonInfo = {
  dir: string;
  path: string;
  name?: string;
  scripts: Record<string, string>;
};

type ParsedPackageScriptCommand = {
  scriptName: string;
  cwd?: string;
  filter?: string;
  workspace?: string;
  recursive?: boolean;
  chainedCwd?: string;
};

type PackageCandidate = {
  packageJsonPath: string;
  reason: string;
  scripts: Record<string, string>;
};

async function collectCommandAnalysis(
  root: string,
  instructionFiles: InstructionFile[],
  configuredCommands: ExtractedCommand[]
): Promise<CommandAnalysis> {
  const issues: StaticIssue[] = [];
  const commandResolutions: CommandResolution[] = [];
  const packageJsons = await readPackageJsons(root);
  const instructionContents = await readInstructionContents(root, instructionFiles);
  const commands = [
    ...instructionFiles.flatMap((file) => file.commands),
    ...configuredCommands
  ];
  const verificationCommands = commands
    .filter((command) => verificationKinds.has(command.kind))
    .filter((command) => !isOptionalAliasExample(command, instructionContents.get(command.sourcePath)));
  let hasNonPackageVerification = false;

  for (const command of verificationCommands) {
    const parsed = parsePackageScriptCommand(command.value);
    if (!parsed) {
      hasNonPackageVerification = true;
      continue;
    }

    const candidate = resolvePackageCandidate({
      command,
      parsed,
      instructionFiles,
      sourceContent: instructionContents.get(command.sourcePath),
      packageJsons
    });
    const resolution: CommandResolution = {
      command: command.value,
      sourcePath: command.sourcePath,
      line: command.line,
      scriptName: parsed.scriptName,
      packageJsonPath: candidate.packageJsonPath,
      status: candidate.scripts[parsed.scriptName] === undefined ? 'missing' : 'resolved',
      reason: candidate.reason
    };
    commandResolutions.push(resolution);
  }

  reuseSameSourceResolutions(commandResolutions);

  let hasRunnableVerification = hasNonPackageVerification;
  for (const resolution of commandResolutions) {
    if (resolution.status === 'resolved') {
      hasRunnableVerification = true;
      continue;
    }

    issues.push({
      category: 'command',
      sourcePath: resolution.sourcePath,
      message: missingPackageScriptMessage(resolution),
      severity: 'error'
    });
  }

  if (!hasRunnableVerification) {
    issues.push({
      category: 'command',
      sourcePath: instructionFiles[0]?.path ?? '.',
      message: 'No runnable verification command found in instruction files.',
      severity: 'error'
    });
  }

  return {
    issues,
    commandResolutions
  };
}

function reuseSameSourceResolutions(commandResolutions: CommandResolution[]): void {
  const resolvedBySourceAndScript = new Map<string, CommandResolution>();

  for (const resolution of commandResolutions) {
    if (resolution.status === 'resolved') {
      resolvedBySourceAndScript.set(commandResolutionKey(resolution), resolution);
    }
  }

  for (const resolution of commandResolutions) {
    if (resolution.status === 'missing') {
      const resolved = resolvedBySourceAndScript.get(commandResolutionKey(resolution));
      if (resolved) {
        resolution.packageJsonPath = resolved.packageJsonPath;
        resolution.status = 'resolved';
        resolution.reason = 'same source resolved package script';
      }
    }
  }
}

function commandResolutionKey(resolution: Pick<CommandResolution, 'sourcePath' | 'scriptName'>): string {
  return `${resolution.sourcePath}\0${resolution.scriptName}`;
}

async function readInstructionContents(root: string, instructionFiles: InstructionFile[]): Promise<Map<string, string>> {
  const contents = new Map<string, string>();

  await Promise.all(
    instructionFiles.map(async (file) => {
      try {
        contents.set(file.path, await readFile(path.join(root, file.path), 'utf8'));
      } catch {
        // Ignore unreadable instruction files here; discovery/reference checks surface path issues separately.
      }
    })
  );

  return contents;
}

async function collectScopeIssues(root: string, instructionFiles: InstructionFile[]): Promise<StaticIssue[]> {
  const packageJsonPaths = await fg(['packages/*/package.json', 'apps/*/package.json'], {
    cwd: root,
    onlyFiles: true,
    dot: true,
    ignore: ['**/node_modules/**', '**/dist/**']
  });
  const instructionScopes = new Set(instructionFiles.map((file) => file.scope));

  return packageJsonPaths
    .map((packageJsonPath) => normalizePath(path.posix.dirname(packageJsonPath)))
    .sort()
    .filter((scope) => !instructionScopes.has(scope))
    .map((scope) => ({
      category: 'scope' as const,
      sourcePath: scope,
      message: `No nested instruction file found for ${scope}.`,
      severity: 'warning' as const
    }));
}

const secretPatterns = [
  {
    name: 'OpenAI API key',
    pattern: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/
  },
  {
    name: 'AWS access key ID',
    pattern: /\bA(?:KIA|SIA)[A-Z0-9]{16}\b/
  },
  {
    name: 'GitHub token',
    pattern: /\bgh[pousr]_[A-Za-z0-9_]{36,}\b/
  },
  {
    name: 'private key',
    pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/
  }
] as const;

async function collectSecretIssues(root: string, instructionFiles: InstructionFile[]): Promise<StaticIssue[]> {
  const issues: StaticIssue[] = [];

  for (const file of instructionFiles) {
    const content = await readFile(path.join(root, file.path), 'utf8');

    for (const secretPattern of secretPatterns) {
      if (secretPattern.pattern.test(content)) {
        issues.push({
          category: 'secret',
          sourcePath: file.path,
          message: `Potential ${secretPattern.name} detected in instruction file.`,
          severity: 'error'
        });
      }
    }
  }

  return issues;
}

async function readPackageJsons(root: string): Promise<PackageJsonInfo[]> {
  const packageJsonPaths = await fg(['**/package.json'], {
    cwd: root,
    onlyFiles: true,
    dot: true,
    ignore: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/vendor/**', '**/coverage/**']
  });

  const packageJsons = await Promise.all(
    packageJsonPaths
      .map(normalizePath)
      .sort()
      .map(async (packageJsonPath) => {
        const packageJson = await readPackageJson(path.join(root, packageJsonPath));
        const dir = normalizePackageDir(path.posix.dirname(packageJsonPath));

        return {
          dir,
          path: packageJsonPath,
          ...(packageJson?.name ? { name: packageJson.name } : {}),
          scripts: packageJson?.scripts ?? {}
        };
      })
  );

  return packageJsons;
}

function parsePackageScriptCommand(command: string): ParsedPackageScriptCommand | undefined {
  const chained = splitLeadingCd(command);
  const tokens = chained.command.trim().split(/\s+/);
  const manager = tokens[0];

  if (!manager || !['pnpm', 'npm', 'yarn', 'bun'].includes(manager)) {
    return undefined;
  }

  let index = 1;
  let cwd: string | undefined;
  let filter: string | undefined;
  let workspace: string | undefined;
  let recursive = false;
  let hasExplicitRun = false;

  while (index < tokens.length) {
    const token = tokens[index];
    if (!token) {
      return undefined;
    }

    const workspaceTarget = tokens[index + 1];
    if (token === 'workspace' && workspaceTarget) {
      workspace = cleanTarget(workspaceTarget);
      index += 2;
      continue;
    }

    if (token === 'run') {
      hasExplicitRun = true;
      index += 1;
      continue;
    }

    if (token === 'recursive') {
      recursive = true;
      index += 1;
      continue;
    }

    if (token.startsWith('-')) {
      const option = parsePackageManagerOption(token, tokens[index + 1]);
      if (option?.kind === 'cwd') {
        cwd = option.value;
      } else if (option?.kind === 'filter') {
        filter = option.value;
      } else if (option?.kind === 'workspace') {
        workspace = option.value;
      } else if (option?.kind === 'recursive') {
        recursive = true;
      }
      index += option?.consumed ?? 1;
      continue;
    }

    const scriptName = token;

    if (!hasExplicitRun && isPackageManagerCommand(scriptName)) {
      return undefined;
    }

    return {
      scriptName,
      ...(cwd ? { cwd } : {}),
      ...(filter ? { filter } : {}),
      ...(workspace ? { workspace } : {}),
      ...(recursive ? { recursive } : {}),
      ...(chained.cwd ? { chainedCwd: chained.cwd } : {})
    };
  }

  return undefined;
}

function parsePackageManagerOption(
  token: string,
  nextToken: string | undefined
): { kind: 'cwd' | 'filter' | 'workspace' | 'recursive'; value: string; consumed: number } | undefined {
  const [name, inlineValue] = token.split('=', 2);

  if (['--recursive', '-r'].includes(name ?? '')) {
    return { kind: 'recursive', value: '', consumed: 1 };
  }

  const optionValue = cleanTarget(inlineValue ?? nextToken ?? '');
  const consumed = inlineValue === undefined ? 2 : 1;

  if (!optionValue) {
    return undefined;
  }

  if (['--cwd', '--dir', '-C', '--prefix'].includes(name ?? '')) {
    return { kind: 'cwd', value: optionValue, consumed };
  }

  if (['--filter', '-F'].includes(name ?? '')) {
    return { kind: 'filter', value: optionValue, consumed };
  }

  if (['--workspace', '-w'].includes(name ?? '')) {
    return { kind: 'workspace', value: optionValue, consumed };
  }

  return undefined;
}

function isPackageManagerCommand(token: string): boolean {
  return ['install', 'add', 'exec', 'x', 'dlx', 'create', 'init', 'remove', 'why', 'config'].includes(token);
}

function isOptionalAliasExample(command: ExtractedCommand, sourceContent: string | undefined): boolean {
  if (!sourceContent || !packageScriptName(command.value)) {
    return false;
  }

  const lines = sourceContent.split(/\r?\n/);
  const commandLineIndex = Math.max(0, command.line - 1);
  const headingIndex = previousMarkdownHeadingIndex(lines, commandLineIndex);
  const contextStart = Math.max(headingIndex, commandLineIndex - 24);
  const context = lines.slice(contextStart, commandLineIndex + 1).join('\n').toLowerCase();
  const heading = headingIndex >= 0 ? lines[headingIndex]?.toLowerCase() ?? '' : '';

  return (
    (heading.includes('optional') && heading.includes('alias')) ||
    ((context.includes('optional') || context.includes('for convenience')) &&
      context.includes('alias') &&
      (context.includes('package.json') || context.includes('scripts')))
  );
}

function packageScriptName(command: string): string | undefined {
  return parsePackageScriptCommand(command)?.scriptName;
}

function resolvePackageCandidate(input: {
  command: ExtractedCommand;
  parsed: ParsedPackageScriptCommand;
  instructionFiles: InstructionFile[];
  sourceContent: string | undefined;
  packageJsons: PackageJsonInfo[];
}): PackageCandidate {
  if (input.parsed.cwd) {
    return packageCandidateFromDirectory(input.packageJsons, input.parsed.cwd, 'package-manager cwd option');
  }

  if (input.parsed.filter) {
    return packageCandidateFromTarget(input.packageJsons, input.parsed.filter, 'package-manager filter');
  }

  if (input.parsed.workspace) {
    return packageCandidateFromTarget(input.packageJsons, input.parsed.workspace, 'package-manager workspace');
  }

  if (input.parsed.chainedCwd) {
    return packageCandidateFromDirectory(input.packageJsons, input.parsed.chainedCwd, 'cd command');
  }

  if (input.parsed.recursive) {
    return packageCandidateFromRecursive(input.packageJsons, input.parsed.scriptName, 'package-manager recursive');
  }

  const contextualCwd = workingDirectoryFromSourceContext(input.command, input.sourceContent, input.packageJsons);
  if (contextualCwd) {
    return packageCandidateFromDirectory(input.packageJsons, contextualCwd, 'instruction working directory');
  }

  const scopedPackage = packageCandidateFromInstructionScope(input.packageJsons, input.instructionFiles, input.command);
  if (scopedPackage) {
    if (scopedPackage.scripts[input.parsed.scriptName] === undefined) {
      const rootPackage = rootPackageCandidate(input.packageJsons);
      if (rootPackage.scripts[input.parsed.scriptName] !== undefined) {
        return {
          ...rootPackage,
          reason: 'repository root fallback'
        };
      }
    }

    return scopedPackage;
  }

  return rootPackageCandidate(input.packageJsons);
}

function packageCandidateFromInstructionScope(
  packageJsons: PackageJsonInfo[],
  instructionFiles: InstructionFile[],
  command: ExtractedCommand
): PackageCandidate | undefined {
  const file = instructionFiles.find((instructionFile) => instructionFile.path === command.sourcePath);
  const scope = file?.scope ?? normalizePackageDir(path.posix.dirname(command.sourcePath));
  const packageJson = nearestPackageForScope(packageJsons, scope);

  if (!packageJson || packageJson.dir === '.') {
    return undefined;
  }

  return {
    packageJsonPath: packageJson.path,
    reason: 'instruction file scope',
    scripts: packageJson.scripts
  };
}

function packageCandidateFromDirectory(
  packageJsons: PackageJsonInfo[],
  dir: string,
  reason: string
): PackageCandidate {
  const normalizedDir = normalizePackageDir(dir);
  const packageJson = packageJsons.find((candidate) => candidate.dir === normalizedDir);

  return {
    packageJsonPath: packageJson?.path ?? packageJsonPathForDir(normalizedDir),
    reason,
    scripts: packageJson?.scripts ?? {}
  };
}

function packageCandidateFromTarget(
  packageJsons: PackageJsonInfo[],
  target: string,
  reason: string
): PackageCandidate {
  const normalizedTarget = cleanFilterTarget(target);
  const packageJsonByName = packageJsons.find((candidate) => candidate.name === normalizedTarget);
  if (packageJsonByName) {
    return {
      packageJsonPath: packageJsonByName.path,
      reason,
      scripts: packageJsonByName.scripts
    };
  }

  return packageCandidateFromDirectory(packageJsons, normalizedTarget, reason);
}

function packageCandidateFromRecursive(packageJsons: PackageJsonInfo[], scriptName: string, reason: string): PackageCandidate {
  const matches = packageJsons.filter((candidate) => candidate.dir !== '.' && candidate.scripts[scriptName] !== undefined);
  if (matches.length === 1) {
    const [match] = matches;
    return {
      packageJsonPath: match?.path ?? 'workspace package.json files',
      reason,
      scripts: match?.scripts ?? {}
    };
  }

  if (matches.length > 1) {
    return {
      packageJsonPath: `${matches.length} workspace package.json files`,
      reason,
      scripts: { [scriptName]: 'recursive workspace script' }
    };
  }

  return {
    packageJsonPath: 'workspace package.json files',
    reason,
    scripts: {}
  };
}

function rootPackageCandidate(packageJsons: PackageJsonInfo[]): PackageCandidate {
  const packageJson = packageJsons.find((candidate) => candidate.dir === '.');

  return {
    packageJsonPath: packageJson?.path ?? 'package.json',
    reason: 'repository root',
    scripts: packageJson?.scripts ?? {}
  };
}

function nearestPackageForScope(packageJsons: PackageJsonInfo[], scope: string): PackageJsonInfo | undefined {
  const normalizedScope = normalizePackageDir(scope);

  return [...packageJsons]
    .sort((left, right) => right.dir.length - left.dir.length)
    .find((candidate) => candidate.dir !== '.' && isPathInsideOrEqual(normalizedScope, candidate.dir));
}

function isPathInsideOrEqual(value: string, parent: string): boolean {
  return value === parent || value.startsWith(`${parent}/`);
}

function packageJsonPathForDir(dir: string): string {
  return dir === '.' ? 'package.json' : `${dir}/package.json`;
}

function splitLeadingCd(command: string): { command: string; cwd?: string } {
  const match = command.trim().match(/^cd\s+(.+?)\s*(?:&&|;)\s*(.+)$/);
  if (!match?.[1] || !match[2]) {
    return { command };
  }

  return {
    command: match[2],
    cwd: normalizeCandidateDir(match[1])
  };
}

function workingDirectoryFromSourceContext(
  command: ExtractedCommand,
  sourceContent: string | undefined,
  packageJsons: PackageJsonInfo[]
): string | undefined {
  if (!sourceContent) {
    return undefined;
  }

  const lines = sourceContent.split(/\r?\n/);
  const commandIndex = Math.max(0, command.line - 1);
  const contextStart = Math.max(0, commandIndex - 16);

  for (let index = commandIndex; index >= contextStart; index -= 1) {
    const line = lines[index] ?? '';
    const cdDirectory = directoryFromCdLine(line);
    if (cdDirectory) {
      return cdDirectory;
    }

    const proseDirectory = directoryFromProse(line);
    if (proseDirectory) {
      return proseDirectory;
    }
  }

  const headingDirectory = directoryFromPreviousHeadings(lines, commandIndex);
  if (headingDirectory) {
    return headingDirectory;
  }

  const frontmatterDirectory = directoryFromFrontmatterGlobs(lines, packageJsons);
  if (frontmatterDirectory) {
    return frontmatterDirectory;
  }

  return undefined;
}

function directoryFromCdLine(line: string): string | undefined {
  const match = line.trim().match(/^(?:\$\s+)?cd\s+(.+?)\s*$/);
  return match?.[1] ? normalizeCandidateDir(match[1]) : undefined;
}

function directoryFromProse(line: string): string | undefined {
  const explicitMatch =
    line.match(/\b(?:run|runs|execute|executes|executed)\s+from\s+`([^`]+)`/i) ??
    line.match(/\b(?:run|runs|execute|executes|executed)\s+from\s+([A-Za-z0-9@._/-]+)/i) ??
    line.match(/\bcwd\s*[:=]\s*`([^`]+)`/i) ??
    line.match(/\bcwd\s*[:=]\s*([A-Za-z0-9@._/-]+)/i);

  return explicitMatch?.[1] ? normalizeCandidateDir(explicitMatch[1]) : undefined;
}

function directoryFromPreviousHeadings(lines: string[], commandIndex: number): string | undefined {
  let childHeadingLevel: number | undefined;

  for (let index = commandIndex; index >= 0; index -= 1) {
    const line = lines[index] ?? '';
    const level = markdownHeadingLevel(line);
    if (!level) {
      continue;
    }

    if (childHeadingLevel !== undefined && level >= childHeadingLevel) {
      continue;
    }

    childHeadingLevel = level;
    const directory = directoryFromBacktickPath(line);
    if (directory) {
      return directory;
    }
  }

  return undefined;
}

function markdownHeadingLevel(line: string): number | undefined {
  return line.match(/^\s{0,3}(#{1,6})\s+/)?.[1]?.length;
}

function directoryFromBacktickPath(line: string): string | undefined {
  for (const match of line.matchAll(/`([^`]+)`/g)) {
    const candidate = normalizeCandidateDir(match[1] ?? '');
    if (looksLikeDirectoryReference(candidate)) {
      return candidate;
    }
  }

  return undefined;
}

function directoryFromFrontmatterGlobs(lines: string[], packageJsons: PackageJsonInfo[]): string | undefined {
  if ((lines[0] ?? '').trim() !== '---') {
    return undefined;
  }

  const endIndex = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
  if (endIndex < 0) {
    return undefined;
  }

  const frontmatter = lines.slice(1, endIndex);
  for (const line of frontmatter) {
    const globPath = line.match(/^\s*-\s+(.+)$/)?.[1];
    if (!globPath) {
      continue;
    }

    const packageJson = nearestPackageForGlob(packageJsons, cleanGlobPath(globPath));
    if (packageJson) {
      return packageJson.dir;
    }
  }

  return undefined;
}

function nearestPackageForGlob(packageJsons: PackageJsonInfo[], globPath: string): PackageJsonInfo | undefined {
  return [...packageJsons]
    .sort((left, right) => right.dir.length - left.dir.length)
    .find((candidate) => candidate.dir !== '.' && isPathInsideOrEqual(globPath, candidate.dir));
}

function cleanGlobPath(value: string): string {
  const cleaned = normalizeCandidateDir(value);
  const wildcardIndex = cleaned.search(/[*{[]/);
  const pathWithoutGlob = wildcardIndex >= 0 ? cleaned.slice(0, wildcardIndex) : cleaned;

  return normalizePackageDir(pathWithoutGlob.replace(/\/+$/g, ''));
}

function looksLikeDirectoryReference(value: string): boolean {
  return Boolean(value) && !/\s|:|\(|\)/.test(value) && !value.endsWith('.json') && value.includes('/');
}

function cleanFilterTarget(value: string): string {
  const cleaned = cleanTarget(value);
  const withoutNegation = cleaned.startsWith('!') ? cleaned.slice(1) : cleaned;
  const withoutEllipsis = withoutNegation.endsWith('...') ? withoutNegation.slice(0, -3) : withoutNegation;

  if (withoutEllipsis.startsWith('{') && withoutEllipsis.endsWith('}')) {
    return normalizeCandidateDir(withoutEllipsis.slice(1, -1));
  }

  return normalizeCandidateDir(withoutEllipsis);
}

function cleanTarget(value: string): string {
  return value.trim() === '' ? '' : normalizeCandidateDir(value);
}

function normalizeCandidateDir(value: string): string {
  const trimmed = value.trim().replace(/^['"`]+|['"`]+$/g, '').replace(/[),.;:]+$/g, '');
  if (trimmed === '' || /^repository\s+root$/i.test(trimmed) || /^repo\s+root$/i.test(trimmed) || /^root$/i.test(trimmed)) {
    return '.';
  }

  return normalizePackageDir(trimmed);
}

function normalizePackageDir(value: string): string {
  const normalized = normalizePath(value).replace(/\/+$/g, '').replace(/^\.\//, '');
  return normalized === '' || normalized === '.' ? '.' : normalized;
}

function missingPackageScriptMessage(resolution: CommandResolution): string {
  if (resolution.packageJsonPath === 'package.json') {
    return `Documented command references missing package script "${resolution.scriptName}".`;
  }

  return `Documented command references missing package script "${resolution.scriptName}" in ${resolution.packageJsonPath}.`;
}

function previousMarkdownHeadingIndex(lines: string[], fromIndex: number): number {
  for (let index = fromIndex; index >= 0; index -= 1) {
    if (/^\s{0,3}#{1,6}\s+/.test(lines[index] ?? '')) {
      return index;
    }
  }

  return 0;
}

async function readPackageJson(filePath: string): Promise<{ name?: string; scripts?: Record<string, string> } | undefined> {
  try {
    return JSON.parse(await readFile(filePath, 'utf8')) as { name?: string; scripts?: Record<string, string> };
  } catch {
    return undefined;
  }
}

function normalizePath(value: string): string {
  return value.split(path.sep).join('/');
}
