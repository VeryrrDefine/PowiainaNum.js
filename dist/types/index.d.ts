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
export default class PowiainaNum implements IPowiainaNum {
    array: Operator[];
    small: 0 | 1;
    sign: -1 | 0 | 1;
    layer: number;
    constructor(arg1?: number | IPowiainaNum);
    /**
     * Normalize functions will make this number convert into standard format.(it also change `this`, like [].sort)
     * @returns normalized number
     */
    normalize(): PowiainaNum;
    /**
     *
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
    static fromNumber(x: number): PowiainaNum;
    static fromObject(powlikeObject: IPowiainaNum): PowiainaNum;
    resetFromObject(powlikeObject: IPowiainaNum): this;
    static readonly ZERO: PowiainaNum;
    static readonly ONE: PowiainaNum;
}
export {};
