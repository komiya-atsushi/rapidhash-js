class Xorshift64Star {
  private state: bigint;

  constructor(seed: bigint) {
    if (seed === 0n) {
      throw new Error('seed must not be 0');
    }
    this.state = seed;
  }

  next(): bigint {
    let x = this.state;
    x ^= x >> 12n;
    x ^= BigInt.asUintN(64, x << 25n);
    x ^= x >> 27n;
    this.state = x;
    return BigInt.asUintN(64, x * 2685821657736338717n);
  }

  nextNumber(minInclusive: number, maxExclusive: number): number {
    return (
      minInclusive + Number(this.next() % BigInt(maxExclusive - minInclusive))
    );
  }
}

export interface RandomDataArgs {
  numItems: number;
  minLengthInclusive: number;
  maxLengthInclusive: number;
}

export class RandomData<T> {
  private index = 0;

  protected constructor(private readonly data: T[]) {}

  get length(): number {
    return this.data.length;
  }

  get(index: number): T {
    return this.data[index];
  }

  next(): T {
    this.index %= this.data.length;
    return this.data[this.index++];
  }

  protected static _generate<T>(
    args: RandomDataArgs & {
      generate: (rng: Xorshift64Star, len: number) => T;
      construct: (data: T[]) => RandomData<T>;
    }
  ): RandomData<T> {
    const rng = new Xorshift64Star(123n);
    const result: T[] = [];

    for (let i = 0; i < args.numItems; i++) {
      const len = rng.nextNumber(
        args.minLengthInclusive,
        args.maxLengthInclusive + 1
      );

      result.push(args.generate(rng, len));
    }

    return args.construct(result);
  }
}

export class RandomStrings extends RandomData<string> {
  private constructor(strings: string[]) {
    super(strings);
  }

  static generate(args: RandomDataArgs): RandomStrings {
    const alphanumeric =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    return RandomData._generate<string>({
      ...args,
      generate: (rng, len) => {
        const chars: string[] = [];
        for (let j = 0; j < len; j++) {
          chars.push(
            alphanumeric.charAt(rng.nextNumber(0, alphanumeric.length))
          );
        }
        return chars.join('');
      },
      construct: data => new RandomStrings(data),
    });
  }
}

export class RandomBytes extends RandomData<Uint8Array> {
  private constructor(byteSequences: Uint8Array[]) {
    super(byteSequences);
  }

  static generate(args: RandomDataArgs): RandomBytes {
    return RandomData._generate<Uint8Array>({
      ...args,
      generate: (rng, len) => {
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = rng.nextNumber(0, 256);
        }
        return bytes;
      },
      construct: data => new RandomBytes(data),
    });
  }
}
