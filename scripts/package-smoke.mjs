#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const packageJsonPath = path.join(repoRoot, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const tempDir = mkdtempSync(path.join(tmpdir(), 'agentfit-package-smoke-'));
let keepTemp = process.env.AGENTFIT_KEEP_SMOKE_TEMP === '1';

function fail(message) {
  throw new Error(message);
}

function run(command, args, options = {}) {
  try {
    return execFileSync(command, args, {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      ...options
    });
  } catch (error) {
    const stderr = error?.stderr?.toString().trim();
    const stdout = error?.stdout?.toString().trim();
    const details = [stdout, stderr].filter(Boolean).join('\n');
    fail(`${command} ${args.join(' ')} failed${details ? `:\n${details}` : '.'}`);
  }
}

function requirePackedFile(filesByPath, filePath) {
  const file = filesByPath.get(filePath);
  if (!file) {
    fail(`Packed tarball is missing ${filePath}.`);
  }
  return file;
}

try {
  const builtCliPath = path.join(repoRoot, 'dist/index.js');
  if (!existsSync(builtCliPath)) {
    fail('dist/index.js is missing. Run pnpm build before pnpm smoke:package.');
  }

  const packOutput = run('npm', [
    '--cache',
    path.join(tempDir, 'npm-cache'),
    'pack',
    '--ignore-scripts',
    '--json',
    '--pack-destination',
    tempDir
  ], {
    env: {
      ...process.env,
      npm_config_dry_run: 'false'
    }
  });
  const [packed] = JSON.parse(packOutput);
  if (!packed?.filename || !Array.isArray(packed.files)) {
    fail('npm pack did not return the expected JSON metadata.');
  }

  const tarballPath = path.isAbsolute(packed.filename)
    ? packed.filename
    : path.join(tempDir, packed.filename);
  const filesByPath = new Map(packed.files.map((file) => [file.path, file]));

  requirePackedFile(filesByPath, 'package.json');
  requirePackedFile(filesByPath, 'README.md');
  requirePackedFile(filesByPath, 'action.yml');
  requirePackedFile(filesByPath, 'docs/assets/agentfit-terminal-demo.svg');
  requirePackedFile(filesByPath, 'docs/assets/social-preview.svg');
  requirePackedFile(filesByPath, 'examples/corpus/README.md');
  requirePackedFile(filesByPath, 'examples/corpus/real-world-candidates.yml');
  requirePackedFile(filesByPath, 'examples/fixtures/nested-monorepo/bad/AGENTS.md');
  requirePackedFile(filesByPath, 'examples/fixtures/nested-monorepo/fixed/packages/api/AGENTS.md');
  const packedCli = requirePackedFile(filesByPath, 'dist/index.js');

  if ((packedCli.mode & 0o111) === 0) {
    fail('Packed dist/index.js is not executable.');
  }

  run('tar', ['-xzf', tarballPath, '-C', tempDir], { cwd: tempDir });
  const extractedPackageDir = path.join(tempDir, 'package');
  const packedPackageJson = JSON.parse(
    readFileSync(path.join(extractedPackageDir, 'package.json'), 'utf8')
  );

  if (packedPackageJson.name !== packageJson.name) {
    fail(`Packed package name mismatch: expected ${packageJson.name}, got ${packedPackageJson.name}.`);
  }
  if (packedPackageJson.version !== packageJson.version) {
    fail(
      `Packed package version mismatch: expected ${packageJson.version}, got ${packedPackageJson.version}.`
    );
  }
  if (packedPackageJson.bin?.agentfit !== 'dist/index.js') {
    fail('Packed package.json must expose the agentfit bin at dist/index.js.');
  }

  const packedCliSource = readFileSync(path.join(extractedPackageDir, 'dist/index.js'), 'utf8');
  if (!packedCliSource.startsWith('#!/usr/bin/env node')) {
    fail('Packed dist/index.js is missing the node shebang.');
  }

  const repoNodeModules = path.join(repoRoot, 'node_modules');
  if (!existsSync(repoNodeModules)) {
    fail('node_modules is missing. Run pnpm install --frozen-lockfile before pnpm smoke:package.');
  }
  symlinkSync(repoNodeModules, path.join(extractedPackageDir, 'node_modules'), 'dir');

  const cliVersion = run(process.execPath, ['dist/index.js', '--version'], {
    cwd: extractedPackageDir
  }).trim();
  if (cliVersion !== packageJson.version) {
    fail(`Packed CLI returned version ${cliVersion}; expected ${packageJson.version}.`);
  }

  const corpusOutput = run(process.execPath, [
    path.join(extractedPackageDir, 'dist/index.js'),
    'corpus',
    '--limit',
    '1'
  ], {
    cwd: tempDir
  });
  if (!corpusOutput.includes('Real-world corpus: 5 candidates')) {
    fail('Packed CLI corpus command did not read the bundled manifest.');
  }

  console.log(`Package smoke passed for ${packageJson.name}@${packageJson.version}.`);
} catch (error) {
  keepTemp = true;
  console.error(error instanceof Error ? error.message : String(error));
  console.error(`Package smoke temp directory kept at ${tempDir}`);
  process.exitCode = 1;
} finally {
  if (!keepTemp) {
    rmSync(tempDir, { recursive: true, force: true });
  }
}
