import {describe} from 'vitest';
import {rapidhashNano, rapidhashNano_fast} from '../../src/v3.0';
import {testVectors_v3_0_rapidhashNano_fast} from '../test-vectors/v3.0/test_vector_v3.0_rapidhashNano_fast';
import {runTests} from '../tester';

describe('v3.0, fast', () => {
  runTests({
    func: rapidhashNano,
    funcName: 'rapidhashNano()',
    testVectors: testVectors_v3_0_rapidhashNano_fast,
  });

  runTests({
    func: (message, options) => rapidhashNano(message, {...options, rapidMumBehaviour: 'fast'}),
    funcName: 'rapidhashNano(message, {rapidMumBehaviour: "fast"})',
    testVectors: testVectors_v3_0_rapidhashNano_fast,
  });

  runTests({
    func: rapidhashNano_fast,
    funcName: 'rapidhashNano_fast()',
    testVectors: testVectors_v3_0_rapidhashNano_fast,
  });
});
