# PowiainaNum.js

A JavaScript library that handles arithmetic for numbers as large as {10,9e15,1,1,1,2}.

This reaches level f<sub>ω<sup>3</sup>+1</sub>.

Internally, it is represented as an sign,layer, small and array. Sign is 1 or -1. It's 10{oper.arrow, oper.expans, oper.megota}, If arrow count or expans count is Infinite, the count replaces from the next operators.

Some codes snippet from [ExpantaNum.js by Naruyoko](https://github.com/Naruyoko/ExpantaNum.js)

Functions are as follows `abs, neg, add, sub, mul, div, rec, pow, sqrt, cbrt, root, log10, log, cmp, isFinite, isInfinite, isNaN`(some missing items that have not been fully developed)

## Using

The library exports a class,
Create a PowiainaNum.js object like this:

```javascript
import PowiainaNum from "powiaina_num.js"; // static import 
const { default: PowiainaNum } = await import("powiaina_num.js") // dynamic import

let a = new PowiainaNum(); // create PN.js number with NaN
let b = new PowiainaNum(3); // create PN.js number with number 3
let c = new PowiainaNum("1e114514"); // create PN.js number with number 10^114514

let d = new PowiainaNum(c); // create PN.js number from a PN.js number
```

Javascript operators will not work such as `+`, `-`, etc.
You should call the equivalent functions instead.

```javascript
let a = new PowiainaNum(114514);
let b = new PowiainaNum(1919810);

// Calculate a+b:
let c = a.add(b); // 1919810+114514

// Calculate a-b:
let c = a.sub(b);

a.mul(b); // a*b
a.div(b); // a/b
a.pow(b); // a^b

a.log10(); // log10(a)

// comparing PN.js numbers

a.lt(b); // a is less than b
a.gt(b); // a is greater than b
a.eq(b); // a is equals to b
```

## Future ideas

Extend `Operator` to nearly infinite keys to reach level f<sub>ω<sup>ω</sup></sub>

```typescript
interface Operator {
  /*P3*/ arrow: number;
  /*P4*/ expans: number;
  /*P5*/ megota: number;
  /*P6*/ powiaina: number;
  P7: number;
  .....

  repeat: number;

  valuereplaced?: -1 | 0 | 1 | 2 | ...
}
```
