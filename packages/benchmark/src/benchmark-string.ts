import {rapidhash_fast as rapidhash_v1_fast, rapidhash_protected as rapidhash_v1_protected} from 'rapidhash-js/v1.0';
import {
  rapidhash_fast as rapidhash_v2_2_fast,
  rapidhash_protected as rapidhash_v2_2_protected,
} from 'rapidhash-js/v2.2';
import {
  rapidhash_fast as rapidhash_v3_0_fast,
  rapidhash_protected as rapidhash_v3_0_protected,
  rapidhashMicro_fast as rapidhashMicro_v3_0_fast,
  rapidhashMicro_protected as rapidhashMicro_v3_0_protected,
  rapidhashNano_fast as rapidhashNano_v3_0_fast,
  rapidhashNano_protected as rapidhashNano_v3_0_protected,
} from 'rapidhash-js/v3.0';
import {HashFunctionBenchmark} from './benchmark-base.js';
import {showBenchmarkEnvironment} from './benchmark-env.js';
import {RandomStrings} from './data.js';

async function main(): Promise<void> {
  const result = await new HashFunctionBenchmark()
    .randomDataGenerator(RandomStrings.generate)
    .randomDataArgs('1-4 characters', {
      numItems: 1024,
      minLengthInclusive: 1,
      maxLengthInclusive: 4,
    })
    .randomDataArgs('5-8 characters', {
      numItems: 1024,
      minLengthInclusive: 5,
      maxLengthInclusive: 8,
    })
    .randomDataArgs('9-16 characters', {
      numItems: 1024,
      minLengthInclusive: 9,
      maxLengthInclusive: 16,
    })
    .randomDataArgs('17-64 characters', {
      numItems: 1024,
      minLengthInclusive: 17,
      maxLengthInclusive: 64,
    })
    .randomDataArgs('65-111 characters', {
      numItems: 1024,
      minLengthInclusive: 65,
      maxLengthInclusive: 111,
    })
    .randomDataArgs('112-256 characters', {
      numItems: 1024,
      minLengthInclusive: 112,
      maxLengthInclusive: 256,
    })
    .randomDataArgs('1M characters', {
      warmup: 1000,
      numItems: 4,
      minLengthInclusive: 1024 * 1024,
      maxLengthInclusive: 1024 * 1024,
    })
    .measurementTarget('[v1.0] rapidhash (fast)', (b) => rapidhash_v1_fast(b))
    .measurementTarget('[v1.0] rapidhash (protected)', (b) => rapidhash_v1_protected(b))
    .measurementTarget('[v2.2] rapidhash (fast)', (b) => rapidhash_v2_2_fast(b))
    .measurementTarget('[v2.2] rapidhash (protected)', (b) => rapidhash_v2_2_protected(b))
    .measurementTarget('[v3.0] rapidhash (fast)', (b) => rapidhash_v3_0_fast(b))
    .measurementTarget('[v3.0] rapidhash (protected)', (b) => rapidhash_v3_0_protected(b))
    .measurementTarget('[v3.0] rapidhashMicro (fast)', (b) => rapidhashMicro_v3_0_fast(b))
    .measurementTarget('[v3.0] rapidhashMicro (protected)', (b) => rapidhashMicro_v3_0_protected(b))
    .measurementTarget('[v3.0] rapidhashNano (fast)', (b) => rapidhashNano_v3_0_fast(b))
    .measurementTarget('[v3.0] rapidhashNano (protected)', (b) => rapidhashNano_v3_0_protected(b))
    .run();

  showBenchmarkEnvironment();

  for (const report of result) {
    report.show();
  }
}

main()
  .then(() => {})
  .catch(console.error);
