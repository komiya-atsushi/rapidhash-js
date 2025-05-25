const {rapidhash, rapidhash_v1, rapidhash_v2_2} = require('rapidhash-js');

test("rapidhash('hello') = rapidhash_v2_2('hello')", () => {
  expect(rapidhash('hello')).toEqual(rapidhash_v2_2('hello'));
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
