// Regression test for https://github.com/komiya-atsushi/rapidhash-js/issues/4: the README imports
// rapidhashMicro and rapidhashNano from the package root, so the root entry point has to export
// everything the default version (rapidhash-js/v3.0) exports.
import * as root from 'rapidhash-js';
import {rapidhash, rapidhashMicro, rapidhashNano} from 'rapidhash-js';
import * as v3_0 from 'rapidhash-js/v3.0';

// 110 bytes: long enough for the three variants to produce different values.
const message = 'hello world'.repeat(10);

test('the package root exports the same names as rapidhash-js/v3.0', () => {
  expect(Object.keys(root).sort()).toEqual(Object.keys(v3_0).sort());
});

test("rapidhash('hello world' x 10) = 5271231894312207630n", () => {
  expect(rapidhash(message)).toEqual(5271231894312207630n);
  expect(rapidhash(message)).toEqual(v3_0.rapidhash(message));
});

test("rapidhashMicro('hello world' x 10) = 14925159553057146723n", () => {
  expect(rapidhashMicro(message)).toEqual(14925159553057146723n);
  expect(rapidhashMicro(message)).toEqual(v3_0.rapidhashMicro(message));
});

test("rapidhashNano('hello world' x 10) = 15702220865788050707n", () => {
  expect(rapidhashNano(message)).toEqual(15702220865788050707n);
  expect(rapidhashNano(message)).toEqual(v3_0.rapidhashNano(message));
});
