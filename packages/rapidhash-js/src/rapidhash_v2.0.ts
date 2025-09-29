import {
  type RapidhashEpilogue,
  type RapidhashOptions,
  type RapidMix,
  rapid_mix_fast,
  rapid_mix_protected,
  rapid_read32,
  rapid_read64,
  rapid_readSmall,
  rapidhash_epilogue_fast,
  rapidhash_epilogue_protected,
  rapidMumImplementations,
  toDataView,
  validateOptions,
} from './common';
import {RAPID_SEED, type RapidSecret, rapid_secret} from './common_v2';

// ---

function rapidhash_v2_0_internal(
  key: DataView,
  seed: bigint,
  secret: RapidSecret,
  rapid_mix: RapidMix,
  rapidhash_epilogue: RapidhashEpilogue,
): bigint {
  const len = key.byteLength;
  const lenBI = BigInt(key.byteLength);

  seed ^= rapid_mix(seed ^ secret[2], secret[1]) ^ lenBI;

  let a: bigint;
  let b: bigint;

  if (len <= 16) {
    if (len >= 4) {
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
      a = rapid_readSmall(key, 0, len);
      b = 0n;
    } else {
      a = 0n;
      b = 0n;
    }
  } else if (len > 56) {
    let i = len;
    let p = 0;
    let see1 = seed;
    let see2 = seed;
    let see3456: bigint;

    if (i >= 112) {
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
      } while (i >= 112);

      see3456 = see3 ^ see4 ^ see5 ^ see6;
    } else {
      see3456 = 0n;
    }

    if (i >= 48) {
      seed = rapid_mix(rapid_read64(key, p) ^ secret[0], rapid_read64(key, p + 8) ^ seed);
      see1 = rapid_mix(rapid_read64(key, p + 16) ^ secret[1], rapid_read64(key, p + 24) ^ see1);
      see2 = rapid_mix(rapid_read64(key, p + 32) ^ secret[2], rapid_read64(key, p + 40) ^ see2);
      p += 48;
      i -= 48;
      if (i >= 48) {
        seed = rapid_mix(rapid_read64(key, p) ^ secret[0], rapid_read64(key, p + 8) ^ seed);
        see1 = rapid_mix(rapid_read64(key, p + 16) ^ secret[1], rapid_read64(key, p + 24) ^ see1);
        see2 = rapid_mix(rapid_read64(key, p + 32) ^ secret[2], rapid_read64(key, p + 40) ^ see2);
        p += 48;
        i -= 48;
      }
    }

    seed ^= see1 ^ see2 ^ see3456;

    if (i > 16) {
      seed = rapid_mix(rapid_read64(key, p) ^ secret[2], rapid_read64(key, p + 8) ^ seed);
      if (i > 32) {
        seed = rapid_mix(rapid_read64(key, p + 16) ^ secret[2], rapid_read64(key, p + 24) ^ seed);
      }
    }

    a = rapid_read64(key, p + i - 16);
    b = rapid_read64(key, p + i - 8);
  } else {
    seed = rapid_mix(rapid_read64(key, 0) ^ secret[0], rapid_read64(key, 8) ^ seed);
    if (len > 32) {
      seed = rapid_mix(rapid_read64(key, 16) ^ secret[1], rapid_read64(key, 24) ^ seed);
      if (len > 48) {
        seed = rapid_mix(rapid_read64(key, 32) ^ secret[0], rapid_read64(key, 40) ^ seed);
      }
    }

    a = rapid_read64(key, len - 16);
    b = rapid_read64(key, len - 8);
  }
  a ^= secret[1];
  b ^= seed;

  return rapidhash_epilogue(a, b, secret[7], secret[1], lenBI);
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
export function rapidhash_v2_0(message: string | Uint8Array | DataView, options?: Partial<RapidhashOptions>): bigint {
  const {seed, rapidMumBehaviour} = validateOptions(options, RAPID_SEED);
  const {rapid_mix, rapidhash_epilogue} = rapidMumImplementations[rapidMumBehaviour];

  return rapidhash_v2_0_internal(toDataView(message), seed, rapid_secret, rapid_mix, rapidhash_epilogue);
}

/**
 * Calculate a 64-bit hash value of the given message.
 * This function is equivalent to rapidhash() with options.rapidMumBehaviour set to 'fast'.
 *
 * @param message {string|Uint8Array|DataView} The message to be hashed.
 * @param options Options for modifying the hash calculation.
 * @param options.seed {bigint} 64-bit unsigned seed value.
 */
export function rapidhash_v2_0_fast(
  message: string | Uint8Array | DataView,
  options?: Partial<Omit<RapidhashOptions, 'rapidMumBehaviour'>>,
): bigint {
  const {seed} = validateOptions(options, RAPID_SEED);

  return rapidhash_v2_0_internal(toDataView(message), seed, rapid_secret, rapid_mix_fast, rapidhash_epilogue_fast);
}

/**
 * Calculate a 64-bit hash value of the given message.
 * This function is equivalent to rapidhash() with options.rapidMumBehaviour set to 'protected'.
 *
 * @param message {string|Uint8Array|DataView} The message to be hashed.
 * @param options Options for modifying the hash calculation.
 * @param options.seed {bigint} 64-bit unsigned seed value.
 */
export function rapidhash_v2_0_protected(
  message: string | Uint8Array | DataView,
  options?: Partial<Omit<RapidhashOptions, 'rapidMumBehaviour'>>,
): bigint {
  const {seed} = validateOptions(options, RAPID_SEED);

  return rapidhash_v2_0_internal(
    toDataView(message),
    seed,
    rapid_secret,
    rapid_mix_protected,
    rapidhash_epilogue_protected,
  );
}
