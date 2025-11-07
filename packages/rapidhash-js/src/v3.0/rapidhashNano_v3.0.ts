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
import {
  RAPID_SEED,
  type RapidhashEpilogueV3,
  type RapidSecret,
  rapid_readSmallV3,
  rapid_secret,
  rapidhash_epilogueV3_fast,
  rapidhash_epilogueV3_protected,
  rapidMumImplementationsV3,
} from './common_v3';

function rapidhashNano_v3_0_internal(
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

    if (i > 48) {
      let see1 = seed;
      let see2 = seed;

      do {
        seed = rapid_mix(rapid_read64(key, p) ^ secret[0], rapid_read64(key, p + 8) ^ seed);
        see1 = rapid_mix(rapid_read64(key, p + 16) ^ secret[1], rapid_read64(key, p + 24) ^ see1);
        see2 = rapid_mix(rapid_read64(key, p + 32) ^ secret[2], rapid_read64(key, p + 40) ^ see2);
        p += 48;
        i -= 48;
      } while (i > 48);

      seed ^= see1;
      seed ^= see2;
    }

    bi = BigInt(i);

    if (i > 16) {
      seed = rapid_mix(rapid_read64(key, p) ^ secret[2], rapid_read64(key, p + 8) ^ seed);
      if (i > 32) {
        seed = rapid_mix(rapid_read64(key, p + 16) ^ secret[2], rapid_read64(key, p + 24) ^ seed);
      }
    }

    a = rapid_read64(key, p + i - 16) ^ bi;
    b = rapid_read64(key, p + i - 8);
  }

  a ^= secret[1];
  b ^= seed;

  return rapidhash_epilogue(a, b, secret, bi);
}

/**
 * Calculate a 64-bit hash value of the given message using the Nano variant.
 * This variant uses 48-byte loop blocks for optimized performance characteristics.
 *
 * @param message {string|Uint8Array|DataView} The message to be hashed.
 * @param options Options for modifying the hash calculation.
 * @param options.seed {bigint} 64-bit unsigned seed value.
 * @param options.rapidMumBehaviour {"fast"|"protected"} Alters behaviour of the rapid_mum function. Defaults to 'fast'.
 */
export function rapidhashNano(message: string | Uint8Array | DataView, options?: Partial<RapidhashOptions>): bigint {
  const {seed, rapidMumBehaviour} = validateOptions(options, RAPID_SEED);
  const {rapid_mix, rapidhash_epilogue} = rapidMumImplementationsV3[rapidMumBehaviour];

  return rapidhashNano_v3_0_internal(toDataView(message), seed, rapid_secret, rapid_mix, rapidhash_epilogue);
}

/**
 * Calculate a 64-bit hash value of the given message using the Nano variant.
 * This function is equivalent to rapidhashNano() with options.rapidMumBehaviour set to 'fast'.
 *
 * @param message {string|Uint8Array|DataView} The message to be hashed.
 * @param options Options for modifying the hash calculation.
 * @param options.seed {bigint} 64-bit unsigned seed value.
 */
export function rapidhashNano_fast(
  message: string | Uint8Array | DataView,
  options?: Partial<Omit<RapidhashOptions, 'rapidMumBehaviour'>>,
): bigint {
  const {seed} = validateOptions(options, RAPID_SEED);

  return rapidhashNano_v3_0_internal(
    toDataView(message),
    seed,
    rapid_secret,
    rapid_mix_fast,
    rapidhash_epilogueV3_fast,
  );
}

/**
 * Calculate a 64-bit hash value of the given message using the Nano variant.
 * This function is equivalent to rapidhashNano() with options.rapidMumBehaviour set to 'protected'.
 *
 * @param message {string|Uint8Array|DataView} The message to be hashed.
 * @param options Options for modifying the hash calculation.
 * @param options.seed {bigint} 64-bit unsigned seed value.
 */
export function rapidhashNano_protected(
  message: string | Uint8Array | DataView,
  options?: Partial<Omit<RapidhashOptions, 'rapidMumBehaviour'>>,
): bigint {
  const {seed} = validateOptions(options, RAPID_SEED);

  return rapidhashNano_v3_0_internal(
    toDataView(message),
    seed,
    rapid_secret,
    rapid_mix_protected,
    rapidhash_epilogueV3_protected,
  );
}
