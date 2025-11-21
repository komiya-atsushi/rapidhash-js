# Changelog

## [Unreleased]

- Implement [rapidhash v3.0](https://github.com/Nicoshev/rapidhash).
- Add `rapidhashMicro` and `rapidhashNano` variants (v3.0 only).
- Add version-specific entry points: `rapidhash-js/v1.0`, `rapidhash-js/v2.0`, `rapidhash-js/v2.2`, and `rapidhash-js/v3.0`.
- **Breaking:** The functions `rapidhash()`, `rapidhash_fast()`, and `rapidhash_protected()` are now implemented with the v3.0 algorithm. To use v2.2, import from `rapidhash-js/v2.2`.

## [2.2.0] - 2025-05-29

- Implement [rapidhash v2.2](https://github.com/Nicoshev/rapidhash/pull/23).
- **Breaking:** The functions `rapidhash()`, `rapidhash_fast()`, and `rapidhash_protected()` are now implemented with the v2.2 algorithm.

## [2.0.0] - 2025-05-18

- Implement [rapidhash v2](https://github.com/Nicoshev/rapidhash/pull/16).

## [1.0.4] - 2024-10-07

- Support both ESM and CommonJS modules.

## [1.0.3] - 2024-09-24

- Some performance improvements.
