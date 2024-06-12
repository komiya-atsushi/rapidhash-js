import {rapidhash} from '../src/rapidhash';
import {
  longMessage,
  testVectors1,
  testVectors2,
} from '../rapidhash-c/test_vector';

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
