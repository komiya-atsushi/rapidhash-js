import {rapidhash} from '../src/rapidhash';
import * as testVectorsFast from '../rapidhash-c/test_vector_fast';

describe('rapidhash_fast', () => {
  const {testVectors1, testVectors2, longMessage} = testVectorsFast;

  describe('Hash short messages', () => {
    test.each(testVectors1)(
      'message = "%s", seed = %s',
      (message: string, seed: bigint, expected: bigint) => {
        const result = rapidhash(message, {seed});
        expect(result).toEqual(expected);
      }
    );
  });

  describe('Hash long messages', () => {
    test.each(testVectors2)(
      'length = %d, seed = %s',
      (length: number, seed: bigint, expected: bigint) => {
        const result = rapidhash(longMessage.slice(0, length), {seed});
        expect(result).toEqual(expected);
      }
    );
  });
});
