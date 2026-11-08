import { LONG_STRING_MIN_LENGTH, OMEGA } from "./constants";
import {
  ExpantaNumArray,
  IBreakEternity,
  Operator,
  PowiainaNumArray01X,
} from "./types";

export function newOperator(r: number, a = 0, e = 1, m = 1): Operator {
  return {
    repeat: r,
    arrow: a,
    expans: e,
    megota: m,
  };
}
export function removeCommasOutsideBraces(input: string): string {
  let result = "";
  let inBraces = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === "{") {
      inBraces = true;
      result += char;
    } else if (char === "}") {
      inBraces = false;
      result += char;
    } else if (char === ",") {
      // 只有在花括号内部才保留逗号
      if (inBraces) {
        result += char;
      }
      // 如果在花括号外部，就不添加到结果中（相当于删除）
    } else {
      result += char;
    }
  }

  return result;
}

export function isIBreakEternity(obj: unknown): obj is IBreakEternity {
  if (obj === null || typeof obj !== "object") return false;
  if (!("mag" in obj && typeof obj.mag == "number")) return false;
  if (!("layer" in obj && typeof obj.layer == "number")) return false;
  if (!("sign" in obj && typeof obj.sign == "number")) return false;

  return true;
}
// parse 0.1.x PowiainaNum.js string
export function parseLegacyPowiainaNumString(str: string) {
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

/**
 * 如果左边小于右边的，返回-1,等于就是0，大于就是1
 * @returns
 */
export function compareTuples<T extends Array<number>>(
  ...tuples: [T, T]
): -1 | 0 | 1 {
  for (let i = 0; i < Math.min(tuples[0].length, tuples[1].length); i++) {
    const a = tuples[0][i];
    const b = tuples[1][i];
    if (a < b) return -1;
    if (a > b) return 1;
  }
  return 0;
}
export function replaceETo10(str: string) {
  // 使用正则表达式匹配 (e^数字) 的模式
  // 正则解释：\(e\^(\d+)\) 匹配 (e^数字)，其中 \d+ 匹配一个或多个数字
  return str
    .replace(/\(e\^(\d+)\)/g, "(10^)^$1 ")
    .replace(/(\d+)[Pp][Tt]/g, "(10^)^$1 ");
}
/**
 * 把一个字符串很长的数进行以10为底的对数
 * @param str 被进行的字符串
 * @returns 字符串以10为底的对数；
 */
export function log10LongString(str: string) {
  return (
    Math.log10(Number(str.substring(0, LONG_STRING_MIN_LENGTH))) +
    (str.length - LONG_STRING_MIN_LENGTH)
  );
}

// Code from break_eternity.js
export function f_gamma(n: number) {
  if (!isFinite(n)) {
    return n;
  }

  if (n < -50) {
    if (n === Math.trunc(n)) {
      return Number.NEGATIVE_INFINITY;
    }

    return 0;
  }

  let scal1 = 1;

  while (n < 10) {
    scal1 = scal1 * n;
    ++n;
  }

  n -= 1;
  let l = 0.9189385332046727; //0.5*Math.log(2*Math.PI)

  l = l + (n + 0.5) * Math.log(n);
  l = l - n;
  const n2 = n * n;
  let np = n;
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

export const f_maglog10 = function (n: number) {
  return Math.sign(n) * Math.log10(Math.abs(n));
};

export function f_lambertw(z: number, t = 1e-10, pr = true) {
  const tol = t;
  const principal = pr;
  let w;
  let wn;

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

  for (let i = 0; i < 100; ++i) {
    wn = (z * Math.exp(-w) + w * w) / (w + 1);

    if (Math.abs(wn - w) < tol * Math.abs(wn)) {
      return wn;
    } else {
      w = wn;
    }
  }

  throw Error("Iteration failed to converge: ".concat(z.toString())); //return Number.NaN;
}
export function isTwoLengthArray(x: unknown[]): x is [unknown, unknown] {
  return x.length == 2;
}
export function isTwoNumberArray(x: [unknown, unknown]): x is [number, number] {
  return typeof x[0] === "number" && typeof x[1] === "number";
}
export function isExpantaNumArray(x: unknown): x is ExpantaNumArray {
  if (!Array.isArray(x)) return false;
  for (let i = 0; i < x.length; i++) {
    const arr = x[i];
    if (!Array.isArray(arr)) return false;
    if (!isTwoLengthArray(arr)) return false;
    if (!isTwoNumberArray(arr)) return false;
  }
  return true;
}
export function replaceXToInfinity(x: "x" | number): number {
  if (x === "x") return Infinity;
  return x;
}
export function isFourLengthArray(
  x: unknown[],
): x is [unknown, unknown, unknown, unknown] {
  return x.length == 4;
}
export function isFourNumberArray(
  x: [unknown, unknown, unknown, unknown],
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
export function isFourArrayWithFirstTermX(
  x: [unknown, unknown, unknown, unknown],
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
export function isFourArrayWithThirdTermX(
  x: [unknown, unknown, unknown, unknown],
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
export function isPowiainaNum01XArray(x: unknown): x is PowiainaNumArray01X {
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
export function countLeadingZerosAfterDecimal(numStr: string) {
  const match = numStr.match(/^0\.(0*)[1-9]/);
  return match ? match[1].length : 0;
}

export function arraySortFunction(a: Operator, b: Operator) {
  return compareTuples(
    [a.megota, a.expans, a.arrow],
    [b.megota, b.expans, b.arrow],
  );
}

export function mergeSameArrays<T>(
  x: T extends {
    array: Operator[];
  }
    ? T
    : never,
) {
  for (let i = 1; i < x.array.length - 1; ++i) {
    let q = x.array[i];
    let r = x.array[i + 1];
    if (q.arrow == r.arrow && q.expans == r.expans && q.megota == r.megota) {
      // same array's merge
      q.repeat += r.repeat;
      x.array.splice(i + 1, 1);
      --i;
    }
  }
}

export function log10PosBigInt(input: bigint) {
  var exp = BigInt(64);
  while (input >= BigInt(1) << exp) exp *= BigInt(2);
  var expdel = exp / BigInt(2);
  while (expdel > BigInt(0)) {
    if (input >= BigInt(1) << exp) exp += expdel;
    else exp -= expdel;
    expdel /= BigInt(2);
  }
  var cutbits = exp - BigInt(54);
  var firstbits = input >> cutbits;
  return (
    Math.log10(Number(firstbits)) + (Math.LOG10E / Math.LOG2E) * Number(cutbits)
  );
}
