import {rapidhash, rapidhash_fast, rapidhash_protected} from '../src/rapidhash';
import * as testVectorsFast from './test_vector_fast';
import * as testVectorsProtected from './test_vector_protected';

describe('Basic functionality', () => {
  const message = 'hello';
  const uint8array = new TextEncoder().encode(message);
  const dataView = new DataView(uint8array.buffer);

  const messages: [string, Uint8Array | DataView][] = [
    ['Uint8Array', uint8array],
    ['DataView', dataView],
  ];

  test.each(messages)(
    'rapidhash() can handle message that represented as %s',
    (_: string, data: Uint8Array | DataView) => {
      expect(rapidhash(data)).toEqual(rapidhash(message));
    }
  );

  test.each(messages)(
    'rapidhash_fast() can handle message that represented as %s',
    (_: string, data: Uint8Array | DataView) => {
      expect(rapidhash_fast(data)).toEqual(rapidhash_fast(message));
    }
  );

  test.each(messages)(
    'rapidhash_protected() can handle message that represented as %s',
    (_: string, data: Uint8Array | DataView) => {
      expect(rapidhash_protected(data)).toEqual(rapidhash_protected(message));
    }
  );
});

describe('rapidhash_fast', () => {
  const {testVectors1, testVectors2, longMessage} = testVectorsFast;

  describe('Hash short messages', () => {
    test.each(testVectors1)(
      'rapidhash("%s", {seed: %s, rapidMumBehaviour: "fast"}) = %s',
      (message: string, seed: bigint, expected: bigint) => {
        const result = rapidhash(message, {seed, rapidMumBehaviour: 'fast'});
        expect(result).toEqual(expected);
      }
    );

    test.each(testVectors1)(
      'rapidhash_fast("%s", {seed: %s}) = %s',
      (message: string, seed: bigint, expected: bigint) => {
        const result = rapidhash_fast(message, {seed});
        expect(result).toEqual(expected);
      }
    );
  });

  describe('Hash long messages', () => {
    test.each(testVectors2)(
      'length = %d, seed = %s',
      (length: number, seed: bigint, expected: bigint) => {
        const result = rapidhash(longMessage.slice(0, length), {
          seed,
          rapidMumBehaviour: 'fast',
        });
        expect(result).toEqual(expected);
      }
    );
  });
});

describe('rapidhash_protected', () => {
  const {testVectors1, testVectors2, longMessage} = testVectorsProtected;

  describe('Hash short messages', () => {
    test.each(testVectors1)(
      'rapidhash("%s", {seed: %s, rapidMumBehaviour: "protected"}) = %s',
      (message: string, seed: bigint, expected: bigint) => {
        const result = rapidhash(message, {
          seed,
          rapidMumBehaviour: 'protected',
        });
        expect(result).toEqual(expected);
      }
    );

    test.each(testVectors1)(
      'rapidhash_protected("%s", {seed: %s}) = %s',
      (message: string, seed: bigint, expected: bigint) => {
        const result = rapidhash_protected(message, {seed});
        expect(result).toEqual(expected);
      }
    );
  });

  describe('Hash long messages', () => {
    test.each(testVectors2)(
      'length = %d, seed = %s',
      (length: number, seed: bigint, expected: bigint) => {
        const result = rapidhash(longMessage.slice(0, length), {
          seed,
          rapidMumBehaviour: 'protected',
        });
        expect(result).toEqual(expected);
      }
    );
  });
});
