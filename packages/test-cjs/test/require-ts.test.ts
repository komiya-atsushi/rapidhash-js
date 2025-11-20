import {rapidhash} from 'rapidhash-js';
import {rapidhash as rapidhash_v1} from 'rapidhash-js/v1.0';
import {rapidhash as rapidhash_v2_2} from 'rapidhash-js/v2.2';
import {expect, test} from 'vitest';

test("rapidhash('hello') = 3327445792987248966n (v3.0)", () => {
  expect(rapidhash('hello')).toEqual(3327445792987248966n);
});

test("rapidhash_v1('hello') = 2188375479838694330n", () => {
  expect(rapidhash_v1('hello')).toEqual(2188375479838694330n);
});

test("rapidhash_v2_2('hello') = 8009845833679978938n", () => {
  expect(rapidhash_v2_2('hello')).toEqual(8009845833679978938n);
});

test('CommonJS module (lib/index.js) should be loaded', () => {
  expect(require.resolve('rapidhash-js')).toMatch(/lib\/index.js$/);
});
