import {describe} from 'vitest';
import {rapidhashNano, rapidhashNano_protected} from '../../src/v3.0';
import {testVectors_v3_0_rapidhashNano_protected} from '../test-vectors/v3.0/test_vector_v3.0_rapidhashNano_protected';
import {runTests} from '../tester';

describe('v3.0, protected', () => {
  runTests({
    func: (message, options) => rapidhashNano(message, {...options, rapidMumBehaviour: 'protected'}),
    funcName: 'rapidhashNano(message, {rapidMumBehaviour: "protected"})',
    testVectors: testVectors_v3_0_rapidhashNano_protected,
  });

  runTests({
    func: rapidhashNano_protected,
    funcName: 'rapidhashNano_protected()',
    testVectors: testVectors_v3_0_rapidhashNano_protected,
  });
});
