import {rapidhash_v1, rapidhash_v1_fast, rapidhash_v1_protected} from './rapidhash_v1';
import {rapidhash_v2, rapidhash_v2_fast, rapidhash_v2_protected} from './rapidhash_v2';

export {
  rapidhash_v1,
  rapidhash_v1_fast,
  rapidhash_v1_protected,
  rapidhash_v2,
  rapidhash_v2_fast,
  rapidhash_v2_protected,
  // Default version is v2
  rapidhash_v2 as rapidhash,
  rapidhash_v2_fast as rapidhash_fast,
  rapidhash_v2_protected as rapidhash_protected,
};
