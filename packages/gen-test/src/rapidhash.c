#include "rapidhash/rapidhash.h"

uint64_t _rapidhash_withSeed(const void *key, size_t len, uint64_t seed) {
  return rapidhash_withSeed(key, len, seed);
}

uint64_t default_seed() {
  return RAPID_SEED;
}
