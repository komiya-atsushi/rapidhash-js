type RapidSecret = [bigint, bigint, bigint];
type RapidMix = (a: bigint, b: bigint) => bigint;
type RapidhashEpilogue = (
  a: bigint,
  b: bigint,
  secret: RapidSecret,
  len: bigint
) => bigint;

const RAPID_SEED = 0xbdd89aa982704029n;
const rapid_secret: RapidSecret = [
  0x2d358dccaa6c78a5n,
  0x8bb84b93962eacc9n,
  0x4b33a62ed433d4a3n,
];

function rapid_mix_fast(a: bigint, b: bigint): bigint {
  const m = a * b;
  return BigInt.asUintN(64, m) ^ (m >> 64n);
}

function rapidhash_epilogue_fast(
  a: bigint,
  b: bigint,
  secret: RapidSecret,
  len: bigint
): bigint {
  const m0 = a * b;
  const m1 =
    (BigInt.asUintN(64, m0) ^ secret[0] ^ len) * ((m0 >> 64n) ^ secret[1]);
  return BigInt.asUintN(64, m1) ^ (m1 >> 64n);
}

function rapid_mix_protected(a: bigint, b: bigint): bigint {
  const m = a * b;
  return BigInt.asUintN(64, m) ^ (m >> 64n) ^ a ^ b;
}

function rapidhash_epilogue_protected(
  a0: bigint,
  b0: bigint,
  secret: RapidSecret,
  len: bigint
): bigint {
  const m0 = a0 * b0;
  const a1 = BigInt.asUintN(64, m0) ^ secret[0] ^ len ^ a0;
  const b1 = (m0 >> 64n) ^ secret[1] ^ b0;
  const m1 = a1 * b1;
  return BigInt.asUintN(64, m1) ^ (m1 >> 64n) ^ a1 ^ b1;
}

const read32x2Buffer = new Uint8Array(8);
const read32x2View = new DataView(read32x2Buffer.buffer);

function rapid_read32x2(
  buf: DataView,
  offset1: number,
  offset2: number
): bigint {
  read32x2View.setUint32(4, buf.getUint32(offset1, true), true);
  read32x2View.setUint32(0, buf.getUint32(offset2, true), true);
  return read32x2View.getBigUint64(0, true);
}

function rapid_read64(buf: DataView, offset: number): bigint {
  return buf.getBigUint64(offset, true);
}

const readSmallBuffer = new Uint8Array(8);
const readSmallView = new DataView(readSmallBuffer.buffer);

function rapid_readSmall(buf: DataView, offset: number, k: number): bigint {
  readSmallBuffer[7] = buf.getUint8(offset);
  readSmallBuffer[4] = buf.getUint8(offset + (k >> 1));
  readSmallBuffer[0] = buf.getUint8(offset + k - 1);
  return readSmallView.getBigUint64(0, true);
}

function rapidhash_internal(
  key: DataView,
  seed: bigint,
  secret: RapidSecret,
  rapid_mix: RapidMix,
  rapidhash_epilogue: RapidhashEpilogue
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
      let see1 = seed,
        see2 = seed;
      while (i >= 96) {
        seed = rapid_mix(
          rapid_read64(key, p) ^ secret[0],
          rapid_read64(key, p + 8) ^ seed
        );
        see1 = rapid_mix(
          rapid_read64(key, p + 16) ^ secret[1],
          rapid_read64(key, p + 24) ^ see1
        );
        see2 = rapid_mix(
          rapid_read64(key, p + 32) ^ secret[2],
          rapid_read64(key, p + 40) ^ see2
        );
        seed = rapid_mix(
          rapid_read64(key, p + 48) ^ secret[0],
          rapid_read64(key, p + 56) ^ seed
        );
        see1 = rapid_mix(
          rapid_read64(key, p + 64) ^ secret[1],
          rapid_read64(key, p + 72) ^ see1
        );
        see2 = rapid_mix(
          rapid_read64(key, p + 80) ^ secret[2],
          rapid_read64(key, p + 88) ^ see2
        );
        p += 96;
        i -= 96;
      }
      if (i >= 48) {
        seed = rapid_mix(
          rapid_read64(key, p) ^ secret[0],
          rapid_read64(key, p + 8) ^ seed
        );
        see1 = rapid_mix(
          rapid_read64(key, p + 16) ^ secret[1],
          rapid_read64(key, p + 24) ^ see1
        );
        see2 = rapid_mix(
          rapid_read64(key, p + 32) ^ secret[2],
          rapid_read64(key, p + 40) ^ see2
        );
        p += 48;
        i -= 48;
      }

      seed ^= see1 ^ see2;
    }

    if (i > 16) {
      seed = rapid_mix(
        rapid_read64(key, p) ^ secret[2],
        rapid_read64(key, p + 8) ^ seed ^ secret[1]
      );
      if (i > 32) {
        seed = rapid_mix(
          rapid_read64(key, p + 16) ^ secret[2],
          rapid_read64(key, p + 24) ^ seed
        );
      }
    }
    a = rapid_read64(key, p + i - 16);
    b = rapid_read64(key, p + i - 8);
  }
  a ^= secret[1];
  b ^= seed;

  return rapidhash_epilogue(a, b, secret, lenBI);
}

type RapidMumBehaviour = 'fast' | 'protected';
const defaultRapidMumBehaviour: RapidMumBehaviour = 'fast';
const rapidMumImplementations: {
  [behaviour in RapidMumBehaviour]: {
    rapid_mix: RapidMix;
    rapidhash_epilogue: RapidhashEpilogue;
  };
} = {
  fast: {
    rapid_mix: rapid_mix_fast,
    rapidhash_epilogue: rapidhash_epilogue_fast,
  },
  protected: {
    rapid_mix: rapid_mix_protected,
    rapidhash_epilogue: rapidhash_epilogue_protected,
  },
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
const utf8BufferSize = 2048;
const stringLengthThresholdToUseBuffer = utf8BufferSize / 3;
const utf8Buffer = new Uint8Array(utf8BufferSize);

function toDataView(message: string | Uint8Array | DataView): DataView {
  if (typeof message === 'string') {
    if (message.length <= stringLengthThresholdToUseBuffer) {
      const {written} = textEncoder.encodeInto(message, utf8Buffer);
      return new DataView(utf8Buffer.buffer, 0, written);
    }

    const utf8bytes = textEncoder.encode(message);
    return new DataView(
      utf8bytes.buffer,
      utf8bytes.byteOffset,
      utf8bytes.byteLength
    );
  }

  if (message instanceof Uint8Array) {
    return new DataView(message.buffer, message.byteOffset, message.byteLength);
  }

  return message;
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
  const {rapid_mix, rapidhash_epilogue} =
    rapidMumImplementations[rapidMumBehaviour];

  return rapidhash_internal(
    toDataView(message),
    seed,
    rapid_secret,
    rapid_mix,
    rapidhash_epilogue
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
    rapid_mix_fast,
    rapidhash_epilogue_fast
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
    rapid_mix_protected,
    rapidhash_epilogue_protected
  );
}
