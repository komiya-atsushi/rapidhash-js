import {
  type RapidhashOptions,
  type RapidMix,
  rapid_mix_fast,
  rapid_mix_protected,
  rapid_read32,
  rapid_read64,
  toDataView,
  validateOptions,
} from '../common';
// Default seed and secret parameters are the same as Rapidhash V2
import {RAPID_SEED, type RapidSecret, rapid_secret} from '../common_v2';

// ---

const readSmallV3Buffer = new Uint8Array(8);
const readSmallV3View = new DataView(readSmallV3Buffer.buffer);

function rapid_readSmallV3(input: DataView, len: number): bigint {
  const v = input.getUint8(0);
  readSmallV3Buffer[6] = v >> 3;
  readSmallV3Buffer[5] = v << 5;
  readSmallV3Buffer[0] = input.getUint8(len - 1);
  return readSmallV3View.getBigUint64(0, true);
}

// ---

type RapidhashEpilogueV3 = (a: bigint, b: bigint, secret: RapidSecret, i: bigint) => bigint;

function rapidhash_epilogueV3_fast(a: bigint, b: bigint, secret: RapidSecret, i: bigint): bigint {
  const m0 = a * b;
  const m1 = (BigInt.asUintN(64, m0) ^ secret[7]) * ((m0 >> 64n) ^ secret[1] ^ i);
  return BigInt.asUintN(64, m1) ^ (m1 >> 64n);
}

function rapidhash_epilogueV3_protected(a0: bigint, b0: bigint, secret: RapidSecret, i: bigint): bigint {
  const m0 = a0 * b0;
  const a1 = BigInt.asUintN(64, m0) ^ secret[7] ^ a0;
  const b1 = (m0 >> 64n) ^ secret[1] ^ i ^ b0;
  const m1 = a1 * b1;
  return BigInt.asUintN(64, m1) ^ (m1 >> 64n) ^ a1 ^ b1;
}

// ---

function rapidhash_v3_0_internal(
  key: DataView,
  seed: bigint,
  secret: RapidSecret,
  rapid_mix: RapidMix,
  rapidhash_epilogue: RapidhashEpilogueV3,
): bigint {
  const len = key.byteLength;
  const lenBI = BigInt(key.byteLength);

  seed ^= rapid_mix(seed ^ secret[2], secret[1]);

  let a: bigint;
  let b: bigint;
  let i = len;
  let bi: bigint | undefined;

  if (len <= 16) {
    bi = lenBI;
    if (len >= 4) {
      seed ^= lenBI;
      if (len >= 8) {
        const last = len - 8;
        a = rapid_read64(key, 0);
        b = rapid_read64(key, last);
      } else {
        const last = len - 4;
        a = rapid_read32(key, 0);
        b = rapid_read32(key, last);
      }
    } else if (len > 0) {
      a = rapid_readSmallV3(key, len);
      b = BigInt(key.getUint8(len >> 1));
    } else {
      a = 0n;
      b = 0n;
    }
  } else {
    let p = 0;

    if (i > 112) {
      let see1 = seed;
      let see2 = seed;
      let see3 = seed;
      let see4 = seed;
      let see5 = seed;
      let see6 = seed;

      do {
        seed = rapid_mix(rapid_read64(key, p) ^ secret[0], rapid_read64(key, p + 8) ^ seed);
        see1 = rapid_mix(rapid_read64(key, p + 16) ^ secret[1], rapid_read64(key, p + 24) ^ see1);
        see2 = rapid_mix(rapid_read64(key, p + 32) ^ secret[2], rapid_read64(key, p + 40) ^ see2);
        see3 = rapid_mix(rapid_read64(key, p + 48) ^ secret[3], rapid_read64(key, p + 56) ^ see3);
        see4 = rapid_mix(rapid_read64(key, p + 64) ^ secret[4], rapid_read64(key, p + 72) ^ see4);
        see5 = rapid_mix(rapid_read64(key, p + 80) ^ secret[5], rapid_read64(key, p + 88) ^ see5);
        see6 = rapid_mix(rapid_read64(key, p + 96) ^ secret[6], rapid_read64(key, p + 104) ^ see6);
        p += 112;
        i -= 112;
      } while (i > 112);

      seed ^= see1;
      see2 ^= see3;
      see4 ^= see5;
      seed ^= see6;
      see2 ^= see4;
      seed ^= see2;
    }

    bi = BigInt(i);

    if (i > 16) {
      seed = rapid_mix(rapid_read64(key, p) ^ secret[2], rapid_read64(key, p + 8) ^ seed);
      if (i > 32) {
        seed = rapid_mix(rapid_read64(key, p + 16) ^ secret[2], rapid_read64(key, p + 24) ^ seed);
        if (i > 48) {
          seed = rapid_mix(rapid_read64(key, p + 32) ^ secret[1], rapid_read64(key, p + 40) ^ seed);
          if (i > 64) {
            seed = rapid_mix(rapid_read64(key, p + 48) ^ secret[1], rapid_read64(key, p + 56) ^ seed);
            if (i > 80) {
              seed = rapid_mix(rapid_read64(key, p + 64) ^ secret[2], rapid_read64(key, p + 72) ^ seed);
              if (i > 96) {
                seed = rapid_mix(rapid_read64(key, p + 80) ^ secret[1], rapid_read64(key, p + 88) ^ seed);
              }
            }
          }
        }
      }
    }

    a = rapid_read64(key, p + i - 16) ^ bi;
    b = rapid_read64(key, p + i - 8);
  }

  a ^= secret[1];
  b ^= seed;

  return rapidhash_epilogue(a, b, secret, bi);
}

const rapidMumImplementationsV3 = {
  fast: {
    rapid_mix: rapid_mix_fast,
    rapidhash_epilogue: rapidhash_epilogueV3_fast,
  },
  protected: {
    rapid_mix: rapid_mix_protected,
    rapidhash_epilogue: rapidhash_epilogueV3_protected,
  },
};

// ---

/**
 * Calculate a 64-bit hash value of the given message.
 *
 * @param message {string|Uint8Array|DataView} The message to be hashed.
 * @param options Options for modifying the hash calculation.
 * @param options.seed {bigint} 64-bit unsigned seed value.
 * @param options.rapidMumBehaviour {'fast'|'protected'} Alters behaviour of the rapid_mum function. Defaults to 'fast'.
 */
export function rapidhash(message: string | Uint8Array | DataView, options?: Partial<RapidhashOptions>): bigint {
  const {seed, rapidMumBehaviour} = validateOptions(options, RAPID_SEED);
  const {rapid_mix, rapidhash_epilogue} = rapidMumImplementationsV3[rapidMumBehaviour];

  return rapidhash_v3_0_internal(toDataView(message), seed, rapid_secret, rapid_mix, rapidhash_epilogue);
}

/**
 * Calculate a 64-bit hash value of the given message.
 * This function is equivalent to rapidhash() with options.rapidMumBehaviour set to 'fast'.
 *
 * @param message {string|Uint8Array|DataView} The message to be hashed.
 * @param options Options for modifying the hash calculation.
 * @param options.seed {bigint} 64-bit unsigned seed value.
 */
export function rapidhash_fast(
  message: string | Uint8Array | DataView,
  options?: Partial<Omit<RapidhashOptions, 'rapidMumBehaviour'>>,
): bigint {
  const {seed} = validateOptions(options, RAPID_SEED);

  return rapidhash_v3_0_internal(toDataView(message), seed, rapid_secret, rapid_mix_fast, rapidhash_epilogueV3_fast);
}

/**
 * Calculate a 64-bit hash value of the given message.
 * This function is equivalent to rapidhash() with options.rapidMumBehaviour set to 'protected'.
 *
 * @param message {string|Uint8Array|DataView} The message to be hashed.
 * @param options Options for modifying the hash calculation.
 * @param options.seed {bigint} 64-bit unsigned seed value.
 */
export function rapidhash_protected(
  message: string | Uint8Array | DataView,
  options?: Partial<Omit<RapidhashOptions, 'rapidMumBehaviour'>>,
): bigint {
  const {seed} = validateOptions(options, RAPID_SEED);

  return rapidhash_v3_0_internal(
    toDataView(message),
    seed,
    rapid_secret,
    rapid_mix_protected,
    rapidhash_epilogueV3_protected,
  );
}
