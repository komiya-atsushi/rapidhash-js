import {describe, expect, test} from 'vitest';

type FunctionUnderTesting = (message: string | Uint8Array | DataView, options: {seed: bigint}) => bigint;
type ShortTestMessages = [string, bigint, bigint][];
type LongTestMessages = {message: string; testVectors: [number, bigint, bigint][]};

export function runTests(args: {
  func: FunctionUnderTesting;
  funcName: string;
  testVectors: {
    short: {
      readonly testVectors: [string, bigint, bigint][];
    };
    readonly long: {
      readonly message: string;
      readonly repetitions: number;
      readonly testVectors: [number, bigint, bigint][];
    };
  };
}): void {
  const longMessage = args.testVectors.long.message.repeat(args.testVectors.long.repetitions);

  describe(args.funcName, () => {
    runTestWithShortMessages(args.func, args.testVectors.short.testVectors);
    runTestWithLongMessages(args.func, {
      message: longMessage,
      testVectors: args.testVectors.long.testVectors,
    });
  });
}

// ---

function runTestWithShortMessages(func: FunctionUnderTesting, testMessages: ShortTestMessages): void {
  describe('Hashing short messages', () => {
    describe('string message', () => {
      test.each(testMessages)('message = "%s", seed = %s', (message: string, seed: bigint, expected: bigint) => {
        const result = func(message, {seed});
        expect(result).toEqual(expected);
      });
    });

    describe('Uint8Array message', () => {
      test.each(testMessages)('message = "%s", seed = %s', (message: string, seed: bigint, expected: bigint) => {
        const result = func(new TextEncoder().encode(message), {seed});
        expect(result).toEqual(expected);
      });
    });

    describe('DataView message', () => {
      test.each(testMessages)('message = "%s", seed = %s', (message: string, seed: bigint, expected: bigint) => {
        const result = func(new DataView(new TextEncoder().encode(message).buffer), {seed});
        expect(result).toEqual(expected);
      });
    });
  });
}

// ---

function runTestWithLongMessages(func: FunctionUnderTesting, testMessages: LongTestMessages): void {
  const stringMessage = testMessages.message;
  const uint8ArrayMessage = new TextEncoder().encode(stringMessage);

  describe('Hashing long messages', () => {
    describe('string message', () => {
      test.each(testMessages.testVectors)(
        'length = %d, seed = %s',
        (length: number, seed: bigint, expected: bigint) => {
          const result = func(stringMessage.slice(0, length), {seed});
          expect(result).toEqual(expected);
        },
      );
    });

    describe('Uint8Array message', () => {
      test.each(testMessages.testVectors)(
        'length = %d, seed = %s',
        (length: number, seed: bigint, expected: bigint) => {
          const result = func(uint8ArrayMessage.slice(0, length), {seed});
          expect(result).toEqual(expected);
        },
      );
    });

    describe('DataView message', () => {
      test.each(testMessages.testVectors)(
        'length = %d, seed = %s',
        (length: number, seed: bigint, expected: bigint) => {
          const result = func(new DataView(uint8ArrayMessage.buffer, 0, length), {seed});
          expect(result).toEqual(expected);
        },
      );
    });
  });
}
