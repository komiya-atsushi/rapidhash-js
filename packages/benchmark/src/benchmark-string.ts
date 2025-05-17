import {rapidhash_v1_fast, rapidhash_v1_protected, rapidhash_v2_fast, rapidhash_v2_protected} from 'rapidhash-js';
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
    .randomDataArgs('1-8 characters', {
      numItems: 1024,
      minLengthInclusive: 1,
      maxLengthInclusive: 8,
    })
    .randomDataArgs('1-16 characters', {
      numItems: 1024,
      minLengthInclusive: 1,
      maxLengthInclusive: 16,
    })
    .randomDataArgs('17-56 characters', {
      numItems: 1024,
      minLengthInclusive: 17,
      maxLengthInclusive: 56,
    })
    .randomDataArgs('57-128 characters', {
      numItems: 1024,
      minLengthInclusive: 57,
      maxLengthInclusive: 128,
    })
    .randomDataArgs('129-256 characters', {
      numItems: 1024,
      minLengthInclusive: 129,
      maxLengthInclusive: 256,
    })
    .randomDataArgs('1M characters', {
      numItems: 4,
      minLengthInclusive: 1024 * 1024,
      maxLengthInclusive: 1024 * 1024,
    })
    .measurementTarget('rapidhash_v1_fast', (str) => rapidhash_v1_fast(str))
    .measurementTarget('rapidhash_v1_protected', (str) => rapidhash_v1_protected(str))
    .measurementTarget('rapidhash_v2_fast', (str) => rapidhash_v2_fast(str))
    .measurementTarget('rapidhash_v2_protected', (str) => rapidhash_v2_protected(str))
    .run();

  showBenchmarkEnvironment();

  for (const report of result) {
    report.show();
  }
}

main()
  .then(() => {})
  .catch(console.error);
