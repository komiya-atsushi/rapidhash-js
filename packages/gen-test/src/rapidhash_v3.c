#include "rapidhash/rapidhash.h"

uint64_t _rapidhash_withSeed(const void *key, size_t len, uint64_t seed) {
  return rapidhash_withSeed(key, len, seed);
}

uint64_t _rapidhashMicro_withSeed(const void *key, size_t len, uint64_t seed) {
  return rapidhashMicro_withSeed(key, len, seed);
}

uint64_t _rapidhashNano_withSeed(const void *key, size_t len, uint64_t seed) {
  return rapidhashNano_withSeed(key, len, seed);
}

uint64_t default_seed() {
  /* V1 default seed */
  return 0xbdd89aa982704029ull;
}
