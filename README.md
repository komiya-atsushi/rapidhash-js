# rapidhash-js

[![npm version](https://badge.fury.io/js/rapidhash-js.svg)](https://badge.fury.io/js/rapidhash-js)
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
  // These functions currently use the v3.0 implementation.
  rapidhash,
  rapidhash_fast,
  rapidhash_protected,
  // rapidhashMicro and rapidhashNano are additional variants in v3.0
  rapidhashMicro,
  rapidhashNano,
} from 'rapidhash-js';

// rapidhash() returns a 64-bit hash value represented as bigint.
console.log(rapidhash('hello world'));

// You can specify a 64-bit seed value with the 'seed' option.
console.log(rapidhash('hello world', {seed: 0x0123_4567_89AB_CDEFn}));

// You can control rapid_mum() behavior with the rapidMumBehaviour option (default: 'fast').
console.log(rapidhash('hello world', {rapidMumBehaviour: 'protected'}));

// Instead of specifying the rapidMumBehaviour option,
// you can call rapidhash_fast() or rapidhash_protected().
console.log(rapidhash_protected('hello world'));

// rapidhashMicro and rapidhashNano are optimized variants with smaller loop blocks
console.log(rapidhashMicro('hello world'));
console.log(rapidhashNano('hello world'));
```

### Using older versions

To use older versions of the algorithm, import from version-specific entry points:

```typescript
// v2.2
import { rapidhash, rapidhash_fast, rapidhash_protected } from 'rapidhash-js/v2.2';

// v2.0
import { rapidhash, rapidhash_fast, rapidhash_protected } from 'rapidhash-js/v2.0';

// v1.0
import { rapidhash, rapidhash_fast, rapidhash_protected } from 'rapidhash-js/v1.0';
```

## Benchmark

<details>
<summary>Apple M3 Max</summary>

```
[Benchmark Environment]
  Node.js: v22.15.1
  CPU: Apple M3 Max (16 cores, 2400 MHz)

[1-4 bytes]
  [v1.0] rapidhash (fast)      : 6,285,122.13 ops/s (159.11 ns/iter)
  [v1.0] rapidhash (protected) : 5,358,496.06 ops/s (186.62 ns/iter)
  [v2.0] rapidhash (fast)      : 6,751,586.61 ops/s (148.11 ns/iter)
  [v2.0] rapidhash (protected) : 5,503,585.53 ops/s (181.70 ns/iter)
  [v2.2] rapidhash (fast)      : 6,713,669.81 ops/s (148.95 ns/iter)
  [v2.2] rapidhash (protected) : 5,474,441.63 ops/s (182.67 ns/iter)

[5-8 bytes]
  [v1.0] rapidhash (fast)      : 5,995,195.47 ops/s (166.80 ns/iter)
  [v1.0] rapidhash (protected) : 5,129,620.76 ops/s (194.95 ns/iter)
  [v2.0] rapidhash (fast)      : 6,217,065.60 ops/s (160.85 ns/iter)
  [v2.0] rapidhash (protected) : 5,326,035.89 ops/s (187.76 ns/iter)
  [v2.2] rapidhash (fast)      : 6,050,308.59 ops/s (165.28 ns/iter)
  [v2.2] rapidhash (protected) : 5,344,429.93 ops/s (187.11 ns/iter)

[9-16 bytes]
  [v1.0] rapidhash (fast)      : 5,986,726.82 ops/s (167.04 ns/iter)
  [v1.0] rapidhash (protected) : 5,154,979.68 ops/s (193.99 ns/iter)
  [v2.0] rapidhash (fast)      : 6,131,914.48 ops/s (163.08 ns/iter)
  [v2.0] rapidhash (protected) : 5,321,633.57 ops/s (187.91 ns/iter)
  [v2.2] rapidhash (fast)      : 6,247,440.63 ops/s (160.07 ns/iter)
  [v2.2] rapidhash (protected) : 5,351,510.81 ops/s (186.86 ns/iter)

[17-64 bytes]
  [v1.0] rapidhash (fast)      : 3,843,646.47 ops/s (260.17 ns/iter)
  [v1.0] rapidhash (protected) : 3,312,988.79 ops/s (301.84 ns/iter)
  [v2.0] rapidhash (fast)      : 3,947,650.45 ops/s (253.32 ns/iter)
  [v2.0] rapidhash (protected) : 3,390,062.69 ops/s (294.98 ns/iter)
  [v2.2] rapidhash (fast)      : 4,039,784.70 ops/s (247.54 ns/iter)
  [v2.2] rapidhash (protected) : 3,400,339.38 ops/s (294.09 ns/iter)

[65-111 bytes]
  [v1.0] rapidhash (fast)      : 2,539,382.14 ops/s (393.80 ns/iter)
  [v1.0] rapidhash (protected) : 2,156,257.28 ops/s (463.77 ns/iter)
  [v2.0] rapidhash (fast)      : 2,580,829.71 ops/s (387.47 ns/iter)
  [v2.0] rapidhash (protected) : 2,186,335.35 ops/s (457.39 ns/iter)
  [v2.2] rapidhash (fast)      : 2,545,090.54 ops/s (392.91 ns/iter)
  [v2.2] rapidhash (protected) : 2,189,080.78 ops/s (456.81 ns/iter)

[112-256 bytes]
  [v1.0] rapidhash (fast)      : 1,518,423.71 ops/s (658.58 ns/iter)
  [v1.0] rapidhash (protected) : 1,274,445.41 ops/s (784.66 ns/iter)
  [v2.0] rapidhash (fast)      : 1,484,277.31 ops/s (673.73 ns/iter)
  [v2.0] rapidhash (protected) : 1,258,892.94 ops/s (794.35 ns/iter)
  [v2.2] rapidhash (fast)      : 1,525,211.09 ops/s (655.65 ns/iter)
  [v2.2] rapidhash (protected) : 1,293,585.65 ops/s (773.05 ns/iter)

[1M bytes]
  [v1.0] rapidhash (fast)      : 356.49 ops/s (2.81 ms/iter)
  [v1.0] rapidhash (protected) : 296.16 ops/s (3.38 ms/iter)
  [v2.0] rapidhash (fast)      : 375.05 ops/s (2.67 ms/iter)
  [v2.0] rapidhash (protected) : 309.03 ops/s (3.24 ms/iter)
  [v2.2] rapidhash (fast)      : 374.26 ops/s (2.67 ms/iter)
  [v2.2] rapidhash (protected) : 309.25 ops/s (3.23 ms/iter)
```

</details>

## License

MIT License

Copyright (c) 2025 KOMIYA Atsushi.
