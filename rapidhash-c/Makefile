CC = gcc

all: generate_test_vector test_vector.ts

clean:
	rm generate_test_vector test_vector.ts

rapidhash/rapidhash.h:
	git submodule update --init

generate_test_vector: generate_test_vector.c rapidhash/rapidhash.h
	$(CC)	generate_test_vector.c -o generate_test_vector

test_vector.ts: generate_test_vector
	git -C rapidhash show --format='// rapidhash revision: %H' --no-patch >test_vector.ts
	./generate_test_vector >>test_vector.ts
