import {describe} from 'vitest';
import {rapidhash_v1, rapidhash_v1_fast} from '../../src';
import {testVectors_v1_0_rapidhash_fast} from '../test-vectors/v1.0/test_vector_v1.0_rapidhash_fast';
import {runTests} from '../tester';

describe('v1.0, fast', () => {
  runTests({
    func: rapidhash_v1,
    funcName: 'rapidhash_v1()',
    testVectors: testVectors_v1_0_rapidhash_fast,
  });

  runTests({
    func: (message, options) => rapidhash_v1(message, {...options, rapidMumBehaviour: 'fast'}),
    funcName: 'rapidhash_v1(message, {rapidMumBehaviour: "fast"})',
    testVectors: testVectors_v1_0_rapidhash_fast,
  });

  runTests({
    func: rapidhash_v1_fast,
    funcName: 'rapidhash_v1_fast()',
    testVectors: testVectors_v1_0_rapidhash_fast,
  });
});
