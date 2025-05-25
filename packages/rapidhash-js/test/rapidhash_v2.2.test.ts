import {describe} from 'vitest';
import {rapidhash_v2_2, rapidhash_v2_2_fast, rapidhash_v2_2_protected} from '../src';
import {rapidhashTest} from './rapidhash_test';
import * as testVectorsFast from './v2.2/test_vector_fast';
import * as testVectorsProtected from './v2.2/test_vector_protected';

describe('v2.2', () => {
  rapidhashTest({
    version: 'v2.2',
    functions: {
      rapidhash: rapidhash_v2_2,
      rapidhash_fast: rapidhash_v2_2_fast,
      rapidhash_protected: rapidhash_v2_2_protected,
    },
    testVectors: {
      fast: testVectorsFast,
      protected: testVectorsProtected,
    },
  });
});
