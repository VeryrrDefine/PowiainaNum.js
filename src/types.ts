export interface Operator {
  arrow: number;
  expans: number;
  megota: number;
  repeat: number;
  /**
   * @deprecated
   */
  valuereplaced?: -1 | 0 | 1;
}

export interface IPowiainaNum {
  array: Operator[];
  small: boolean;
  sign: -1 | 0 | 1;
}
export interface IBreakEternity {
  layer: number;
  mag: number;
  sign: number;
}
export type PowiainaNumArray01X = [
  number,
  ...(
    | [number, number, number, number]
    | ["x", number, number, number]
    | [number, number, "x", number]
  )[],
];

export type ExpantaNumArray = [number, number][];
