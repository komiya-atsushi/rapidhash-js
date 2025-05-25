import {describe, expect, test} from 'vitest';
import type {
  rapidhash as _rapidhash,
  rapidhash_fast as _rapidhash_fast,
  rapidhash_protected as _rapidhash_protected,
} from '../src';
import type * as testVectors from './v1.0/test_vector_fast';

type Rapidhash = typeof _rapidhash;
type RapidhashFast = typeof _rapidhash_fast;
type RapidhashProtected = typeof _rapidhash_protected;
type TestVectors = typeof testVectors;

export function rapidhashTest(args: {
  version: string;
  functions: {
    rapidhash: Rapidhash;
    rapidhash_fast: RapidhashFast;
    rapidhash_protected: RapidhashProtected;
  };
  testVectors: {
    fast: TestVectors;
    protected: TestVectors;
  };
}): void {
  const {
    version,
    functions: {rapidhash, rapidhash_fast, rapidhash_protected},
    testVectors: {fast: testVectorsFast, protected: testVectorsProtected},
  } = args;

  describe('Basic functionality', () => {
    const message = 'hello';
    const uint8array = new TextEncoder().encode(message);
    const dataView = new DataView(uint8array.buffer);

    const messages: [string, Uint8Array | DataView][] = [
      ['Uint8Array', uint8array],
      ['DataView', dataView],
    ];

    test.each(messages)(
      `[${version}] rapidhash() can handle message that represented as %s`,
      (_: string, data: Uint8Array | DataView) => {
        expect(rapidhash(data)).toEqual(rapidhash(message));
      },
    );

    test.each(messages)(
      `[${version}] rapidhash_fast() can handle message that represented as %s`,
      (_: string, data: Uint8Array | DataView) => {
        expect(rapidhash_fast(data)).toEqual(rapidhash_fast(message));
      },
    );

    test.each(messages)(
      `[${version}] rapidhash_protected() can handle message that represented as %s`,
      (_: string, data: Uint8Array | DataView) => {
        expect(rapidhash_protected(data)).toEqual(rapidhash_protected(message));
      },
    );
  });

  describe('rapidhash_fast', () => {
    const {testVectors1, testVectors2, longMessage} = testVectorsFast;

    describe('Hash short messages', () => {
      test.each(testVectors1)(
        `[${version}] rapidhash("%s", {seed: %s, rapidMumBehaviour: "fast"}) = %s`,
        (message: string, seed: bigint, expected: bigint) => {
          const result = rapidhash(message, {seed, rapidMumBehaviour: 'fast'});
          expect(result).toEqual(expected);
        },
      );

      test.each(testVectors1)(
        `[${version}] rapidhash_fast("%s", {seed: %s}) = %s`,
        (message: string, seed: bigint, expected: bigint) => {
          const result = rapidhash_fast(message, {seed});
          expect(result).toEqual(expected);
        },
      );
    });

    describe('Hash long messages', () => {
      const uint8array = new TextEncoder().encode(longMessage);

      test.each(testVectors2)(
        `[${version}] [string] length = %d, seed = %s`,
        (length: number, seed: bigint, expected: bigint) => {
          const result = rapidhash(longMessage.slice(0, length), {
            seed,
            rapidMumBehaviour: 'fast',
          });
          expect(result).toEqual(expected);
        },
      );

      test.each(testVectors2)(
        `[${version}] [Uint8Array] length = %d, seed = %s`,
        (length: number, seed: bigint, expected: bigint) => {
          const result = rapidhash(uint8array.slice(0, length), {
            seed,
            rapidMumBehaviour: 'fast',
          });
          expect(result).toEqual(expected);
        },
      );

      test.each(testVectors2)(
        `[${version}] [DataView] length = %d, seed = %s`,
        (length: number, seed: bigint, expected: bigint) => {
          const result = rapidhash(new DataView(uint8array.buffer, 0, length), {
            seed,
            rapidMumBehaviour: 'fast',
          });
          expect(result).toEqual(expected);
        },
      );
    });
  });

  describe('rapidhash_protected', () => {
    const {testVectors1, testVectors2, longMessage} = testVectorsProtected;

    describe('Hash short messages', () => {
      test.each(testVectors1)(
        `[${version}] rapidhash("%s", {seed: %s, rapidMumBehaviour: "protected"}) = %s`,
        (message: string, seed: bigint, expected: bigint) => {
          const result = rapidhash(message, {
            seed,
            rapidMumBehaviour: 'protected',
          });
          expect(result).toEqual(expected);
        },
      );

      test.each(testVectors1)(
        `[${version}] rapidhash_protected("%s", {seed: %s}) = %s`,
        (message: string, seed: bigint, expected: bigint) => {
          const result = rapidhash_protected(message, {seed});
          expect(result).toEqual(expected);
        },
      );
    });

    describe('Hash long messages', () => {
      const uint8array = new TextEncoder().encode(longMessage);

      test.each(testVectors2)(
        `[${version}] [string] length = %d, seed = %s`,
        (length: number, seed: bigint, expected: bigint) => {
          const result = rapidhash(longMessage.slice(0, length), {
            seed,
            rapidMumBehaviour: 'protected',
          });
          expect(result).toEqual(expected);
        },
      );

      test.each(testVectors2)(
        `[${version}] [Uint8Array] length = %d, seed = %s`,
        (length: number, seed: bigint, expected: bigint) => {
          const result = rapidhash(uint8array.slice(0, length), {
            seed,
            rapidMumBehaviour: 'protected',
          });
          expect(result).toEqual(expected);
        },
      );

      test.each(testVectors2)(
        `[${version}] [DataView] length = %d, seed = %s`,
        (length: number, seed: bigint, expected: bigint) => {
          const result = rapidhash(new DataView(uint8array.buffer, 0, length), {
            seed,
            rapidMumBehaviour: 'protected',
          });
          expect(result).toEqual(expected);
        },
      );
    });
  });
}
