import {rapidhash_fast, rapidhash_protected} from 'rapidhash-js';
import {HashFunctionBenchmark} from './benchmark-base.js';
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
    .randomDataArgs('17-128 characters', {
      numItems: 1024,
      minLengthInclusive: 17,
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
    .measurementTarget('rapidhash_fast', (str) => rapidhash_fast(str))
    .measurementTarget('rapidhash_protected', (str) => rapidhash_protected(str))
    .run();

  for (const report of result) {
    report.show();
  }
}

main()
  .then(() => {})
  .catch(console.error);
