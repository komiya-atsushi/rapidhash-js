export type RapidMix = (a: bigint, b: bigint) => bigint;
export type RapidhashEpilogue = (a: bigint, b: bigint, secretA: bigint, secretB: bigint, len: bigint) => bigint;

export function rapid_mix_fast(a: bigint, b: bigint): bigint {
  const m = a * b;
  return BigInt.asUintN(64, m) ^ (m >> 64n);
}

export function rapidhash_epilogue_fast(a: bigint, b: bigint, secretA: bigint, secretB: bigint, len: bigint): bigint {
  const m0 = a * b;
  const m1 = (BigInt.asUintN(64, m0) ^ secretA ^ len) * ((m0 >> 64n) ^ secretB);
  return BigInt.asUintN(64, m1) ^ (m1 >> 64n);
}

export function rapid_mix_protected(a: bigint, b: bigint): bigint {
  const m = a * b;
  return BigInt.asUintN(64, m) ^ (m >> 64n) ^ a ^ b;
}

export function rapidhash_epilogue_protected(
  a0: bigint,
  b0: bigint,
  secretA: bigint,
  secretB: bigint,
  len: bigint,
): bigint {
  const m0 = a0 * b0;
  const a1 = BigInt.asUintN(64, m0) ^ secretA ^ len ^ a0;
  const b1 = (m0 >> 64n) ^ secretB ^ b0;
  const m1 = a1 * b1;
  return BigInt.asUintN(64, m1) ^ (m1 >> 64n) ^ a1 ^ b1;
}

// ---

const read32x2Buffer = new Uint8Array(8);
const read32x2View = new DataView(read32x2Buffer.buffer);

export function rapid_read32x2(buf: DataView, offset1: number, offset2: number): bigint {
  read32x2View.setUint32(4, buf.getUint32(offset1, true), true);
  read32x2View.setUint32(0, buf.getUint32(offset2, true), true);
  return read32x2View.getBigUint64(0, true);
}

const read32Buffer = new Uint8Array(8);
const read32View = new DataView(read32Buffer.buffer);

export function rapid_read32(buf: DataView, offset: number): bigint {
  read32View.setUint32(0, buf.getUint32(offset, true), true);
  return read32View.getBigUint64(0, true);
}

export function rapid_read64(buf: DataView, offset: number): bigint {
  return buf.getBigUint64(offset, true);
}

const readSmallBuffer = new Uint8Array(8);
const readSmallView = new DataView(readSmallBuffer.buffer);

export function rapid_readSmall(buf: DataView, offset: number, k: number): bigint {
  readSmallBuffer[7] = buf.getUint8(offset);
  readSmallBuffer[4] = buf.getUint8(offset + (k >> 1));
  readSmallBuffer[0] = buf.getUint8(offset + k - 1);
  return readSmallView.getBigUint64(0, true);
}

// ---

const textEncoder = new TextEncoder();
const utf8BufferSize = 2048;
const stringLengthThresholdToUseBuffer = utf8BufferSize / 3;
const utf8Buffer = new Uint8Array(utf8BufferSize);

export function toDataView(message: string | Uint8Array | DataView): DataView {
  if (typeof message === 'string') {
    if (message.length <= stringLengthThresholdToUseBuffer) {
      const {written} = textEncoder.encodeInto(message, utf8Buffer);
      return new DataView(utf8Buffer.buffer, 0, written);
    }

    const utf8bytes = textEncoder.encode(message);
    return new DataView(utf8bytes.buffer, utf8bytes.byteOffset, utf8bytes.byteLength);
  }

  if (message instanceof Uint8Array) {
    return new DataView(message.buffer, message.byteOffset, message.byteLength);
  }

  return message;
}

// ---

export type RapidMumBehaviour = 'fast' | 'protected';
const defaultRapidMumBehaviour: RapidMumBehaviour = 'fast';

export interface RapidhashOptions {
  seed: bigint;
  rapidMumBehaviour: RapidMumBehaviour;
}

function isBigUint64(value: bigint): boolean {
  return value >= 0n && value <= 0xffff_ffff_ffff_ffffn;
}

export function validateOptions(options: Partial<RapidhashOptions> | undefined, defaultSeed: bigint): RapidhashOptions {
  const result: RapidhashOptions = {
    seed: defaultSeed,
    rapidMumBehaviour: defaultRapidMumBehaviour,
  };

  if (options === undefined) {
    return result;
  }

  if (options.seed !== undefined) {
    if (!isBigUint64(options.seed)) {
      throw new Error(`seed must be a 64-bit unsigned bigint value: ${options.seed}`);
    }
    result.seed = options.seed;
  }

  if (options.rapidMumBehaviour !== undefined) {
    result.rapidMumBehaviour = options.rapidMumBehaviour;
  }

  return result;
}
