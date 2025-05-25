import {
  type RapidMix,
  type RapidhashEpilogue,
  type RapidhashOptions,
  rapidMumImplementations,
  rapid_mix_fast,
  rapid_mix_protected,
  rapid_read32x2,
  rapid_read64,
  rapid_readSmall,
  rapidhash_epilogue_fast,
  rapidhash_epilogue_protected,
  toDataView,
  validateOptions,
} from './common';

type RapidSecret = [bigint, bigint, bigint];

const RAPID_SEED = 0xbdd89aa982704029n;
const rapid_secret: RapidSecret = [0x2d358dccaa6c78a5n, 0x8bb84b93962eacc9n, 0x4b33a62ed433d4a3n];

// ---

function rapidhash_v1_internal(
  key: DataView,
  seed: bigint,
  secret: RapidSecret,
  rapid_mix: RapidMix,
  rapidhash_epilogue: RapidhashEpilogue,
): bigint {
  const len = key.byteLength;
  const lenBI = BigInt(key.byteLength);

  seed ^= rapid_mix(seed ^ secret[0], secret[1]) ^ lenBI;

  let a: bigint;
  let b: bigint;

  if (len <= 16) {
    if (len >= 4) {
      const last = len - 4;
      a = rapid_read32x2(key, 0, last);
      const delta = (len & 24) >> (len >> 3);
      b = rapid_read32x2(key, delta, last - delta);
    } else if (len > 0) {
      a = rapid_readSmall(key, 0, len);
      b = 0n;
    } else {
      a = 0n;
      b = 0n;
    }
  } else {
    let i = len;
    let p = 0;

    if (i > 48) {
      let see1 = seed;
      let see2 = seed;

      while (i >= 96) {
        seed = rapid_mix(rapid_read64(key, p) ^ secret[0], rapid_read64(key, p + 8) ^ seed);
        see1 = rapid_mix(rapid_read64(key, p + 16) ^ secret[1], rapid_read64(key, p + 24) ^ see1);
        see2 = rapid_mix(rapid_read64(key, p + 32) ^ secret[2], rapid_read64(key, p + 40) ^ see2);
        seed = rapid_mix(rapid_read64(key, p + 48) ^ secret[0], rapid_read64(key, p + 56) ^ seed);
        see1 = rapid_mix(rapid_read64(key, p + 64) ^ secret[1], rapid_read64(key, p + 72) ^ see1);
        see2 = rapid_mix(rapid_read64(key, p + 80) ^ secret[2], rapid_read64(key, p + 88) ^ see2);
        p += 96;
        i -= 96;
      }
      if (i >= 48) {
        seed = rapid_mix(rapid_read64(key, p) ^ secret[0], rapid_read64(key, p + 8) ^ seed);
        see1 = rapid_mix(rapid_read64(key, p + 16) ^ secret[1], rapid_read64(key, p + 24) ^ see1);
        see2 = rapid_mix(rapid_read64(key, p + 32) ^ secret[2], rapid_read64(key, p + 40) ^ see2);
        p += 48;
        i -= 48;
      }

      seed ^= see1 ^ see2;
    }

    if (i > 16) {
      seed = rapid_mix(rapid_read64(key, p) ^ secret[2], rapid_read64(key, p + 8) ^ seed ^ secret[1]);
      if (i > 32) {
        seed = rapid_mix(rapid_read64(key, p + 16) ^ secret[2], rapid_read64(key, p + 24) ^ seed);
      }
    }
    a = rapid_read64(key, p + i - 16);
    b = rapid_read64(key, p + i - 8);
  }
  a ^= secret[1];
  b ^= seed;

  return rapidhash_epilogue(a, b, secret[0], secret[1], lenBI);
}

// ---

/**
 * Calculate a 64-bit hash value of the given message.
 *
 * @param message {string|Uint8Array|DataView} The message to be hashed.
 * @param options Options for modifying the hash calculation.
 * @param options.seed {bigint} 64-bit unsigned seed value.
 * @param options.rapidMumBehaviour {'fast'|'protected'} Alters behaviour of the rapid_mum function. Defaults to 'fast'.
 */
export function rapidhash_v1(message: string | Uint8Array | DataView, options?: Partial<RapidhashOptions>): bigint {
  const {seed, rapidMumBehaviour} = validateOptions(options, RAPID_SEED);
  const {rapid_mix, rapidhash_epilogue} = rapidMumImplementations[rapidMumBehaviour];

  return rapidhash_v1_internal(toDataView(message), seed, rapid_secret, rapid_mix, rapidhash_epilogue);
}

/**
 * Calculate a 64-bit hash value of the given message.
 * This function is equivalent to rapidhash() with options.rapidMumBehaviour set to 'fast'.
 *
 * @param message {string|Uint8Array|DataView} The message to be hashed.
 * @param options Options for modifying the hash calculation.
 * @param options.seed {bigint} 64-bit unsigned seed value.
 */
export function rapidhash_v1_fast(
  message: string | Uint8Array | DataView,
  options?: Partial<Omit<RapidhashOptions, 'rapidMumBehaviour'>>,
): bigint {
  const {seed} = validateOptions(options, RAPID_SEED);

  return rapidhash_v1_internal(toDataView(message), seed, rapid_secret, rapid_mix_fast, rapidhash_epilogue_fast);
}

/**
 * Calculate a 64-bit hash value of the given message.
 * This function is equivalent to rapidhash() with options.rapidMumBehaviour set to 'protected'.
 *
 * @param message {string|Uint8Array|DataView} The message to be hashed.
 * @param options Options for modifying the hash calculation.
 * @param options.seed {bigint} 64-bit unsigned seed value.
 */
export function rapidhash_v1_protected(
  message: string | Uint8Array | DataView,
  options?: Partial<Omit<RapidhashOptions, 'rapidMumBehaviour'>>,
): bigint {
  const {seed} = validateOptions(options, RAPID_SEED);

  return rapidhash_v1_internal(
    toDataView(message),
    seed,
    rapid_secret,
    rapid_mix_protected,
    rapidhash_epilogue_protected,
  );
}
