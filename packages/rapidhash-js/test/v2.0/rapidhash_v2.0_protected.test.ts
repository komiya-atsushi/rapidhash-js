import {describe} from 'vitest';
import {rapidhash_v2_0, rapidhash_v2_0_protected} from '../../src';
import {testVectors_v2_0_rapidhash_protected} from '../test-vectors/v2.0/test_vector_v2.0_rapidhash_protected';
import {runTests} from '../tester';

describe('v2.0, protected', () => {
  runTests({
    func: (message, options) => rapidhash_v2_0(message, {...options, rapidMumBehaviour: 'protected'}),
    funcName: 'rapidhash_v2_0(message, {rapidMumBehaviour: "protected"})',
    testVectors: testVectors_v2_0_rapidhash_protected,
  });

  runTests({
    func: rapidhash_v2_0_protected,
    funcName: 'rapidhash_v2_0_protected()',
    testVectors: testVectors_v2_0_rapidhash_protected,
  });
});
