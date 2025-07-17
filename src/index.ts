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
  small: 0 | 1; // when small = 1, the number is reciprocated.
  sign: -1 | 0 | 1; // when sign=-1, the number is negative, sign=0=>zero, sign=1=>positive
  layer: number; // actions like ExpantaNum.js, but use {10, 10, 10, 10, ..} instead of {10, 10, x}
}

const MSI = 2**53-1;
const MSI_LOG10 = Math.log10(MSI);
export type PowiainaNumSource = number | IPowiainaNum | PowiainaNum;

function compareTuples<T extends Array<any>>(...tuples: [T, T]): -1 | 0 | 1 {
  for (let i = 0; i < Math.min(tuples[0].length, tuples[1].length); i++) {
    const a = tuples[0][i];
    const b = tuples[1][i];
    if (a < b) return -1;
    if (a > b) return 1;
  }
  return 0;
}

export default class PowiainaNum implements IPowiainaNum {
  array: Operator[];
  small: 0 | 1;
  sign: -1 | 0 | 1;
  layer: number;
  constructor(arg1?: PowiainaNumSource) {
    this.array = [{ arrow: 0, expans: 1, megota: 1, repeat: NaN }];
    this.small = 0;
    this.sign = 0;
    this.layer = 0;
    if (typeof arg1 == "undefined"){
    } else if (typeof arg1 == "number") {
      let obj = PowiainaNum.fromNumber(arg1);
      this.resetFromObject(obj);
    } else if (typeof arg1 == "object") {
      let obj = PowiainaNum.fromObject(arg1);
      this.resetFromObject(obj);
    } else {
      let isn: never = arg1
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
    if ((x.eq(PowiainaNum.POSITIVE_INFINITY) && y.eq(PowiainaNum.NEGATIVE_INFINITY))
      || (x.eq(PowiainaNum.NEGATIVE_INFINITY) && y.eq(PowiainaNum.POSITIVE_INFINITY))
      ) return PowiainaNum.NaN.clone();

    // inf & nan check
    if (!x.isFinite()) return x.clone();
    if (!y.isFinite()) return y.clone();
    
    // if x or y = 0, return other.
    if (x.isZero()) return y.clone();
    if (y.isZero()) return x.clone();

    // x+ -x = 0
    if (x.sign==-y.sign&&(function(){
      let a = x.abs();
      let b = y.abs();
      return a.eq(b)
    })()) return PowiainaNum.ZERO.clone();

    // calculate anything > e9e15 or <e-9e15, take absval bigger.
    if (x.abs().lt(PowiainaNum.E_MSI_REC) || x.abs().gt(PowiainaNum.E_MSI)
      || y.abs().lt(PowiainaNum.E_MSI_REC) || y.abs().gt(PowiainaNum.E_MSI)) {
      return x.maxabs(y)
    }
    if (x.sign == -1)  {
      return x.neg().add(y.neg()).neg()
    }
    
    let a, b; //a=bigger, b=smaller
    
    if (x.cmpabs(y)>0) {
      a = x; b = y;
    } else {
      b = x; a = y;
    }

    if (!a.small && !b.small && !a.getOperator(1) && !b.getOperator(1)) {
      return new PowiainaNum(a.getOperator(0) + b.getOperator(0))
    }

    const alog10 = (a.small?-1: 1) * (a.getOperator(1) ? a.getOperator(0) : Math.log10(a.getOperator(0)))
    const blog10 = (b.small?-1: 1) * (b.getOperator(1) ? b.getOperator(0) : Math.log10(b.getOperator(0)))
    if (alog10-blog10 > MSI_LOG10 ) return a;

    const offset= -Math.floor(alog10) //a number can make a+off in [0,1)
  
    let r,l=0;
    if (a.sign==1 && b.sign == -1) {
      l=Math.log10(10**(alog10+offset)-10**(blog10+offset))-offset
    }

    if (a.sign==1 && b.sign == 1) {
      l=Math.log10(10**(alog10+offset)+10**(blog10+offset))-offset
    }
    r = new PowiainaNum();
    
    r.sign = 1;
    if (l > MSI_LOG10 || l < -MSI_LOG10) {
      r.setOperator(1, 1)
      r.setOperator(Math.log10(Math.abs(l)), 1);
    } else {
      r.setOperator(10**Math.abs(l), 0)
    }
    r.small =l<0?1:0;
    return r;
  }
  
  public abs(): PowiainaNum {
    let obj = this.clone();
    if (obj.sign<0) obj.sign*=-1;
    return obj;

  }
  public max(x: PowiainaNumSource): PowiainaNum {const other = new PowiainaNum(x); return this.lt(other)?other.clone():this.clone()}
  public min(x: PowiainaNumSource): PowiainaNum {const other = new PowiainaNum(x); return this.gte(other)?other.clone():this.clone()}
  public maxabs(x: PowiainaNumSource): PowiainaNum {const other = new PowiainaNum(x).abs(); return this.abs().lt(other)?other.clone():this.clone()}
  public minabs(x: PowiainaNumSource): PowiainaNum {const other = new PowiainaNum(x).abs(); return this.abs().gt(other)?other.clone():this.clone()}

  public cmpabs(x: PowiainaNumSource): -1|0|1|2 {const other = new PowiainaNum(x).abs(); return this.abs().cmp(other)}

  public neg(): PowiainaNum {
    let a= this.clone();
    a.sign *=-1;
    a.normalize();
    return a;
  }
  /**
   * @returns if this<other, return -1, if this=other, return 0, if this>other, return 1, if this!<=>, return 2
   */
  compare(x: PowiainaNumSource): -1|0|1|2 {
    const other = new PowiainaNum(x)
    if (this.isNaN() || other.isNaN()) return 2;

    if (this.sign<other.sign) return -1;
    if (this.sign>other.sign) return 1;
    //this.sign = other.sign
    const allneg = this.sign==-1&&other.sign==-1
    if (this.small==1 && other.small==0) return -1 * (allneg?-1:1) as -1|1;
    if (other.small==1 && this.small==0) return 1 * (allneg?-1:1) as -1|1;

    let resultreverse = 1;
    if (this.small==1&&other.small==1) resultreverse*=-1;
    if (allneg) resultreverse*=-1;


    let result = 0;

    for (let i = 0; this.array.length-1-i>=0 && other.array.length-1-i>=0; i++) {
      let op1 = this.array[this.array.length-1-i];
      let op2 = other.array[other.array.length-1-i];
      let cmp = compareTuples(
        [op1.megota, op1.expans, op1.arrow, op1.repeat],
        [op2.megota, op2.expans, op2.arrow, op2.repeat],
      );
      if (cmp == 1) { result = 1; break; }
      else if (cmp == -1) { result = -1; break; }
    }

    return (result*resultreverse)+1-1 as -1|0|1;
  }
  cmp(other: PowiainaNumSource): -1|0|1|2 {
    return this.compare(other)
  }
  
  eq(other: PowiainaNumSource): boolean { return this.cmp(other)===0 }
  neq(other: PowiainaNumSource): boolean { return this.cmp(other)!==0 }
  lt(other: PowiainaNumSource): boolean { return this.cmp(other)===-1 }
  lte(other: PowiainaNumSource): boolean { return this.cmp(other)<=0 }
  gt(other: PowiainaNumSource): boolean { return this.cmp(other)==1 }
  gte(other: PowiainaNumSource): boolean { 
    let t = this.cmp(other) 
    return t==0||t==1;
  }

  isNaN(): boolean{
    return isNaN(this.getOperator(0))
  }
  isZero(): boolean {
    return Boolean(this.small && !isFinite(this.getOperator(0)))
  }
  isFinite(): boolean {
    return Boolean(this.small!=0||isFinite(this.getOperator(0))) && !this.isNaN()
  }
  isInfinite(): boolean {
    return Boolean(this.small==0&&!isFinite(this.getOperator(0))) || this.isNaN()
  }
  /**
   * Normalize functions will make this number convert into standard format.(it also change `this`, like [].sort)
   * @returns normalized number
   */
  normalize(): PowiainaNum {
    //TODO: normalize
    let renormalize = true;
    do {
      renormalize = false;
    } while (renormalize);
    return this;
  }

  /**
   * @returns number will return the index of the operator in array. return as x.5 if it's between the xth and x+1th operators.
   */
  getOperatorIndex(arrow: number, expans = 1, megota = 1) {
    for (let i = 0; i < this.array.length; i++) {
      let cmp = compareTuples(
        [megota, expans, arrow],
        [this.array[i].megota, this.array[i].expans, this.array[i].arrow],
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
    const index = this.getOperatorIndex(arrow, expans, megota);
    if (!this.array[index]) {
      this.array.splice(Math.floor(index), 0, {
        arrow,
        expans,
        megota,
        valuereplaced: expans === Infinity ? 1 : arrow == Infinity ? 0 : -1,
        repeat: val,
      });
      return true;
    }
    this.array[index].repeat = val;
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
  public static fromNumber(x: number): PowiainaNum {
    let obj = new PowiainaNum(); // NaN

    if (x < 0)
      obj.sign = -1; // negative
    else if (x == 0) obj.sign = 0;
    else if (x > 0) obj.sign = 1;
    let y = Math.abs(x);
    if (y < 1) {
      obj.small = 1;
      obj.setOperator(1 / y, 0);
    } else {
      obj.setOperator(y, 0);
    }

    obj.normalize();
    return obj;
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
  public static readonly ZERO = new PowiainaNum({
    array: [
      {
        arrow: 0,
        expans: 1,
        megota: 1,
        repeat: Infinity,
      },
    ],
    small: 1,
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
    small: 0,
    layer: 0,
    sign: 1,
  });
  public static readonly MSI = new PowiainaNum(MSI)
  public static readonly MSI_REC = (function(){
    let obj = new PowiainaNum(MSI);
    obj.small=1;
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
      { arrow: 1, expans:1, megota:1, repeat: 1}
    ],
    small: 0,
    layer: 0,
    sign: 1,
  
  })
  public static readonly E_MSI_REC = new PowiainaNum({
    array: [
      {
        arrow: 0,
        expans: 1,
        megota: 1,
        repeat: MSI,
      },
      { arrow: 1, expans:1, megota:1, repeat: 1}
    ],
    small: 1,
    layer: 0,
    sign: 1,
  
  })
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
    small: 0,
    layer: 0,
    sign: 0,
  
  })
}
