import {do_not_optimize, measure} from 'mitata';
import type {RandomData, RandomDataArgs} from './data.js';

type MeasureResult = Awaited<ReturnType<typeof measure>>;

export class HashFunctionBenchmark<T extends string | Uint8Array> {
  private _generateRandomData: ((args: RandomDataArgs) => RandomData<T>) | undefined;
  private _randomDataArgs: Record<string, RandomDataArgs> = {};
  private _targetFunctions: [string, (v: T) => bigint][] = [];

  randomDataGenerator(generator: (args: RandomDataArgs) => RandomData<T>): this {
    this._generateRandomData = generator;
    return this;
  }

  randomDataArgs(name: string, args: RandomDataArgs): this {
    this._randomDataArgs[name] = args;
    return this;
  }

  measurementTarget(name: string, target: (v: T) => bigint): this {
    this._targetFunctions.push([name, target]);
    return this;
  }

  async run(): Promise<Report[]> {
    if (this._generateRandomData === undefined) {
      throw new Error('randomDataGenerator is not set');
    }

    const reports: Report[] = [];

    for (const [benchmarkName, args] of Object.entries(this._randomDataArgs)) {
      console.log(`[${benchmarkName}]`);

      const data = this._generateRandomData(args);
      const result: (MeasureResult & {functionName: string})[] = [];

      for (const [functionName, targetFunction] of this._targetFunctions) {
        process.stdout.write(`  Running ${functionName}... `);
        const measurement = await this.measure(data, targetFunction);
        console.log('done');

        result.push({functionName, ...measurement});
      }

      console.log('');
      reports.push(new Report(benchmarkName, result));
    }

    return reports;
  }

  private async measure(data: RandomData<T>, targetFunction: (v: T) => bigint): Promise<MeasureResult> {
    return await measure(
      function* () {
        yield {
          [0](): T {
            return data.next();
          },

          bench(v: T): void {
            do_not_optimize(targetFunction(v));
          },
        };
      },
      {
        warmup_samples: 1000,
        min_samples: 1004,
        samples_threshold: 1000,
      },
    );
  }
}

export class Report {
  constructor(
    private readonly benchmarkName: string,
    private readonly results: (MeasureResult & {functionName: string})[],
  ) {}

  show(): void {
    console.log(`[${this.benchmarkName}]`);

    const results = this.results.map((result) => {
      return {
        ...result,
        unitOfTime: this.unitOfTime(result.avg),
        functionNameLength: result.functionName.length,
        opsSec: (1e9 / result.avg).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      };
    });

    const [unit, divisor] = results.reduce((min, {unitOfTime: cur}) => (cur[1] < min[1] ? cur : min), ['s', 1e9]);
    const maxFunctionNameLength = results.reduce((max, {functionNameLength}) => Math.max(max, functionNameLength), 0);
    const maxOpsSecLength = results.reduce((max, {opsSec}) => Math.max(max, opsSec.length), 0);

    for (const result of results) {
      console.log(
        `  ${result.functionName.padEnd(maxFunctionNameLength + 1)}: ${result.opsSec.padStart(maxOpsSecLength)} ops/s (${(result.avg / divisor).toFixed(2)} ${unit}/iter)`,
      );
    }

    console.log('');
  }

  private unitOfTime(ns: number): [string, number] {
    if (ns < 1e3) {
      return ['ns', 1];
    }

    if (ns < 1e6) {
      return ['µs', 1e3];
    }

    if (ns < 1e9) {
      return ['ms', 1e6];
    }

    return ['s', 1e9];
  }
}
