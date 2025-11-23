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
<summary>GitHub Actions runner</summary>

```
[Benchmark Environment]
  Node.js: v22.21.1
  CPU: AMD EPYC 7763 64-Core Processor (4 cores, 0 MHz)

[1-4 bytes]
  [v1.0] rapidhash (fast)           : 2,420,375.33 ops/s (413.16 ns/iter)
  [v1.0] rapidhash (protected)      : 2,030,644.31 ops/s (492.45 ns/iter)
  [v2.2] rapidhash (fast)           : 2,734,729.69 ops/s (365.67 ns/iter)
  [v2.2] rapidhash (protected)      : 2,197,545.98 ops/s (455.05 ns/iter)
  [v3.0] rapidhash (fast)           : 2,674,325.05 ops/s (373.93 ns/iter)
  [v3.0] rapidhash (protected)      : 2,226,115.44 ops/s (449.21 ns/iter)
  [v3.0] rapidhashMicro (fast)      : 2,710,931.05 ops/s (368.88 ns/iter)
  [v3.0] rapidhashMicro (protected) : 2,213,185.82 ops/s (451.84 ns/iter)
  [v3.0] rapidhashNano (fast)       : 2,655,616.94 ops/s (376.56 ns/iter)
  [v3.0] rapidhashNano (protected)  : 2,231,395.19 ops/s (448.15 ns/iter)

[5-8 bytes]
  [v1.0] rapidhash (fast)           : 2,371,330.83 ops/s (421.70 ns/iter)
  [v1.0] rapidhash (protected)      : 2,015,037.92 ops/s (496.27 ns/iter)
  [v2.2] rapidhash (fast)           : 2,525,306.66 ops/s (395.99 ns/iter)
  [v2.2] rapidhash (protected)      : 2,151,700.91 ops/s (464.75 ns/iter)
  [v3.0] rapidhash (fast)           : 2,398,649.67 ops/s (416.90 ns/iter)
  [v3.0] rapidhash (protected)      : 2,115,376.44 ops/s (472.73 ns/iter)
  [v3.0] rapidhashMicro (fast)      : 2,419,115.71 ops/s (413.37 ns/iter)
  [v3.0] rapidhashMicro (protected) : 2,112,217.87 ops/s (473.44 ns/iter)
  [v3.0] rapidhashNano (fast)       : 2,464,902.12 ops/s (405.70 ns/iter)
  [v3.0] rapidhashNano (protected)  : 2,139,688.49 ops/s (467.36 ns/iter)

[9-16 bytes]
  [v1.0] rapidhash (fast)           : 2,373,128.45 ops/s (421.38 ns/iter)
  [v1.0] rapidhash (protected)      : 2,019,580.56 ops/s (495.15 ns/iter)
  [v2.2] rapidhash (fast)           : 2,494,555.85 ops/s (400.87 ns/iter)
  [v2.2] rapidhash (protected)      : 2,164,351.62 ops/s (462.03 ns/iter)
  [v3.0] rapidhash (fast)           : 2,445,111.08 ops/s (408.98 ns/iter)
  [v3.0] rapidhash (protected)      : 2,124,576.46 ops/s (470.68 ns/iter)
  [v3.0] rapidhashMicro (fast)      : 2,534,830.67 ops/s (394.50 ns/iter)
  [v3.0] rapidhashMicro (protected) : 2,144,787.46 ops/s (466.25 ns/iter)
  [v3.0] rapidhashNano (fast)       : 2,507,392.59 ops/s (398.82 ns/iter)
  [v3.0] rapidhashNano (protected)  : 2,159,198.42 ops/s (463.13 ns/iter)

[17-64 bytes]
  [v1.0] rapidhash (fast)           : 1,519,363.59 ops/s (658.17 ns/iter)
  [v1.0] rapidhash (protected)      : 1,308,565.57 ops/s (764.20 ns/iter)
  [v2.2] rapidhash (fast)           : 1,627,131.71 ops/s (614.58 ns/iter)
  [v2.2] rapidhash (protected)      : 1,358,146.83 ops/s (736.30 ns/iter)
  [v3.0] rapidhash (fast)           : 1,557,365.74 ops/s (642.11 ns/iter)
  [v3.0] rapidhash (protected)      : 1,278,365.66 ops/s (782.25 ns/iter)
  [v3.0] rapidhashMicro (fast)      : 1,566,121.67 ops/s (638.52 ns/iter)
  [v3.0] rapidhashMicro (protected) : 1,309,712.62 ops/s (763.53 ns/iter)
  [v3.0] rapidhashNano (fast)       : 1,522,941.99 ops/s (656.62 ns/iter)
  [v3.0] rapidhashNano (protected)  : 1,287,697.13 ops/s (776.58 ns/iter)

[65-111 bytes]
  [v1.0] rapidhash (fast)           : 1,012,019.84 ops/s (988.12 ns/iter)
  [v1.0] rapidhash (protected)      :   851,571.85 ops/s (1174.30 ns/iter)
  [v2.2] rapidhash (fast)           : 1,032,261.69 ops/s (968.75 ns/iter)
  [v2.2] rapidhash (protected)      :   873,368.59 ops/s (1144.99 ns/iter)
  [v3.0] rapidhash (fast)           : 1,049,513.86 ops/s (952.82 ns/iter)
  [v3.0] rapidhash (protected)      :   875,091.75 ops/s (1142.74 ns/iter)
  [v3.0] rapidhashMicro (fast)      : 1,008,137.11 ops/s (991.93 ns/iter)
  [v3.0] rapidhashMicro (protected) :   843,635.34 ops/s (1185.35 ns/iter)
  [v3.0] rapidhashNano (fast)       : 1,019,000.92 ops/s (981.35 ns/iter)
  [v3.0] rapidhashNano (protected)  :   846,423.68 ops/s (1181.44 ns/iter)

[112-256 bytes]
  [v1.0] rapidhash (fast)           : 614,172.98 ops/s (1.63 µs/iter)
  [v1.0] rapidhash (protected)      : 513,971.04 ops/s (1.95 µs/iter)
  [v2.2] rapidhash (fast)           : 610,816.92 ops/s (1.64 µs/iter)
  [v2.2] rapidhash (protected)      : 517,844.27 ops/s (1.93 µs/iter)
  [v3.0] rapidhash (fast)           : 594,643.45 ops/s (1.68 µs/iter)
  [v3.0] rapidhash (protected)      : 499,762.62 ops/s (2.00 µs/iter)
  [v3.0] rapidhashMicro (fast)      : 617,073.02 ops/s (1.62 µs/iter)
  [v3.0] rapidhashMicro (protected) : 505,441.57 ops/s (1.98 µs/iter)
  [v3.0] rapidhashNano (fast)       : 625,289.65 ops/s (1.60 µs/iter)
  [v3.0] rapidhashNano (protected)  : 511,777.23 ops/s (1.95 µs/iter)

[1M bytes]
  [v1.0] rapidhash (fast)           : 147.45 ops/s (6.78 ms/iter)
  [v1.0] rapidhash (protected)      : 121.19 ops/s (8.25 ms/iter)
  [v2.2] rapidhash (fast)           : 152.66 ops/s (6.55 ms/iter)
  [v2.2] rapidhash (protected)      : 125.51 ops/s (7.97 ms/iter)
  [v3.0] rapidhash (fast)           : 153.71 ops/s (6.51 ms/iter)
  [v3.0] rapidhash (protected)      : 121.11 ops/s (8.26 ms/iter)
  [v3.0] rapidhashMicro (fast)      : 153.73 ops/s (6.50 ms/iter)
  [v3.0] rapidhashMicro (protected) : 121.58 ops/s (8.23 ms/iter)
  [v3.0] rapidhashNano (fast)       : 152.79 ops/s (6.54 ms/iter)
  [v3.0] rapidhashNano (protected)  : 120.72 ops/s (8.28 ms/iter)
```

</details>

## License

MIT License

Copyright (c) 2025 KOMIYA Atsushi.
