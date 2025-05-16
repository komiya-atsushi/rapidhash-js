import {rapidhash, rapidhash_v1, rapidhash_v2} from 'rapidhash-js';
import {expect, test} from 'vitest';

test("rapidhash('hello') = rapidhash_v2('hello')", () => {
  expect(rapidhash('hello')).toEqual(rapidhash_v2('hello'));
});

test("rapidhash_v1('hello') = 2188375479838694330n", () => {
  expect(rapidhash_v1('hello')).toEqual(2188375479838694330n);
});

test("rapidhash_v2('hello') = 8009845833679978938n", () => {
  expect(rapidhash_v2('hello')).toEqual(8009845833679978938n);
});
