import {describe, expect, test} from 'vitest';
import * as root from '../src';
import * as v3_0 from '../src/v3.0';

// Regression test for https://github.com/komiya-atsushi/rapidhash-js/issues/4. The README imports
// rapidhashMicro and rapidhashNano from the package root, so the root entry point has to re-export
// everything the default version (src/v3.0) exports.
describe('Package root (src/index.ts)', () => {
  const rootExports: Record<string, unknown> = {...root};
  const v3_0Exports: Record<string, unknown> = {...v3_0};

  test('exports the same names as v3.0', () => {
    expect(Object.keys(rootExports).sort()).toEqual(Object.keys(v3_0Exports).sort());
  });

  test.each(Object.keys(v3_0Exports))('re-exports %s of v3.0', (name) => {
    expect(rootExports[name]).toBe(v3_0Exports[name]);
  });
});
