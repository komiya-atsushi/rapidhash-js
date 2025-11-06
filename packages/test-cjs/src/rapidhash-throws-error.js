const {rapidhash} = require('rapidhash-js');

rapidhash('hello', {seed: 1n << 64n});
