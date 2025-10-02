import {describe} from 'vitest';
import {rapidhash_v2_2, rapidhash_v2_2_fast} from '../../src';
import {testVectors_v2_2_rapidhash_fast} from '../test-vectors/v2.2/test_vector_v2.2_rapidhash_fast';
import {runTests} from '../tester';

describe('v2.2, fast', () => {
  runTests({
    func: rapidhash_v2_2,
    funcName: 'rapidhash_v2_2()',
    testVectors: testVectors_v2_2_rapidhash_fast,
  });

  runTests({
    func: (message, options) => rapidhash_v2_2(message, {...options, rapidMumBehaviour: 'fast'}),
    funcName: 'rapidhash_v2_2(message, {rapidMumBehaviour: "fast"})',
    testVectors: testVectors_v2_2_rapidhash_fast,
  });

  runTests({
    func: rapidhash_v2_2_fast,
    funcName: 'rapidhash_v2_2_fast()',
    testVectors: testVectors_v2_2_rapidhash_fast,
  });
});
