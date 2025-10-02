import {describe} from 'vitest';
import {rapidhash_v2_2, rapidhash_v2_2_protected} from '../../src';
import {testVectors_v2_2_rapidhash_protected} from '../test-vectors/v2.2/test_vector_v2.2_rapidhash_protected';
import {runTests} from '../tester';

describe('v2.2, protected', () => {
  runTests({
    func: (message, options) => rapidhash_v2_2(message, {...options, rapidMumBehaviour: 'protected'}),
    funcName: 'rapidhash_v2_2(message, {rapidMumBehaviour: "protected"})',
    testVectors: testVectors_v2_2_rapidhash_protected,
  });

  runTests({
    func: rapidhash_v2_2_protected,
    funcName: 'rapidhash_v2_2_protected()',
    testVectors: testVectors_v2_2_rapidhash_protected,
  });
});
