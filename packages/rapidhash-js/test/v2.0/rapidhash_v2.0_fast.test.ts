import {describe} from 'vitest';
import {rapidhash, rapidhash_fast} from '../../src/v2.0';
import {testVectors_v2_0_rapidhash_fast} from '../test-vectors/v2.0/test_vector_v2.0_rapidhash_fast';
import {runTests} from '../tester';

describe('v2.0, fast', () => {
  runTests({
    func: rapidhash,
    funcName: 'rapidhash()',
    testVectors: testVectors_v2_0_rapidhash_fast,
  });

  runTests({
    func: (message, options) => rapidhash(message, {...options, rapidMumBehaviour: 'fast'}),
    funcName: 'rapidhash(message, {rapidMumBehaviour: "fast"})',
    testVectors: testVectors_v2_0_rapidhash_fast,
  });

  runTests({
    func: rapidhash_fast,
    funcName: 'rapidhash_fast()',
    testVectors: testVectors_v2_0_rapidhash_fast,
  });
});
