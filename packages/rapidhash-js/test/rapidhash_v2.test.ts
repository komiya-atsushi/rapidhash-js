import {describe, expect, test} from 'vitest';
import {rapidhash_v2, rapidhash_v2_fast, rapidhash_v2_protected} from '../src';
import * as testVectorsFast from './v2/test_vector_fast';
import * as testVectorsProtected from './v2/test_vector_protected';

describe('Basic functionality', () => {
  const message = 'hello';
  const uint8array = new TextEncoder().encode(message);
  const dataView = new DataView(uint8array.buffer);

  const messages: [string, Uint8Array | DataView][] = [
    ['Uint8Array', uint8array],
    ['DataView', dataView],
  ];

  test.each(messages)(
    'rapidhash_v2() can handle message that represented as %s',
    (_: string, data: Uint8Array | DataView) => {
      expect(rapidhash_v2(data)).toEqual(rapidhash_v2(message));
    },
  );

  test.each(messages)(
    'rapidhash_v2_fast() can handle message that represented as %s',
    (_: string, data: Uint8Array | DataView) => {
      expect(rapidhash_v2_fast(data)).toEqual(rapidhash_v2_fast(message));
    },
  );

  test.each(messages)(
    'rapidhash_v2_protected() can handle message that represented as %s',
    (_: string, data: Uint8Array | DataView) => {
      expect(rapidhash_v2_protected(data)).toEqual(rapidhash_v2_protected(message));
    },
  );
});

describe('rapidhash_fast', () => {
  const {testVectors1, testVectors2, longMessage} = testVectorsFast;

  describe('Hash short messages', () => {
    test.each(testVectors1)(
      'rapidhash_v2("%s", {seed: %s, rapidMumBehaviour: "fast"}) = %s',
      (message: string, seed: bigint, expected: bigint) => {
        const result = rapidhash_v2(message, {seed, rapidMumBehaviour: 'fast'});
        expect(result).toEqual(expected);
      },
    );

    test.each(testVectors1)(
      'rapidhash_v2_fast("%s", {seed: %s}) = %s',
      (message: string, seed: bigint, expected: bigint) => {
        const result = rapidhash_v2_fast(message, {seed});
        expect(result).toEqual(expected);
      },
    );
  });

  describe('Hash long messages', () => {
    const uint8array = new TextEncoder().encode(longMessage);

    test.each(testVectors2)('[string] length = %d, seed = %s', (length: number, seed: bigint, expected: bigint) => {
      const result = rapidhash_v2(longMessage.slice(0, length), {
        seed,
        rapidMumBehaviour: 'fast',
      });
      expect(result).toEqual(expected);
    });

    test.each(testVectors2)('[Uint8Array] length = %d, seed = %s', (length: number, seed: bigint, expected: bigint) => {
      const result = rapidhash_v2(uint8array.slice(0, length), {
        seed,
        rapidMumBehaviour: 'fast',
      });
      expect(result).toEqual(expected);
    });

    test.each(testVectors2)('[DataView] length = %d, seed = %s', (length: number, seed: bigint, expected: bigint) => {
      const result = rapidhash_v2(new DataView(uint8array.buffer, 0, length), {
        seed,
        rapidMumBehaviour: 'fast',
      });
      expect(result).toEqual(expected);
    });
  });
});

describe('rapidhash_protected', () => {
  const {testVectors1, testVectors2, longMessage} = testVectorsProtected;

  describe('Hash short messages', () => {
    test.each(testVectors1)(
      'rapidhash_v2("%s", {seed: %s, rapidMumBehaviour: "protected"}) = %s',
      (message: string, seed: bigint, expected: bigint) => {
        const result = rapidhash_v2(message, {
          seed,
          rapidMumBehaviour: 'protected',
        });
        expect(result).toEqual(expected);
      },
    );

    test.each(testVectors1)(
      'rapidhash_v2_protected("%s", {seed: %s}) = %s',
      (message: string, seed: bigint, expected: bigint) => {
        const result = rapidhash_v2_protected(message, {seed});
        expect(result).toEqual(expected);
      },
    );
  });

  describe('Hash long messages', () => {
    const uint8array = new TextEncoder().encode(longMessage);

    test.each(testVectors2)('[strig] length = %d, seed = %s', (length: number, seed: bigint, expected: bigint) => {
      const result = rapidhash_v2(longMessage.slice(0, length), {
        seed,
        rapidMumBehaviour: 'protected',
      });
      expect(result).toEqual(expected);
    });

    test.each(testVectors2)('[Uint8Array] length = %d, seed = %s', (length: number, seed: bigint, expected: bigint) => {
      const result = rapidhash_v2(uint8array.slice(0, length), {
        seed,
        rapidMumBehaviour: 'protected',
      });
      expect(result).toEqual(expected);
    });

    test.each(testVectors2)('[DataView] length = %d, seed = %s', (length: number, seed: bigint, expected: bigint) => {
      const result = rapidhash_v2(new DataView(uint8array.buffer, 0, length), {
        seed,
        rapidMumBehaviour: 'protected',
      });
      expect(result).toEqual(expected);
    });
  });
});
