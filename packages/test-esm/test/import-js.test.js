import * as child_process from 'node:child_process';
import {rapidhash, rapidhash_v1, rapidhash_v2} from 'rapidhash-js';

test("rapidhash('hello') = rapidhash_v2('hello')", () => {
  expect(rapidhash('hello')).toEqual(rapidhash_v2('hello'));
});

test("rapidhash_v1('hello') = 2188375479838694330n", () => {
  expect(rapidhash_v1('hello')).toEqual(2188375479838694330n);
});

test("rapidhash_v2('hello') = 8009845833679978938n", () => {
  expect(rapidhash_v2('hello')).toEqual(8009845833679978938n);
});

test('ES module (lib/index.mjs) should be loaded', () => {
  const result = child_process.execSync('node ./src/show-import-meta-resolve-rapidhash-js.js').toString().trim();

  expect(result).toMatch(/lib\/index.mjs$/);
});

test('Source map should be applied in error stack trace', () => {
  const result = (() => {
    try {
      rapidhash('hello', {seed: 1n << 64n});
    } catch (e) {
      return e.stack.split('\n').find((line) => line.includes('validateOptions'));
    }
  })();

  expect(result).toMatch(/common\.ts:\d+:\d+/);
});
