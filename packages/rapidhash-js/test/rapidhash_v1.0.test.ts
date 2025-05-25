import {describe} from 'vitest';
import {rapidhash_v1, rapidhash_v1_fast, rapidhash_v1_protected} from '../src';
import {rapidhashTest} from './rapidhash_test';
import * as testVectorsFast from './v1.0/test_vector_fast';
import * as testVectorsProtected from './v1.0/test_vector_protected';

describe('v1.0', () => {
  rapidhashTest({
    version: 'v1.0',
    functions: {
      rapidhash: rapidhash_v1,
      rapidhash_fast: rapidhash_v1_fast,
      rapidhash_protected: rapidhash_v1_protected,
    },
    testVectors: {
      fast: testVectorsFast,
      protected: testVectorsProtected,
    },
  });
});
