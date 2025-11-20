import {describe} from 'vitest';
import {rapidhash, rapidhash_protected} from '../../src/v2.0';
import {testVectors_v2_0_rapidhash_protected} from '../test-vectors/v2.0/test_vector_v2.0_rapidhash_protected';
import {runTests} from '../tester';

describe('v2.0, protected', () => {
  runTests({
    func: (message, options) => rapidhash(message, {...options, rapidMumBehaviour: 'protected'}),
    funcName: 'rapidhash(message, {rapidMumBehaviour: "protected"})',
    testVectors: testVectors_v2_0_rapidhash_protected,
  });

  runTests({
    func: rapidhash_protected,
    funcName: 'rapidhash_protected()',
    testVectors: testVectors_v2_0_rapidhash_protected,
  });
});
