#include <stdio.h>
#include <string.h>
#include "rapidhash/rapidhash.h"

int main(void) {
  const uint64_t seeds[] = {
      RAPID_SEED,
      0,
      0x0123456789abcdefull,
  };

  const char *const messages[] = {
      "",
      "a",
      "AB",
      "123",
      "Hello, world.",
      "こんにちは、世界。",
  };

  size_t num_seeds = sizeof(seeds) / sizeof(seeds[0]);
  size_t num_messages = sizeof(messages) / sizeof(messages[0]);

  uint64_t hash_val;

  puts("export const testVectors1: [string, bigint, bigint][] = [");

  for (size_t i0 = 0; i0 < num_seeds; i0++) {
    uint64_t seed = seeds[i0];

    for (size_t i1 = 0; i1 < num_messages; i1++) {
      const char *message = messages[i1];
      const size_t len = strlen(message);

      hash_val = rapidhash_withSeed(message, len, seed);

      printf("  [\"%s\", 0x%016llxn, 0x%016llxn],\n", message, seed, hash_val);
    }
  }

  puts("];");

  // ---

  const char *long_message =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  size_t long_message_len = strlen(long_message);

  printf("export const longMessage = '%s';\n", long_message);

  puts("export const testVectors2: [number, bigint, bigint][] = [");

  for (size_t i0 = 0; i0 < num_seeds; i0++) {
    uint64_t seed = seeds[i0];

    for (size_t i1 = 1; i1 < long_message_len; i1++) {
      hash_val = rapidhash_withSeed(long_message, i1, seed);
      printf("  [%zu, 0x%016llxn, 0x%016llxn],\n", i1, seed, hash_val);
    }
  }

  puts("];");

  return 0;
}
