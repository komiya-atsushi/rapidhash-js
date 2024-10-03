import {rapidhash} from 'rapidhash-js';

test("rapidhash('hello') = 2188375479838694330n", () => {
  expect(rapidhash('hello')).toEqual(2188375479838694330n);
});

test('CommonJS module (lib/cjs/index.js) should be loaded', () => {
  expect(require.resolve('rapidhash-js')).toMatch(/lib\/cjs\/index.js$/);
});
