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
  constructor(arg1?: number| IPowiainaNum) {
    this.array = [{arrow:0, expans:1, megota:1, repeat: NaN}]
    this.small = 0;
    this.sign = 0;
    this.layer=0;
    if (typeof arg1=="number") {
      let obj = PowiainaNum.fromNumber(arg1)
      this.resetFromObject(obj);
    }
    if (typeof arg1=="object") {
      let obj = PowiainaNum.fromObject(arg1)
      this.resetFromObject(obj);
    }
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
   *
   * @returns number will return the index of the operator in array. return as x.5 if it's between the xth and x+1th operators.
   */
  getOperatorIndex(arrow: number, expans=1, megota=1){
    for (let i = 0;i<this.array.length; i++){
      let cmp =  (compareTuples([megota,expans,arrow], [this.array[i].megota, this.array[i].expans,this.array[i].arrow]))
      if (cmp==0) return i // I find it was [xx,xxx,*xxx*,xxx]!
      if (cmp==1)return i-0.5 // It's between [xx, xx,xx*,?,*xx]!
    }
    return this.array.length-0.5
  }
  /**
   * @returns number repeats of operators with given arguments.
   */
  getOperator(arrow:number, expans=1, megota=1) {
    const index = this.getOperatorIndex(arrow, expans, megota)
    if (!(this.array[index])) return 0;
    return this.array[index].repeat;
  }

  /**
   * Modify the repeat of operator
   * @param number val the repeat of operator will modify to array.
   * @returns bool Is the operators array changed?
   */
  setOperator(val: number, arrow: number, expans=1, megota=1) {
    const index = this.getOperatorIndex(arrow, expans, megota)
    if (!(this.array[index])) {
      this.array.splice(Math.floor(index), 0, {
        arrow, expans, megota,
        valuereplaced: (expans===Infinity?1: arrow==Infinity?0:-1),
        repeat: val
      });
      return true;
    }
    this.array[index].repeat = val;
    return false
  }
  public static fromNumber(x: number):PowiainaNum {
    let obj = new PowiainaNum(); // NaN

    if (x < 0) obj.sign = -1 // negative
    else if (x == 0) obj.sign = 0;
    else if (x> 0) obj.sign = 1;
    let y = Math.abs(x)
    if (y<1) {
      obj.small = 1;
      obj.setOperator(1/y, 0)
    } else {
      obj.setOperator(y, 0)
    }
    
    obj.normalize()
    return obj
  }
  public static fromObject(powlikeObject: IPowiainaNum) {
    let obj  = new PowiainaNum();
    obj.array = []
    for (let i = 0; i<powlikeObject.array.length; i++) {
      obj.array[i] = {
        arrow: powlikeObject.array[i].arrow,
        expans: powlikeObject.array[i].expans,
        megota: powlikeObject.array[i].megota,
        repeat: powlikeObject.array[i].repeat,
        valuereplaced: powlikeObject.array[i].valuereplaced,
      }
    }
    obj.small = powlikeObject.small;
    obj.sign = powlikeObject.sign;
    obj.layer = powlikeObject.layer;
    return obj;
  }
  /**
   * @returns PowiainaNum a PowiainaNum object which deep copied from `this` object.
   */
  clone(): PowiainaNum {
    let obj = new PowiainaNum()
    obj.resetFromObject(this);
    return obj;
  }
  resetFromObject(powlikeObject: IPowiainaNum) {
    this.array = []
    for (let i = 0; i<powlikeObject.array.length; i++) {
      this.array[i] = {
        arrow: powlikeObject.array[i].arrow,
        expans: powlikeObject.array[i].expans,
        megota: powlikeObject.array[i].megota,
        repeat: powlikeObject.array[i].repeat,
        valuereplaced: powlikeObject.array[i].valuereplaced,
      }
    }
    this.small = powlikeObject.small;
    this.sign = powlikeObject.sign;
    this.layer = powlikeObject.layer;
    return this;
  }
  public static readonly ZERO = new PowiainaNum({
    array: [{
      arrow: 0,
      expans: 1,
      megota: 1,
      repeat: Infinity
    }],
    small: 1,
    layer: 0,
    sign: 0,
  });
  public static readonly ONE = new PowiainaNum({
    array: [{
      arrow: 0,
      expans: 1,
      megota: 1,
      repeat: 1
    }],
    small: 0,
    layer: 0,
    sign: 1,
  });
}
