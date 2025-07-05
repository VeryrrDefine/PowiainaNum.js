# PowiainaNum.js

A JavaScript library that handles arithmetic for numbers as large as {10,9e15,1,1,1,2}.

This reaches level f<sub>ω<sup>3</sup>+1</sub>.

Internally, it is represented as an sign,layer and array. Sign is 1 or -1. Array is \[n<sub>0</sub>,\[a<sub>0</sub>, a<sub>1</sub>, a<sub>2</sub>, a<sub>3</sub>], \[b<sub>0</sub>, b<sub>1</sub>, b<sub>2</sub>, b<sub>3</sub>], ...]. They together represents {10,{10,...{10,{10,{...{10, n<sub>0</sub>...}...},c<sub>0</sub>,c<sub>2</sub>,c<sub>3</sub>}...,b<sub>0</sub>,b<sub>2</sub>,b<sub>3</sub>},b<sub>0</sub>,b<sub>2</sub>,b<sub>3</sub>}.
(b<sub>1</sub> is how many {10, ... ,b<sub>0</sub>,b<sub>2</sub>,b<sub>3</sub>}'s )
Some codes snippet from [ExpantaNum.js by Naruyoko](https://github.com/Naruyoko/ExpantaNum.js)

Functions are as follows `abs, neg, add, sub, mul, div, rec, pow, exp, sqrt, cbrt, root, log10, logarithm, logBase, f_lambertw, d_lambertw, lambertw, tetrate, expansion(eps), multiExpansion(mulEps), powerExpansion(powEps), explosion(els), cmp, isFinite, isInfinite, isNaN,  iteratedlog,  iteratedslog,  iteratedexp, pentate, arrow`(some missing items that have not been fully developed)

## How does it come from
PowiainaNum.js是我基于ExpantaNum.js的基础上修改结构而得来的。我将原先的\[number, number\]\[\]结构改成了\[number,number,number,number\]\[\]结构，并将"x"特殊值运用在里面，再修改程序逻辑而得出来。
