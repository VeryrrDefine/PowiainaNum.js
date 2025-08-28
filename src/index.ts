/* Author: VeryrrDefine 0.2.0-beta.1.1*/

interface Operator {
  arrow: number;
  expans: number;
  megota: number;
  repeat: number;
  valuereplaced?: -1 | 0 | 1; //-1->nothing replaced, 0-> arrow, 1->expans // undefined -> -1
  // if arrow's value is replaced, the operator's arrow will pointless (set to Infinity), replace to the lower operators.
  // But if in higher numbers, the single operator will be like chains, i may stop higher numbers at GodgahNum.js.
}

interface IPowiainaNum {
  array: Operator[];
  small: boolean; // when small = 1, the number is reciprocated.
  sign: -1 | 0 | 1; // when sign=-1, the number is negative, sign=0=>zero, sign=1=>positive
  layer: number; // actions like ExpantaNum.js, but use {10, 10, 10, 10, ..} instead of {10, 10, x}
}

type PowiainaNumArray01X = [
  number,
  ...(
    | [number, number, number, number]
    | ["x", number, number, number]
    | [number, number, "x", number]
  )[],
];

const powiainaNumError = "[PowiainaNum 0.2 error]" as const;
const MSI = 9007199254740991 as const;
const MSI_LOG10 = 15.954589770191003 as const;
const MSI_REC = 1.1102230246251568e-16 as const;
const LONG_STRING_MIN_LENGTH = 17 as const;
const EXP_E_REC = 1.444667861009766 as const;
const isPowiainaNum =
  /^(PN)?[\/\-\+]*(Infinity|NaN|(P+|P\^\d+ )?(10(\^+|\{([1-9]\d*|!)(,([1-9]\d*|!))?(,[1-9]\d*)?\})|\(10(\^+|\{([1-9]\d*|!)(,([1-9]\d*|!))?(,[1-9]\d*)?\})\)\^[1-9]\d*\x20*)*((\d+(\.\d*)?|\d*\.\d+)?([Ee][-\+]*))*(0|\d+(\.\d*)?|\d*\.\d+))$/;
type ExpantaNumArray = [number, number][];

export type PowiainaNumSource =
  | number
  | string
  | IPowiainaNum
  | PowiainaNum
  | ExpantaNumArray;

//#region some useful functions
function newOperator(r: number, a = 0, e = 1, m = 1): Operator {
  return {
    repeat: r,
    arrow: a,
    expans: e,
    megota: m,
    valuereplaced: a == Infinity ? 0 : e == Infinity ? 1 : -1,
  };
}

// parse 0.1.x PowiainaNum.js string
function parseLegacyPowiainaNumString(str: string) {
  const pattern = /l(\d+)\s+s(\d+)\s+a(\[.*\])/;
  const match = str.match(pattern);
  try {
    if (match) {
      return {
        lValue: parseInt(match[1]),
        sValue: parseInt(match[2]),
        array: JSON.parse(match[3]),
      };
    }
  } catch {
    return null;
  }
  return null;
}

function compareTuples<T extends Array<any>>(...tuples: [T, T]): -1 | 0 | 1 {
  for (let i = 0; i < Math.min(tuples[0].length, tuples[1].length); i++) {
    const a = tuples[0][i];
    const b = tuples[1][i];
    if (a < b) return -1;
    if (a > b) return 1;
  }
  return 0;
}
function replaceETo10(str: string) {
  // 使用正则表达式匹配 (e^数字) 的模式
  // 正则解释：\(e\^(\d+)\) 匹配 (e^数字)，其中 \d+ 匹配一个或多个数字
  return str
    .replace(/\(e\^(\d+)\)/g, "(10^)^$1 ")
    .replace(/(\d+)\x20*PT/g, "(10^)^$1 ");
}
/**
 * 把一个字符串很长的数进行以10为底的对数
 * @param str 被进行的字符串
 * @returns 字符串以10为底的对数；
 */
function log10LongString(str: string) {
  return (
    Math.log10(Number(str.substring(0, LONG_STRING_MIN_LENGTH))) +
    (str.length - LONG_STRING_MIN_LENGTH)
  );
}

function deepCopyProps(source: any, target: any) {
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      // 如果源对象的属性是对象或数组，则递归复制
      if (
        typeof source[key] === "object" &&
        !(source[key] instanceof PowiainaNum) &&
        source[key] !== null
      ) {
        // 如果目标对象没有这个属性，或者属性是null，则创建一个新的
        if (
          !target.hasOwnProperty(key) ||
          target[key] == null ||
          Array.isArray(source[key]) !== Array.isArray(target[key])
        ) {
          target[key] = Array.isArray(source[key]) ? [] : {};
        }
        // 递归复制属性
        deepCopyProps(source[key], target[key]);
      } else {
        // 如果属性不是对象或数组，则直接复制
        target[key] = source[key];
      }
    }
  }
}

// Code from break_eternity.js
function f_gamma(n: number) {
  if (!isFinite(n)) {
    return n;
  }

  if (n < -50) {
    if (n === Math.trunc(n)) {
      return Number.NEGATIVE_INFINITY;
    }

    return 0;
  }

  var scal1 = 1;

  while (n < 10) {
    scal1 = scal1 * n;
    ++n;
  }

  n -= 1;
  var l = 0.9189385332046727; //0.5*Math.log(2*Math.PI)

  l = l + (n + 0.5) * Math.log(n);
  l = l - n;
  var n2 = n * n;
  var np = n;
  l = l + 1 / (12 * np);
  np = np * n2;
  l = l - 1 / (360 * np);
  np = np * n2;
  l = l + 1 / (1260 * np);
  np = np * n2;
  l = l - 1 / (1680 * np);
  np = np * n2;
  l = l + 1 / (1188 * np);
  np = np * n2;
  l = l - 691 / (360360 * np);
  np = np * n2;
  l = l + 7 / (1092 * np);
  np = np * n2;
  l = l - 3617 / (122400 * np);
  return Math.exp(l) / scal1;
}

var _EXPN1 = 0.36787944117144232159553; // exp(-1)

var OMEGA = 0.56714329040978387299997; // W(1, 0)
//from https://math.stackexchange.com/a/465183
// The evaluation can become inaccurate very close to the branch point
// Evaluates W(x, 0) if principal is true, W(x, -1) if principal is false
function f_lambertw(z: number, t = 1e-10, pr = true) {
  var tol =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1e-10;
  var principal =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var w;
  var wn;

  if (!Number.isFinite(z)) {
    return z;
  }

  if (principal) {
    if (z === 0) {
      return z;
    }

    if (z === 1) {
      return OMEGA;
    }

    if (z < 10) {
      w = 0;
    } else {
      w = Math.log(z) - Math.log(Math.log(z));
    }
  } else {
    if (z === 0) return -Infinity;

    if (z <= -0.1) {
      w = -2;
    } else {
      w = Math.log(-z) - Math.log(-Math.log(-z));
    }
  }

  for (var i = 0; i < 100; ++i) {
    wn = (z * Math.exp(-w) + w * w) / (w + 1);

    if (Math.abs(wn - w) < tol * Math.abs(wn)) {
      return wn;
    } else {
      w = wn;
    }
  }

  throw Error("Iteration failed to converge: ".concat(z.toString())); //return Number.NaN;
}
function isTwoLengthArray(x: unknown[]): x is [unknown, unknown] {
  return x.length == 2;
}
function isTwoNumberArray(x: [unknown, unknown]): x is [number, number] {
  return typeof x[0] === "number" && typeof x[1] === "number";
}
function isExpantaNumArray(x: unknown): x is ExpantaNumArray {
  if (!Array.isArray(x)) return false;
  for (let i = 0; i < x.length; i++) {
    let arr = x[i];
    if (!Array.isArray(arr)) return false;
    if (!isTwoLengthArray(arr)) return false;
    if (!isTwoNumberArray(arr)) return false;
  }
  return true;
}
function replaceXToInfinity(x: "x" | number): number {
  if (x === "x") return Infinity;
  return x;
}
function isFourLengthArray(
  x: unknown[]
): x is [unknown, unknown, unknown, unknown] {
  return x.length == 4;
}
function isFourNumberArray(
  x: [unknown, unknown, unknown, unknown]
): x is [number, number, number, number] {
  if (
    typeof x[0] == "number" &&
    typeof x[1] == "number" &&
    typeof x[2] == "number" &&
    typeof x[3] == "number"
  ) {
    return true;
  }
  return false;
}
function isFourArrayWithFirstTermX(
  x: [unknown, unknown, unknown, unknown]
): x is ["x", number, number, number] {
  if (
    x[0] === "x" &&
    typeof x[1] == "number" &&
    typeof x[2] == "number" &&
    typeof x[3] == "number"
  ) {
    return true;
  }
  return false;
}
function isFourArrayWithThirdTermX(
  x: [unknown, unknown, unknown, unknown]
): x is ["x", number, number, number] {
  if (
    typeof x[0] == "number" &&
    typeof x[1] == "number" &&
    x[2] == "x" &&
    typeof x[3] == "number"
  ) {
    return true;
  }
  return false;
}
function isPowiainaNum01XArray(x: unknown): x is PowiainaNumArray01X {
  if (!Array.isArray(x)) return false;
  if (typeof x[0] != "number") return false;
  for (let i = 1; i < x.length; i++) {
    let b = x[i];
    if (!Array.isArray(b)) return false;
    if (!isFourLengthArray(b)) return false;
    if (
      !isFourNumberArray(b) &&
      !isFourArrayWithFirstTermX(b) &&
      !isFourArrayWithThirdTermX(b)
    )
      return false;
  }
  return true;
}
function countLeadingZerosAfterDecimal(numStr: string) {
  const match = numStr.match(/^0\.(0*)[1-9]/);
  return match ? match[1].length : 0;
}
/*
function countLeadingZerosAfterDecimal(numStr) {
    const match = numStr.match(/^0\.(0*)[1-9]/);
    return match ? match[1].length : 0;
}
*/
//from https://github.com/scipy/scipy/blob/8dba340293fe20e62e173bdf2c10ae208286692f/scipy/special/lambertw.pxd
// The evaluation can become inaccurate very close to the branch point
// at ``-1/e``. In some corner cases, `lambertw` might currently
// fail to converge, or can end up on the wrong branch.
// Evaluates W(x, 0) if principal is true, W(x, -1) if principal is false
function d_lambertw(z: PowiainaNum, tol = 1e10, principal = true) {
  z = new PowiainaNum(z);
  var w;
  if (!z.isFinite()) return z;
  if (principal) {
    if (z.eq(PowiainaNum.ZERO)) return z;
    if (z.eq(PowiainaNum.ONE)) return new PowiainaNum(OMEGA);
    w = PowiainaNum.log(z);
  } else {
    if (z.eq(PowiainaNum.ZERO)) return PowiainaNum.NEGATIVE_INFINITY.clone();
    w = PowiainaNum.log(z.neg());
  }
  for (var i = 0; i < 100; ++i) {
    var ew = w.neg().exp();
    var wewz = w.sub(z.mul(ew));
    var dd = w
      .add(PowiainaNum.ONE)
      .sub(w.add(2).mul(wewz).div(PowiainaNum.mul(2, w).add(2)));
    if (dd.eq(PowiainaNum.ZERO)) return w;
    var wn = w.sub(wewz.div(dd));
    if (PowiainaNum.abs(wn.sub(w)).lt(PowiainaNum.abs(wn).mul(tol))) return wn;
    w = wn;
  }
  throw Error("Iteration failed to converge: " + z);
}

export function arraySortFunction(a: Operator, b: Operator) {
  return compareTuples(
    [a.megota, a.expans, a.arrow],
    [b.megota, b.expans, b.arrow]
  );
}

/**
 * Merge arrays in arrow,expans,megota is all same.
 * @param x an object has `array` key.
 */
export function mergeSameArrays<T>(
  x: T extends {
    array: Operator[];
  }
    ? T
    : never
) {
  for (let i = 1; i < x.array.length - 1; ++i) {
    if (
      x.array[i].arrow == x.array[i + 1].arrow &&
      x.array[i].expans == x.array[i + 1].expans &&
      x.array[i].megota == x.array[i + 1].megota
    ) {
      // same array's merge
      x.array[i].repeat += x.array[i + 1].repeat;
      x.array.splice(i + 1, 1);
      --i;
    }
  }
}
//#endregion
export default class PowiainaNum implements IPowiainaNum {
  array: Operator[];
  small: boolean;
  sign: -1 | 0 | 1;
  layer: number;

  /**
   * Constructor of PowiainaNum class,
   * If no arguments, return `PowiainaNum.NaN`.
   */
  constructor(arg1?: PowiainaNumSource) {
    this.array = [{ arrow: 0, expans: 1, megota: 1, repeat: NaN }];
    this.small = false;
    this.sign = 0;
    this.layer = 0;
    if (typeof arg1 == "undefined") {
    } else if (typeof arg1 == "number") {
      let obj = PowiainaNum.fromNumber(arg1);
      this.resetFromObject(obj);
    } else if (typeof arg1 == "object") {
      let obj = PowiainaNum.fromObject(arg1);
      this.resetFromObject(obj);
    } else if (typeof arg1 == "string") {
      let obj = PowiainaNum.fromString(arg1);
      this.resetFromObject(obj);
    } else {
      let isn: never = arg1;
    }
  }

  //#region 4 Basic calculates.
  /**
   * Addition
   * @returns the sum of `this` and `other`
   */
  public add(other: PowiainaNumSource): PowiainaNum {
    let x = this.clone();
    let y = new PowiainaNum(other);

    // inf + -inf = nan
    if (
      (x.eq(PowiainaNum.POSITIVE_INFINITY) &&
        y.eq(PowiainaNum.NEGATIVE_INFINITY)) ||
      (x.eq(PowiainaNum.NEGATIVE_INFINITY) &&
        y.eq(PowiainaNum.POSITIVE_INFINITY))
    )
      return PowiainaNum.NaN.clone();

    // inf & nan check
    if (!x.isFinite()) return x.clone();
    if (!y.isFinite()) return y.clone();

    // if x or y = 0, return other.
    if (x.isZero()) return y.clone();
    if (y.isZero()) return x.clone();

    // x+ -x = 0
    if (
      x.sign == -y.sign &&
      (function () {
        let a = x.abs();
        let b = y.abs();
        return a.eq(b);
      })()
    )
      return PowiainaNum.ZERO.clone();

    // Run pure number calculates in there
    if (x.abs().lt(MSI) && y.abs().lt(MSI)) {
      return PowiainaNum.fromNumber(x.toNumber() + y.toNumber());
    }

    // calculate anything > e9e15 or <e-9e15, take absval bigger.
    if (
      x.abs().lt(PowiainaNum.E_MSI_REC) ||
      x.abs().gt(PowiainaNum.E_MSI) ||
      y.abs().lt(PowiainaNum.E_MSI_REC) ||
      y.abs().gt(PowiainaNum.E_MSI)
    ) {
      let a = x.maxabs(y);
      if (x.abs().eq(a)) return x;
      if (y.abs().eq(a)) return y;
      return y;
    }
    if (x.sign == -1) {
      return x.neg().add(y.neg()).neg();
    }

    // if ((x.sign==1&&y.sign==-1&&x.lt(y.abs()))  ) return y.neg().add(x.neg()).neg();
    let a, b; //a=bigger, b=smaller

    if (x.cmpabs(y) > 0) {
      a = x;
      b = y;
    } else {
      b = x;
      a = y;
    }

    let temp = a.toNumber() + b.toNumber();
    if (isFinite(temp) && temp !== 0) {
      return PowiainaNum.fromNumber(temp);
    }

    let mult = 1;
    if (
      !a.small &&
      !b.small &&
      !a.array[1]?.repeat &&
      !b.array[1]?.repeat &&
      a.sign == b.sign
    ) {
      return new PowiainaNum((a.array[0].repeat + b.array[0].repeat) * a.sign);
    }

    const alog10 =
      (a.small ? -1 : 1) *
      (a.array[1]?.repeat ? a.array[0].repeat : Math.log10(a.array[0].repeat));
    const blog10 =
      (b.small ? -1 : 1) *
      (b.array[1]?.repeat ? b.array[0].repeat : Math.log10(b.array[0].repeat));
    if (alog10 - blog10 > MSI_LOG10) return a;

    const offset = -Math.floor(alog10); //a number can make a+off in [0,1)

    let r,
      l = 0,
      t;
    t = a.sign * 10 ** (alog10 + offset) + b.sign * 10 ** (blog10 + offset);

    if (t > 0) l = Math.log10(t) - offset;
    if (t < 0) {
      l = Math.log10(-t) - offset;
      mult *= -1;
    }
    if (t == 0) throw Error("Encounter a calculate error");

    r = new PowiainaNum();

    r.sign = 1;
    if (l > MSI_LOG10 || l < -MSI_LOG10) {
      r.array = [newOperator(l, 0), newOperator(1, 1)];
    } else {
      r.array = [newOperator(10 ** Math.abs(l), 0)];
    }
    r.small = l < 0 ? true : false;
    r.sign *= mult;
    return r;
  }

  public static add(
    t: PowiainaNumSource,
    other: PowiainaNumSource
  ): PowiainaNum {
    return new PowiainaNum(t).add(other);
  }

  public sub(a: PowiainaNumSource): PowiainaNum {
    return this.add(new PowiainaNum(a).neg());
  }

  public static sub(
    t: PowiainaNumSource,
    other: PowiainaNumSource
  ): PowiainaNum {
    return new PowiainaNum(t).sub(other);
  }
  public mul(other: PowiainaNumSource): PowiainaNum {
    let x = this.clone();
    let y = new PowiainaNum(other);

    // inf * -inf = -inf
    if (
      (x.eq(PowiainaNum.POSITIVE_INFINITY) &&
        y.eq(PowiainaNum.NEGATIVE_INFINITY)) ||
      (y.eq(PowiainaNum.POSITIVE_INFINITY) &&
        x.eq(PowiainaNum.NEGATIVE_INFINITY))
    )
      return PowiainaNum.NEGATIVE_INFINITY.clone();

    if ((x.isInfiNaN() && y.isZero()) || (y.isInfiNaN() && x.isZero()))
      return PowiainaNum.NaN.clone();

    if (
      x.eq(PowiainaNum.NEGATIVE_INFINITY) &&
      y.eq(PowiainaNum.NEGATIVE_INFINITY)
    )
      return PowiainaNum.POSITIVE_INFINITY.clone();

    // inf & nan check
    if (!x.isFinite()) return x.clone();
    if (!y.isFinite()) return y.clone();

    if (x.isZero() || y.isZero()) return PowiainaNum.ZERO.clone();

    // x* x^-1 = 0
    /* if (x.small==1-y.small&&(function(){
      let a = x.abs();
      let b = y.abs();
      return a.eq(b)
    })()) return (function () {
      let a = new PowiainaNum(1);
      a.sign = x.sign*y.sign as -1|0| 1;
      return a;
    })(); */

    // calculate use number directly using number

    let t = x.toNumber() * y.toNumber();
    if (isFinite(t) && t !== 0) {
      return PowiainaNum.fromNumber(t);
    }

    let r;

    r = x.abs().log10().add(y.abs().log10()).pow10();
    r.sign = (x.sign * y.sign) as 0 | -1 | 1;
    return r;
  }
  public static mul(
    t: PowiainaNumSource,
    other: PowiainaNumSource
  ): PowiainaNum {
    return new PowiainaNum(t).mul(other);
  }

  public div(other: PowiainaNumSource): PowiainaNum {
    const x = new PowiainaNum(other).rec();
    return this.mul(x);
  }
  public static div(
    t: PowiainaNumSource,
    other: PowiainaNumSource
  ): PowiainaNum {
    return new PowiainaNum(t).div(other);
  }

  public mod(x: PowiainaNumSource): PowiainaNum {
    const other = new PowiainaNum(x);

    const division = this.div(other);
    return division.sub(division.floor()).mul(other);
  }
  //#endregion

  //#region power

  /**
   * @returns 10 to the power of `this`
   */
  public pow10(): PowiainaNum {
    const r = this.clone();
    // inf & nan check
    if (!this.isFinite()) return this.clone();

    if (r.isneg()) {
      // 10^(-x) = 1/(10^x)
      r.sign *= -1;
      return r.pow10().rec();
    }
    if (r.lte(308.25471555991675)) {
      return PowiainaNum.fromNumber(10 ** r.toNumber());
    }
    if (r.small) {
      if (r.lt(PowiainaNum.MSI_REC)) return PowiainaNum.ONE;
      return new PowiainaNum(10 ** (r.array[0].repeat ** -1));
    }
    if (r.gt(PowiainaNum.TETRATED_MSI)) return r;
    r.setOperator((r.array[1]?.repeat ?? 0) + 1, 1);
    r.normalize();
    return r;
  }
  public pow(x: PowiainaNumSource): PowiainaNum {
    const other = new PowiainaNum(x);

    if (this.eq(1)) return PowiainaNum.ONE.clone();
    if (!other.isFinite()) return other.clone();
    if (!this.isFinite()) return this.clone();

    if (this.eq(10)) return other.pow10();
    if (this.isneg()) {
      if (!other.isInt()) return PowiainaNum.NaN.clone();
      let r = this.abs().pow(other);
      r.sign = (function () {
        let a = other.mod(2).round();
        if (a.eq(0) || a.eq(2)) return 1;
        return -1;
      })();

      return r;
    }
    let a = this.toNumber();
    let b = other.toNumber();
    let t = a ** b;
    if (isFinite(t) && t !== 0) {
      // optimize?
      return PowiainaNum.fromNumber(t);
    }

    if (this.isZero() && other.isZero()) {
      return PowiainaNum.ONE.clone();
    }
    if (this.isZero()) return PowiainaNum.ZERO.clone();
    if (other.isZero()) return PowiainaNum.ONE.clone();

    // if this<0, check other' rec is oddd
    if (this.gt(0)) {
      // log10(a^b) = b log10(a)
      return this.log10().mul(other).pow10();
    } else if (other.rec().mod(2).eq(1)) {
      return this.neg().log10().mul(other).pow10().neg();
    }
    return PowiainaNum.NaN.clone();
  }
  public pow_base(x: PowiainaNumSource): PowiainaNum {
    const a = new PowiainaNum(x);
    return a.pow(this);
  }
  public static pow(
    t: PowiainaNumSource,
    other: PowiainaNumSource
  ): PowiainaNum {
    return new PowiainaNum(t).pow(other);
  }

  public root(x: PowiainaNumSource): PowiainaNum {
    let other = new PowiainaNum(x);
    return this.pow(other.rec());
  }
  public static root(
    t: PowiainaNumSource,
    other: PowiainaNumSource
  ): PowiainaNum {
    return new PowiainaNum(t).root(other);
  }

  public sqrt(): PowiainaNum {
    return this.pow(0.5);
  }

  public static sqrt(t: PowiainaNumSource): PowiainaNum {
    return new PowiainaNum(t).sqrt();
  }
  public cbrt(): PowiainaNum {
    return this.abs().root(3).mul(this.sign);
  }
  public static cbrt(t: PowiainaNumSource): PowiainaNum {
    return new PowiainaNum(t).cbrt();
  }
  public log10(): PowiainaNum {
    if (this.isneg()) return PowiainaNum.NaN.clone();
    if (this.isZero()) return PowiainaNum.NEGATIVE_INFINITY.clone();
    if (this.small) {
      let x = this.clone();
      x.small = !x.small;
      return x.log10().neg();
    }
    if (this.array.length == 1)
      return new PowiainaNum(Math.log10(this.array[0].repeat));

    if (this.gte(PowiainaNum.TETRATED_MSI)) return this.clone();
    let x = this.clone();
    x.array[1].repeat = x.array[1].repeat - 1;
    x.normalize();
    return x;
  }
  public static log10(t: PowiainaNumSource): PowiainaNum {
    return new PowiainaNum(t).log10();
  }
  public log(base: PowiainaNumSource = Math.E): PowiainaNum {
    // log_a b = log_x b / log_x a;
    const other = new PowiainaNum(base);
    return this.log10().div(other.log10());
  }
  public static log(
    t: PowiainaNumSource,
    base: PowiainaNumSource = Math.E
  ): PowiainaNum {
    return new PowiainaNum(t).log(base);
  }
  public ln(): PowiainaNum {
    return this.log();
  }
  /**
   * positive-Log10, Returns the base-10 logarithm of nonnegative Decimals, but returns 0 for negative Decimals.
   */
  public pLog10(): PowiainaNum {
    if (this.isneg()) return PowiainaNum.ZERO;
    return this.log10();
  }
  /**
   * positive-Log10
   */
  public static pLog10(t: PowiainaNumSource): PowiainaNum {
    return new PowiainaNum(t).pLog10();
  }
  public static exp(x: PowiainaNumSource): PowiainaNum {
    let y = new PowiainaNum(x);
    return y.pow_base(Math.E);
  }
  public exp(): PowiainaNum {
    return this.pow_base(Math.E);
  }
  //#endregion

  //#region some math functions
  /**
   * For positive integers, X factorial (written as X!) equals X * (X - 1) * (X - 2) *... * 3 * 2 * 1. 0! equals 1.
   * This can be extended to real numbers (except for negative integers) via the gamma function, which is what this function does.
   */
  //[Code from break_eternity.js]
  public factorial(): PowiainaNum {
    if (this.abs().lt(MSI)) {
      return this.add(1).gamma();
    } else if (this.abs().lt(PowiainaNum.E_MSI)) {
      return PowiainaNum.exp(this.mul(this.log10().sub(1)));
    } else {
      return PowiainaNum.exp(this);
    }
  }
  public static factorial(x: PowiainaNumSource): PowiainaNum {
    return new PowiainaNum(x).factorial();
  }
  /**
   * The gamma function extends the idea of factorials to non-whole numbers using some calculus.
   * Gamma(x) is defined as the integral of t^(x-1) * e^-t dt from t = 0 to t = infinity,
   * and gamma(x) = (x - 1)! for nonnegative integer x, so the factorial for non-whole numbers is defined using the gamma function.
   */
  //[Code from break_eternity.js]
  //from HyperCalc source code
  public gamma() {
    if (this.small) {
      return this.rec();
    } else if (this.lte(MSI)) {
      if (this.lt(24)) {
        return PowiainaNum.fromNumber(f_gamma(this.sign * this.getOperator(0)));
      }

      var t = this.getOperator(0) - 1;
      var l = 0.9189385332046727; //0.5*Math.log(2*Math.PI)

      l = l + (t + 0.5) * Math.log(t);
      l = l - t;
      var n2 = t * t;
      var np = t;
      var lm = 12 * np;
      var adj = 1 / lm;
      var l2 = l + adj;

      if (l2 === l) {
        return PowiainaNum.exp(l);
      }

      l = l2;
      np = np * n2;
      lm = 360 * np;
      adj = 1 / lm;
      l2 = l - adj;

      if (l2 === l) {
        return PowiainaNum.exp(l);
      }

      l = l2;
      np = np * n2;
      lm = 1260 * np;
      var lt = 1 / lm;
      l = l + lt;
      np = np * n2;
      lm = 1680 * np;
      lt = 1 / lm;
      l = l - lt;
      return PowiainaNum.exp(l);
    } else if (this.gt(MSI)) {
      return PowiainaNum.exp(this.mul(this.log().sub(1)));
    } else {
      return PowiainaNum.exp(this);
    }
  }
  public static gamma(x: PowiainaNumSource): PowiainaNum {
    return new PowiainaNum(x).gamma();
  }

  /**
   * The Lambert W function, also called the omega function or product logarithm, is the solution W(x) === x*e^x.
   * https://en.wikipedia.org/wiki/Lambert_W_function
   *
   * This is a multi-valued function in the complex plane, but only two branches matter for real numbers: the "principal branch" W0, and the "non-principal branch" W_-1.
   * W_0 works for any number >= -1/e, but W_-1 only works for nonpositive numbers >= -1/e.
   * The "principal" parameter, which is true by default, decides which branch we're looking for: W_0 is used if principal is true, W_-1 is used if principal is false.
   */
  //Code from break_eternity.js
  //Some special values, for testing: https://en.wikipedia.org/wiki/Lambert_W_function#Special_values
  public lambertw(princ = true): PowiainaNum {
    var principal =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    if (this.lt(-0.3678794411710499)) {
      return PowiainaNum.NaN.clone(); //complex
    } else if (principal) {
      if (this.abs().lt("1e-300")) return new PowiainaNum(this);
      else if (this.small) {
        return PowiainaNum.fromNumber(f_lambertw(this.toNumber()));
      } else if (this.lt(MSI)) {
        return PowiainaNum.fromNumber(
          f_lambertw(this.sign * this.getOperator(0))
        );
      } else if (this.lt("eee15")) {
        return d_lambertw(this);
      } else {
        // Numbers this large would sometimes fail to converge using d_lambertw, and at this size this.ln() is close enough
        return this.log();
      }
    } else {
      if (this.sign === 1) {
        return PowiainaNum.NaN.clone(); //complex
      }

      if (this.layer === 0) {
        return PowiainaNum.fromNumber(
          f_lambertw(this.sign * this.array[0].repeat, 1e-10, false)
        );
      } else if (this.layer == 1) {
        return d_lambertw(this, 1e-10, false);
      } else {
        return this.neg().rec().lambertw().neg();
      }
    }
  }

  public static lambertw(x: PowiainaNumSource, principal = true): PowiainaNum {
    return new PowiainaNum(x).lambertw(principal);
  }
  //#endregion
  //#region Commonly used functions by game
  // All of these are from break_eternity.js

  /**
   * If you're willing to spend 'resourcesAvailable' and want to buy something
   * with exponentially increasing cost each purchase (start at priceStart,
   * multiply by priceRatio, already own currentOwned), how much of it can you buy?
   * Adapted from Trimps source code.
   *
   * currentOwned >= priceStart*priceRatio^(return value)
   */
  public static affordGeometricSeries(
    resourcesAvailable: PowiainaNumSource,
    priceStart: PowiainaNumSource,
    priceRatio: PowiainaNumSource,
    currentOwned: PowiainaNumSource
  ): PowiainaNum {
    return this.affordGeometricSeries_core(
      new PowiainaNum(resourcesAvailable),
      new PowiainaNum(priceStart),
      new PowiainaNum(priceRatio),
      currentOwned
    );
  }

  public static affordGeometricSeries_core(
    resourcesAvailable: PowiainaNum,
    priceStart: PowiainaNum,
    priceRatio: PowiainaNum,
    currentOwned: PowiainaNumSource,
    withNaNProtect = true
  ): PowiainaNum {
    const actualStart = priceStart.mul(priceRatio.pow(currentOwned));
    return resourcesAvailable
      .div(actualStart)
      .mul(priceRatio.sub(1))
      .add(1)
      .clampMin(withNaNProtect ? 1 : -Infinity)
      .log10()
      .div(priceRatio.log10())
      .floor();
  }

  /**
   * How much resource would it cost to buy (numItems) items if you already have currentOwned,
   * the initial price is priceStart and it multiplies by priceRatio each purchase?
   *
   * return value = priceStart*priceRatio^(numItems)
   */
  public static sumGeometricSeries(
    numItems: PowiainaNumSource,
    priceStart: PowiainaNumSource,
    priceRatio: PowiainaNumSource,
    currentOwned: PowiainaNumSource
  ): PowiainaNum {
    return this.sumGeometricSeries_core(
      numItems,
      new PowiainaNum(priceStart),
      new PowiainaNum(priceRatio),
      currentOwned
    );
  }

  public static sumGeometricSeries_core(
    numItems: PowiainaNumSource,
    priceStart: PowiainaNum,
    priceRatio: PowiainaNum,
    currentOwned: PowiainaNumSource
  ): PowiainaNum {
    return priceStart
      .mul(priceRatio.pow(currentOwned))
      .mul(PowiainaNum.sub(1, priceRatio.pow(numItems)))
      .div(PowiainaNum.sub(1, priceRatio));
  }

  /**
   * If you're willing to spend 'resourcesAvailable' and want to buy something with additively
   * increasing cost each purchase (start at priceStart, add by priceAdd, already own currentOwned),
   * how much of it can you buy?
   */
  public static affordArithmeticSeries(
    resourcesAvailable: PowiainaNumSource,
    priceStart: PowiainaNumSource,
    priceAdd: PowiainaNumSource,
    currentOwned: PowiainaNumSource
  ): PowiainaNum {
    return this.affordArithmeticSeries_core(
      new PowiainaNum(resourcesAvailable),
      new PowiainaNum(priceStart),
      new PowiainaNum(priceAdd),
      new PowiainaNum(currentOwned)
    );
  }

  public static affordArithmeticSeries_core(
    resourcesAvailable: PowiainaNum,
    priceStart: PowiainaNum,
    priceAdd: PowiainaNum,
    currentOwned: PowiainaNum
  ): PowiainaNum {
    // n = (-(a-d/2) + sqrt((a-d/2)^2+2dS))/d
    // where a is actualStart, d is priceAdd and S is resourcesAvailable
    // then floor it and you're done!
    const actualStart = priceStart.add(currentOwned.mul(priceAdd));
    const b = actualStart.sub(priceAdd.div(2));
    const b2 = b.pow(2);
    return b
      .neg()
      .add(b2.add(priceAdd.mul(resourcesAvailable).mul(2)).sqrt())
      .div(priceAdd)
      .floor();
  }

  /**
   * How much resource would it cost to buy (numItems) items if you already have currentOwned,
   * the initial price is priceStart and it adds priceAdd each purchase?
   * Adapted from http://www.mathwords.com/a/arithmetic_series.htm
   */

  public static sumArithmeticSeries(
    numItems: PowiainaNumSource,
    priceStart: PowiainaNumSource,
    priceAdd: PowiainaNumSource,
    currentOwned: PowiainaNumSource
  ): PowiainaNum {
    return this.sumArithmeticSeries_core(
      new PowiainaNum(numItems),
      new PowiainaNum(priceStart),
      new PowiainaNum(priceAdd),
      new PowiainaNum(currentOwned)
    );
  }
  public static sumArithmeticSeries_core(
    numItems: PowiainaNum,
    priceStart: PowiainaNum,
    priceAdd: PowiainaNum,
    currentOwned: PowiainaNum
  ): PowiainaNum {
    const actualStart = priceStart.add(currentOwned.mul(priceAdd)); // (n/2)*(2*a+(n-1)*d)

    return numItems
      .div(2)
      .mul(actualStart.mul(2).add(numItems.sub(1).mul(priceAdd)));
  }

  //#endregion
  //#region higher calculates

  //#region Tetration
  // Code from ExpantaNum.js
  public tetrate(other2: PowiainaNumSource, payload: PowiainaNumSource = 1) {
    const t = this.clone();
    let other = new PowiainaNum(other2);
    const payl = new PowiainaNum(payload);
    if (t.isNaN() || other.isNaN() || payl.isNaN())
      return PowiainaNum.NaN.clone();
    if (t.eq(1)) return PowiainaNum.ONE.clone();
    if (payl.neq(PowiainaNum.ONE)) other = other.add(payl.slog(t));
    let negln;
    if (other.isInfi() && other.sign > 0) {
      if (t.gte(EXP_E_REC)) return PowiainaNum.POSITIVE_INFINITY.clone();
      negln = this.log().neg();
      return negln.lambertw().div(negln);
    }
    if (other.lte(-2)) return PowiainaNum.NaN.clone();
    if (t.isZero()) {
      if (other.isZero()) return PowiainaNum.NaN.clone();
      if (other.gte(MSI / 2) || other.toNumber() % 2 == 0)
        return PowiainaNum.ZERO.clone();
      return PowiainaNum.ONE.clone();
    }
    if (t.eq(PowiainaNum.ONE)) {
      if (other.eq(PowiainaNum.ONE.neg())) return PowiainaNum.NaN.clone();
      return PowiainaNum.ONE.clone();
    }
    if (other.eq(PowiainaNum.ONE.neg())) return PowiainaNum.ZERO.clone();
    if (other.eq(PowiainaNum.ZERO)) return PowiainaNum.ONE.clone();
    if (other.eq(PowiainaNum.ONE)) return t;
    if (other.eq(2)) return t.pow(t);
    if (t.eq(2)) {
      if (other.eq(3)) return PowiainaNum.fromNumber(16);
      if (other.eq(4)) return PowiainaNum.fromNumber(65536);
    }
    const m = t.max(other);
    if (m.gt(PowiainaNum.PENTATED_MSI)) return m;
    if (m.gt(PowiainaNum.TETRATED_MSI) || other.gt(MSI)) {
      if (this.lt(EXP_E_REC)) {
        negln = t.ln().neg();
        return negln.lambertw().div(negln);
      }
      let j = t.slog(10).add(other);
      j.setOperator(j.getOperator(2) + 1, 2);
      j.normalize();
      return j;
    }
    let y = other.toNumber();
    let f = Math.floor(y);
    var r = t.pow(y - f);
    var l = PowiainaNum.NaN;
    let i = 0;
    for (
      let w = PowiainaNum.E_MSI.clone();
      f !== 0 && r.lt(w) && i < 100;
      ++i
    ) {
      if (f > 0) {
        r = t.pow(r);
        if (l.eq(r)) {
          f = 0;
          break;
        }
        l = r;
        --f;
      } else {
        r = r.log(t);
        if (l.eq(r)) {
          f = 0;
          break;
        }
        l = r;
        ++f;
      }
    }
    if (i == 100 || this.lt(EXP_E_REC)) f = 0;
    r.setOperator(r.getOperator(1) + f, 1);
    r.normalize();
    return r;
  }
  // Code from ExpantaNum.js
  public slog(base: PowiainaNumSource = 10): PowiainaNum {
    let x = this.clone();
    const b = new PowiainaNum(base);
    if (x.isInfiNaN()) return x;
    if (b.isNaN()) return b;
    if (b.isInfi()) return PowiainaNum.ZERO.clone();

    if (x.isZero()) return PowiainaNum.ONE.clone();
    if (x.eq(PowiainaNum.ONE)) return PowiainaNum.ZERO.clone();
    if (x.eq(b)) return PowiainaNum.ONE.clone();
    if (b.lt(EXP_E_REC)) {
      let a = b.tetrate(Infinity);
      if (x.eq(a)) return PowiainaNum.POSITIVE_INFINITY.clone();
      if (x.gt(a)) return PowiainaNum.NaN.clone();
    }
    if (x.max(b).gt(PowiainaNum.PENTATED_MSI)) {
      if (x.gt(b)) return x;
      return PowiainaNum.ZERO.clone();
    }
    if (x.max(b).gt(PowiainaNum.TETRATED_MSI)) {
      if (x.gt(b)) {
        x.setOperator(x.getOperator(2) - 1, 2);
        x.normalize();
        return x.sub(x.getOperator(1));
      }
    }
    if (x.lt(PowiainaNum.ZERO.clone())) return b.pow(x).sub(2);

    // base^base^... = x? (? bases)

    let r = 0;

    // 计算x与base的差距
    let t = x.getOperator(1) - b.getOperator(1);
    if (t > 3) {
      let l = t - 3;
      r += l;
      x.setOperator(x.getOperator(1) - l, 1);
    }

    // 假设b=3， x=1e19
    for (var i = 0; i < 100; ++i) {
      if (x.lt(PowiainaNum.ZERO)) {
        x = PowiainaNum.pow(base, x);
        --r;
      } else if (x.lte(1)) {
        // 第五次，进入此处
        // 结果=4+0.08795395574340908-1=3.087953...
        // 验算3**3**3**(3**.08795395574340908)=10000000000000720000,符合预期
        return new PowiainaNum(r + x.toNumber() - 1);
      } else {
        // 第1-4次迭代，进入此处
        ++r;
        x = PowiainaNum.log(x, base);
        // 第一次：r = 1, x = log_3(1e19) ~ 39.822162211498316
        // 第二次：r = 2, x = log_3(39.822...) ~ 3.353706885314807
        // 第三次：r = 3, x = log_3(3.3537...) ~ 1.1014497830508163
        // 第四次：r = 4, x = log_3(1.1014...) ~ 0.08795395574340908
      }
    }
    if (x.gt(10)) return new PowiainaNum(r);
    return PowiainaNum.NaN.clone();
  }

  public static tetrate(
    t: PowiainaNumSource,
    other2: PowiainaNumSource,
    payload: PowiainaNumSource = 1
  ) {
    return new PowiainaNum(t).tetrate(other2, payload);
  }

  public ssqrt() {
    const x = this.clone();
    if (x.lt(1 / EXP_E_REC)) return PowiainaNum.NaN.clone();
    if (!x.isFinite()) return x;
    if (x.gt(PowiainaNum.TETRATED_MSI)) return x;
    if (x.gt(PowiainaNum.EE_MSI)) {
      x.setOperator(x.getOperator(1) - 1, 1);
      return x;
    }
    // use lambertw
    const l = x.ln();
    return l.div(l.lambertw());
  }

  public static tetrate_10(other2: PowiainaNumSource): PowiainaNum {
    return PowiainaNum.fromNumber(10).tetrate(other2);
  }

  /**
   * iterated-log
   *
   * @example new P("10^10^3").iteratedlog(2,10) == 3
   */
  public iteratedlog(
    other2: PowiainaNumSource = 1,
    base2: PowiainaNumSource = 10
  ) {
    const t = this.clone();
    const base = new PowiainaNum(base2);
    const other = new PowiainaNum(other2);
    if (other.isZero()) return t;
    if (other.eq(PowiainaNum.ONE)) return t.log(base);
    return base.tetrate(t.slog(base).sub(other));
  }

  //#endregion

  /**
   * Arrow operation, return a function
   * The function has a parameter `other`
   * call this function returns a powiainanum `this`{`arrow2`}`other`
   * @param arrows2 arrow count
   * @returns A function
   */
  public arrow(
    arrows2: PowiainaNumSource
  ): (
    other: PowiainaNumSource,
    payload?: PowiainaNumSource,
    depth?: number
  ) => PowiainaNum {
    const t = this.clone();
    const arrows = new PowiainaNum(arrows2);
    if (!arrows.isInt() || arrows.lt(PowiainaNum.ZERO)) {
      console.warn(
        "The arrow is <0 or not a integer, the returned function will return NaN."
      );
      return function () {
        return PowiainaNum.NaN.clone();
      };
    }
    if (arrows.eq(0))
      return function (other) {
        return t.mul(other);
      };
    if (arrows.eq(1))
      return function (other) {
        return t.pow(other);
      };
    if (arrows.eq(2))
      return function (other) {
        return t.tetrate(other);
      };
    return function (other2, payload2?: PowiainaNumSource, depth = 0) {
      let other = new PowiainaNum(other2);
      const payload = new PowiainaNum(payload2);
      let ctt = PowiainaNum.arrowFuncMap.get(
        `${t.toString()} ${arrows.toString()} ${other.toString()} ${depth}`
      );
      if (ctt) return ctt.clone();

      let res = (function () {
        let r;
        if (t.isNaN() || other.isNaN() || payload.isNaN())
          return PowiainaNum.NaN.clone();
        if (other.lt(PowiainaNum.ZERO)) return PowiainaNum.NaN.clone();
        if (t.eq(PowiainaNum.ZERO)) {
          if (other.eq(PowiainaNum.ONE)) return PowiainaNum.ZERO.clone();
          return PowiainaNum.NaN.clone();
        }
        if (payload.neq(PowiainaNum.ONE))
          other = other.add(payload.anyarrow_log(arrows)(t));
        if (t.eq(PowiainaNum.ONE)) return PowiainaNum.ONE.clone();
        if (other.eq(PowiainaNum.ZERO)) return PowiainaNum.ONE.clone();
        if (other.eq(PowiainaNum.ONE)) return t.clone();

        // arrow > 9e15, that using 10{x}, x=arrow;
        if (arrows.gt(PowiainaNum.MSI)) {
          r = arrows.clone();
          r.setOperator(r.getOperator(Infinity) + 1, Infinity);
          return r;
        }
        let arrowsNum = arrows.toNumber();
        // arrow < 9e15

        // 10{x}2 = 10{x-1}10
        if (other.eq(2)) return t.arrow(arrowsNum - 1)(t, payload, depth + 1);
        if (t.max(other).gt(PowiainaNum.arrowMSI(arrowsNum + 1)))
          return t.max(other);
        if (t.gt(PowiainaNum.arrowMSI(arrowsNum)) || other.gt(MSI)) {
          if (t.gt(PowiainaNum.arrowMSI(arrowsNum))) {
            r = t.clone();
            r.setOperator(r.getOperator(arrowsNum) - 1, arrowsNum);
            r.normalize();
          } else if (t.gt(PowiainaNum.arrowMSI(arrowsNum - 1))) {
            r = new PowiainaNum(t.getOperator(arrowsNum - 1));
          } else {
            r = PowiainaNum.ZERO;
          }
          var j = r.add(other);
          j.setOperator(j.getOperator(arrowsNum) + 1, arrowsNum);
          j.normalize();
          return j;
        }
        if (depth >= PowiainaNum.maxOps + 10) {
          return new PowiainaNum({
            small: false,
            sign: 1,
            layer: 0,
            array: [newOperator(10, 0), newOperator(1, arrowsNum)],
          });
        }
        const y = other.toNumber();
        let f = Math.floor(y);
        const arrows_m1 = arrows.sub(PowiainaNum.ONE);
        r = t.arrow(arrows_m1)(y - f, payload, depth + 1);
        let i = 0;
        for (
          let m = PowiainaNum.arrowMSI(arrowsNum - 1);
          f !== 0 && r.lt(m) && i < 100;
          i++
        ) {
          if (f > 0) {
            r = t.arrow(arrows_m1)(r, payload, depth + 1);
            --f;
          }
        }
        if (i == 100) f = 0;
        r.setOperator(r.getOperator(arrowsNum - 1) + f, arrowsNum - 1);
        r.normalize();
        return r;
      })();
      if (depth < PowiainaNum.maxOps + 10) {
        PowiainaNum.arrowFuncMap.set(
          `${t.toString()} ${arrows.toString()} ${other.toString()} ${depth}`,
          res.clone()
        );
      }
      return res;
    };
  }

  /**
   * return `base`{`arrow2`}`x` = `this` which `x` is.
   *
   * @param arrow2
   * @returns
   */
  public anyarrow_log(
    arrow2: PowiainaNumSource
  ): (base: PowiainaNumSource, depth?: number) => PowiainaNum {
    let x = this.clone();
    const arrow = new PowiainaNum(arrow2);

    const arrowsNum = arrow.toNumber();
    if (arrow.gt(MSI)) {
      throw new Error(powiainaNumError + "Not implemented");
    }
    if (!arrow.isInt() || arrow.lt(0)) return () => PowiainaNum.NaN.clone();
    if (arrow.eq(0)) return (base) => x.div(base);
    if (arrow.eq(1)) return (base) => x.log(base);
    if (arrow.eq(2)) return (base) => x.slog(base);
    if (x.isInfiNaN()) return () => x;
    return function (base: PowiainaNumSource, depth = 0) {
      const b = new PowiainaNum(base);
      if (b.isNaN()) return b;
      if (b.isInfi()) return PowiainaNum.ZERO.clone();

      if (x.isZero()) return PowiainaNum.ONE.clone();
      if (x.eq(PowiainaNum.ONE)) return PowiainaNum.ZERO.clone();
      if (x.eq(b)) return PowiainaNum.ONE.clone();

      if (x.max(b).gt(PowiainaNum.arrowMSI(arrowsNum + 1))) {
        if (x.gt(b)) return x;
        return PowiainaNum.ZERO.clone();
      }
      if (x.max(b).gt(PowiainaNum.arrowMSI(arrowsNum))) {
        if (x.gt(b)) {
          x.setOperator(x.getOperator(arrowsNum) - 1, arrowsNum);
          x.normalize();
          return x.sub(x.getOperator(arrowsNum - 1));
        }
      }
      if (x.lt(PowiainaNum.ZERO.clone())) return PowiainaNum.NaN.clone();

      // base^base^... = x? (? bases)

      let r = 0;

      // 计算x与base的差距
      let t = x.getOperator(arrowsNum) - b.getOperator(arrowsNum);
      if (t > 3) {
        let l = t - 3;
        r += l;
        x.setOperator(x.getOperator(arrowsNum) - l, arrowsNum);
      }

      // 假设b=3， x=1e19
      for (var i = 0; i < 100; ++i) {
        if (x.lt(PowiainaNum.ZERO)) {
          x = x.arrow(arrowsNum - 1)(base);
          --r;
        } else if (x.lte(1)) {
          return new PowiainaNum(r + x.toNumber() - 1);
        } else {
          // 第1-4次迭代，进入此处
          ++r;
          x = x.anyarrow_log(arrowsNum - 1)(base, depth + 1);
        }
      }
      if (x.gt(10)) return new PowiainaNum(r);
      return PowiainaNum.NaN.clone();
    };
  }

  /**
   * base{height}base
   */
  public static arrFrac(base: PowiainaNumSource, height: PowiainaNumSource) {
    let b = new PowiainaNum(base).clone();
    let h = new PowiainaNum(height).clone();
    return new PowiainaNum(b).arrow(h.floor().add(1))(
      b.div(2).pow(h.sub(h.floor())).mul(2)
    );
  }
  /**
   * Arrow height inverse (ExpantaNum.js), an alias of `anyarrow_log`
   * @param arrows
   * @returns
   */
  public arrow_height_inverse(arrows: PowiainaNumSource) {
    return this.anyarrow_log(arrows);
  }
  private static arrowMSI(arrowsNum: number): PowiainaNum {
    return new PowiainaNum(`10{${arrowsNum}}${MSI}`);
  }
  public chain(other: PowiainaNumSource, arrows: PowiainaNumSource) {
    return this.arrow(arrows)(other);
  }
  public static hyper(arr: PowiainaNumSource) {
    const z = new PowiainaNum(arr);
    if (z.eq(0))
      return (x: PowiainaNumSource, y: PowiainaNumSource) => {
        return new PowiainaNum(y).eq(0)
          ? new PowiainaNum(x)
          : new PowiainaNum(x).add(1);
      };
    if (z.eq(1)) return PowiainaNum.add;
    else if (z.eq(2)) return PowiainaNum.mul;
    else if (z.eq(3)) return PowiainaNum.pow;
    else {
      return (x: PowiainaNumSource, y: PowiainaNumSource) => {
        return new PowiainaNum(x).arrow(z.sub(2))(y);
      };
    }
  }
  public pentate(other: PowiainaNumSource) {
    return this.arrow(3)(other);
  }
  public hexate(other: PowiainaNumSource) {
    return this.arrow(4)(other);
  }
  public penta_log(base: PowiainaNumSource = 10) {
    return this.anyarrow_log(3)(base);
  }

  /**
   * Expansion, which is `this`{{1}}`other2`.
   *
   * Expansion refers to the binary function a{{1}}b = a{a{...a{b}a...}a}a where there are b a's from the center out. It is {a,b,1,2} in BEAF and a{X+1}b in X-Sequence Hyper-Exponential Notation. The notation a{c}b means {a,b,c}, which is a "c + 2"-ated to b, using the bracket operator.
   *
   * @url https://googology.fandom.com/wiki/Expansion
   */
  public expansion(other2: PowiainaNumSource) {
    const other = new PowiainaNum(other2);
    const t = this.clone();
    if (other.lt(PowiainaNum.ZERO) || !other.isInt())
      return PowiainaNum.NaN.clone();
    if (other.eq(PowiainaNum.ONE)) return this.clone();
    if (this.eq(PowiainaNum.ONE)) return PowiainaNum.ONE.clone();
    if (!this.isInt()) return PowiainaNum.NaN.clone();
    if (this.eq(2)) return new PowiainaNum(4);
    if (other.eq(0)) return PowiainaNum.ONE.clone();
    let r;
    // I don't know is this added partrs work correctly...
    if (t.gt(`10{1,2}${MSI}`) || other.gt(MSI)) {
      if (t.gt(`10{1,2}${MSI}`)) {
        r = t.clone();
        r.setOperator(r.getOperator(1, 2) - 1, 1, 2);
        r.normalize();
      } else if (t.gt(`10{${MSI}}10`)) {
        r = new PowiainaNum(t.getOperator(Infinity));
      } else {
        r = PowiainaNum.ZERO;
      }
      var j = r.add(other);
      j.setOperator(j.getOperator(1, 2) + 1, 1, 2);
      j.normalize();
      return j;
    }
    let f = other.toNumber() - 1;
    r = t.clone();
    let i;
    for (i = 0; f !== 0 && r.lt(MSI) && i < 100; ++i) {
      if (f > 0) {
        r = t.arrow(r)(t);
        --f;
      }
    }
    if (i == 100) f = 0;
    r.setOperator(r.getOperator(Infinity) + f, Infinity);
    r.normalize();
    return r;
  }

  public expansionArrow(arrow2: PowiainaNumSource) {
    const arrow = new PowiainaNum(arrow2);
    const t = this.clone();
    if (arrow.lt(0) || !arrow.isInt() || arrow.isNaN() || this.isNaN())
      return function () {
        return PowiainaNum.NaN.clone();
      };
    if (arrow.eq(0))
      return function (other: PowiainaNumSource) {
        return t.arrow(other)(t);
      };
    if (arrow.eq(1))
      return function (other: PowiainaNumSource) {
        return t.expansion(other);
      };

    const arrows = arrow;
    return function (other2: PowiainaNumSource, depth = 0): PowiainaNum {
      const other = new PowiainaNum(other2);
      let r;
      if (t.isNaN() || other.isNaN()) return PowiainaNum.NaN.clone();
      if (other.lt(PowiainaNum.ZERO)) return PowiainaNum.NaN.clone();
      if (t.eq(PowiainaNum.ZERO)) {
        if (other.eq(PowiainaNum.ONE)) return PowiainaNum.ZERO.clone();
        return PowiainaNum.NaN.clone();
      }
      if (t.eq(PowiainaNum.ONE)) return PowiainaNum.ONE.clone();
      if (other.eq(PowiainaNum.ZERO)) return PowiainaNum.ONE.clone();
      if (other.eq(PowiainaNum.ONE)) return t.clone();

      // arrow > 9e15, that using 10{x,2}, x=arrow;
      if (arrows.gt(PowiainaNum.MSI)) {
        r = arrows.clone();
        r.setOperator(r.getOperator(Infinity, 2) + 1, Infinity, 2);
        return r;
      }
      let arrowsNum = arrows.toNumber();
      // arrow < 9e15

      // 10{x}2 = 10{x-1}10
      if (other.eq(2)) return t.expansionArrow(arrowsNum - 1)(t, depth + 1);
      if (t.max(other).gt(`10{${arrowsNum + 1},2}${MSI}`)) return t.max(other);
      if (t.gt(`10{${arrowsNum},2}${MSI}`) || other.gt(MSI)) {
        if (t.gt(`10{${arrowsNum},2}${MSI}`)) {
          r = t.clone();
          r.setOperator(r.getOperator(arrowsNum, 2) - 1, arrowsNum, 2);
          r.normalize();
        } else if (t.gt(`10{${arrowsNum - 1},2}${MSI}`)) {
          r = new PowiainaNum(t.getOperator(arrowsNum - 1, 2));
        } else {
          r = PowiainaNum.ZERO;
        }
        var j = r.add(other);
        j.setOperator(j.getOperator(arrowsNum, 2) + 1, arrowsNum, 2);
        j.normalize();
        return j;
      }
      if (depth >= PowiainaNum.maxOps + 10) {
        return new PowiainaNum({
          small: false,
          sign: 1,
          layer: 0,
          array: [newOperator(10, 0), newOperator(1, arrowsNum, 2)],
        });
      }
      const y = other.toNumber();
      let f = Math.floor(y);
      const arrows_m1 = arrows.sub(PowiainaNum.ONE);
      r = t.expansionArrow(arrows_m1)(y - f, depth + 1);
      let i = 0;
      for (
        let m = new PowiainaNum(`10{${arrowsNum - 1},2}${MSI}`);
        f !== 0 && r.lt(m) && i < 100;
        i++
      ) {
        if (f > 0) {
          r = t.expansionArrow(arrows_m1)(r, depth + 1);
          --f;
        }
      }
      if (i == 100) f = 0;
      r.setOperator(r.getOperator(arrowsNum - 1, 2) + f, arrowsNum - 1, 2);
      r.normalize();
      return r;
    };
  }

  public static expansion(t: PowiainaNumSource, other: PowiainaNumSource) {
    return new PowiainaNum(t).expansion(other);
  }

  public multiExpansion(other: PowiainaNumSource) {
    return this.expansionArrow(2)(other);
  }
  public static multiExpansion(t: PowiainaNumSource, other: PowiainaNumSource) {
    return new PowiainaNum(t).multiExpansion(other);
  }
  public powerExpansion(other: PowiainaNumSource) {
    return this.expansionArrow(3)(other);
  }
  public static powerExpansion(t: PowiainaNumSource, other: PowiainaNumSource) {
    return new PowiainaNum(t).powerExpansion(other);
  }

  public explosion(other: PowiainaNumSource) {
    return PowiainaNum.BEAF(this, other, 1, 3);
  }

  public megotion(other: PowiainaNumSource) {
    return PowiainaNum.BEAF(this, other, 1, 1, 2);
  }
  public powiaination(other: PowiainaNumSource) {
    return PowiainaNum.BEAF(this, other, 1, 1, 1, 2);
  }

  public static BEAF(
    base2: PowiainaNumSource,
    power2: PowiainaNumSource,
    arrow2: PowiainaNumSource = 1,
    expans2: PowiainaNumSource = 1,
    megota2: PowiainaNumSource = 1,
    powiaina2: PowiainaNumSource = 1,
    depth = 0
  ): PowiainaNum {
    // console.warn(
    //   "This function is unstable when calculating numbers greater than *megotion*",
    // );
    let base = new PowiainaNum(base2);
    let power = new PowiainaNum(power2);
    function readArg(a: number) {
      return new PowiainaNum([arrow2, expans2, megota2, powiaina2][a] ?? 1);
    }

    if (base.eq(1)) return new PowiainaNum(1);
    if (power.eq(1)) return new PowiainaNum(base);
    if (power.isZero()) return new PowiainaNum(1);
    if (base.lt(0)) return PowiainaNum.NaN.clone();
    // // check infinite
    // let sufpowiaina = args.slice(4);
    // if (sufpowiaina.filter((f) => new PowiainaNum(f).gte(2)).length > 0) {
    //   return PowiainaNum.POSITIVE_INFINITY;
    // }
    if (new PowiainaNum(powiaina2).gte(3))
      return PowiainaNum.POSITIVE_INFINITY.clone();
    if (readArg(0).eq(1) && readArg(1).eq(1) && readArg(2).eq(1)) {
      return base.pow(power);
    }
    if (
      readArg(0).eq(2) &&
      readArg(1).eq(1) &&
      readArg(2).eq(1) &&
      readArg(3).eq(1)
    ) {
      return base.tetrate(power);
    }
    if (readArg(1).eq(1) && readArg(2).eq(1) && readArg(3).eq(1)) {
      return base.arrow(readArg(0))(power);
    }
    if (readArg(1).eq(2) && readArg(2).eq(1) && readArg(3).eq(1)) {
      return base.expansionArrow(readArg(0))(power);
    }
    let arrow = readArg(0).toNumber();
    let expans = readArg(1);
    let megota = readArg(2);
    let powiaina = readArg(3);

    if (powiaina.eq(2)) {
      if (arrow != 1) return PowiainaNum.POSITIVE_INFINITY.clone();
      if (expans.neq(1)) return PowiainaNum.POSITIVE_INFINITY.clone();
      if (megota.neq(1)) return PowiainaNum.POSITIVE_INFINITY.clone();
      if (power.gte(MSI)) return PowiainaNum.POSITIVE_INFINITY.clone();
      let r = new PowiainaNum(10);
      r.layer = power.toNumber();
      r.normalize();
      return r;
    }

    function convertOperator(
      arrows: number,
      expans: number,
      megota: number
    ): [number, number, number] {
      let a = arrows;
      let e = expans;
      let m = megota;
      if (a == 0 && e > 1) {
        return [1 / 0, e - 1, m];
      }
      if (a == 0 && e == 1 && m > 1) {
        return [1, 1 / 0, m - 1];
      }

      return [a, e, m];
    }
    if (megota.gt(MSI)) {
      let temp = new PowiainaNum(megota);
      temp.layer++;
      temp.normalize();
      return temp;
    }
    function infToBang(x: number) {
      if (!isFinite(x)) return "!";
      return x.toString();
    }
    function getMSIForm(arrow: number, expans: number, megota: number) {
      return `10{${infToBang(arrow)},${infToBang(expans)},${megota}}${MSI}`;
    }

    const t = base.clone();
    const arrows = new PowiainaNum(readArg(0));
    const result = (function (
      other2: PowiainaNumSource,
      depth = 0
    ): PowiainaNum {
      console.log(
        `${"-".repeat(depth)} {${base2},${power2},${arrow2},${expans2},${megota2}}`
      );
      const other = new PowiainaNum(other2);
      let r;
      if (t.isNaN() || other.isNaN()) return PowiainaNum.NaN.clone();
      if (other.lt(PowiainaNum.ZERO)) return PowiainaNum.NaN.clone();
      if (t.eq(PowiainaNum.ZERO)) {
        if (other.eq(PowiainaNum.ONE)) return PowiainaNum.ZERO.clone();
        return PowiainaNum.NaN.clone();
      }
      if (t.eq(PowiainaNum.ONE)) return PowiainaNum.ONE.clone();
      if (other.eq(PowiainaNum.ZERO)) return PowiainaNum.ONE.clone();
      if (other.eq(PowiainaNum.ONE)) return t.clone();

      if (arrows.eq(0)) {
        return PowiainaNum.BEAF(
          t,
          t,
          power,
          expans.sub(1),
          megota,
          powiaina2,
          depth + 1
        );
        // {this, this, power, expans-1, megota}
      }
      if (megota.eq(0)) {
        return PowiainaNum.BEAF(
          t,
          t,
          t,
          t,
          expans,
          new PowiainaNum(powiaina2).sub(1),
          depth + 1
        );
      }
      // expans > 9e15, that using 10{?, x}, x=expans;
      if (expans.gt(MSI)) {
        r = new PowiainaNum(expans);
        r.setOperator(
          r.getOperator(1, Infinity, megota.toNumber()) + 1,
          1,
          Infinity,
          megota.toNumber()
        );
        return r;
      }
      // arrow > 9e15, that using 10{x,2}, x=arrow;
      if (arrows.gt(PowiainaNum.MSI)) {
        r = arrows.clone();
        r.setOperator(
          r.getOperator(Infinity, expans.toNumber(), megota.toNumber()) + 1,
          Infinity,
          expans.toNumber(),
          megota.toNumber()
        );
        return r;
      }
      let arrowsNum = arrows.toNumber();
      // arrow < 9e15

      // 10{x}2 = 10{x-1}10
      if (other.eq(2))
        return PowiainaNum.BEAF(
          t,
          t,
          arrowsNum - 1,
          expans,
          megota,
          powiaina2,
          depth + 1
        );
      if (
        t
          .max(other)
          .gt(getMSIForm(arrowsNum + 1, expans.toNumber(), megota.toNumber()))
      )
        return t.max(other);
      if (
        t.gt(getMSIForm(arrowsNum, expans.toNumber(), megota.toNumber())) ||
        other.gt(MSI)
      ) {
        if (t.gt(getMSIForm(arrowsNum, expans.toNumber(), megota.toNumber()))) {
          r = t.clone();
          r.setOperator(
            r.getOperator(arrowsNum, expans.toNumber(), megota.toNumber()) - 1,
            arrowsNum,
            expans.toNumber(),
            megota.toNumber()
          );
          r.normalize();
        } else if (
          t.gt(
            getMSIForm(
              ...convertOperator(
                arrowsNum - 1,
                expans.toNumber(),
                megota.toNumber()
              )
            )
          )
        ) {
          r = new PowiainaNum(
            t.getOperator(
              ...convertOperator(
                arrowsNum - 1,
                expans.toNumber(),
                megota.toNumber()
              )
            )
          );
        } else {
          r = PowiainaNum.ZERO;
        }
        var j = r.add(other);
        j.setOperator(
          j.getOperator(arrowsNum, expans.toNumber(), megota.toNumber()) + 1,
          arrowsNum,
          expans.toNumber(),
          megota.toNumber()
        );
        j.normalize();
        return j;
      }
      if (depth >= PowiainaNum.maxOps + 10) {
        return new PowiainaNum({
          small: false,
          sign: 1,
          layer: 0,
          array: [
            newOperator(10, 0),
            newOperator(1, arrowsNum, expans.toNumber(), megota.toNumber()),
          ],
        });
      }
      const y = other.toNumber();
      let f = Math.floor(y);
      const arrows_m1 = arrows.sub(PowiainaNum.ONE);
      r = PowiainaNum.BEAF(
        t,
        y - f,
        arrows_m1.toNumber(),
        expans,
        megota,
        powiaina2,
        depth + 1
      );
      let i = 0;
      for (
        let m = new PowiainaNum(
          getMSIForm(
            ...convertOperator(
              arrowsNum - 1,
              expans.toNumber(),
              megota.toNumber()
            )
          )
        );
        f !== 0 && r.lt(m) && i < 100;
        i++
      ) {
        if (f > 0) {
          r = PowiainaNum.BEAF(
            base,
            r,
            arrows_m1.toNumber(),
            expans,
            megota,
            powiaina2,
            depth + 1
          );
          --f;
        }
      }
      if (i == 100) f = 0;
      r.setOperator(
        r.getOperator(
          ...convertOperator(
            arrowsNum - 1,
            expans.toNumber(),
            megota.toNumber()
          )
        ) + f,
        ...convertOperator(arrowsNum - 1, expans.toNumber(), megota.toNumber())
      );
      r.normalize();
      return r;
    })(power, depth);
    console.log(`${"-".repeat(depth)} = ${result}`);
    return result;
    throw new Error("Not implemented");
  }
  //#endregion

  //#region comparsion

  public abs(): PowiainaNum {
    let obj = this.clone();
    if (obj.sign < 0) obj.sign *= -1;
    return obj;
  }
  public static abs(x: PowiainaNumSource): PowiainaNum {
    return new PowiainaNum(x).abs();
  }
  /**
   * Select the largest number of arguments.
   */
  public static max(...args: PowiainaNumSource[]): PowiainaNum {
    let max = PowiainaNum.NEGATIVE_INFINITY;
    for (let i = 0; i < args.length; i++) {
      if (max.lt(args[i])) {
        max = new PowiainaNum(args[i]).clone();
      }
    }
    return max;
  }

  /**
   * Select the smallest number of arguments.
   */
  public static min(...args: PowiainaNumSource[]): PowiainaNum {
    let max = PowiainaNum.POSITIVE_INFINITY;
    for (let i = 0; i < args.length; i++) {
      if (max.gt(args[i])) {
        max = new PowiainaNum(args[i]).clone();
      }
    }
    return max;
  }
  /**
   * Restrict a number be not lower than a number
   *
   * It's also an alias of `PowiainaNum.max`.
   * @returns restricted number
   */
  public static clampMin(...args: PowiainaNumSource[]): PowiainaNum {
    return PowiainaNum.max(...args);
  }
  /**
   * Restrict a number be not lower than a number
   *
   * It's also an alias of `PowiainaNum.max`.
   * @returns restricted number
   */
  public clampMin(...args: PowiainaNumSource[]): PowiainaNum {
    return PowiainaNum.max(this, ...args);
  }

  /**
   * Restrict a number be not higher than a number
   *
   * It's also an alias of `PowiainaNum.min`.
   * @returns restricted number
   */
  public static clampMax(...args: PowiainaNumSource[]): PowiainaNum {
    return PowiainaNum.min(...args);
  }
  /**
   * Restrict a number be not higher than a number
   *
   * It's also an alias of `PowiainaNum.min`.
   * @returns restricted number
   */
  public clampMax(...args: PowiainaNumSource[]): PowiainaNum {
    return PowiainaNum.min(this, ...args);
  }

  /**
   * A combination of minimum and maximum: the value returned by clamp is normally 'this', but it won't go below 'min' and it won't go above 'max'.
   * Therefore, if 'this' < 'min', then 'min' is returned, and if 'this' > 'max', then 'max' is returned.
   */
  public clamp(min: PowiainaNumSource, max: PowiainaNumSource): PowiainaNum {
    return this.max(min).min(max);
  }

  public max(...args: PowiainaNumSource[]): PowiainaNum {
    return PowiainaNum.max(this, ...args);
  }
  public min(...args: PowiainaNumSource[]): PowiainaNum {
    return PowiainaNum.min(this, ...args);
  }

  /**
   * Compare what PowiainaNum's absolute value is max
   * @param args
   * @returns absolute value max number's absolute value
   */
  public maxabs(...args: PowiainaNumSource[]): PowiainaNum {
    const other = args.map((x) => new PowiainaNum(x).abs());
    return PowiainaNum.max(this.abs(), ...other);
  }
  public minabs(...args: PowiainaNumSource[]): PowiainaNum {
    const other = args.map((x) => new PowiainaNum(x).abs());
    return PowiainaNum.min(this.abs(), ...other);
  }

  public cmpabs(x: PowiainaNumSource): -1 | 0 | 1 | 2 {
    const other = new PowiainaNum(x).abs();
    return this.abs().cmp(other);
  }

  compare(x: PowiainaNumSource): -1 | 0 | 1 | 2 {
    const other = new PowiainaNum(x);
    if (this.isNaN() || other.isNaN()) return 2;

    if (this.sign < other.sign) return -1;
    if (this.sign > other.sign) return 1;
    //this.sign = other.sign
    const allneg = this.sign == -1 && other.sign == -1;
    if (this.small && !other.small) return (-1 * (allneg ? -1 : 1)) as -1 | 1;
    if (other.small && !this.small) return (1 * (allneg ? -1 : 1)) as -1 | 1;

    let resultreverse = 1;
    if (this.small && other.small) resultreverse *= -1;
    if (allneg) resultreverse *= -1;

    let result = 0;

    for (
      let i = 0;
      this.array.length - 1 - i >= 0 && other.array.length - 1 - i >= 0;
      i++
    ) {
      let op1 = this.array[this.array.length - 1 - i];
      let op2 = other.array[other.array.length - 1 - i];
      let cmp = compareTuples(
        [op1.megota, op1.expans, op1.arrow, op1.repeat],
        [op2.megota, op2.expans, op2.arrow, op2.repeat]
      );
      if (cmp == 1) {
        result = 1;
        break;
      } else if (cmp == -1) {
        result = -1;
        break;
      }
    }

    return (result * resultreverse + 1 - 1) as -1 | 0 | 1;
  }
  cmp(other: PowiainaNumSource): -1 | 0 | 1 | 2 {
    return this.compare(other);
  }

  eq(other: PowiainaNumSource): boolean {
    return this.cmp(other) === 0;
  }
  neq(other: PowiainaNumSource): boolean {
    return this.cmp(other) !== 0;
  }
  lt(other: PowiainaNumSource): boolean {
    return this.cmp(other) === -1;
  }
  lte(other: PowiainaNumSource): boolean {
    return this.cmp(other) <= 0;
  }
  gt(other: PowiainaNumSource): boolean {
    return this.cmp(other) == 1;
  }
  gte(other: PowiainaNumSource): boolean {
    let t = this.cmp(other);
    return t == 0 || t == 1;
  }

  public eq_tolerance(
    value: PowiainaNumSource,
    tolerance: number = 1e-7
  ): boolean {
    const dec = new PowiainaNum(value);
    return this.sub(dec).lte(this.max(dec).mul(tolerance));
  }
  //#endregion

  //#region geometry
  public sin(): PowiainaNum {
    const x = this.clone();
    if (x.isneg()) {
      return x.neg().sin().neg();
    }
    const y = x.mod(7074237752028440);

    return PowiainaNum.fromNumber(Math.sin(y.toNumber()));
  }

  public cos(): PowiainaNum {
    return this.sub(Math.PI / 2).sin();
  }

  public tan(): PowiainaNum {
    return this.sin().div(this.cos());
  }

  public cot(): PowiainaNum {
    return this.cos().div(this.sin());
  }

  public sec(): PowiainaNum {
    return this.cos().rec();
  }
  public csc(): PowiainaNum {
    return this.sin().rec();
  }
  //#endregion

  //#region neg, rec, floor, ceil, round, trunc, sign
  public neg(): PowiainaNum {
    let a = this.clone();
    a.sign *= -1;
    a.normalize();
    return a;
  }

  public rec(): PowiainaNum {
    let a = this.clone();
    a.small = !a.small;
    return a;
  }
  public floor(): PowiainaNum {
    if (this.isInt()) return this.clone();
    if (this.small) {
      if (this.sign == 1) return PowiainaNum.ZERO.clone();
      else return PowiainaNum.ONE.neg().clone();
    }
    let r = this.abs();
    r.array[0].repeat = Math[this.sign == 1 ? "floor" : "ceil"](
      r.getOperator(0)
    );
    return r;
  }
  public ceil(): PowiainaNum {
    if (this.isInt()) return this.clone();
    if (this.small) {
      if (this.sign == 1) return PowiainaNum.ONE.clone();
      else return PowiainaNum.ZERO.clone();
    }
    let r = this.abs();
    r.array[0].repeat = Math[this.sign == 1 ? "ceil" : "floor"](
      r.getOperator(0)
    );
    r.sign = this.sign;
    return r;
  }
  public round(): PowiainaNum {
    if (this.isInt()) return this.clone();
    if (this.small) {
      if (this.sign == 1) {
        if (this.rec().lte(2)) return PowiainaNum.ONE.clone();
        else return PowiainaNum.ZERO.clone();
      } else {
        if (this.abs().rec().lte(2)) return PowiainaNum.ZERO.clone();
        else return PowiainaNum.ONE.neg().clone();
      }
    }
    let r = this.abs();
    r.array[0].repeat = Math.round(r.array[0].repeat);
    r.sign = this.sign;
    return r;
  }

  /**
   * Work like `Math.trunc`,
   *
   * if `this > 0`, return `floor(this)`
   *
   * if `this < 0`, return `ceil(this)`
   *
   * @example
   * new PowiainaNum(3.3).trunc() == new PowiainaNum(3)
   * new PowiainaNum(-1.114514).trunc() == new PowiainaNum(-1)
   * @returns
   */
  public trunc() {
    const y = this.clone();
    return y.gte(0) ? y.floor() : y.ceil();
  }
  /**
   * @returns if this<other, return -1, if this=other, return 0, if this>other, return 1, if this!<=>, return 2
   */

  public static sign(a: PowiainaNum): -1 | 0 | 1 {
    return new PowiainaNum(a).sign;
  }
  //#endregion

  //#region judge-numbers
  isNaN(): boolean {
    return isNaN(this.getOperator(0));
  }
  isZero(): boolean {
    return Boolean(this.small && !isFinite(this.getOperator(0)));
  }
  isFinite(): boolean {
    return (
      Boolean(this.small || isFinite(this.getOperator(0))) && !this.isNaN()
    );
  }

  isInfi(): boolean {
    return this.rec().isZero();
  }
  isInfiNaN(): boolean {
    return this.isInfi() || this.isNaN();
  }
  isInt(): boolean {
    if (this.isZero()) return true;
    if (!this.small && Number.isInteger(this.getOperator(0))) return true;
    if (this.abs().gte(MSI / 2)) return true;
    return false;
  }

  ispos(): boolean {
    return this.sign > 0;
  }
  isneg(): boolean {
    return this.sign < 0;
  }

  static isNaN(x: PowiainaNumSource): boolean {
    return new PowiainaNum(x).isNaN();
  }

  //#endregion

  /**
   * Normalize functions will make this number convert into standard format.(it also change `this`, like [].sort)
   * @returns normalized number
   */
  public normalize(): PowiainaNum {
    //TODO: normalize

    let renormalize = true;
    var x = this;
    for (let i = 0; i < this.array.length; i++) {
      // Check what is infinity
      if (this.array[i].repeat == Infinity) {
        this.array = [
          {
            arrow: 0,
            expans: 1,
            megota: 1,
            repeat: Infinity,
          },
        ];
        this.layer = 0;
        return this;
      }
    }
    for (var i = 1; i < x.array.length; ++i) {
      var e = x.array[i];
      if (e.arrow === null || e.arrow === undefined) {
        e.arrow = 0;
      }
      if (e.expans === null || e.expans === undefined) {
        e.expans = 1;
      }
      if (e.megota === null || e.megota === undefined) {
        e.megota = 1;
      }
      if (
        isNaN(e.arrow) ||
        isNaN(e.repeat) ||
        isNaN(e.expans) ||
        isNaN(e.megota)
      ) {
        x.array = [newOperator(NaN, 0, 1, 1)];
        return x;
      }
      if (!isFinite(e.repeat) || !isFinite(e.megota)) {
        x.array = [newOperator(Infinity, 0, 1, 1)];
        return x;
      }
      if (!Number.isInteger(e.arrow)) e.arrow = Math.floor(e.arrow);
      if (!Number.isInteger(e.repeat)) e.repeat = Math.floor(e.repeat);
      if (!Number.isInteger(e.expans)) e.expans = Math.floor(e.expans);
      if (!Number.isInteger(e.megota)) e.megota = Math.floor(e.megota);
    }

    if (!x.array.length) {
      x.small = !x.small;
      x.array = [newOperator(Infinity)]; // if no array set zero
    }
    do {
      renormalize = false;
      // Sort arrays.
      this.array.sort(arraySortFunction);

      for (i = 1; i < x.array.length - 1; ++i) {
        if (
          x.array[i].arrow == x.array[i + 1].arrow &&
          x.array[i].expans == x.array[i + 1].expans &&
          x.array[i].megota == x.array[i + 1].megota
        ) {
          // same array's merge
          x.array[i].repeat += x.array[i + 1].repeat;
          x.array.splice(i + 1, 1);
          --i;
          renormalize = true;
        }
      }
      for (i = 1; i < x.array.length; ++i) {
        // If there is a 0 repeat operator, remove it.
        if (
          x.array[i].arrow !== 0 &&
          (x.array[i].repeat === 0 ||
            x.array[i].repeat === null ||
            x.array[i].repeat === undefined)
        ) {
          x.array.splice(i, 1);
          --i;
          continue;
        }
        // If there is a operator which arrow 0 and brace count >=2
        // replace it as arrow replacement operaotr
        if (x.array[i].arrow == 0 && x.array[i].expans >= 2) {
          x.array[i].arrow = Infinity;
          x.array[i].valuereplaced = 0;
          x.array[i].expans = x.array[i].expans - 1;
        }
      }
      if (x.array.length > PowiainaNum.maxOps)
        x.array.splice(1, x.array.length - PowiainaNum.maxOps); // max operators check
      // for any 10^a but a >log10(MSI), replace to regular 10^a
      if (
        this.array.length >= 2 &&
        this.array[1].arrow == 1 &&
        this.array[1].repeat >= 1 &&
        this.array[0].repeat < MSI_LOG10
      ) {
        this.setOperator(this.array[1].repeat - 1, 1);
        this.setOperator(10 ** this.array[0].repeat, 0);
        renormalize = true;
      }
      if (this.getOperator(0) > MSI && isFinite(this.getOperator(0))) {
        this.setOperator(this.getOperator(1) + 1, 1);
        this.setOperator(Math.log10(this.getOperator(0)), 0);
        renormalize = true;
      }
      if (this.array[this.array.length - 1].megota > MSI) {
        this.layer++;
        this.array = [newOperator(this.array[this.array.length - 1].megota)];
        renormalize = true;
      } else if (
        this.layer &&
        this.array.length == 1 &&
        this.array[0].arrow === 0
      ) {
        this.layer--;
        this.array = [
          newOperator(10),
          newOperator(1, 10, 10, this.array[0].repeat),
        ];

        renormalize = true;
      }
      // for a<1, turn into reciprocate
      if (this.array.length == 1 && this.array[0].repeat < 1) {
        this.array[0].repeat = 1 / this.array[0].repeat;
        this.small = !this.small;
        renormalize = true;
      }
      // for any 10{X>9e15}10, replace into 10{!}X;
      if (this.array.length >= 2 && this.array[1].arrow >= MSI) {
        this.array[0].repeat = this.array[1].arrow;
        this.array[1] = newOperator(
          1,
          Infinity,
          this.array[1].expans,
          this.array[1].megota
        );
      }
      while (
        x.array.length >= 2 &&
        x.array[0].repeat == 1 &&
        x.array[1].repeat
      ) {
        // for any 10{X}10{X} 1, turn into 10{X}10
        // [1, [R=sth, A=sth, E=sth, M=sth]]
        if (x.array[1].repeat > 1) {
          x.array[1].repeat--;
        } else {
          x.array.splice(1, 1);
        }
        x.array[0].repeat = 10;
        renormalize = true;
      }
      if (
        x.array.length >= 2 &&
        x.array.length < PowiainaNum.maxOps &&
        x.array[0].repeat < MSI &&
        x.array[1].arrow >= 2 &&
        x.array[1].repeat > 1 && //10^^^ 10
        isFinite(x.array[1].arrow)
      ) {
        // for any (10{A sample=2})^k 1e9, turn into (10{A})^k-1  (10{A-1})^1e9-1 10
        // But dont convert when a is infinite
        // [1e9, [R=K, A=2, sth, sth]]
        x.array[1].repeat--;
        x.array.splice(
          1,
          0,
          newOperator(
            x.array[0].repeat - 1,
            x.array[1].arrow - 1,
            x.array[1].expans,
            x.array[1].megota
          )
        );
        x.array[0].repeat = 10;
        renormalize = true;
      }
      if (
        x.array.length >= 2 &&
        x.array[0].repeat < MSI &&
        x.array[1].arrow >= 2 &&
        x.array[1].repeat == 1 && //10^^^ 10
        isFinite(x.array[1].arrow)
      ) {
        // for any 10{A sample=2}1e9, turn into (10{A-1})^1e9-1 10
        // But dont convert when a is infinite
        // [1e9, [R=1, A=2, sth, sth]]
        x.array.splice(
          1,
          1,
          newOperator(
            x.array[0].repeat - 1,
            x.array[1].arrow - 1,
            x.array[1].expans,
            x.array[1].megota
          )
        );
        x.array[0].repeat = 10;
        renormalize = true;
      }

      // for any (10{A=2})^1e16 10, turn into (10{A+1}) 1e16
      if (
        x.array.length >= 2 &&
        x.array[1].repeat > MSI &&
        x.array[1].arrow !== Infinity
      ) {
        x.array[1].arrow++;
        x.array[0].repeat = x.array[1].repeat;
        x.array[1].repeat = 1;

        renormalize = true;
      }
      // for any (10{x})^1e16 10, turn into (10{1,2}) 1e16
      if (
        x.array.length >= 2 &&
        x.array[1].repeat > MSI &&
        x.array[1].arrow === Infinity
      ) {
        x.array[1].arrow = 1;
        x.array[1].expans++;
        x.array[0].repeat = x.array[1].repeat;
        x.array[1].repeat = 1;

        renormalize = true;
      }
    } while (renormalize);
    return this;
  }

  //#region operators
  /**
   * @returns number will return the index of the operator in array. return as x.5 if it's between the xth and x+1th operators.
   */
  getOperatorIndex(arrow: number, expans = 1, megota = 1) {
    for (let i = 0; i < this.array.length; i++) {
      let cmp = compareTuples(
        [this.array[i].megota, this.array[i].expans, this.array[i].arrow],
        [megota, expans, arrow]
      );
      if (cmp == 0) return i; // I find it was [xx,xxx,*xxx*,xxx]!
      if (cmp == 1) return i - 0.5; // It's between [xx, xx,xx*,?,*xx]!
    }
    return this.array.length - 0.5;
  }
  /**
   * @returns number repeats of operators with given arguments.
   */
  getOperator(arrow: number, expans = 1, megota = 1) {
    const index = this.getOperatorIndex(arrow, expans, megota);
    if (!this.array[index]) return 0;
    return this.array[index].repeat;
  }

  /**
   * Modify the repeat of operator
   * @param number val the repeat of operator will modify to array.
   * @returns bool Is the operators array changed?
   */
  setOperator(val: number, arrow: number, expans = 1, megota = 1) {
    // if (arrow!=0&&val==0) return false;
    const index = this.getOperatorIndex(arrow, expans, megota);
    if (!this.array[index]) {
      this.array.splice(Math.ceil(index), 0, {
        arrow,
        expans,
        megota,
        valuereplaced: expans === Infinity ? 1 : arrow == Infinity ? 0 : -1,
        repeat: val,
      });
      return true;
    }
    this.array[index].repeat = val;
    // this.normalize()
    return false;
  }
  //#endregion

  /**
   * @returns  a PowiainaNum object which deep copied from `this` object.
   */
  clone(): PowiainaNum {
    let obj = new PowiainaNum();
    obj.resetFromObject(this);
    return obj;
  }

  /**
   * Set `this` from a object(deep-copy)
   * @param powlikeObject
   * @returns
   */
  resetFromObject(powlikeObject: IPowiainaNum) {
    this.array = [];
    for (let i = 0; i < powlikeObject.array.length; i++) {
      this.array[i] = {
        arrow: powlikeObject.array[i].arrow,
        expans: powlikeObject.array[i].expans,
        megota: powlikeObject.array[i].megota,
        repeat: powlikeObject.array[i].repeat,
        valuereplaced: powlikeObject.array[i].valuereplaced,
      };
    }
    this.small = powlikeObject.small;
    this.sign = powlikeObject.sign;
    this.layer = powlikeObject.layer;
    return this;
  }

  //#region converters
  /**
   * Convert `this` to Javascript `number`
   *
   * returns `Infinity` when the number is greater than `Number.MAX_VALUE`
   */
  public toNumber(): number {
    if (this.sign == -1) return -this.neg().toNumber();
    if (this.small) return 1 / this.rec().toNumber();

    if (this.array.length > 2) return Infinity;

    if (this.array.length == 1) return this.array[0].repeat;
    else if (
      this.array.length == 2 &&
      this.array[1].arrow == 1 &&
      this.array[1].expans == 1 &&
      this.array[1].megota == 1 &&
      this.array[1].repeat == 1
    )
      return 10 ** this.getOperator(0);
    return NaN;
  }

  /**
   * Convert `this` to a string
   */
  public toString(): string {
    if (this.isNaN()) return `NaN`;
    if (this.sign == -1) return `-${this.neg().toString()}`;
    if (this.small) {
      if (this.isZero()) return `0`;
      return `/${this.rec().toString()}`;
    }
    if (this.isInfi()) return `Infinity`;

    // P^a (10{arrow,expans,megota})^repeation base
    let res = ``;

    if (!this.layer) res += "";
    else if (this.layer < 3) res += "P".repeat(this.layer);
    else res += "P^" + this.layer + " ";
    for (let i = this.array.length - 1; i >= 0; i--) {
      let oper = this.array[i];
      let calc = `10{${oper.arrow === Infinity ? "!" : oper.arrow}${
        oper.expans > 1 || oper.megota > 1
          ? `,${oper.expans === Infinity ? "!" : oper.expans}`
          : ""
      }${oper.megota > 1 ? `,${oper.megota}` : ""}}`;
      if (
        oper.arrow == 1 &&
        oper.expans == 1 &&
        oper.megota == 1 &&
        oper.repeat < 5
      ) {
        calc = `e`.repeat(oper.repeat);
      } else if (oper.arrow == 0 && oper.expans == 1 && oper.megota == 1) {
        calc = oper.repeat.toString();
      } else if (oper.repeat > 1) {
        calc = `(${calc})^${oper.repeat} `;
      } else {
        calc = `${calc}`;
      }
      res += `${calc}`;
    }
    return res;
  }
  public static fromNumber(x: number): PowiainaNum {
    let obj = new PowiainaNum(); // NaN

    if (x < 0)
      obj.sign = -1; // negative
    else if (x == 0) {
      obj.sign = 0;
      obj.small = true;
      obj.array = [newOperator(Infinity, 0)];
      return obj;
    } else if (x > 0) obj.sign = 1;
    let y = Math.abs(x);
    if (y == Infinity) {
      obj.array = [newOperator(Infinity, 0)];
    } else if (y >= MSI_REC && y < 1) {
      obj.small = true;
      obj.array = [newOperator(1 / y, 0)];
    } else if (y < MSI_REC) {
      obj.small = true;
      obj.array = [newOperator(-Math.log10(y), 0), newOperator(1, 1)];
    } else if (y <= MSI) {
      obj.array = [newOperator(y, 0)];
    } else {
      obj.setOperator(Math.log10(y), 0);
      obj.array = [newOperator(Math.log10(y), 0), newOperator(1, 1)];
    }
    return obj;
  }

  [Symbol.toStringTag] = "PowiainaNum";
  /**
   * Convert `this` to a JSON object
   * @returns a JSON object
   */
  public toJSON(): string {
    return "PN" + this.toString();
  }
  public static fromString(input: string) {
    var x = new PowiainaNum();
    // Judge the string was a number

    if (input.startsWith("PN")) input = input.substring(2);

    if (!isNaN(Number(input))) {
      let res = Number(input);
      let a = false;
      if (res == 0) {
        if (/^((0)|(0*\.0+e\d+)|(0*\.0*))$/.test(input)) {
          a = true;
        }
      } else {
        a = true;
      }
      if (!a) {
        let m = input.search(/e/);
        let exponent = input.substring((m == -1 ? input.length : m) + 1);
        let mantissa = input.substring(0, m == -1 ? undefined : m);
        let mantissaME = [0, 0];

        // Handle mantissa to ME
        mantissaME[1] = Number(exponent ? exponent : "0");
        // Is regular number gte 1:
        if (Number(mantissa) >= 1) {
          // check The mantissa is very long?
          let log10mant =
            mantissa.length >= LONG_STRING_MIN_LENGTH
              ? log10LongString(mantissa)
              : Math.log10(Number(mantissa));

          let log10int = Math.floor(log10mant) - 1;
          let log10float = log10mant - log10int;
          mantissaME[0] = 10 ** log10float;
          mantissaME[1] += log10float;
        } else {
          // If not , count how many zeros until reached non-zero numbers
          let zeros = countLeadingZerosAfterDecimal(mantissa);
          mantissa = mantissa.substring(mantissa.search(/[1-9]/));
          mantissa = mantissa.charAt(0) + "." + mantissa.substring(1);
          zeros += 1;
          mantissaME[0] = Number(mantissa);
          mantissaME[1] += -zeros;
        }
        // We'll get [a, b] which respents a*10^b;
        // actually b < 0; So we can ^-1
        // /((a*10^b)^-1) = /(a^-1*10^-b) = /(a^-1 * 10 * 10^(-b-1))
        return PowiainaNum.pow(10, -mantissaME[1] - 1)
          .mul(mantissaME[0] ** -1 * 10)
          .rec();
      }
      if (isFinite(res) && a) {
        x = PowiainaNum.fromNumber(Number(input));
        return x;
      }
    }

    // Check legacy PowiainaNum 0.1.x number format
    if (
      input.indexOf("l") !== -1 &&
      input.indexOf("s") !== -1 &&
      input.indexOf("a") !== -1
    ) {
      const obj = parseLegacyPowiainaNumString(input);
      if (!obj || (obj.sValue !== 0 && obj.sValue !== 1 && obj.sValue !== -1))
        throw powiainaNumError + "malformed input: " + input;
      x = PowiainaNum.fromObject(obj.array);
      x.layer = obj.lValue;
      x.sign = obj.sValue;
      x.small = false;
      x.normalize();
      return x;
    }
    input = replaceETo10(input);

    if (!isPowiainaNum.test(input)) {
      throw powiainaNumError + "malformed input: " + input;
    }

    var negateIt = false;
    var recipIt = false;
    if (input[0] == "-" || input[0] == "+") {
      var numSigns = input.search(/[^-\+]/);
      var signs = input.substring(0, numSigns);
      negateIt = (signs.match(/-/g)?.length ?? 0) % 2 == 1;
      input = input.substring(numSigns);
    }
    if (input[0] == "/") {
      var numSigns = input.search(/[^\/]/);
      var signs = input.substring(0, numSigns);
      recipIt = (signs.match(/\//g)?.length ?? 0) % 2 == 1;
      input = input.substring(numSigns);
    }
    if (input == "NaN") x.array = [newOperator(NaN)];
    else if (input == "Infinity") x.array = [newOperator(Infinity)];
    else {
      x.sign = 1;
      x.array = [newOperator(0)];
      var a, b, c, d, i;
      if (input[0] == "P") {
        if (input[1] == "^") {
          a = input.substring(2).search(/[^0-9]/) + 2;
          x.layer = Number(input.substring(2, a));
          input = input.substring(a + 1);
        } else {
          a = input.search(/[^P]/);
          x.layer = a;
          input = input.substring(a);
        }
      }
      while (input) {
        if (/^(\(?10[\^\{])/.test(input)) {
          /*
            10^ - 匹配
            10{ - 匹配
            (10^ - 匹配
            (10{ - 匹配
            10x - 不匹配（最后一个字符不是 ^ 或 {）
            110^ - 不匹配（不是以 10 开头）
          */
          if (input[0] == "(") input = input.substring(1);
          //cutted, 10^.... or 10{....

          var arrows, expans, megota;
          if (input[2] == "^") {
            a = input.substring(2).search(/[^\^]/);
            //cut input to ^^...^^, and search how numbers
            arrows = a;
            // 10^^^
            b = a + 2; // b points to after ^'s.
          } else {
            // 10{...}

            a = input.indexOf("}");

            // select contents between {...}
            let tmp = input.substring(3, a).split(",");
            arrows = Number(tmp[0] == "!" ? Infinity : tmp[0]);
            expans = Number((tmp[1] == "!" ? Infinity : tmp[1]) ?? 1);
            megota = Number(tmp[2] ?? 1);
            b = a + 1;
            // b points to after }.
          }
          input = input.substring(b);
          if (input[0] == ")") {
            // )^....<Space>
            a = input.indexOf(" ");
            c = Number(input.substring(2, a)); // Select contents between )^....<Space>
            input = input.substring(a + 1); // c points to after <Space>
          } else {
            c = 1; // There is only spaces, count as <ONE>
          }

          if (arrows == 1 && expans == 1 && megota == 1) {
            if (x.array.length >= 2 && x.array[1].arrow == 1) {
              x.array[1].repeat += c;
            } else {
              x.array.splice(1, 0, newOperator(c, 1, expans, megota));
            }
          } else if (arrows == 2 && expans == 1 && megota == 1) {
            a =
              x.array.length >= 2 && x.array[1].arrow == 1
                ? x.array[1].repeat
                : 0;
            b = x.array[0].repeat;
            if (b >= 1e10) ++a;
            if (b >= 10) ++a;
            x.array[0].repeat = a;
            if (x.array.length >= 2 && x.array[1].arrow == 1)
              x.array.splice(1, 1);
            d = x.getOperatorIndex(2);
            if (Number.isInteger(d)) x.array[d].repeat += c;
            else
              x.array.splice(
                Math.ceil(d),
                0,
                newOperator(c, 2, expans, megota)
              );
          } else if (isFinite(arrows)) {
            a = x.getOperator(arrows - 1);
            b = x.getOperator(arrows - 2);
            if (b >= 10) ++a;
            d = x.getOperatorIndex(arrows);
            x.array.splice(1, Math.ceil(d) - 1);
            x.array[0].repeat = a;
            if (Number.isInteger(d)) x.array[1].repeat += c;
            else x.array.splice(1, 0, newOperator(c, arrows, expans, megota));
          } else {
            x.array.splice(1, 0, newOperator(c, arrows, expans, megota));
          }
        } else {
          break;
        }
      }
      a = input.split(/[Ee]/);
      b = [x.array[0].repeat, 0];
      c = 1;
      for (let i = a.length - 1; i >= 0; --i) {
        //The things that are already there
        if (b[0] < MSI_LOG10 && b[1] === 0) {
          b[0] = Math.pow(10, c * b[0]);
        } else if (c == -1) {
          if (b[1] === 0) {
            b[0] = Math.pow(10, c * b[0]);
          } else if (b[1] == 1 && b[0] <= Math.log10(Number.MAX_VALUE)) {
            b[0] = Math.pow(10, c * Math.pow(10, b[0]));
          } else {
            b[0] = 0;
          }
          b[1] = 0;
        } else {
          b[1]++;
        }
        //Multiplying coefficient
        var decimalPointPos = a[i].indexOf(".");
        var intPartLen = decimalPointPos == -1 ? a[i].length : decimalPointPos;
        if (b[1] === 0) {
          if (intPartLen >= LONG_STRING_MIN_LENGTH)
            ((b[0] =
              Math.log10(b[0]) +
              log10LongString(a[i].substring(0, intPartLen))),
              (b[1] = 1));
          else if (a[i]) b[0] *= Number(a[i]);
        } else {
          d =
            intPartLen >= LONG_STRING_MIN_LENGTH
              ? log10LongString(a[i].substring(0, intPartLen))
              : a[i]
                ? Math.log10(Number(a[i]))
                : 0;
          if (b[1] == 1) {
            b[0] += d;
          } else if (b[1] == 2 && b[0] < MSI_LOG10 + Math.log10(d)) {
            b[0] += Math.log10(1 + Math.pow(10, Math.log10(d) - b[0]));
          }
        }
        //Carrying
        if (b[0] < MSI_LOG10 && b[1]) {
          b[0] = Math.pow(10, b[0]);
          b[1]--;
        } else if (b[0] > MSI) {
          b[0] = Math.log10(b[0]);
          b[1]++;
        }
      }
      x.array[0].repeat = b[0];
      if (b[1]) {
        if (
          x.array.length >= 2 &&
          x.array[1].arrow == 1 &&
          x.array[1].expans == 1 &&
          x.array[1].megota == 1
        )
          x.array[1].repeat += b[1];
        else x.array.splice(1, 0, newOperator(b[1], 1, 1, 1));
      }
    }
    if (negateIt) x.sign *= -1;
    if (recipIt) x.small = !x.small;
    x.normalize();
    x.normalize();
    return x;
  }
  public static fromObject(
    powlikeObject: IPowiainaNum | ExpantaNumArray | PowiainaNumArray01X
  ) {
    let obj = new PowiainaNum();
    obj.array = [];
    if (isExpantaNumArray(powlikeObject)) {
      for (let i = 0; i < powlikeObject.length; i++) {
        obj.array[i] = {
          arrow: powlikeObject[i][0],
          expans: 1,
          megota: 1,
          repeat: powlikeObject[i][1],
        };
      }
      obj.small = false;
      obj.sign = 1;
      obj.layer = 0;
      return obj;
    } else if (isPowiainaNum01XArray(powlikeObject)) {
      let arrayobj = powlikeObject;
      obj.array[0] = newOperator(arrayobj[0]);
      for (let i = 1; i < arrayobj.length; i++) {
        let b = arrayobj[i] as
          | [number, number, number, number]
          | ["x", number, number, number]
          | [number, number, "x", number];
        obj.array[1] = newOperator(
          b[1],
          replaceXToInfinity(b[0]),
          replaceXToInfinity(b[2]),
          b[3]
        );
      }
      obj.small = false;
      obj.sign = 1;
      obj.layer = 0;
      return obj;
    } else {
      for (let i = 0; i < powlikeObject.array.length; i++) {
        obj.array[i] = {
          arrow: powlikeObject.array[i].arrow,
          expans: powlikeObject.array[i].expans,
          megota: powlikeObject.array[i].megota,
          repeat: powlikeObject.array[i].repeat,
          valuereplaced: powlikeObject.array[i].valuereplaced,
        };
      }
      obj.small = powlikeObject.small;
      obj.sign = powlikeObject.sign;
      obj.layer = powlikeObject.layer;
      return obj;
    }
  }
  /**
   * A property array value for version 0.1.x PowiainaNum.
   */
  get arr01() {
    let res: PowiainaNumArray01X = [0];
    for (let i = 0; i < this.array.length; i++) {
      if (i == 0) res[0] = this.array[i].repeat;
      else {
        // @ts-ignore
        res[i] = [0, 0, 0, 0];
        // @ts-ignore
        res[i][0] = this.array[i].arrow == Infinity ? "x" : this.array[i].arrow;
        // @ts-ignore
        res[i][1] = this.array[i].repeat;
        // @ts-ignore
        res[i][2] =
          this.array[i].expans == Infinity ? "x" : this.array[i].expans;
        // @ts-ignore
        res[i][3] = this.array[i].megota;
      }
    }
    return res;
  }
  //#endregion

  //#region constants
  /**
   * Zero
   */
  public static readonly ZERO = new PowiainaNum({
    array: [
      {
        arrow: 0,
        expans: 1,
        megota: 1,
        repeat: Infinity,
      },
    ],
    small: true,
    layer: 0,
    sign: 0,
  });
  /**
   * One
   */
  public static readonly ONE = new PowiainaNum({
    array: [
      {
        arrow: 0,
        expans: 1,
        megota: 1,
        repeat: 1,
      },
    ],
    small: false,
    layer: 0,
    sign: 1,
  });
  /**
   * The value of the largest integer n such that n and n + 1 are both
   * exactly representable as a Number value = 9007199254740991 = 2^53 − 1.
   */
  public static readonly MSI = new PowiainaNum(MSI);
  /**
   * MSI's reciprocate value, = 1/9007199254740991.
   */
  public static readonly MSI_REC = (function () {
    let obj = new PowiainaNum(MSI);
    obj.small = true;
    return obj;
  })();

  /**
   * 10^(MSI) = 10^9007199254740991.
   */
  public static readonly E_MSI = new PowiainaNum({
    array: [
      {
        arrow: 0,
        expans: 1,
        megota: 1,
        repeat: MSI,
      },
      { arrow: 1, expans: 1, megota: 1, repeat: 1 },
    ],
    small: false,
    layer: 0,
    sign: 1,
  });
  /**
   * 10^10^(MSI) = 10^10^9007199254740991.
   */
  public static readonly EE_MSI = new PowiainaNum({
    array: [
      {
        arrow: 0,
        expans: 1,
        megota: 1,
        repeat: MSI,
      },
      { arrow: 1, expans: 1, megota: 1, repeat: 2 },
    ],
    small: false,
    layer: 0,
    sign: 1,
  });

  /**
   * 10^(MSI) 's reciprocate value, = 10^-9007199254740991.
   */
  public static readonly E_MSI_REC = new PowiainaNum({
    array: [
      {
        arrow: 0,
        expans: 1,
        megota: 1,
        repeat: MSI,
      },
      { arrow: 1, expans: 1, megota: 1, repeat: 1 },
    ],
    small: true,
    layer: 0,
    sign: 1,
  });

  /**
   * Tetrated MSI, = 10↑↑9007199254740991.
   */
  public static readonly TETRATED_MSI = new PowiainaNum({
    array: [
      {
        arrow: 0,
        expans: 1,
        megota: 1,
        repeat: 1e10,
      },
      { arrow: 1, expans: 1, megota: 1, repeat: MSI - 2 },
    ],
    small: false,
    layer: 0,
    sign: 1,
  });

  /**
   * Pentated MSI, = 10↑↑↑9007199254740991.
   */
  public static readonly PENTATED_MSI = new PowiainaNum({
    array: [
      {
        arrow: 0,
        expans: 1,
        megota: 1,
        repeat: 10,
      },
      { arrow: 2, expans: 1, megota: 1, repeat: MSI - 1 },
    ],
    small: false,
    layer: 0,
    sign: 1,
  });

  /**
   * Tritri, = 3↑↑↑3 = power tower with height 7625597484987 base 3.
   */
  public static readonly TRITRI = new PowiainaNum({
    small: false,
    layer: 0,
    sign: 1,
    array: [
      newOperator(3638334640023.7783, 0, 1, 1),
      newOperator(7625587484984, 1, 1, 1),
    ],
  });

  /**
   * The Graham's Number, = G^64(4)
   *
   * = 3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{
   * 3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3{3↑↑↑↑3
   * }3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3
   * }3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3}3
   */
  public static readonly GRAHAMS_NUMBER = new PowiainaNum(
    "(10{!})^63 10^^^(10^)^7625597484984 3638334640023.7783"
  );
  /**
   * Positive Infinity.
   */
  public static readonly POSITIVE_INFINITY = new PowiainaNum(Infinity);
  /**
   * Negative Infinity.
   */
  public static readonly NEGATIVE_INFINITY = new PowiainaNum(-Infinity);
  public static readonly NaN = new PowiainaNum({
    array: [
      {
        arrow: 0,
        expans: 1,
        megota: 1,
        repeat: NaN,
      },
    ],
    small: false,
    layer: 0,
    sign: 0,
  });
  /**
   * The mathematical constant e. This is Euler's number, the base of natural logarithms.
   */
  public static readonly E = new PowiainaNum(Math.E);
  /**
   * The natural logarithm of 2 = ln(2).
   */
  public static readonly LN2 = new PowiainaNum(Math.LN2);
  /**
   * The natural logarithm of 10.
   */
  public static readonly LN10 = new PowiainaNum(Math.LN10);
  /**
   * The base-2 logarithm of e = log_2(e).
   */
  public static readonly LOG2E = new PowiainaNum(Math.LOG2E);
  /**
   * The base-10 logarithm of e = log_10(e).
   */
  public static readonly LOG10E = new PowiainaNum(Math.LOG10E);
  /**
   * Pi(). This is the ratio of the circumference of a circle to its diameter.
   */
  public static readonly PI = new PowiainaNum(Math.PI);
  /**
   * The square root of 0.5, or, equivalently, one divided by the square root of 2.
   *
   * = (√2)/2 = √(0.5)
   */
  public static readonly SQRT1_2 = new PowiainaNum(Math.SQRT1_2);
  /**
   * The square root of 2 = √2.
   */
  public static readonly SQRT2 = new PowiainaNum(Math.SQRT2);

  public static readonly maxOps = 100;
  public static readonly POW_2_44_MOD_PI = 1.701173079953;

  //#endregion
  public static arrowFuncMap: Map<string, PowiainaNum> = new Map();
}
