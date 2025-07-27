/* Author: VeryrrDefine 0.2.0-alpha.2*/
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

const powiainaNumError = "[PowiainaNum 0.2 error]" as const;
const MSI = 9007199254740991 as const;
const MSI_LOG10 = 15.954589770191003 as const;
const MSI_REC = 1.1102230246251568e-16 as const;
const LONG_STRING_MIN_LENGTH = 17 as const;
const isPowiainaNum =
  /^[-\+]*(Infinity|NaN|(10(\^+|\{([1-9]\d*|!)(,([1-9]\d*|!))?(,[1-9]\d*)?\})|\(10(\^+|\{([1-9]\d*|!)(,([1-9]\d*|!))?(,[1-9]\d*)?\})\)\^[1-9]\d* )*((\d+(\.\d*)?|\d*\.\d+)?([Ee][-\+]*))*(0|\d+(\.\d*)?|\d*\.\d+))$/;

export type PowiainaNumSource = number | string | IPowiainaNum | PowiainaNum;

function newOperator(r: number, a = 0, e = 1, m = 1): Operator {
  return {
    repeat: r,
    arrow: a,
    expans: e,
    megota: m,
    valuereplaced: a == Infinity ? 0 : e == Infinity ? 1 : -1,
  };
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
};

var _EXPN1 = 0.36787944117144232159553; // exp(-1)

var OMEGA = 0.56714329040978387299997; // W(1, 0)
//from https://math.stackexchange.com/a/465183
// The evaluation can become inaccurate very close to the branch point
// Evaluates W(x, 0) if principal is true, W(x, -1) if principal is false
function f_lambertw(z: number, t=1e-10, pr=true) {
  var tol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1e-10;
  var principal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
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
}; 


//from https://github.com/scipy/scipy/blob/8dba340293fe20e62e173bdf2c10ae208286692f/scipy/special/lambertw.pxd
// The evaluation can become inaccurate very close to the branch point
// at ``-1/e``. In some corner cases, `lambertw` might currently
// fail to converge, or can end up on the wrong branch.
// Evaluates W(x, 0) if principal is true, W(x, -1) if principal is false
function d_lambertw(z: PowiainaNum, t=1e-10, pr=true) {
  var tol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1e-10;
  var principal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var w;
  var ew, wewz, wn;

  if (z.isInfinite()) return z

  if (principal) {
    if (z.eq(PowiainaNum.ZERO)) {
      return PowiainaNum.ZERO.clone();
    }

    if (z.eq(PowiainaNum.ONE)) {
      //Split out this case because the asymptotic series blows up
      return PowiainaNum.fromNumber(OMEGA);
    } //Get an initial guess for Halley's method


    w = z.log();
  } else {
    if (z.eq(PowiainaNum.ZERO)) {
      return PowiainaNum.NEGATIVE_INFINITY.clone();
    } //Get an initial guess for Halley's method


    w = z.neg().log();
  } //Halley's method; see 5.9 in [1]


  for (var i = 0; i < 100; ++i) {
    ew = w.neg().exp();
    wewz = w.sub(z.mul(ew));
    wn = w.sub(wewz.div(w.add(1).sub(w.add(2).mul(wewz).div(w.mul(2).add(2)))));

    if (wn.sub(w).abs().lt(wn.abs().mul(tol))) {
      return wn;
    } else {
      w = wn;
    }
  }

  throw Error("Iteration failed to converge: ".concat(z.toString())); //return Decimal.dNaN;
}

export default class PowiainaNum implements IPowiainaNum {
  array: Operator[];
  small: boolean;
  sign: -1 | 0 | 1;
  layer: number;
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

    // calculate anything > e9e15 or <e-9e15, take absval bigger.
    if (
      x.abs().lt(PowiainaNum.E_MSI_REC) ||
      x.abs().gt(PowiainaNum.E_MSI) ||
      y.abs().lt(PowiainaNum.E_MSI_REC) ||
      y.abs().gt(PowiainaNum.E_MSI)
    ) {
      return x.maxabs(y);
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
    let mult = 1;
    if (
      !a.small &&
      !b.small &&
      !a.getOperator(1) &&
      !b.getOperator(1) &&
      a.sign == b.sign
    ) {
      return new PowiainaNum((a.getOperator(0) + b.getOperator(0)) * a.sign);
    }

    const alog10 =
      (a.small ? -1 : 1) *
      (a.getOperator(1) ? a.getOperator(0) : Math.log10(a.getOperator(0)));
    const blog10 =
      (b.small ? -1 : 1) *
      (b.getOperator(1) ? b.getOperator(0) : Math.log10(b.getOperator(0)));
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
      r.setOperator(1, 1);
      r.setOperator(Math.log10(Math.abs(l)), 1);
    } else {
      r.setOperator(10 ** Math.abs(l), 0);
    }
    r.small = l < 0 ? true : false;
    r.sign *= mult;
    return r;
  }

  public static add(t: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum {
    return new PowiainaNum(t).add(other);
  }

  public sub(a: PowiainaNumSource): PowiainaNum {
    return this.add(new PowiainaNum(a).neg());
  }

  public static sub(t: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum {
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

    if (
      x.isInfinite() &&
      y.eq(PowiainaNum.ZERO) &&
      y.isInfinite() &&
      x.eq(PowiainaNum.ZERO)
    )
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

    let r;

    r = x.abs().log10().add(y.abs().log10()).pow10();
    r.sign = (x.sign * y.sign) as 0 | -1 | 1;
    return r;
  }
  public static mul(t: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum {
    return new PowiainaNum(t).mul(other);
  }

  public div(other: PowiainaNumSource): PowiainaNum {
    const x = new PowiainaNum(other).rec();
    return this.mul(x);
  }
  public static div(t: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum {
    return new PowiainaNum(t).div(other);
  }
  
  public pow10(): PowiainaNum {
    const r = this.clone();
    // inf & nan check
    if (!this.isFinite()) return this.clone();

    if (r.lt(0)) {
      // 10^(-x) = 1/(10^x)
      r.sign *= -1;
      return r.pow10().rec();
    }
    if (r.small) {
      if (r.lt(PowiainaNum.MSI_REC)) return PowiainaNum.ONE;
      return new PowiainaNum(10 ** (r.getOperator(0) ** -1));
    }
    r.setOperator(r.getOperator(1) + 1, 1);
    r.normalize();
    return r;
  }
  public pow(x: PowiainaNumSource): PowiainaNum {
    const other = new PowiainaNum(x);

    if (!other.isFinite()) return other.clone();
    if (!this.isFinite()) return this.clone();

    if (this.eq(10)) return other.pow10();
    if (this.lt(0)) {
      if (!other.isInt()) return PowiainaNum.NaN.clone();
      let r = this.abs().pow(other);
      r.sign = (function () {
        let a = other.mod(2).round();
        if (a.eq(0) || a.eq(2)) return 1;
        return -1;
      })();

      return r;
    }
    // log10(a^b) = b log10(a)
    return this.log10().mul(other).pow10();
  }
  public pow_base(x: PowiainaNumSource): PowiainaNum {
    const a = new PowiainaNum(x);
    return a.pow(this);
  }
  public static pow(t: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum {
    return new PowiainaNum(t).pow(other);
  }

  public root(x: PowiainaNumSource): PowiainaNum {
    let other = new PowiainaNum(x);
    return this.pow(other.rec());
  }
  public static root(t: PowiainaNumSource, other: PowiainaNumSource): PowiainaNum {
    return new PowiainaNum(t).root(other);
  }

  public sqrt(): PowiainaNum {
    return this.pow(0.5);
  }
  
  public static sqrt(t: PowiainaNumSource): PowiainaNum {
    return new PowiainaNum(t).sqrt();
  }
  public cbrt(): PowiainaNum {
    return this.root(3);
  }
  public static cbrt(t: PowiainaNumSource): PowiainaNum {
    return new PowiainaNum(t).cbrt();
  }

  public abs(): PowiainaNum {
    let obj = this.clone();
    if (obj.sign < 0) obj.sign *= -1;
    return obj;
  }
  public log10(): PowiainaNum {
    if (this.lt(0)) return PowiainaNum.NaN.clone();
    if (this.isZero()) return PowiainaNum.NEGATIVE_INFINITY.clone();
    if (this.small) {
      let x = this.clone();
      x.small = !x.small;
      return x.log10().neg();
    }
    if (this.getOperator(1) == 0)
      return new PowiainaNum(Math.log10(this.getOperator(0)));
    let x = this.clone();
    x.setOperator(x.getOperator(1) - 1, 1);
    x.normalize();
    return x;
  }
  public static log10(t: PowiainaNumSource): PowiainaNum {
    return new PowiainaNum(t).log10();
  }
  public log(base: PowiainaNumSource=Math.E): PowiainaNum {
    // log_a b = log_x b / log_x a;
    const other = new PowiainaNum(base);
    return this.log10().div(other.log10());
  }
  public static log(t: PowiainaNumSource, base: PowiainaNumSource=Math.E): PowiainaNum {
    return new PowiainaNum(t).log(base);
  }
  public static exp(x: PowiainaNumSource): PowiainaNum {
    let y = new PowiainaNum(x);
    return y.pow_base(Math.E);
  }
  public exp(): PowiainaNum{
    return this.pow_base(Math.E)
  }
  public mod(x: PowiainaNumSource): PowiainaNum {
    const other = new PowiainaNum(x);

    const division = this.div(other);
    return division.sub(division.floor()).mul(other);
  }

  /**
   * For positive integers, X factorial (written as X!) equals X * (X - 1) * (X - 2) *... * 3 * 2 * 1. 0! equals 1.
   * This can be extended to real numbers (except for negative integers) via the gamma function, which is what this function does.
   */
  //[Code from break_eternity.js]
  public factorial(): PowiainaNum {
    if (this.abs().lt(MSI)) {
      return this.add(1).gamma();
    }  else if (this.abs().lt(PowiainaNum.E_MSI)) {
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
  public lambertw(princ=true): PowiainaNum {
    var principal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    if (this.lt(-0.3678794411710499)) {
      return PowiainaNum.NaN.clone(); //complex
    } else if (principal) {
      if (this.abs().lt("1e-300")) return new PowiainaNum(this);else if (this.small) {
        return PowiainaNum.fromNumber(f_lambertw(this.toNumber()));
      } else if (this.layer === 0) {
        return PowiainaNum.fromNumber(f_lambertw(this.sign * this.getOperator(0)));
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
        return PowiainaNum.fromNumber(f_lambertw(this.sign * this.getOperator(0), 1e-10, false));
      } else if (this.layer == 1) {
        return d_lambertw(this, 1e-10, false);
      } else {
        return this.neg().rec().lambertw().neg();
      }
    }
  }
  
  public static lambertw(x: PowiainaNumSource,principal=true): PowiainaNum {
    return new PowiainaNum(x).lambertw(principal);
  }


  public max(x: PowiainaNumSource): PowiainaNum {
    const other = new PowiainaNum(x);
    return this.lt(other) ? other.clone() : this.clone();
  }
  public min(x: PowiainaNumSource): PowiainaNum {
    const other = new PowiainaNum(x);
    return this.gte(other) ? other.clone() : this.clone();
  }
  public maxabs(x: PowiainaNumSource): PowiainaNum {
    const other = new PowiainaNum(x).abs();
    return this.abs().lt(other) ? other.clone() : this.clone();
  }
  public minabs(x: PowiainaNumSource): PowiainaNum {
    const other = new PowiainaNum(x).abs();
    return this.abs().gt(other) ? other.clone() : this.clone();
  }

  public cmpabs(x: PowiainaNumSource): -1 | 0 | 1 | 2 {
    const other = new PowiainaNum(x).abs();
    return this.abs().cmp(other);
  }

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
    r.setOperator(Math[this.sign == 1 ? "floor" : "ceil"](r.getOperator(0)), 0);
    return r;
  }
  public ceil(): PowiainaNum {
    if (this.isInt()) return this.clone();
    if (this.small) {
      if (this.sign == 1) return PowiainaNum.ONE.clone();
      else return PowiainaNum.ZERO.clone();
    }
    let r = this.abs();
    r.setOperator(Math[this.sign == 1 ? "ceil" : "floor"](r.getOperator(0)), 0);
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
    r.setOperator(Math.round(r.getOperator(0)), 0);
    r.sign = this.sign;
    return r;
  }
  /**
   * @returns if this<other, return -1, if this=other, return 0, if this>other, return 1, if this!<=>, return 2
   */
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
        [op2.megota, op2.expans, op2.arrow, op2.repeat],
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
  isInfinite(): boolean {
    return (
      Boolean(!this.small && !isFinite(this.getOperator(0))) || this.isNaN()
    );
  }
  isInt(): boolean {
    if (this.isZero()) return true;
    if (!this.small && Number.isInteger(this.getOperator(0))) return true;
    if (this.abs().gte(2 ** 52)) return true;
    return false;
  }
  /**
   * Normalize functions will make this number convert into standard format.(it also change `this`, like [].sort)
   * @returns normalized number
   */
  public normalize(): PowiainaNum {
    //TODO: normalize

    let renormalize = true;
    var x = this;
    for (let i = 0; i < this.array.length; i++) {
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
    do {
      renormalize = false;
      this.array.sort(function (a, b) {
        return compareTuples(
          [a.megota, a.expans, a.arrow],
          [b.megota, b.expans, b.arrow],
        );
      });
      for (i = 1; i < x.array.length; ++i) {
        // check 0 repeat count
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
        // check arrow 0 and brace count >=2
        if (x.array[i].arrow == 0 && x.array[i].expans >= 2) {
          x.array[i].arrow = Infinity;
          x.array[i].valuereplaced = 0;
          x.array[i].expans = x.array[i].expans - 1;
        }
      }
      for (let i = 1; i < this.array.length; i++) {
        if (this.array[i].repeat == 0) {
          this.array.splice(i, 1);
          i--;
        }
      }
      if (!x.array.length) {
        x.small = !x.small;
        x.array = [newOperator(Infinity)]; // if no array set zero
      }
      if (x.array.length > PowiainaNum.maxOps)
        x.array.splice(1, x.array.length - PowiainaNum.maxOps); // max operators check
      if (this.getOperator(1) >= 1 && this.getOperator(0) < MSI_LOG10) {
        console.log(this.array);
        this.setOperator(this.getOperator(1) - 1, 1);
        this.setOperator(10 ** this.getOperator(0), 0);
        renormalize = true;
      }
      if (this.getOperator(0) > MSI) {
        this.setOperator(this.getOperator(1) + 1, 1);
        this.setOperator(Math.log10(this.getOperator(0)), 0);
        renormalize = true;
      }
      if (this.array.length == 1 && this.array[0].repeat < 1) {
        this.array[0].repeat = 1 / this.array[0].repeat;
        this.small = !this.small;
        renormalize = true;
      }
      while (
        x.array.length >= 2 &&
        x.array[0].repeat == 1 &&
        x.array[1].repeat
      ) {
        // [1, [R=1, A=sth, E=sth, M=sth]]
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
        x.array[0].repeat < MSI &&
        x.array[1].arrow >= 2 &&
        x.array[1].repeat == 1
      ) {
        // [1e9, [R=1, A=2, sth, sth]]
        x.array.splice(
          1,
          1,
          newOperator(
            x.array[0].repeat,
            x.array[1].arrow - 1,
            x.array[1].expans,
            x.array[1].megota,
          ),
        );

        x.array[0].repeat = 10;
        renormalize = true;
      }
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
    } while (renormalize);
    return this;
  }

  /**
   * @returns number will return the index of the operator in array. return as x.5 if it's between the xth and x+1th operators.
   */
  getOperatorIndex(arrow: number, expans = 1, megota = 1) {
    for (let i = 0; i < this.array.length; i++) {
      let cmp = compareTuples(
        [this.array[i].megota, this.array[i].expans, this.array[i].arrow],
        [megota, expans, arrow],
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
  /**
   * @returns PowiainaNum a PowiainaNum object which deep copied from `this` object.
   */
  clone(): PowiainaNum {
    let obj = new PowiainaNum();
    obj.resetFromObject(this);
    return obj;
  }
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
  toNumber(): number {
    if (this.sign == -1) return -this.neg().toNumber();
    if (this.small) return 1 / this.rec().toNumber();

    if (this.getOperator(1) == 0) return this.getOperator(0);
    else if (this.getOperator(1) == 1) return 10 ** this.getOperator(0);
    return NaN;
  }
  toString(): string {
    if (this.isNaN()) return `NaN`;
    if (this.sign == -1) return `-${this.neg().toString()}`;
    if (this.small) {
      if (this.eq(PowiainaNum.ZERO)) return `0`;
      return `/${this.rec().toString()}`;
    }
    if (this.isInfinite()) return `Infinity`;

    // O^a (10{arrow,expans,megota})^repeation base
    let res = ``;
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
        calc = `${calc} `;
      }
      res += `${calc}`;
    }
    return res;
  }
  public static fromNumber(x: number): PowiainaNum {
    let obj = new PowiainaNum(); // NaN

    if (x < 0)
      obj.sign = -1; // negative
    else if (x == 0) obj.sign = 0;
    else if (x > 0) obj.sign = 1;
    let y = Math.abs(x);
    if (y >= MSI_REC && y < 1) {
      obj.small = true;
      obj.setOperator(1 / y, 0);
    } else if (y < MSI_REC) {
      obj.small = true;
      obj.setOperator(-Math.log10(y), 0);
      obj.setOperator(1, 1);
    } else {
      obj.setOperator(y, 0);
    }

    obj.normalize();
    return obj;
  }
  public static fromString(input: string) {
    if (!isPowiainaNum.test(input)) {
      throw powiainaNumError+"malformed input: "+input
    }
    var x = new PowiainaNum();
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
                newOperator(c, 2, expans, megota),
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
        if (x.array.length >= 2 && x.array[1].arrow == 1)
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
  public static fromObject(powlikeObject: IPowiainaNum) {
    let obj = new PowiainaNum();
    obj.array = [];
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
  /**
   * A property arary value for version 0.1.x PowiainaNum.
   */
  get arr01() {
    let res: [number, ...(([number, number, number, number]|["x", number, number, number]|[number, number, "x", number])[])] 
    = [0];
    for (let i = 0; i < this.array.length; i++) {
      if (i==0) res[0] = this.array[i].repeat;
      else {
        // @ts-ignore
        res[i]=[0,0,0,0]
        // @ts-ignore
        res[i][0] =this.array[i].arrow == Infinity ? "x" : this.array[i].arrow;
        // @ts-ignore
        res[i][1] =this.array[i].repeat;
        // @ts-ignore
        res[i][2] =this.array[i].expans == Infinity ? "x" : this.array[i].expans;
        // @ts-ignore
        res[i][3] =this.array[i].megota;
      }
    }
    return res;
  }
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
  public static readonly MSI = new PowiainaNum(MSI);
  public static readonly MSI_REC = (function () {
    let obj = new PowiainaNum(MSI);
    obj.small = true;
    return obj;
  })();
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

  public static readonly TRITRI = new PowiainaNum({
    small: false,layer:0,sign:1,
    array: [
      newOperator(3638334640023.7783, 0, 1, 1),
      newOperator(7625587484984, 1, 1, 1)
    ]
  })
  public static readonly GRAHAMS_NUMBER = new PowiainaNum("(10{!})^63 10^^^(10^)^7625597484984 3638334640023.7783")
  public static readonly POSITIVE_INFINITY = new PowiainaNum(Infinity);
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
  public static readonly maxOps = 100;
}
