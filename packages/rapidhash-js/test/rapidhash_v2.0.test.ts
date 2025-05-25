import {describe} from 'vitest';
import {rapidhash_v2, rapidhash_v2_fast, rapidhash_v2_protected} from '../src';
import {rapidhashTest} from './rapidhash_test';
import * as testVectorsFast from './v2.0/test_vector_fast';
import * as testVectorsProtected from './v2.0/test_vector_protected';

describe('v2.0', () => {
  rapidhashTest({
    version: 'v2.0',
    functions: {
      rapidhash: rapidhash_v2,
      rapidhash_fast: rapidhash_v2_fast,
      rapidhash_protected: rapidhash_v2_protected,
    },
    testVectors: {
      fast: testVectorsFast,
      protected: testVectorsProtected,
    },
  });
});
