import {rapidhash_v1, rapidhash_v1_fast, rapidhash_v1_protected} from './rapidhash_v1.0';
import {rapidhash_v2_0, rapidhash_v2_0_fast, rapidhash_v2_0_protected} from './rapidhash_v2.0';
import {rapidhash_v2_2, rapidhash_v2_2_fast, rapidhash_v2_2_protected} from './rapidhash_v2.2';

export {
  rapidhash_v1,
  rapidhash_v1_fast,
  rapidhash_v1_protected,
  rapidhash_v2_0,
  rapidhash_v2_0_fast,
  rapidhash_v2_0_protected,
  rapidhash_v2_2,
  rapidhash_v2_2_fast,
  rapidhash_v2_2_protected,
  // Default version is v2.2
  rapidhash_v2_2 as rapidhash,
  rapidhash_v2_2_fast as rapidhash_fast,
  rapidhash_v2_2_protected as rapidhash_protected,
};
