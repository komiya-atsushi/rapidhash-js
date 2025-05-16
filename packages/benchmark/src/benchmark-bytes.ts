import {rapidhash_fast, rapidhash_protected} from 'rapidhash-js';
import {HashFunctionBenchmark} from './benchmark-base.js';
import {RandomBytes} from './data.js';

async function main(): Promise<void> {
  const result = await new HashFunctionBenchmark()
    .randomDataGenerator(RandomBytes.generate)
    .randomDataArgs('1-4 bytes', {
      numItems: 1024,
      minLengthInclusive: 1,
      maxLengthInclusive: 4,
    })
    .randomDataArgs('1-8 bytes', {
      numItems: 1024,
      minLengthInclusive: 1,
      maxLengthInclusive: 8,
    })
    .randomDataArgs('1-16 bytes', {
      numItems: 1024,
      minLengthInclusive: 1,
      maxLengthInclusive: 16,
    })
    .randomDataArgs('17-128 bytes', {
      numItems: 1024,
      minLengthInclusive: 17,
      maxLengthInclusive: 128,
    })
    .randomDataArgs('129-256 bytes', {
      numItems: 1024,
      minLengthInclusive: 129,
      maxLengthInclusive: 256,
    })
    .randomDataArgs('1M bytes', {
      numItems: 4,
      minLengthInclusive: 1024 * 1024,
      maxLengthInclusive: 1024 * 1024,
    })
    .measurementTarget('rapidhash_fast', (b) => rapidhash_fast(b))
    .measurementTarget('rapidhash_protected', (b) => rapidhash_protected(b))
    .run();

  for (const report of result) {
    report.show();
  }
}

main()
  .then(() => {})
  .catch(console.error);
