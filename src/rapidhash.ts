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
  return (m & 0xffff_ffff_ffff_ffffn) ^ (m >> 64n);
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
    (m & 0xffff_ffff_ffff_ffffn) ^ secret[0] ^ lenBI,
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

const textEncoder = new TextEncoder();

function toDataViewFromString(message: string): DataView {
  const utf8bytes = textEncoder.encode(message);
  return new DataView(
    utf8bytes.buffer,
    utf8bytes.byteOffset,
    utf8bytes.byteLength
  );
}

export function rapidhash(
  message: string,
  options_: Partial<RapidhashOptions> = {
    seed: RAPID_SEED,
    rapidMumBehaviour: defaultRapidMumBehaviour,
  }
): bigint {
  const options = {
    seed: options_.seed ?? RAPID_SEED,
    rapidMumBehaviour: options_.rapidMumBehaviour ?? defaultRapidMumBehaviour,
  };

  return rapidhash_internal(
    toDataViewFromString(message),
    options.seed,
    rapid_secret,
    rapidMumImplementations[options.rapidMumBehaviour]
  );
}
