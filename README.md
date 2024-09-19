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
import {rapidhash} from 'rapidhash';

// rapidhash() returns a 64-bit hash value represented as bigint.
console.log(rapidhash('hello world'));  // Output: 17498481775468162579n

// You can specify a 64-bit seed value with the 'seed' option.
console.log(rapidhash('hello world', {seed: 0x0123_4567_89AB_CDEFn}));  // Output: 9400866032237060842n

// You can specify the behavior of the rapid_mum() function
// with the rapidMumBehaviour option (default is 'fast').
console.log(rapidhash('hello world', {rapidMumBehaviour: 'protected'}));  // Output: 16019612682927597028n

// Instead of specifying the rapidMumBehaviour option,
// you can call rapidhash_fast() or rapidhash_protected().
console.log(rapidhash_protected('hello world'));
```

## License

MIT License

Copyright (c) 2024 KOMIYA Atsushi.
