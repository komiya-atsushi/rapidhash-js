import {describe} from 'vitest';
import {rapidhash, rapidhash_fast} from '../../src/v3.0';
import {testVectors_v3_0_rapidhash_fast} from '../test-vectors/v3.0/test_vector_v3.0_rapidhash_fast';
import {runTests} from '../tester';

describe('v3.0, fast', () => {
  runTests({
    func: rapidhash,
    funcName: 'rapidhash()',
    testVectors: testVectors_v3_0_rapidhash_fast,
  });

  runTests({
    func: (message, options) => rapidhash(message, {...options, rapidMumBehaviour: 'fast'}),
    funcName: 'rapidhash(message, {rapidMumBehaviour: "fast"})',
    testVectors: testVectors_v3_0_rapidhash_fast,
  });

  runTests({
    func: rapidhash_fast,
    funcName: 'rapidhash_fast()',
    testVectors: testVectors_v3_0_rapidhash_fast,
  });
});
