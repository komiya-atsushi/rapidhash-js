const {rapidhash} = require('rapidhash-js');

test("rapidhash('hello') = 2188375479838694330n", () => {
  expect(rapidhash('hello')).toEqual(2188375479838694330n);
});

test('CommonJS module (lib/cjs/index.js) should be loaded', () => {
  expect(require.resolve('rapidhash-js')).toMatch(/lib\/cjs\/index.js$/);
});

test('Source map should be applied in error stack trace', () => {
  const result = (function () {
    try {
      rapidhash('hello', {seed: 1n << 64n});
    } catch (e) {
      return e.stack.split('\n').find(line => line.includes('validateOptions'));
    }
  })();

  expect(result).toMatch(/rapidhash\.ts:\d+:\d+/);
});
