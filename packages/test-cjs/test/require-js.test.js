const {rapidhash} = require('rapidhash-js');
const {rapidhash: rapidhash_v1} = require('rapidhash-js/v1.0');
const {rapidhash: rapidhash_v2_2} = require('rapidhash-js/v2.2');
const child_process = require('node:child_process');

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

test('Source map should be applied in error stack trace', () => {
  const result = child_process.spawnSync('node', ['--enable-source-maps', 'src/rapidhash-throws-error.js'], {
    encoding: 'utf-8',
  });

  const stackTraceLine = result.stderr?.split('\n').find((line) => line.includes('validateOptions'));
  expect(stackTraceLine).toMatch(/common\.ts:\d+:\d+/);
});
