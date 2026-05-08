import { describe, expect, it } from 'vitest';
import { mergeConfig, parseAgentFitConfig } from '../../src/core/config.js';

describe('agentfit config', () => {
  it('does not assume package-manager commands by default', () => {
    expect(mergeConfig({}).commands).toEqual({
      setup: [],
      verify: []
    });
  });

  it('preserves explicit setup and verification commands', () => {
    const config = parseAgentFitConfig(
      [
        'version: 1',
        'commands:',
        '  setup:',
        '    - npm ci',
        '  verify:',
        '    - npm test',
        '    - npm run lint',
        ''
      ].join('\n')
    );

    expect(mergeConfig(config).commands).toEqual({
      setup: ['npm ci'],
      verify: ['npm test', 'npm run lint']
    });
  });
});
