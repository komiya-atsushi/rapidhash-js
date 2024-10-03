import {rapidhash} from 'rapidhash-js';

test("rapidhash('hello') = 2188375479838694330n", () => {
  expect(rapidhash('hello')).toEqual(2188375479838694330n);
});
