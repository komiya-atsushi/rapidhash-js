CC = gcc

all: test_vector_fast.ts test_vector_protected.ts

clean:
	rm generate_test_vector_{fast,protected} test_vector_{fast,protected}.ts

rapidhash/rapidhash.h:
	git submodule update --init

generate_test_vector_fast: generate_test_vector.c rapidhash/rapidhash.h
	$(CC)	generate_test_vector.c -o generate_test_vector_fast

generate_test_vector_protected: generate_test_vector.c rapidhash/rapidhash.h
	$(CC)	generate_test_vector.c -o generate_test_vector_protected -DRAPIDHASH_PROTECTED

test_vector_fast.ts: generate_test_vector_fast
	git -C rapidhash show --format='// rapidhash revision: %H' --no-patch >test_vector_fast.ts
	./generate_test_vector_fast >>test_vector_fast.ts

test_vector_protected.ts: generate_test_vector_protected
	git -C rapidhash show --format='// rapidhash revision: %H' --no-patch >test_vector_protected.ts
	./generate_test_vector_protected >>test_vector_protected.ts
