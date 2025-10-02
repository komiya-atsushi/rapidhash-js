import * as fs from 'node:fs';
import * as Bun from 'bun';
import {compile} from './compiler';
import {rapidhashGitRepo} from './git';
import {type InputMessage, inputMessages} from './input-message';
import type {Behaviour, FunctionName, RapidhashFunction} from './types';
import {TestVectorWriter} from './writer';

interface RapidhashVersion {
  tag: string;
  version: string;
  source: string;
  functionNames: FunctionName[];
}

const versions: RapidhashVersion[] = [
  {
    tag: 'rapidhash_v1.0',
    version: 'v1.0',
    source: 'src/rapidhash.c',
    functionNames: ['rapidhash'],
  },
  {
    tag: 'rapidhash_v2.0',
    version: 'v2.0',
    source: 'src/rapidhash.c',
    functionNames: ['rapidhash'],
  },
  {
    tag: 'rapidhash_v2.2',
    version: 'v2.2',
    source: 'src/rapidhash.c',
    functionNames: ['rapidhash'],
  },
];

// ---

function generateShortInputTestVectors(rapidhash: RapidhashFunction, seeds: bigint[], shortMessages: InputMessage[]) {
  return seeds.flatMap((seed) =>
    shortMessages.map((message) => [message.message, seed, rapidhash(message.buffer, message.length, seed)] as const),
  );
}

function generateLongInputTestVectors(rapidhash: RapidhashFunction, seeds: bigint[], longInputMessage: InputMessage) {
  const result: (readonly [number, bigint, bigint])[] = [];

  for (let i = 1; i < longInputMessage.length; i++) {
    if (i % 10000 === 0) {
      console.log(`${i} / ${longInputMessage.length}`);
    }

    result.push(...seeds.map((seed) => [i, seed, rapidhash(longInputMessage.buffer, i, seed)] as const));
  }

  return result;
}

function generateTestVectors(args: {
  version: string;
  behaviour: Behaviour;
  tag: string;
  revision: string;
  source: Bun.BunFile;
  destinationDir: string;
  functionName: FunctionName;
}): void {
  const {version, behaviour, tag, revision, source, functionName, destinationDir} = args;

  const {defaultSeed, rapidhashWithSeed} = compile({source, behaviour, functionName});

  const v1DefaultSeed = 0xbdd89aa982704029n;
  const seeds: bigint[] = [defaultSeed, defaultSeed ^ v1DefaultSeed, 0x0123456789abcdefn, 0xfedcba9876543210n];

  const writer = new TestVectorWriter({
    destinationDir,
    version,
    functionName,
    behaviour,
    tag,
    revision,
  });

  const shortTestVectors = generateShortInputTestVectors(rapidhashWithSeed, seeds, inputMessages.shortMessages);
  const longTestVectors = generateLongInputTestVectors(rapidhashWithSeed, [defaultSeed], inputMessages.longMessage);

  try {
    writer.createFile();
    writer.writeTestVectors({
      short: {
        testVectors: shortTestVectors,
      },
      long: {
        message: inputMessages.longMessage.message,
        repetitions: inputMessages.longMessage.repetitions,
        testVectors: longTestVectors,
      },
    });
  } finally {
    writer.close();
  }
}

function generate(rapidhashVersion: RapidhashVersion): void {
  const {tag, version, source, functionNames} = rapidhashVersion;

  console.log(`Generating test vectors for rapidhash ${version}`);

  const revision = rapidhashGitRepo.checkout(tag);

  const destinationDir = `generated/${version}`;
  fs.rmSync(destinationDir, {recursive: true, force: true});
  fs.mkdirSync(destinationDir, {recursive: true});

  for (const functionName of functionNames) {
    const options = {
      version,
      tag,
      revision,
      source: Bun.file(source),
      destinationDir,
      functionName,
    };

    generateTestVectors({...options, behaviour: 'fast'});
    generateTestVectors({...options, behaviour: 'protected'});
  }
}

function main(): void {
  rapidhashGitRepo.pullOrClone();

  for (const v of versions) {
    generate(v);
  }
}

main();
