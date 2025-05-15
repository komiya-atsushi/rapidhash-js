#include "rapidhash/rapidhash.h"

uint64_t _rapidhash_withSeed(const void *key, size_t len, uint64_t seed) {
  return rapidhash_withSeed(key, len, seed);
}

uint64_t default_seed() {
#ifdef RAPID_SEED
  return RAPID_SEED;
#else
  /* V1 default seed */
  return 0xbdd89aa982704029ull;
#endif
}
