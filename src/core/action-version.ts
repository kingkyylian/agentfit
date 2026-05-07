export function isSafeNpmVersionInput(version: string): boolean {
  return /^[A-Za-z0-9._~-]+$/.test(version);
}
