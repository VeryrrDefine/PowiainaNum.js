# PowiainaNum.js

[![npm](https://img.shields.io/npm/v/powiaina_num.js.svg)](https://www.npmjs.com/package/powiaina_num.js)

A JavaScript library that handles arithmetic for numbers as large as {10,9e15,1,1,1,2}.

This reaches level f<sub>ω<sup>3</sup>+1</sub>, which the operation [powiaination](https://googology.fandom.com/wiki/Powiaination) also is at, hence the name.

Internally, it is represented as an sign, array, small, and layer. Sign is 1 or -1. . Layer is a non-negative integer. 

The operator interface is `interface {arrow: number; expans: number; megota: number; repeat: number;}`;

The array is an array types `Operator[]`

when $$f(x) = \{10, 10, 10, 10, x\}$$
$$g_{a,b,c}(x) = \text{a,b is not Infinity}=\{10,x,a,b,c\},\text{a is Infinity}=\{10,10,x,b,c\},\text{b is Infinity}=\{10,10,10,x,c\}$$
$$o_x = \text{last }x\text{th operator of array}  $$
$$s_{ign} = \text{PN's sign property}$$
$$l_{ayer} = \text{PN's layer property}$$
$$e_{xp} = \text{if PN's small property is false, }e_{xp}=1,\text{Otherwise,}e_{xp}=-1$$
They together respents $(s_{ign}\times f^{l_{ayer}} g_{o_1.arrow, o_1.expans, o_1.megota}^{o_1.repeat} g_{o_2.arrow, o_2.expans, o_2.megota}^{o_2.repeat} ...)^{e_{xp}}$

If arrow count or expans count is Infinite, the count replaces to the next operators.

Some codes snippet from [ExpantaNum.js by Naruyoko](https://github.com/Naruyoko/ExpantaNum.js)

Functions are as follows `abs, neg, add, sub, mul, div, rec, pow, pow10, pow_base, sqrt, cbrt, root, log10, log, cmp, rec, gamma, mod, exp, ln, slog, factorial, tetrate_10, isFinite, isInfinite, isNaN, tetrate, lambertw, toString, toJSON, floor, ceil, round, trunc, clampMax, clampMin, arrow, expansion, expansionArrow, multiExpansion, powerExpansion, explosion, megotion, BEAF, powiaination`

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

let e = new PowiainaNum([[0,23.2352],[1,2],[2,6],[3,0],[4,1],[5,4]]); // You can also use a pair number array which from ExpantaNum.js

let f = new PowiainaNum("(10^^^)^114514 e1919810") // ExpantaNum.js string form 

let g = new PowiainaNum("10{!}e1919810") // 10{!} = 10{x}10, x points to e1919810, 10{!} = J in ExpantaNum.js
let h = new PowiainaNum("10{1,2}ee114514") // {10, ee114514, 1, 2}
let i = new PowiainaNum("10{1,514,114}ee114514") // {10, ee114514, 1, 514, 114}
let j = new PowiainaNum("/10{1,514,114}ee114514") // Very small numbers ({10, ee114514, 1, 514, 114})^-1
let k = new PowiainaNum("(e^114514)1919810") // break_eternity.js (e^x) form
```

In browser, you can download `dist/PowiainaNum.min.js` or use 
```html
<script src="https://unpkg.com/powiaina_num.js@alpha"></script>
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

## Developing

Clone this project and then run `npm install`.

### Build project
Run `npm run build` to build this project, js files will produce in `dist` directory.

### Test project
Run `npm test` to test this project.

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
