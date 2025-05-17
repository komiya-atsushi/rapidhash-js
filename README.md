# rapidhash-js

[![npm version](https://badge.fury.io/js/rapidhash-js.png)](https://badge.fury.io/js/rapidhash-js)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/komiya-atsushi/rapidhash-js/test.yaml)](https://github.com/komiya-atsushi/rapidhash-js/actions/workflows/test.yaml)
[![NPM License](https://img.shields.io/npm/l/rapidhash-js)](https://opensource.org/licenses/MIT)

A TypeScript implementation of the [Nicoshev/rapidhash](https://github.com/Nicoshev/rapidhash).

Rapidhash is a fast hashing algorithm that passes all tests in [SMHasher](https://github.com/rurban/smhasher) and [SMHasher3](https://gitlab.com/fwojcik/smhasher3).

## Installation


```bash
npm install rapidhash-js
```

## Usage

```typescript
import {
  // The functions rapidhash, rapidhash_fast, and rapidhash_protected currently implement the v2 algorithm.
  rapidhash,
  rapidhash_fast,
  rapidhash_protected,
  // To use the old v1 algorithm, import rapidhash_v1 (or rapidhash_v1_fast, rapidhash_v1_protected) instead.
  rapidhash_v1,
} from 'rapidhash-js';

// rapidhash() returns a 64-bit hash value represented as bigint.
console.log(rapidhash('hello world'));  // Output: 1722744455612372674n

// You can specify a 64-bit seed value with the 'seed' option.
console.log(rapidhash('hello world', {seed: 0x0123_4567_89AB_CDEFn}));  // Output: 13409940373860458135n

// You can specify the behavior of the rapid_mum() function
// with the rapidMumBehaviour option (default is 'fast').
console.log(rapidhash('hello world', {rapidMumBehaviour: 'protected'}));  // Output: 12365338091610779222n

// Instead of specifying the rapidMumBehaviour option,
// you can call rapidhash_fast() or rapidhash_protected().
console.log(rapidhash_protected('hello world'));
```

## Benchmark

```
[Benchmark Environment]
  Node.js: v22.15.1
  CPU: Apple M3 Max (16 cores, 2400 MHz)

[1-4 bytes]
  rapidhash_v1_fast      : 6,158,460.80 ops/s (162.38 ns/iter)
  rapidhash_v1_protected : 5,238,665.86 ops/s (190.89 ns/iter)
  rapidhash_v2_fast      : 6,652,432.34 ops/s (150.32 ns/iter)
  rapidhash_v2_protected : 5,426,323.09 ops/s (184.29 ns/iter)

[1-8 bytes]
  rapidhash_v1_fast      : 5,734,137.37 ops/s (174.39 ns/iter)
  rapidhash_v1_protected : 5,110,619.92 ops/s (195.67 ns/iter)
  rapidhash_v2_fast      : 5,928,919.83 ops/s (168.66 ns/iter)
  rapidhash_v2_protected : 5,263,867.11 ops/s (189.97 ns/iter)

[1-16 bytes]
  rapidhash_v1_fast      : 5,655,101.18 ops/s (176.83 ns/iter)
  rapidhash_v1_protected : 5,096,905.96 ops/s (196.20 ns/iter)
  rapidhash_v2_fast      : 5,861,882.39 ops/s (170.59 ns/iter)
  rapidhash_v2_protected : 5,210,155.86 ops/s (191.93 ns/iter)

[17-56 bytes]
  rapidhash_v1_fast      : 3,769,517.21 ops/s (265.29 ns/iter)
  rapidhash_v1_protected : 3,342,290.50 ops/s (299.20 ns/iter)
  rapidhash_v2_fast      : 3,982,046.12 ops/s (251.13 ns/iter)
  rapidhash_v2_protected : 3,515,249.93 ops/s (284.47 ns/iter)

[57-128 bytes]
  rapidhash_v1_fast      : 2,260,312.89 ops/s (442.42 ns/iter)
  rapidhash_v1_protected : 2,048,074.92 ops/s (488.26 ns/iter)
  rapidhash_v2_fast      : 2,161,841.53 ops/s (462.57 ns/iter)
  rapidhash_v2_protected : 2,005,979.52 ops/s (498.51 ns/iter)

[129-256 bytes]
  rapidhash_v1_fast      : 1,291,980.54 ops/s (774.01 ns/iter)
  rapidhash_v1_protected : 1,201,241.40 ops/s (832.47 ns/iter)
  rapidhash_v2_fast      : 1,274,486.99 ops/s (784.63 ns/iter)
  rapidhash_v2_protected : 1,200,791.35 ops/s (832.78 ns/iter)

[1M bytes]
  rapidhash_v1_fast      : 308.34 ops/s (3.24 ms/iter)
  rapidhash_v1_protected : 291.73 ops/s (3.43 ms/iter)
  rapidhash_v2_fast      : 309.57 ops/s (3.23 ms/iter)
  rapidhash_v2_protected : 291.12 ops/s (3.43 ms/iter)
```

## License

MIT License

Copyright (c) 2025 KOMIYA Atsushi.
