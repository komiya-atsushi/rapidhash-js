import {describe} from 'vitest';
import {rapidhash_v2_0, rapidhash_v2_0_fast} from '../../src';
import {testVectors_v2_0_rapidhash_fast} from '../test-vectors/v2.0/test_vector_v2.0_rapidhash_fast';
import {runTests} from '../tester';

describe('v2.0, fast', () => {
  runTests({
    func: rapidhash_v2_0,
    funcName: 'rapidhash_v2_0()',
    testVectors: testVectors_v2_0_rapidhash_fast,
  });

  runTests({
    func: (message, options) => rapidhash_v2_0(message, {...options, rapidMumBehaviour: 'fast'}),
    funcName: 'rapidhash_v2_0(message, {rapidMumBehaviour: "fast"})',
    testVectors: testVectors_v2_0_rapidhash_fast,
  });

  runTests({
    func: rapidhash_v2_0_fast,
    funcName: 'rapidhash_v2_0_fast()',
    testVectors: testVectors_v2_0_rapidhash_fast,
  });
});
