export type FunctionName = 'rapidhash' | 'rapidhashMicro' | 'rapidhashNano';
export type Behaviour = 'fast' | 'protected';
export type RapidhashFunction = (message: ArrayBuffer, len: number, seed: bigint) => bigint;

export interface TestVectors {
  short: {
    testVectors: (readonly [string, bigint, bigint])[];
  };
  long: {
    message: string;
    repetitions: number;
    testVectors: (readonly [number, bigint, bigint])[];
  };
}
