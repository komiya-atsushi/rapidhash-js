import * as ffi from 'bun:ffi';
import type * as Bun from 'bun';
import type {FunctionName, RapidhashFunction} from './types';

export function compile(args: {source: Bun.BunFile; behaviour: 'fast' | 'protected'; functionName: FunctionName}): {
  defaultSeed: bigint;
  rapidhashWithSeed: RapidhashFunction;
} {
  const {source, behaviour} = args;
  const functionName = `_${args.functionName}_withSeed`;

  const result = ffi.cc({
    source,
    define: behaviour === 'fast' ? {} : {RAPIDHASH_PROTECTED: '1'},
    symbols: {
      [functionName]: {
        args: ['ptr', 'u32', 'u64'],
        returns: 'u64',
      },
      default_seed: {args: [], returns: 'u64'},
    },
  });

  return {
    defaultSeed: result.symbols.default_seed(),
    rapidhashWithSeed: (message: ArrayBuffer, len: number, seed: bigint): bigint =>
      result.symbols[functionName](ffi.ptr(message), len, seed),
  };
}
