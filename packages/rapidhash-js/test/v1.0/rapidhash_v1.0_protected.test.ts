import {describe} from 'vitest';
import {rapidhash_v1, rapidhash_v1_protected} from '../../src';
import {testVectors_v1_0_rapidhash_protected} from '../test-vectors/v1.0/test_vector_v1.0_rapidhash_protected';
import {runTests} from '../tester';

describe('v1.0, protected', () => {
  runTests({
    func: (message, options) => rapidhash_v1(message, {...options, rapidMumBehaviour: 'protected'}),
    funcName: 'rapidhash_v1(message, {rapidMumBehaviour: "protected"})',
    testVectors: testVectors_v1_0_rapidhash_protected,
  });

  runTests({
    func: rapidhash_v1_protected,
    funcName: 'rapidhash_v1_protected()',
    testVectors: testVectors_v1_0_rapidhash_protected,
  });
});
