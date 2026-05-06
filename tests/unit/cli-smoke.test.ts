import { describe, expect, it } from 'vitest';
import { createProgram } from '../../src/cli/index.js';

describe('agentfit cli', () => {
  it('prints help', async () => {
    const help = createProgram().helpInformation();

    expect(help).toContain('Local-first fitness tests');
    expect(help).toContain('eval');
  });
});
