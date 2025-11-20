import {describe} from 'vitest';
import {rapidhash, rapidhash_protected} from '../../src/v2.2';
import {testVectors_v2_2_rapidhash_protected} from '../test-vectors/v2.2/test_vector_v2.2_rapidhash_protected';
import {runTests} from '../tester';

describe('v2.2, protected', () => {
  runTests({
    func: (message, options) => rapidhash(message, {...options, rapidMumBehaviour: 'protected'}),
    funcName: 'rapidhash(message, {rapidMumBehaviour: "protected"})',
    testVectors: testVectors_v2_2_rapidhash_protected,
  });

  runTests({
    func: rapidhash_protected,
    funcName: 'rapidhash_protected()',
    testVectors: testVectors_v2_2_rapidhash_protected,
  });
});
