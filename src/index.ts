/* Author: VeryrrDefine 0.3.0-alpha.1*/
import {
  ExpantaNumArray,
  IBreakEternity,
  IPowiainaNum,
  Operator,
} from "./types";

export type PowiainaNumSource =
  | number
  | string
  | bigint
  | IPowiainaNum
  | PowiainaNum
  | ExpantaNumArray
  | IBreakEternity;

/**
 * Merge arrays in arrow,expans,megota is all same.
 * @param x an object has `array` key.
 */

//#endregion
export default class PowiainaNum implements IPowiainaNum {
  array: Operator[];
  small: boolean;
  sign: -1 | 0 | 1;
  constructor() {
    this.array = [];
    this.small = false;
    this.sign = 0;
  }
}
