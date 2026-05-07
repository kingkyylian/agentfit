import { describe, expect, it } from 'vitest';
import { isSafeNpmVersionInput } from '../../src/core/action-version.js';

describe('validate-action-version', () => {
  it('accepts semver versions and npm dist-tags', async () => {
    expect(isSafeNpmVersionInput('0.1.0')).toBe(true);
    expect(isSafeNpmVersionInput('latest')).toBe(true);
    expect(isSafeNpmVersionInput('next-2026.05')).toBe(true);
  });

  it('rejects shell metacharacters', async () => {
    expect(isSafeNpmVersionInput('0.1.0"; echo leaked #')).toBe(false);
    expect(isSafeNpmVersionInput('latest && echo leaked')).toBe(false);
    expect(isSafeNpmVersionInput('$(echo leaked)')).toBe(false);
  });
});
