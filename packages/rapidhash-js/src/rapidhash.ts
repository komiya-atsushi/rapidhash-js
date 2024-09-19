const RAPID_SEED = 0xbdd89aa982704029n;
const rapid_secret: [bigint, bigint, bigint] = [
  0x2d358dccaa6c78a5n,
  0x8bb84b93962eacc9n,
  0x4b33a62ed433d4a3n,
];

function rapid_mum_fast(a: bigint, b: bigint): bigint {
  return a * b;
}

function rapid_mum_protected(a: bigint, b: bigint): bigint {
  const m = a * b;
  return m ^ (a | (b << 64n));
}

function rapid_mix(
  a: bigint,
  b: bigint,
  rapid_mum: (a: bigint, b: bigint) => bigint
): bigint {
  const m = rapid_mum(a, b);
  return BigInt.asUintN(64, m) ^ (m >> 64n);
}

function rapid_read32(buf: DataView, offset: number): bigint {
  return BigInt(buf.getUint32(offset, true));
}

function rapid_read64(buf: DataView, offset: number): bigint {
  return buf.getBigUint64(offset, true);
}

function rapid_readSmall(buf: DataView, offset: number, k: number): bigint {
  const v1 = buf.getUint8(offset);
  const v2 = buf.getUint8(offset + (k >> 1));
  const v3 = buf.getUint8(offset + k - 1);

  return (BigInt(v1) << 56n) | (BigInt(v2) << 32n) | BigInt(v3);
}

function rapidhash_internal(
  key: DataView,
  seed: bigint,
  secret: [bigint, bigint, bigint],
  rapid_mum: (a: bigint, b: bigint) => bigint
): bigint {
  const len = key.byteLength;
  const lenBI = BigInt(key.byteLength);

  seed ^= rapid_mix(seed ^ secret[0], secret[1], rapid_mum) ^ lenBI;

  let a: bigint;
  let b: bigint;

  if (len <= 16) {
    if (len >= 4) {
      const last = len - 4;
      a = (rapid_read32(key, 0) << 32n) | rapid_read32(key, last);
      const delta = (len & 24) >> (len >> 3);
      b = (rapid_read32(key, delta) << 32n) | rapid_read32(key, last - delta);
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
      let see1 = seed,
        see2 = seed;
      while (i >= 96) {
        seed = rapid_mix(
          rapid_read64(key, p) ^ secret[0],
          rapid_read64(key, p + 8) ^ seed,
          rapid_mum
        );
        see1 = rapid_mix(
          rapid_read64(key, p + 16) ^ secret[1],
          rapid_read64(key, p + 24) ^ see1,
          rapid_mum
        );
        see2 = rapid_mix(
          rapid_read64(key, p + 32) ^ secret[2],
          rapid_read64(key, p + 40) ^ see2,
          rapid_mum
        );
        seed = rapid_mix(
          rapid_read64(key, p + 48) ^ secret[0],
          rapid_read64(key, p + 56) ^ seed,
          rapid_mum
        );
        see1 = rapid_mix(
          rapid_read64(key, p + 64) ^ secret[1],
          rapid_read64(key, p + 72) ^ see1,
          rapid_mum
        );
        see2 = rapid_mix(
          rapid_read64(key, p + 80) ^ secret[2],
          rapid_read64(key, p + 88) ^ see2,
          rapid_mum
        );
        p += 96;
        i -= 96;
      }
      if (i >= 48) {
        seed = rapid_mix(
          rapid_read64(key, p) ^ secret[0],
          rapid_read64(key, p + 8) ^ seed,
          rapid_mum
        );
        see1 = rapid_mix(
          rapid_read64(key, p + 16) ^ secret[1],
          rapid_read64(key, p + 24) ^ see1,
          rapid_mum
        );
        see2 = rapid_mix(
          rapid_read64(key, p + 32) ^ secret[2],
          rapid_read64(key, p + 40) ^ see2,
          rapid_mum
        );
        p += 48;
        i -= 48;
      }

      seed ^= see1 ^ see2;
    }

    if (i > 16) {
      seed = rapid_mix(
        rapid_read64(key, p) ^ secret[2],
        rapid_read64(key, p + 8) ^ seed ^ secret[1],
        rapid_mum
      );
      if (i > 32) {
        seed = rapid_mix(
          rapid_read64(key, p + 16) ^ secret[2],
          rapid_read64(key, p + 24) ^ seed,
          rapid_mum
        );
      }
    }
    a = rapid_read64(key, p + i - 16);
    b = rapid_read64(key, p + i - 8);
  }
  a ^= secret[1];
  b ^= seed;
  const m = rapid_mum(a, b);
  return rapid_mix(
    BigInt.asUintN(64, m) ^ secret[0] ^ lenBI,
    (m >> 64n) ^ secret[1],
    rapid_mum
  );
}

type RapidMumBehaviour = 'fast' | 'protected';
const defaultRapidMumBehaviour: RapidMumBehaviour = 'fast';
const rapidMumImplementations: {
  [behaviour in RapidMumBehaviour]: (a: bigint, b: bigint) => bigint;
} = {
  fast: rapid_mum_fast,
  protected: rapid_mum_protected,
};

interface RapidhashOptions {
  seed: bigint;
  rapidMumBehaviour: RapidMumBehaviour;
}

function isBigUint64(value: bigint): boolean {
  return value >= 0n && value <= 0xffff_ffff_ffff_ffffn;
}

function validateOptions(
  options: Partial<RapidhashOptions> | undefined
): RapidhashOptions {
  const result: RapidhashOptions = {
    seed: RAPID_SEED,
    rapidMumBehaviour: defaultRapidMumBehaviour,
  };

  if (options === undefined) {
    return result;
  }

  if (options.seed !== undefined) {
    if (!isBigUint64(options.seed)) {
      throw new Error(
        `seed must be a 64-bit unsigned bigint value: ${options.seed}`
      );
    }
    result.seed = options.seed;
  }

  if (options.rapidMumBehaviour !== undefined) {
    result.rapidMumBehaviour = options.rapidMumBehaviour;
  }

  return result;
}

const textEncoder = new TextEncoder();

function toDataView(message: string | Uint8Array | DataView): DataView {
  if (message instanceof DataView) {
    return message;
  }
  if (message instanceof Uint8Array) {
    return new DataView(message.buffer, message.byteOffset, message.byteLength);
  }
  const utf8bytes = textEncoder.encode(message);
  return new DataView(
    utf8bytes.buffer,
    utf8bytes.byteOffset,
    utf8bytes.byteLength
  );
}

/**
 * Calculate a 64-bit hash value of the given message.
 *
 * @param message {string|Uint8Array|DataView} The message to be hashed.
 * @param options Options for modifying the hash calculation.
 * @param options.seed {bigint} 64-bit unsigned seed value.
 * @param options.rapidMumBehaviour {'fast'|'protected'} Alters behaviour of the rapid_mum function. Defaults to 'fast'.
 */
export function rapidhash(
  message: string | Uint8Array | DataView,
  options?: Partial<RapidhashOptions>
): bigint {
  const {seed, rapidMumBehaviour} = validateOptions(options);

  return rapidhash_internal(
    toDataView(message),
    seed,
    rapid_secret,
    rapidMumImplementations[rapidMumBehaviour]
  );
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
  options?: Partial<Omit<RapidhashOptions, 'rapidMumBehaviour'>>
): bigint {
  const {seed} = validateOptions(options);

  return rapidhash_internal(
    toDataView(message),
    seed,
    rapid_secret,
    rapid_mum_fast
  );
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
  options?: Partial<Omit<RapidhashOptions, 'rapidMumBehaviour'>>
): bigint {
  const {seed} = validateOptions(options);

  return rapidhash_internal(
    toDataView(message),
    seed,
    rapid_secret,
    rapid_mum_protected
  );
}
