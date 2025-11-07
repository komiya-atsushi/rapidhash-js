import {describe} from 'vitest';
import {rapidhashMicro, rapidhashMicro_protected} from '../../src/v3.0';
import {testVectors_v3_0_rapidhashMicro_protected} from '../test-vectors/v3.0/test_vector_v3.0_rapidhashMicro_protected';
import {runTests} from '../tester';

describe('v3.0, protected', () => {
  runTests({
    func: (message, options) => rapidhashMicro(message, {...options, rapidMumBehaviour: 'protected'}),
    funcName: 'rapidhashMicro(message, {rapidMumBehaviour: "protected"})',
    testVectors: testVectors_v3_0_rapidhashMicro_protected,
  });

  runTests({
    func: rapidhashMicro_protected,
    funcName: 'rapidhashMicro_protected()',
    testVectors: testVectors_v3_0_rapidhashMicro_protected,
  });
});
