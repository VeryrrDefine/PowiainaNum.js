interface Operator {
    arrow: number;
    expans: number;
    megota: number;
    repeat: number;
    valuereplaced?: -1 | 0 | 1;
}
interface IPowiainaNum {
    array: Operator[];
    small: 0 | 1;
    sign: -1 | 0 | 1;
    layer: number;
}
export type PowiainaNumSource = number | IPowiainaNum | PowiainaNum;
export default class PowiainaNum implements IPowiainaNum {
    array: Operator[];
    small: 0 | 1;
    sign: -1 | 0 | 1;
    layer: number;
    constructor(arg1?: PowiainaNumSource);
    /**
     * Addition
     * @returns the sum of `this` and `other`
     */
    add(other: PowiainaNumSource): PowiainaNum;
    abs(): PowiainaNum;
    max(x: PowiainaNumSource): PowiainaNum;
    min(x: PowiainaNumSource): PowiainaNum;
    maxabs(x: PowiainaNumSource): PowiainaNum;
    minabs(x: PowiainaNumSource): PowiainaNum;
    cmpabs(x: PowiainaNumSource): -1 | 0 | 1 | 2;
    neg(): PowiainaNum;
    /**
     * @returns if this<other, return -1, if this=other, return 0, if this>other, return 1, if this!<=>, return 2
     */
    compare(x: PowiainaNumSource): -1 | 0 | 1 | 2;
    cmp(other: PowiainaNumSource): -1 | 0 | 1 | 2;
    eq(other: PowiainaNumSource): boolean;
    neq(other: PowiainaNumSource): boolean;
    lt(other: PowiainaNumSource): boolean;
    lte(other: PowiainaNumSource): boolean;
    gt(other: PowiainaNumSource): boolean;
    gte(other: PowiainaNumSource): boolean;
    isNaN(): boolean;
    isZero(): boolean;
    isFinite(): boolean;
    isInfinite(): boolean;
    /**
     * Normalize functions will make this number convert into standard format.(it also change `this`, like [].sort)
     * @returns normalized number
     */
    normalize(): PowiainaNum;
    /**
     * @returns number will return the index of the operator in array. return as x.5 if it's between the xth and x+1th operators.
     */
    getOperatorIndex(arrow: number, expans?: number, megota?: number): number;
    /**
     * @returns number repeats of operators with given arguments.
     */
    getOperator(arrow: number, expans?: number, megota?: number): number;
    /**
     * Modify the repeat of operator
     * @param number val the repeat of operator will modify to array.
     * @returns bool Is the operators array changed?
     */
    setOperator(val: number, arrow: number, expans?: number, megota?: number): boolean;
    /**
     * @returns PowiainaNum a PowiainaNum object which deep copied from `this` object.
     */
    clone(): PowiainaNum;
    resetFromObject(powlikeObject: IPowiainaNum): this;
    static fromNumber(x: number): PowiainaNum;
    static fromObject(powlikeObject: IPowiainaNum): PowiainaNum;
    static readonly ZERO: PowiainaNum;
    static readonly ONE: PowiainaNum;
    static readonly MSI: PowiainaNum;
    static readonly MSI_REC: PowiainaNum;
    static readonly E_MSI: PowiainaNum;
    static readonly E_MSI_REC: PowiainaNum;
    static readonly POSITIVE_INFINITY: PowiainaNum;
    static readonly NEGATIVE_INFINITY: PowiainaNum;
    static readonly NaN: PowiainaNum;
}
export {};
