# PowiainaNum.js

A JavaScript library that handles arithmetic for numbers as large as {10,9e15,1,1,1,2}.

This reaches level f<sub>ω<sup>3</sup>+1</sub>.

Internally, it is represented as an sign,layer small and array. Sign is 1 or -1.
Some codes snippet from [ExpantaNum.js by Naruyoko](https://github.com/Naruyoko/ExpantaNum.js)

Functions are as follows `abs, neg, add, sub, mul, div, rec, pow, exp, sqrt, cbrt, root, log10, logarithm, logBase, f_lambertw, d_lambertw, lambertw, tetrate, expansion(eps), multiExpansion(mulEps), powerExpansion(powEps), explosion(els), cmp, isFinite, isInfinite, isNaN,  iteratedlog,  iteratedslog,  iteratedexp, pentate, arrow`(some missing items that have not been fully developed)

## How does it come from
PowiainaNum.js是我基于ExpantaNum.js的基础上修改结构而得来的。我将原先的\[number, number\]\[\]结构改成了{
    arrow: number
    expans: number
    megota: number
    repeat: number
    valuereplaced: 0|1 //0-\> arrow, 1-\>expans
}\[\]特殊值运用在里面，再修改程序逻辑而得出来。
