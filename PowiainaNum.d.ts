export declare type PowiainaNumSource = PowiainaNum|number|string;
export default class PowiainaNum {

    constructor(value?: PowiainaNumSource);

    static readonly ZERO: PowiainaNum;
    static readonly ONE: PowiainaNum;
    static readonly NaN: PowiainaNum;
    static readonly E: PowiainaNum;
    static readonly LN2: PowiainaNum;
    static readonly LN10: PowiainaNum;
    static readonly LOG2E: PowiainaNum;
    static readonly LOG10E: PowiainaNum;
    static readonly PI: PowiainaNum;
    static readonly SQRT1_2: PowiainaNum;
    static readonly SQRT2: PowiainaNum;
    static readonly MAX_SAFE_INTEGER: PowiainaNum;
    static readonly MIN_SAFE_INTEGER: PowiainaNum;
    static readonly NEGATIVE_INFINITY: PowiainaNum;
    static readonly POSITIVE_INFINITY: PowiainaNum;
    static readonly E_MAX_SAFE_INTEGER: PowiainaNum;
    static readonly EE_MAX_SAFE_INTEGER: PowiainaNum;
    static readonly TETRATED_MAX_SAFE_INTEGER: PowiainaNum;
    static readonly PENTATED_MAX_SAFE_INTEGER: PowiainaNum;
    static readonly GRAHAMS_NUMBER: PowiainaNum;
    static readonly THROOTRIADEKOL: PowiainaNum;

    plus(other: PowiainaNumSource): PowiainaNum;
    static plus(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    add(other: PowiainaNumSource): PowiainaNum;
    static add(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    minus(other: PowiainaNumSource): PowiainaNum;
    static minus(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    sub(other: PowiainaNumSource): PowiainaNum;
    static sub(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    times(other: PowiainaNumSource): PowiainaNum;
    static times(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    mul(other: PowiainaNumSource): PowiainaNum;
    static mul(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    divide(other: PowiainaNumSource): PowiainaNum;
    static divide(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    div(other: PowiainaNumSource): PowiainaNum;
    static div(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    reciprocate(): PowiainaNum;
    static reciprocate(x: PowiainaNumSource): PowiainaNum;
    rec(): PowiainaNum;
    static rec(x: PowiainaNumSource): PowiainaNum;

    toPower(other: PowiainaNumSource): PowiainaNum;
    static toPower(x:PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    pow(other: PowiainaNumSource): PowiainaNum;
    static pow(x:PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;

    exponential(): PowiainaNum;
    static exponential(x:PowiainaNumSource): PowiainaNum;
    exp(): PowiainaNum;
    static exp(x:PowiainaNumSource): PowiainaNum;

    squareRoot(): PowiainaNum;
    static squareRoot(x:PowiainaNumSource): PowiainaNum;
    sqrt(): PowiainaNum;
    static sqrt(x:PowiainaNumSource): PowiainaNum;
    cubeRoot(): PowiainaNum;
    static cubeRoot(x:PowiainaNumSource): PowiainaNum;
    cbrt(): PowiainaNum;
    static cbrt(x:PowiainaNumSource): PowiainaNum;
    root(other: PowiainaNumSource): PowiainaNum;
    static root(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    
    generalLogarithm(): PowiainaNum;
    static generalLogarithm(x: PowiainaNumSource): PowiainaNum;
    log10(): PowiainaNum;
    static log10(x: PowiainaNumSource): PowiainaNum;
    
    logarithm(other: PowiainaNumSource): PowiainaNum;
    static logarithm(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    logBase(other: PowiainaNumSource): PowiainaNum;
    static logBase(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    
    naturalLogarithm(): PowiainaNum;
    static naturalLogarithm(x: PowiainaNumSource): PowiainaNum;
    log(): PowiainaNum;
    static log(x: PowiainaNumSource): PowiainaNum;
    ln(): PowiainaNum;
    static ln(x: PowiainaNumSource): PowiainaNum;

    iteratedexp(other: PowiainaNumSource, payload?: PowiainaNumSource): PowiainaNum;
    static iteratedexp(x: PowiainaNumSource, other: PowiainaNumSource, payload?: PowiainaNumSource): PowiainaNum;

    iteratedlog(base: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    static iteratedlog(x: PowiainaNumSource, y: PowiainaNumSource, z: PowiainaNumSource): PowiainaNum;

    iteratedslog(other: PowiainaNumSource): PowiainaNum;

    tetrate(other: PowiainaNumSource, payload?: PowiainaNumSource): PowiainaNum;
    static tetrate(x:PowiainaNumSource, y: PowiainaNumSource, payload?: PowiainaNumSource): PowiainaNum;

    ssqrt(): PowiainaNum;
    ssrt(): PowiainaNum;
    static ssqrt(x: PowiainaNumSource): PowiainaNum;
    static ssrt(x: PowiainaNumSource): PowiainaNum;

    slog(base: PowiainaNumSource): PowiainaNum;
    static slog(): PowiainaNum;

    pentate(other: PowiainaNumSource): PowiainaNum;
    static pentate(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    pent(other: PowiainaNumSource): PowiainaNum;
    static pent(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;

    arrow(other: PowiainaNumSource): (other: PowiainaNumSource)=>(PowiainaNum); 
    static arrow(x: PowiainaNumSource, z: PowiainaNumSource, y: PowiainaNumSource): PowiainaNum;

    add1J(): PowiainaNum;

    chain(other: PowiainaNumSource, arrows: PowiainaNumSource): PowiainaNum;
    static chain(x: PowiainaNumSource, y: PowiainaNumSource, z: PowiainaNumSource): PowiainaNumSource

    static hyper(z: PowiainaNumSource): (x:PowiainaNumSource,y:PowiainaNumSource)=>PowiainaNum;


    expansion(other: PowiainaNumSource): PowiainaNum;
    static expansion(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    eps(other: PowiainaNumSource): PowiainaNum;
    static eps(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    
    multiExpansion(other: PowiainaNumSource): PowiainaNum;
    static multiExpansion(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    mulEps(other: PowiainaNumSource): PowiainaNum;
    static mulEps(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;


    powerExpansion(other: PowiainaNumSource): PowiainaNum;
    static powerExpansion(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    powEps(other: PowiainaNumSource): PowiainaNum;
    static powEps(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;

    static expansionArrow(other: PowiainaNumSource, array: PowiainaNumSource):PowiainaNum;
    static epsArrow(other: PowiainaNumSource, array: PowiainaNumSource):PowiainaNum;

    
    explosion(other: PowiainaNumSource): PowiainaNum;
    static explosion(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    els(other: PowiainaNumSource): PowiainaNum;
    static els(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;

    compareTo(other: PowiainaNumSource): -1|0|1;
    cmp(other: PowiainaNumSource): -1|0|1;
    static compareTo(x: PowiainaNumSource,y: PowiainaNumSource): -1|0|1;
    static cmp(x: PowiainaNumSource, y: PowiainaNumSource): -1|0|1;

    static explosionArrow(other: PowiainaNumSource, array: PowiainaNumSource):PowiainaNum;
    static elsArrow(other: PowiainaNumSource, array: PowiainaNumSource):PowiainaNum;


    isInteger(): boolean;
    isint(): boolean;
    static isInteger(x: PowiainaNumSource): boolean;
    static isint(x: PowiainaNumSource): boolean;

    floor(): PowiainaNum;
    static floor(x: PowiainaNumSource): PowiainaNum;
    ceiling(): PowiainaNum;
    static ceiling(x: PowiainaNumSource): PowiainaNum;
    ceil(): PowiainaNum;
    static ceil(x: PowiainaNumSource): PowiainaNum;
    round(): PowiainaNum;
    static round(x: PowiainaNumSource): PowiainaNum;
    
    greaterThan(other: PowiainaNumSource): PowiainaNum;
    static greaterThan(x: PowiainaNumSource, y: PowiainaNumSource): PowiainaNum;
    gt(other: PowiainaNumSource): PowiainaNum;
    static gt(x: PowiainaNumSource, y: PowiainaNumSource): PowiainaNum;
    
    greaterThanOrEqualTo(other: PowiainaNumSource): PowiainaNum;
    static greaterThanOrEqualTo(x: PowiainaNumSource, y: PowiainaNumSource): PowiainaNum;
    gte(other: PowiainaNumSource): PowiainaNum;
    static gte(x: PowiainaNumSource, y: PowiainaNumSource): PowiainaNum;

    lessThan(other: PowiainaNumSource): PowiainaNum;
    static lessThan(x: PowiainaNumSource, y: PowiainaNumSource): PowiainaNum;
    lt(other: PowiainaNumSource): PowiainaNum;
    static lt(x: PowiainaNumSource, y: PowiainaNumSource): PowiainaNum;
    
    lessThanOrEqualTo(other: PowiainaNumSource): PowiainaNum;
    static lessThanOrEqualTo(x: PowiainaNumSource, y: PowiainaNumSource): PowiainaNum;
    lte(other: PowiainaNumSource): PowiainaNum;
    static lte(x: PowiainaNumSource, y: PowiainaNumSource): PowiainaNum;

    equalsTo(other: PowiainaNumSource): PowiainaNum;
    static equalsTo(x: PowiainaNumSource, y: PowiainaNumSource): PowiainaNum;
    eq(other: PowiainaNumSource): PowiainaNum;
    static eq(x: PowiainaNumSource, y: PowiainaNumSource): PowiainaNum;
    notEqualsTo(other: PowiainaNumSource): PowiainaNum;
    static notEqualsTo(x: PowiainaNumSource, y: PowiainaNumSource): PowiainaNum;
    neq(other: PowiainaNumSource): PowiainaNum;
    static neq(x: PowiainaNumSource, y: PowiainaNumSource): PowiainaNum;

    minimum(other: PowiainaNumSource): PowiainaNum;
    min(other: PowiainaNumSource): PowiainaNum;
    static minimum(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    static min(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;

    maximum(other: PowiainaNumSource): PowiainaNum;
    max(other: PowiainaNumSource): PowiainaNum;
    static maximum(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    static max(x: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum;
    array: Array<number|Array<number>>;
    layer: number;
    sign: 1|0|-1;
}