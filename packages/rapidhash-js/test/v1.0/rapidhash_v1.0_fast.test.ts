import {describe} from 'vitest';
import {rapidhash, rapidhash_fast} from '../../src/v1.0';
import {testVectors_v1_0_rapidhash_fast} from '../test-vectors/v1.0/test_vector_v1.0_rapidhash_fast';
import {runTests} from '../tester';

describe('v1.0, fast', () => {
  runTests({
    func: rapidhash,
    funcName: 'rapidhash()',
    testVectors: testVectors_v1_0_rapidhash_fast,
  });

  runTests({
    func: (message, options) => rapidhash(message, {...options, rapidMumBehaviour: 'fast'}),
    funcName: 'rapidhash(message, {rapidMumBehaviour: "fast"})',
    testVectors: testVectors_v1_0_rapidhash_fast,
  });

  runTests({
    func: rapidhash_fast,
    funcName: 'rapidhash_fast()',
    testVectors: testVectors_v1_0_rapidhash_fast,
  });
});
