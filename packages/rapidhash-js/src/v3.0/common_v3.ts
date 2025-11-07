import {rapid_mix_fast, rapid_mix_protected} from '../common';
import {RAPID_SEED, type RapidSecret, rapid_secret} from '../common_v2';

// Default seed and secret parameters are the same as Rapidhash V2
export {RAPID_SEED, type RapidSecret, rapid_secret};

// ---

const readSmallV3Buffer = new Uint8Array(8);
const readSmallV3View = new DataView(readSmallV3Buffer.buffer);

export function rapid_readSmallV3(input: DataView, len: number): bigint {
  const v = input.getUint8(0);
  readSmallV3Buffer[6] = v >> 3;
  readSmallV3Buffer[5] = v << 5;
  readSmallV3Buffer[0] = input.getUint8(len - 1);
  return readSmallV3View.getBigUint64(0, true);
}

// ---

export type RapidhashEpilogueV3 = (a: bigint, b: bigint, secret: RapidSecret, i: bigint) => bigint;

export function rapidhash_epilogueV3_fast(a: bigint, b: bigint, secret: RapidSecret, i: bigint): bigint {
  const m0 = a * b;
  const m1 = (BigInt.asUintN(64, m0) ^ secret[7]) * ((m0 >> 64n) ^ secret[1] ^ i);
  return BigInt.asUintN(64, m1) ^ (m1 >> 64n);
}

export function rapidhash_epilogueV3_protected(a0: bigint, b0: bigint, secret: RapidSecret, i: bigint): bigint {
  const m0 = a0 * b0;
  const a1 = BigInt.asUintN(64, m0) ^ secret[7] ^ a0;
  const b1 = (m0 >> 64n) ^ secret[1] ^ i ^ b0;
  const m1 = a1 * b1;
  return BigInt.asUintN(64, m1) ^ (m1 >> 64n) ^ a1 ^ b1;
}

// ---

export const rapidMumImplementationsV3 = {
  fast: {
    rapid_mix: rapid_mix_fast,
    rapidhash_epilogue: rapidhash_epilogueV3_fast,
  },
  protected: {
    rapid_mix: rapid_mix_protected,
    rapidhash_epilogue: rapidhash_epilogueV3_protected,
  },
};
