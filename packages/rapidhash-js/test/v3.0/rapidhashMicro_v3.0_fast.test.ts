import {describe} from 'vitest';
import {rapidhashMicro, rapidhashMicro_fast} from '../../src/v3.0';
import {testVectors_v3_0_rapidhashMicro_fast} from '../test-vectors/v3.0/test_vector_v3.0_rapidhashMicro_fast';
import {runTests} from '../tester';

describe('v3.0, fast', () => {
  runTests({
    func: rapidhashMicro,
    funcName: 'rapidhashMicro()',
    testVectors: testVectors_v3_0_rapidhashMicro_fast,
  });

  runTests({
    func: (message, options) => rapidhashMicro(message, {...options, rapidMumBehaviour: 'fast'}),
    funcName: 'rapidhashMicro(message, {rapidMumBehaviour: "fast"})',
    testVectors: testVectors_v3_0_rapidhashMicro_fast,
  });

  runTests({
    func: rapidhashMicro_fast,
    funcName: 'rapidhashMicro_fast()',
    testVectors: testVectors_v3_0_rapidhashMicro_fast,
  });
});
