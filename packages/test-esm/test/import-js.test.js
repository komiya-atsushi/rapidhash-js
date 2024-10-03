import * as child_process from 'node:child_process';
import {rapidhash} from 'rapidhash-js';

test("rapidhash('hello') = 2188375479838694330n", () => {
  expect(rapidhash('hello')).toEqual(2188375479838694330n);
});

test('ES module (lib/esm/index.mjs) should be loaded', () => {
  const result = child_process
    .execSync('node ./src/show-import-meta-resolve-rapidhash-js.js')
    .toString()
    .trim();

  expect(result).toMatch(/lib\/esm\/index.mjs$/);
});

test('Source map should be applied in error stack trace', () => {
  const result = (function () {
    try {
      rapidhash('hello', {seed: 1n << 64n});
    } catch (e) {
      return e.stack.split('\n').find(line => line.includes('validateOptions'));
    }
  })();

  expect(result).toMatch(/rapidhash\.mts:\d+:\d+/);
});
