//Code snippets and templates from ExpantaNum.js


//const ExpantaNum = require("../hyper-volume-incremental-v1/assets/scripts/technical/ExpantaNum");

; (function (globalScope) {
    var PowiainaNum = {
        maxOps: 100,

        // Specify what format is used when serializing for JSON.stringify
        // 
        // JSON   0 JSON object
        // STRING 1 String
        serializeMode: 1,

        // Deprecated
        // Level of debug information printed in console
        // 
        // NONE   0 Show no information.
        // NORMAL 1 Show operations.
        // ALL    2 Show everything.
        debug: 0,


    },
    external = true,

    powiainaNumError = "[PowiainaNumError] ",
    invalidArgument = powiainaNumError + "Invalid argument: ",


    MAX_SAFE_INTEGER = 9007199254740991,
    MAX_E = Math.log10(MAX_SAFE_INTEGER), //15.954589770191003

    //PowiainaNum.prototype object
    P = {},

    //PowiainaNum static object
    Q = {},

    R = {};

    //#region PowiainaNum constants
    R.ZERO = 0;
    R.ONE = 1;
    R.NaN = NaN;

    R.E = Math.E;
    R.LN2 = Math.LN2;
    R.LN10 = Math.LN10;
    R.LOG2E = Math.LOG2E;
    R.LOG10E = Math.LOG10E;
    R.PI = Math.PI;
    R.SQRT1_2 = Math.SQRT1_2;
    R.SQRT2 = Math.SQRT2;
    R.MAX_SAFE_INTEGER = MAX_SAFE_INTEGER;
    R.MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;
    R.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
    R.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
    R.E_MAX_SAFE_INTEGER = "l0 s1 a[" + MAX_SAFE_INTEGER + ",[1,1,1,1]]";
    R.EE_MAX_SAFE_INTEGER = "l0 s1 a[" + MAX_SAFE_INTEGER + ",[1,2,1,1]]";
    R.TETRATED_MAX_SAFE_INTEGER = "l0 s1 a[10000000000,[1," + (MAX_SAFE_INTEGER - 1).toString() + ",1,1]]";
    R.PENTATED_MAX_SAFE_INTEGER = "l0 s1 a[10000000000,[2," + (MAX_SAFE_INTEGER - 1).toString() + ",1,1]]";

    R.GRAHAMS_NUMBER = "l0 s1 a[3638334640023.7783,[1,7625597484984,1,1],[3,1,1,1],[\"x\",63,1,1]]"

    //#endregion

    //#region calculating


    //#region four basic calculating
    //#region plus
    P.plus = P.add = function (other) {
        var x = this.clone();
        other = new PowiainaNum(other);
        if (PowiainaNum.debug >= PowiainaNum.NORMAL) {
            console.log(this, "calculate add", other);
        }
        if (x.sign == -1) return x.neg().add(other.neg()).neg();
        if (other.sign == -1) return x.sub(other.neg());

        if (x.eq(PowiainaNum.ZERO)) return other; // 0+x
        if (other.eq(PowiainaNum.ZERO)) return x;
        if (x.isNaN() || other.isNaN() || x.isInfinite() && other.isInfinite() && x.eq(other.neg())) return PowiainaNum.NaN.clone();
        if (x.isInfinite()) return x;
        if (other.isInfinite()) return other;

        var p = x.min(other); // who is smallest
        var q = x.max(other); // who is biggest
        var op0 = q.operatorE(0);
        var op1 = q.operatorE(1);

        var t;

        if (q.gt(PowiainaNum.E_MAX_SAFE_INTEGER) || q.div(p).gt(PowiainaNum.MAX_SAFE_INTEGER)) {
            t = q;
        } else if (!op1) {
            t = new PowiainaNum(x.toNumber() + other.toNumber());
        } else if (op1 == 1) {
            var a = p.operator(1) ? p.operator(0) : Math.log10(p.operator(0));
            t = new PowiainaNum(a + Math.log10(Math.pow(10, op0 - a) + 1));
            t = PowiainaNum.pow(10, t);
        }
        p = q = null;
        return t;
    }

    Q.plus = Q.add = function (x, y) {
        return new PowiainaNum(x).add(y);
    };
    //#endregion

    //#region minus
    P.minus = P.sub = function (other) {
        var x = this.clone();
        other = new PowiainaNum(other);
        if (PowiainaNum.debug >= PowiainaNum.NORMAL) console.log(x + "-" + other);
        if (x.sign == -1) return x.neg().sub(other.neg()).neg();
        if (other.sign == -1) return x.add(other.neg());
        if (x.eq(other)) return PowiainaNum.ZERO.clone();
        if (other.eq(PowiainaNum.ZERO)) return x;
        if (x.isNaN() || other.isNaN() || x.isInfinite() && other.isInfinite()) return PowiainaNum.NaN.clone();
        if (x.isInfinite()) return x;
        if (other.isInfinite()) return other.neg();
        var p = x.min(other);
        var q = x.max(other);
        var n = other.gt(x);
        var op0 = q.operator(0);
        var op1 = q.operator(1);
        var t;
        if (q.gt(PowiainaNum.E_MAX_SAFE_INTEGER) || q.div(p).gt(PowiainaNum.MAX_SAFE_INTEGER)) {
        t = q;
        t = n ? t.neg() : t;
        } else if (!op1) {
        t = new PowiainaNum(x.toNumber() - other.toNumber());
        } else if (op1 == 1) {
        var a = p.operator(1) ? p.operator(0) : Math.log10(p.operator(0));
        t = new PowiainaNum(a + Math.log10(Math.pow(10, op0 - a) - 1));
        t = PowiainaNum.pow(10, t)
        t = n ? t.neg() : t;
        }
        p = q = null;
        return t;
    };
    Q.minus = Q.sub = function (x, y) {
        return new PowiainaNum(x).sub(y);
    };
    //#endregion

    //#region times
    P.times = P.mul = function (other) {
        var x = this.clone();
        other = new PowiainaNum(other);
        if (PowiainaNum.debug >= PowiainaNum.NORMAL) console.log(x + "*" + other);
        if (x.sign * other.sign == -1) return x.abs().mul(other.abs()).neg();
        if (x.sign == -1) return x.abs().mul(other.abs());
        if (x.isNaN() || other.isNaN() || x.eq(PowiainaNum.ZERO) && other.isInfinite() || x.isInfinite() && other.abs().eq(PowiainaNum.ZERO)) return PowiainaNum.NaN.clone();
        if (other.eq(PowiainaNum.ZERO)) return PowiainaNum.ZERO.clone();
        if (other.eq(PowiainaNum.ONE)) return x.clone();
        if (x.isInfinite()) return x;
        if (other.isInfinite()) return other;
        if (x.max(other).gt(PowiainaNum.EE_MAX_SAFE_INTEGER)) return x.max(other);
        var n = x.toNumber() * other.toNumber();
        if (n <= MAX_SAFE_INTEGER) return new PowiainaNum(n);
        return PowiainaNum.pow(10, x.log10().add(other.log10()));
    };
    Q.times = Q.mul = function (x, y) {
        return new PowiainaNum(x).mul(y);
    };

    //#endregion

    //#region division

    P.divide = P.div = function (other) {
        var x = this.clone();
        other = new PowiainaNum(other);
        if (PowiainaNum.debug >= PowiainaNum.NORMAL) console.log(x + "/" + "other");
        if (x.sign * other.sign == -1) return x.abs().div(other.abs()).neg();
        if (x.sign == -1) return x.abs().div(other.abs());
        if (x.isNaN() || other.isNaN() || x.isInfinite() && other.isInfinite() || x.eq(PowiainaNum.ZERO) && other.eq(PowiainaNum.ZERO)) return PowiainaNum.NaN.clone();
        if (other.eq(PowiainaNum.ZERO)) return PowiainaNum.POSITIVE_INFINITY.clone();
        if (other.eq(PowiainaNum.ZERO)) return PowiainaNum.ONE.clone();
        if (x.isInfinite()) return x;
        if (other.isInfinite()) return PowiainaNum.ZERO.clone();
        if (x.max(other).gt(PowiainaNum.EE_MAX_SAFE_INTEGER)) return x.gt(other) ? x.clone() : PowiainaNum.ZERO.clone();
        var n = x.toNumber() / other.toNumber();
        if (n <= MAX_SAFE_INTEGER) return new PowiainaNum(n);

        var pw = PowiainaNum.pow(10, x.log10().sub(other.log10()));

        var fp = pw.floor();
        if (pw.sub(fp).lt(new PowiainaNum(1e-9))) return fp;
        return pw;
    }
    Q.divide = Q.div = function (x, y) {
        return new PowiainaNum(x).div(y);
    };
    P.reciprocate = P.rec = function () {
    if (PowiainaNum.debug >= PowiainaNum.NORMAL) console.log(this + "^-1");
    if (this.isNaN() || this.eq(PowiainaNum.ZERO)) return PowiainaNum.NaN.clone();
    if (this.abs().gt("2e323")) return PowiainaNum.ZERO.clone();
    return new PowiainaNum(1 / this);
    };
    Q.reciprocate = Q.rec = function (x) {
    return new PowiainaNum(x).rec();
    };


    //#endregion
    //#endregion

    //#region power, root, logarithm, iteratedlog, iteratedexp, iterated slog
        P.toPower = P.pow = function(other) {
            other = new PowiainaNum(other);
            if(PowiainaNum.debug >= PowiainaNum.NORMAL) console.log(this + "^" + other);
            if(other.eq(PowiainaNum.ZERO)) return PowiainaNum.ONE.clone();
            if(other.eq(PowiainaNum.ONE)) return this.clone();
            if(other.lt(PowiainaNum.ZERO)) return this.pow(other.neg()).rec();
            if(this.lt(PowiainaNum.ZERO) && other.isint()) {
            if(other.mod(2).lt(PowiainaNum.ONE)) return this.abs().pow(other);
            return this.abs().pow(other).neg();
            }
            if(this.lt(PowiainaNum.ZERO)) return PowiainaNum.NaN.clone();
            if(this.eq(PowiainaNum.ONE)) return PowiainaNum.ONE.clone();
            if(this.eq(PowiainaNum.ZERO)) return PowiainaNum.ZERO.clone();
            if(this.max(other).gt(PowiainaNum.TETRATED_MAX_SAFE_INTEGER)) return this.max(other);
            if(this.eq(10)) {
            if(other.gt(PowiainaNum.ZERO)) {
                other.operatorE(1, (other.operatorE(1) + 1) || 1);
                other.normalize();
                return other;
            } else {
                return new PowiainaNum(Math.pow(10, other.toNumber()));
            }
            }
            if(other.lt(PowiainaNum.ONE)) return this.root(other.rec());
            var n = Math.pow(this.toNumber(), other.toNumber());
            if(n <= MAX_SAFE_INTEGER) return new PowiainaNum(n);
            return PowiainaNum.pow(10, this.log10().mul(other));   
        }
        Q.toPower = Q.pow = function(x, y) {
            return new PowiainaNum(x).pow(y);
        };
        P.exponential = P.exp = function() {
            return PowiainaNum.pow(Math.E, this);
        };
        Q.exponential = Q.exp = function(x) {
            return PowiainaNum.pow(Math.E, x);
        };
        P.squareRoot = P.sqrt = function() {
            return this.root(2);
        };
        Q.squareRoot = Q.sqrt = function(x) {
            return new PowiainaNum(x).root(2);
        };
        P.cubeRoot = P.cbrt = function() {
            return this.root(3);
        };
        Q.cubeRoot = Q.cbrt = function(x) {
            return new PowiainaNum(x).root(3);
        };
        P.root = function(other) {
            other = new PowiainaNum(other);
            if(PowiainaNum.debug >= PowiainaNum.NORMAL) console.log(this + "root" + other);
            if(other.eq(PowiainaNum.ONE)) return this.clone();
            if(other.lt(PowiainaNum.ZERO)) return this.root(other.neg()).rec();
            if(other.lt(PowiainaNum.ONE)) return this.pow(other.rec());
            if(this.lt(PowiainaNum.ZERO) && other.isint() && other.mod(2).eq(PowiainaNum.ONE)) return this.neg().root(other).neg();
            if(this.lt(PowiainaNum.ZERO)) return PowiainaNum.NaN.clone();
            if(this.eq(PowiainaNum.ONE)) return PowiainaNum.ONE.clone();
            if(this.eq(PowiainaNum.ZERO)) return PowiainaNum.ZERO.clone();
            if(this.max(other).gt(PowiainaNum.TETRATED_MAX_SAFE_INTEGER)) return this.gt(other) ? this.clone() : PowiainaNum.ZERO.clone();
            return PowiainaNum.pow(10, this.log10().div(other));
        };
        Q.root = function(x, y) {
            return new PowiainaNum(x).root(y);
        };
        P.generalLogarithm = P.log10 = function() {
            var x = this.clone();
            if(PowiainaNum.debug >= PowiainaNum.NORMAL) console.log("log" + this);
            if(x.lt(PowiainaNum.ZERO)) return PowiainaNum.NaN.clone();
            if(x.eq(PowiainaNum.ZERO)) return PowiainaNum.NEGATIVE_INFINITY.clone();
            if(x.lte(PowiainaNum.MAX_SAFE_INTEGER)) return new PowiainaNum(Math.log10(x.toNumber()));
            if(!x.isFinite()) return x;
            if(x.gt(PowiainaNum.TETRATED_MAX_SAFE_INTEGER)) return x;
            x.operatorE(1, x.operatorE(1) - 1);
            return x.normalize();
        };
        Q.generalLogarithm = Q.log10 = function(x) {
            return new PowiainaNum(x).log10();
        };
        P.logarithm = P.logBase = function(base) {
            if(base === undefined) base = Math.E;
            return this.log10().div(PowiainaNum.log10(base));
        };
        Q.logarithm = Q.logBase = function(x, base) {
            return new PowiainaNum(x).logBase(base);
        };
        P.naturalLogarithm = P.log = P.ln = function() {
          return this.logBase(Math.E);
        };
        Q.naturalLogarithm = Q.log = Q.ln = function(x) {
          return new PowiainaNum(x).ln();
        };
        //Implementation of functions from break_eternity.js
        P.iteratedexp = function (other, payload) {
            return this.tetr(other, payload);
        };
        Q.iteratedexp = function (x, other, payload) {
            return new PowiainaNum(x).iteratedexp(other, payload);
        };
        //This implementation is highly inaccurate and slow, and probably be given custom code
        P.iteratedlog = function (base, other) {
            if (base === undefined) base = 10;
            if (other === undefined) other = PowiainaNum.ONE.clone();
            var t = this.clone();
            base = new PowiainaNum(base);
            other = new PowiainaNum(other);
            if (other.eq(PowiainaNum.ZERO)) return t;
            if (other.eq(PowiainaNum.ONE)) return t.logBase(base);
            return base.tetr(t.slog(base).sub(other));
        };
        Q.iteratedlog = function (x, y, z) {
            return new PowiainaNum(x).iteratedlog(y, z);
        };
        P.iteratedslog = function (other) {
            if (other === undefined) other = PowiainaNum.ONE.clone();
            var t = this.clone();
            other = new PowiainaNum(other);
            if (other.eq(PowiainaNum.ZERO)) return t;
            if (other.eq(PowiainaNum.ONE)) return t.slog();
            return E(10).pent(t.mlog().sub(other))
        };
        //#endregion

    //#region lambertw

    //All of these are from Patashu's break_eternity.js
    var OMEGA = 0.56714329040978387299997; //W(1,0)
    //from https://math.stackexchange.com/a/465183
    //The evaluation can become inaccurate very close to the branch point
    var f_lambertw = function (z, tol, principal) {
        if (tol === undefined) tol = 1e-10;
        if (principal === undefined) principal = true;
        var w;
        if (!Number.isFinite(z)) return z;
        if (principal) {
        if (z === 0) return z;
        if (z === 1) return OMEGA;
        if (z < 10) w = 0;
        else w = Math.log(z) - Math.log(Math.log(z));
        } else {
            if (z === 0) return -Infinity;
            if (z <= -0.1) w = -2;
            else w = Math.log(-z) - Math.log(-Math.log(-z));
        }
        for (var i = 0; i < 100; ++i) {
            var wn = (z * Math.exp(-w) + w * w) / (w + 1);
            if (Math.abs(wn - w) < tol * Math.abs(wn)) return wn;
            w = wn;
        }
        throw Error("Iteration failed to converge: " + z);
    };
    //from https://github.com/scipy/scipy/blob/8dba340293fe20e62e173bdf2c10ae208286692f/scipy/special/lambertw.pxd
    //The evaluation can become inaccurate very close to the branch point
    //at ``-1/e``. In some corner cases, `lambertw` might currently
    //fail to converge, or can end up on the wrong branch.
    var d_lambertw = function (z, tol, principal) {
        if (tol === undefined) tol = 1e-10;
        if (principal === undefined) principal = true;
        z = new PowiainaNum(z);
        var w;
        if (!z.isFinite()) return z;
        if (principal) {
        if (z.eq(PowiainaNum.ZERO)) return z;
        if (z.eq(PowiainaNum.ONE)) return new PowiainaNum(OMEGA);
            w = PowiainaNum.ln(z);
        } else {
        if (z.eq(PowiainaNum.ZERO)) return PowiainaNum.NEGATIVE_INFINITY.clone();
            w = PowiainaNum.ln(z.neg());
        }
        for (var i = 0; i < 100; ++i) {
            var ew = w.neg().exp();
            var wewz = w.sub(z.mul(ew));
            var dd = w.add(PowiainaNum.ONE).sub(w.add(2).mul(wewz).div(PowiainaNum.mul(2, w).add(2)));
            if (dd.eq(PowiainaNum.ZERO)) return w; 
            var wn = w.sub(wewz.div(dd));
            if (PowiainaNum.abs(wn.sub(w)).lt(PowiainaNum.abs(wn).mul(tol))) return wn;
            w = wn;
        }
        throw Error("Iteration failed to converge: " + z);
    };
    //The Lambert W function, also called the omega function or product logarithm, is the solution W(x) === x*e^x.
    //https://en.wikipedia.org/wiki/Lambert_W_function
    //Some special values, for testing: https://en.wikipedia.org/wiki/Lambert_W_function#Special_values
    P.lambertw = function (principal) {
        if (principal === undefined) principal = true;
        var x = this.clone();
        if (x.isNaN()) return x;
        if (x.lt(-0.3678794411710499)) return PowiainaNum.NaN.clone();
        if (principal) {
            if (x.gt(PowiainaNum.TETRATED_MAX_SAFE_INTEGER)) return x;
            if (x.gt(PowiainaNum.EE_MAX_SAFE_INTEGER)) {
                x.operator(1, x.operator(1) - 1);
                return x;
            }
            if (x.gt(PowiainaNum.MAX_SAFE_INTEGER)) return d_lambertw(x);
            else return new PowiainaNum(f_lambertw(x.sign * x.operator(0)));
        } else {
            if (x.ispos()) return PowiainaNum.NaN.clone();
            if (x.abs().gt(PowiainaNum.EE_MAX_SAFE_INTEGER)) return x.neg().recip().lambertw().neg();
            if (x.abs().gt(PowiainaNum.MAX_SAFE_INTEGER)) return d_lambertw(x, 1e-10, false);
            else return new PowiainaNum(f_lambertw(x.sign * x.operator(0), 1e-10, false));
        }
    };
    Q.lambertw = function (x, principal) {
        return new PowiainaNum(x).lambertw(principal);
    };
    //end break_eternity.js excerpt
    //#endregion

    //#region tetrate, sroot, slog, pentate, expansion

    P.tetrate = P.tetr = function (other, payload) {
        if (payload === undefined) payload = PowiainaNum.ONE;
        var t = this.clone();
        other = new PowiainaNum(other);
        payload = new PowiainaNum(payload);
        if (payload.neq(PowiainaNum.ONE)) other = other.add(payload.slog(t));
        if (PowiainaNum.debug >= PowiainaNum.NORMAL) console.log(t + "^^" + other);
        var negln;
        if (t.isNaN() || other.isNaN() || payload.isNaN()) return PowiainaNum.NaN.clone();
        if (other.isInfinite() && other.sign > 0) {
            if (t.gte(1.4446678610091994)) return PowiainaNum.POSITIVE_INFINITY.clone();
            //Formula for infinite height power tower.
            if (t.eq(1.444667861009196)) return PowiainaNum(2.718277846521643)
            negln = t.ln().neg();
            return negln.lambertw().div(negln);
        }
        if (other.lt(-2)) return PowiainaNum.NaN.clone();
        if (t.eq(PowiainaNum.ZERO)) {
            if (other.eq(PowiainaNum.ZERO)) return PowiainaNum.NaN.clone();
            if (other.mod(2).eq(PowiainaNum.ZERO)) return PowiainaNum.ZERO.clone();
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
            if (other.eq(3)) return new PowiainaNum(16);
            if (other.eq(4)) return new PowiainaNum(65536);
        }
        var m = t.max(other);
        if (m.gt(PowiainaNum.PENTATED_MAX_SAFE_INTEGER)) return m;
        if (m.gt(PowiainaNum.TETRATED_MAX_SAFE_INTEGER) || other.gt(PowiainaNum.MAX_SAFE_INTEGER)) {
            if (this.lt(Math.exp(1 / Math.E))) {
                negln = t.ln().neg();
                return negln.lambertw().div(negln);
            }
            var j = t.slog(10).add(other);
            j.operatorE(2, (j.operatorE(2) || 0) + 1);
            j.normalize();
            return j;
        }
        var y = other.toNumber();
        var f = Math.floor(y);
        var r = t.pow(y - f);
        var l = PowiainaNum.NaN;
        for (var i = 0, w = new PowiainaNum(PowiainaNum.E_MAX_SAFE_INTEGER); f !== 0 && r.lt(w) && i < 100; ++i) {
            if (f > 0) {
                r = t.pow(r);
                if (l.eq(r)) {
                    f = 0;
                    break;
                }
                l = r;
                --f;
            } else {
                r = r.logBase(t);
                if (l.eq(r)) {
                    f = 0;
                    break;
                }
                l = r;
                ++f;
            }
        }
        if (i == 100 || this.lt(Math.exp(1 / Math.E))) f = 0;
        r.operatorE(1, (r.operatorE(1) + f) || f);
        r.normalize();
        return r;
    }; // P.tetrate from ExpantaNum.js
    Q.tetrate = Q.tetr = function (x, y, payload) {
        return new PowiainaNum(x).tetr(y, payload);
    };

    //All of these are from Patashu's break_eternity.js
    //The super square-root function - what number, tetrated to height 2, equals this?
    //Other sroots are possible to calculate probably through guess and check methods, this one is easy though.
    //https://en.wikipedia.org/wiki/Tetration#Super-root
    P.ssqrt = P.ssrt = function () {
        var x = this.clone();
        if (x.lt(Math.exp(-1 / Math.E))) return PowiainaNum.NaN.clone();
        if (!x.isFinite()) return x;
        if (x.gt(PowiainaNum.TETRATED_MAX_SAFE_INTEGER)) return x;
        if (x.gt(PowiainaNum.EE_MAX_SAFE_INTEGER)) {
        x.operator(1, x.operator(1) - 1);
        return x;
        }
        var l = x.ln();
        return l.div(l.lambertw());
    };
    Q.ssqrt = Q.ssrt = function (x) {
        return new PowiainaNum(x).ssqrt();
    };
    //Super-logarithm, one of tetration's inverses, tells you what size power tower you'd have to tetrate base to to get number. By definition, will never be higher than 1.8e308 in break_eternity.js, since a power tower 1.8e308 numbers tall is the largest representable number.
    //Uses linear approximation
    //https://en.wikipedia.org/wiki/Super-logarithm
    P.slog = function (base) {
        if (base === undefined) base = 10;
        var x = new PowiainaNum(this);
        base = new PowiainaNum(base);
        if (x.isNaN() || base.isNaN() || x.isInfinite() && base.isInfinite()) return PowiainaNum.NaN.clone();
        if (x.isInfinite()) return x;
        if (base.isInfinite()) return PowiainaNum.ZERO.clone();
        if (x.lt(PowiainaNum.ZERO)) return PowiainaNum.ONE.neg();
        if (x.eq(PowiainaNum.ONE)) return PowiainaNum.ZERO.clone();
        if (x.eq(base)) return PowiainaNum.ONE.clone();
        if (base.lt(Math.exp(1 / Math.E))) {
            var a = PowiainaNum.tetr(base, Infinity);
            if (x.eq(a)) return PowiainaNum.POSITIVE_INFINITY.clone();
            if (x.gt(a)) return PowiainaNum.NaN.clone();
        }
        if (x.max(base).gt("10^^^" + MAX_SAFE_INTEGER)) {
        if (x.gt(base)) return x;
            return PowiainaNum.ZERO.clone();
        }
        if (x.max(base).gt(PowiainaNum.TETRATED_MAX_SAFE_INTEGER)) {
            if (x.gt(base)) {
                x.operatorE(2, x.operatorE(2) - 1);
                x.normalize();
                return x.sub(x.operatorE(1));
            }
            return PowiainaNum.ZERO.clone();
        }
        var r = 0;
        var t = (x.operatorE(1) || 0) - (base.operatorE(1) || 0);
        if (t > 3) {
            var l = t - 3;
            r += l;
            x.operatorE(1, x.operatorE(1) - l);
        }
        for (var i = 0; i < 100; ++i) {
            if (x.lt(PowiainaNum.ZERO)) {
                x = PowiainaNum.pow(base, x);
                --r;
            } else if (x.lte(1)) {
                return new PowiainaNum(r + x.toNumber() - 1);
            } else {
                ++r;
                x = PowiainaNum.logBase(x, base);
            }
        }
        if (x.gt(10))
        return new PowiainaNum(r);
    };
    Q.slog = function (x, y) {
        return new PowiainaNum(x).slog(y);
    };

    //#region expansion multiexpansion powerexpansion 
    P.expansion = P.eps = function (other) {
        var t = this.clone();
        other = new PowiainaNum(other);
        var r;
        if (PowiainaNum.debug >= PowiainaNum.NORMAL) console.log("{" + t + "," + other + ",1,2}");
        if (other.lte(PowiainaNum.ZERO) || !other.isint()) return PowiainaNum.NaN.clone();
        if (other.eq(PowiainaNum.ONE)) return t.clone();
        if (!t.isint()) return PowiainaNum.NaN.clone();
        if (t.eq(2)) return new PowiainaNum(4);
        if (t.neq(10)) throw Error(powiainaNumError + "I can't handle that base is not 1, 2, or10")
        if (other.gt(PowiainaNum.MAX_SAFE_INTEGER)) {
            r = PowiainaNum()

            r.array = []
            r.array.push(...other.array);
            r.array.push([1,1,2,1]);
            
        }else{
            r = PowiainaNum()

            r.array = [10]
            r.array.push(["x",other.toNumber()-1,1,1]);

        }
        return r.normalize();
    };
    Q.expansion = Q.eps = function (x, other){
        return PowiainaNum(x).expansion(other)
    }
    P.multiExpansion = P.mulEps = function (other) {
        var t = this.clone();
        other = new PowiainaNum(other);
        var r;
        if (PowiainaNum.debug >= PowiainaNum.NORMAL) console.log("{" + t + "," + other + ",2,2}");
        if (other.lte(PowiainaNum.ZERO) || !other.isint()) return PowiainaNum.NaN.clone();
        if (other.eq(PowiainaNum.ONE)) return t.clone();
        if (!t.isint()) return PowiainaNum.NaN.clone();
        if (t.eq(2)) return new PowiainaNum(4);
        if (t.neq(10)) throw Error(powiainaNumError + "I can't handle that base is not 1, 2, or10")
        if (other.gt(PowiainaNum.MAX_SAFE_INTEGER)) {
            r = PowiainaNum()

            r.array = []
            r.array.push(...other.array);
            r.array.push([2,1,2,1]);
            
        }else{
            r = PowiainaNum()

            r.array = [10]
            r.array.push([1,other.toNumber()-1,2,1]);
            
        }
        return r.normalize();
    }
    Q.multiExpansion = Q.mulEps = function (x, other){
        return PowiainaNum(x).multiExpansion(other);
    }
    P.powerExpansion = P.powEps = function (other) {
        var t = this.clone();
        other = new PowiainaNum(other);
        var r;
        if (PowiainaNum.debug >= PowiainaNum.NORMAL) console.log("{" + t + "," + other + ",3,2}");
        if (other.lte(PowiainaNum.ZERO) || !other.isint()) return PowiainaNum.NaN.clone();
        if (other.eq(PowiainaNum.ONE)) return t.clone();
        if (!t.isint()) return PowiainaNum.NaN.clone();
        if (t.eq(2)) return new PowiainaNum(4);
        if (t.neq(10)) throw Error(powiainaNumError + "I can't handle that base is not 1, 2, or10")
        if (other.gt(PowiainaNum.MAX_SAFE_INTEGER)) {
            r = PowiainaNum()

            r.array = []
            r.array.push(...other.array);
            r.array.push([3,1,2,1]);
            
        }else{
            r = PowiainaNum()

            r.array = [10]
            r.array.push([2,other.toNumber()-1,2,1]);
            
        }
        return r.normalize();
    }
    Q.powerExpansion = Q.powEps = function (x, other){
        return PowiainaNum(x).powerExpansion(other);
    }

    //#endregion

    //#region explosion
    P.explosion = P.els = function (other){
        var t = this.clone();
        other = new PowiainaNum(other);
        var r;
        if (PowiainaNum.debug >= PowiainaNum.NORMAL) console.log("{" + t + "," + other + ",2,2}");
        if (other.lte(PowiainaNum.ZERO) || !other.isint()) return PowiainaNum.NaN.clone();
        if (other.eq(PowiainaNum.ONE)) return t.clone();
        if (!t.isint()) return PowiainaNum.NaN.clone();
        if (t.eq(2)) return new PowiainaNum(4);
        if (t.neq(10)) throw Error(powiainaNumError + "I can't handle that base is not 1, 2, or10")
        if (other.gt(PowiainaNum.MAX_SAFE_INTEGER)) {
            r = PowiainaNum()

            r.array = []
            r.array.push(...other.array);
            r.array.push([1,1,3,1]);
            
        }else{
            r = PowiainaNum()

            r.array = [10]
            r.array.push(["x",other.toNumber()-1,2,1]);

        }
        return r.normalize();
    };

    Q.explosion = P.els = function (x, other){
        return PowiainaNum(x).explosion(other);
    }

    //#endregion
    //#endregion

    //#endregion

    //#region compareTo
    P.compareTo = P.cmp = function (other) {
        if (PowiainaNum.debug > PowiainaNum.NORMAL) console.log("cmpare",this,other)
        if (!(other instanceof PowiainaNum)) other = new PowiainaNum(other);
        if (isNaN(this.array[0]) || isNaN(other.array[0])) return NaN
        if (this.array[0] == Infinity && other.array[0] != Infinity) return this.sign;
        if (this.array[0] != Infinity && other.array[0] == Infinity) return -other.sign;
        if (this.array.length == 1 && other.array.length == 1 && this.array[0] == other.array[0]) return 0;
        if (this.sign != other.sign) return this.sign;
        if (other.array[0] == 0) {
            if (this.sign > 0){
                return 1
            }else if (this.sign < 0){
                return -1
            }
        }
        var m = this.sign;
        var r;
        if (this.layer > other.layer) r = 1
        else if (this.layer < other.layer) r = -1;
        else {
            var e, f;
            var i = 1;
            var l = Math.min(this.array.length, other.array.length);
            do {
                g = this.array[this.array.length - i];
                h = other.array[other.array.length - i];
                if (typeof g == "number") e = [0,g,1,1];
                else e = g;
                if (typeof h == "number") f = [0,h,1,1];
                else f = h;
                if (e[3] > f[3] || (e[3] == f[3] && (
                    (e[2] == "x" && f[2] != "x") || e[2] > f[2] || (e[2] == f[2] && (
                        (e[0] == "x" && f[0] != "x") || e[0] > f[0] || (e[0] == f[0] && (
                            e[1] > f[1]
                        ))
                    ))
                ))) { r = 1; break; }
                if (e[3] < f[3] || (e[3] == f[3] && (
                    (e[2] != "x" && f[2] == "x") || e[2] < f[2] || (e[2] == f[2] && (
                        (e[0] != "x" && f[0] == "x") || e[0] < f[0] || (e[0] == f[0] && (
                            e[1] < f[1]
                        ))
                    ))
                ))) { r = -1; break; }
                i++
            }while (i < l)
            if (r === undefined) {
                if (this.array.length == other.array.length) {
                    if (this.array[0] > other.array[0]) {
                        r = 1
                    } else if (this.array[0] < other.array[0]) {
                        r = -1
                    } else {

                        r = 0;
                    }
                } else if (this.array.length > other.array.length) {
                    e = this.array[this.array.length - l];
                    if (e[0] >= 1 || e[1] > 10) {
                        r = 1;
                    } else {
                        r = -1;
                    }
                } else {
                    e = other.array[other.array.length - l];
                    if (e[0] >= 1 || e[1] > 10) {
                        r = -1;
                    } else {
                        r = 1;
                    }
                }
            }
        }
        return r * m;
    }

    Q.compare = Q.cmp = function (x, y) {
        return new PowiainaNum(x).cmp(y);
    };
    //#endregion

    //#region floorceil
    P.isInteger = P.isint = function () {
        if (this.sign == -1) return this.abs().isint();
        if (this.gt(PowiainaNum.MAX_SAFE_INTEGER)) return true;
        return Number.isInteger(this.toNumber());
      };
      Q.isInteger = Q.isint = function (x) {
        return new PowiainaNum(x).isint();
      };
      P.floor = function () {
        if (this.isInteger()) return this.clone();
        return new PowiainaNum(Math.floor(this.toNumber()));
      };
      Q.floor = function (x) {
        return new PowiainaNum(x).floor();
      };
      P.ceiling = P.ceil = function () {
        if (this.isInteger()) return this.clone();
        return new PowiainaNum(Math.ceil(this.toNumber()));
      };
      Q.ceiling = Q.ceil = function (x) {
        return new PowiainaNum(x).ceil();
      };
      P.round = function () {
        if (this.isInteger()) return this.clone();
        return new PowiainaNum(Math.round(this.toNumber()));
      };
      Q.round = function (x) {
        return new PowiainaNum(x).round();
      };
    //#endregion

    //#region from ExpantaNum.js comparing

    P.greaterThan = P.gt = function (other) {
        return this.cmp(other) > 0;
    };
    Q.greaterThan = Q.gt = function (x, y) {
        return new PowiainaNum(x).gt(y);
    };
    P.greaterThanOrEqualTo = P.gte = function (other) {
        return this.cmp(other) >= 0;
    };
    Q.greaterThanOrEqualTo = Q.gte = function (x, y) {
        return new PowiainaNum(x).gte(y);
    };
    P.lessThan = P.lt = function (other) {
        return this.cmp(other) < 0;
    };
    Q.lessThan = Q.lt = function (x, y) {
        return new PowiainaNum(x).lt(y);
    };
    P.lessThanOrEqualTo = P.lte = function (other) {
        return this.cmp(other) <= 0;
    };
    Q.lessThanOrEqualTo = Q.lte = function (x, y) {
        return new PowiainaNum(x).lte(y);
    };
    P.equalsTo = P.equal = P.eq = function (other) {
        return this.cmp(other) === 0;
    };
    Q.equalsTo = Q.equal = Q.eq = function (x, y) {
        return new PowiainaNum(x).eq(y);
    };
    P.notEqualsTo = P.notEqual = P.neq = function (other) {
        return this.cmp(other) !== 0;
    };
    Q.notEqualsTo = Q.notEqual = Q.neq = function (x, y) {
        return new PowiainaNum(x).neq(y);
    };
    P.minimum = P.min = function (other) {
        return this.lt(other) ? this.clone() : new PowiainaNum(other);
    };
    Q.minimum = Q.min = function (x, y) {
        return new PowiainaNum(x).min(y);
    };
    P.maximum = P.max = function (other) {
        return this.gt(other) ? this.clone() : new PowiainaNum(other);
    };
    Q.maximum = Q.max = function (x, y) {
        return new PowiainaNum(x).max(y);
    };
    P.isPositive = P.ispos = function () {
        return this.gt(PowiainaNum.ZERO);
    };
    Q.isPositive = Q.ispos = function (x) {
        return new PowiainaNum(x).ispos();
    };
    P.isNegative = P.isneg = function () {
        return this.lt(PowiainaNum.ZERO);
    };
    Q.isNegative = Q.isneg = function (x) {
        return new PowiainaNum(x).isneg();
    };

    //#endregion

    //#region from ExpantaNum.js operator
    P.getOperatorIndex = function (i, j = 1, k = 1) {
        /**
        
        PS:
        in ExpantaNum.js, P.operator need only 1 parameter (arrow count?)

        but in PowiainaNum.js, P.operator need 3 parameters
            (arrowcount, {{}}brace count(1), [[]]brace count(1)) 
        
        such as 10{1145141919810}229028, in ExpantaNum.toString, 
        it equals to (10{1145141919809})^229026 (10{1145141919808})^8 (10{1145141919807})^8 ... (10{1145141918813})^8 (10{1145141918812})^8 10
        so ExpantaNum("10{1145141919810}229028").operator(1145141919809) equals 229026;
        
        that P.operator(i,j,k) returns the repeat count of ({10,x,i,j,k}, x= ...)^repeatcount has



        We back to the method P.getOperatorIndex;

        sometime it returns NON-INTEGER(such as 4.5, -0.5), 4.5 means this number's max arrows used. 
        (but i don't know how -0.5 means.)

        such as a = ExpantaNum("10{5}100")
        a.toString() = (10^^^^)^98 (10^^^)^8 (10^^)^8 (10^)^8 10000000000

        a.getOperatorIndex(2) = 2
        so a.array[a.getOperatorIndex(2)] == [2,8]
        
        such^2 as b = ExpantaNum("(10{6})^5 (10^^^)^5 10")
        b.toString() = (10{6})^5 (10^^^)^4 (10^^)^8 (10^)^8 10000000000;

        b.getOperatorIndex(6) = 4 
        so b.array[b.getOperatorIndex(6)] == [6,5]
        */
        if (i != "x" && typeof i != "number") i = Number(i);
        if (i != "x" && !isFinite(i)) throw Error(invalidArgument + "Index i out of range.");
        if (j != "x" && typeof j != "number") j = Number(j);
        if (j != "x" && !isFinite(j)) throw Error(invalidArgument + "Index j out of range.");
        if (typeof k != "number") k = Number(k);
        if (!isFinite(k)) throw Error(invalidArgument + "Index k out of range.");
        var a = this.array;
        var min = 0, max = a.length - 1;
        if (a.length == 1){
            if (0 > i) return -0.5
            if (0 == i) return 0
            if (0 < i) return 0.5
        }
        if (a[max][3] < k) return max + 0.5
        if (a[max][3] > k) return -0.5
        if (a[max][2] != "x" && j == "x") return max + 0.5
        if (a[max][2] == "x" && j != "x") return -0.5
        if (a[max][0] < i) return max + 0.5
        if (a.length > 1 && 0 > i) return -0.5
        else if (0 > i) return -0.5

        while (min != max) {
            if (a[min][3] == k && a[min][2] == j && a[min][0] == i) return min;
            if (a[max][3] == k && a[max][2] == j && a[max][0] == i) return max;

            var mid = Math.floor((min + max) / 2);

            if (min == mid || (a[mid][0] == i && a[mid][2] == j && a[mid][3] == k)) {
                min = mid;
                break;
            }
            if (a[mid][3] < k || a[mid][2] < j || a[mid][0] < i) min = mid;
            if (a[mid][3] > k || a[mid][2] > j || a[mid][0] > i) max = mid;
        }
        if (min == 0 && i == 0){
            return min;
        }else{
            return a[min][0] == i ? min : min + 0.5;
        }
    }
    P.getOperator = function (i, j = 1, k = 1) {
        if (i != "x" && typeof i != "number") i = Number(i);
        if (i != "x" && !isFinite(i)) throw Error(invalidArgument + "Index i out of range.");
        if (j != "x" && typeof j != "number") j = Number(j);
        if (j != "x" && !isFinite(j)) throw Error(invalidArgument + "Index j out of range.");
        if (typeof k != "number") k = Number(k);
        if (!isFinite(k)) throw Error(invalidArgument + "Index k out of range.");
        var ai = this.getOperatorIndex(i, j, k);
        if (Number.isInteger(ai) && ai != 0) return this.array[ai][1];
        else if (ai == 0) return this.array[0]
        else return i === 0 ? 10 : 0;

    }
    P.setOperator = function (i, j = 1, k = 1, value) {
        if (i != "x" && typeof i != "number") i = Number(i);
        if (i != "x" && !isFinite(i)) throw Error(invalidArgument + "Index i out of range.");
        if (j != "x" && typeof j != "number") j = Number(j);
        if (j != "x" && !isFinite(j)) throw Error(invalidArgument + "Index j out of range.");
        if (typeof k != "number") k = Number(k);
        if (!isFinite(k)) throw Error(invalidArgument + "Index k out of range.");
        var ai = this.getOperatorIndex(i, j, k);
        if (Number.isInteger(ai)) this.array[ai][1] = value;
        else {
            ai = Math.ceil(ai);
            this.array.splice(ai, 0, [i, value]);
        }
        this.normalize();
    };
    P.operator = function (i, j = 1, k = 1, value) {

        if (i != "x" && typeof i != "number") i = Number(i);
        if (i != "x" && !isFinite(i)) throw Error(invalidArgument + "Index i out of range.");
        if (j != "x" && typeof j != "number") j = Number(j);
        if (j != "x" && !isFinite(j)) throw Error(invalidArgument + "Index j out of range.");
        if (typeof k != "number") k = Number(k);
        if (!isFinite(k)) throw Error(invalidArgument + "Index k out of range.");

        if (value === undefined) return this.getOperator(i, j, k);
        else this.setOperator(i, j, k, value)
    }

    P.operatorE = function (i, value) {

        if (typeof i != "number") i = Number(i);
        if (i != "x" && !isFinite(i)) throw Error(invalidArgument + "Index i out of range.");

        if (value === undefined) return this.getOperator(i, 1, 1);
        else this.setOperator(i, 1, 1, value)

    }
    //#endregion

    //#region isFinite isInfinite isNaN


    P.isFinite = function () {
        return isFinite(this.array[0]);
    };
    Q.isFinite = function (x) {
        return new PowiainaNum(x).isFinite();
    };
    P.isInfinite = function () {
        return this.array[0] == Infinity;
    };
    Q.isInfinite = function (x) {
        return new PowiainaNum(x).isInfinite();
    };
    P.isNaN = function () {
        return isNaN(this.array[0])
    }
    Q.isNaN = function (x) {
        return new PowiainaNum(x).isNaN();
    }
    //#endregion

    //#region absoluteValue negative
    P.absoluteValue = P.abs = function () {
        var x = this.clone();
        x.sign = 1;
        return x;
    };
    Q.absoluteValue = Q.abs = function (x) {
        return new PowiainaNum(x).abs();
    };
    P.negate = P.neg = function () {
      var x = this.clone();
      x.sign = x.sign * -1;
      return x;
    };
    Q.negate = Q.neg = function (x) {
      return new PowiainaNum(x).neg();
    };
    //#endregion



    P.normalize = function () {
        var b;
        var x = this;
        if (PowiainaNum.debug >= PowiainaNum.ALL) console.log(x.toString())
        if (!x.array.length) {
            x.array = [0]
        }
        if (x.array[0] == Infinity) {
            x.array = [Infinity];
            return x;
        }
        if (x.sign != 1 && x.sign != -1) {
            if (typeof x.sign != "number") x.sign = Number(x.sign);
            x.sign = x.sign < 0 ? -1 : 1;
        }
        if (x.layer > MAX_SAFE_INTEGER) {
            x.array = [Infinity]
            x.layer = 0;
            return x;
        }
        if (Number.isInteger(x.layer)) x.layer = Math.floor(x.layer);
        var maxWhileTime = 1000;
        var whileTimeRuns = 0
        for (var i = 1; i < x.array.length; ++i) {
            var e = x.array[i]
            if (e[0] === null || e[0] === undefined) {
                e[0] = 0
            }
            if (e[2] === null || e[3] === undefined) {
                e[2] = 1
            }
            if (e[3] === null || e[3] === undefined) {
                e[3] = 1
            }
            if ((isNaN(e[0]) && e[0] != "x") || isNaN(e[1]) || (isNaN(e[2]) && e[2] != "x") || isNaN(e[3])) {
                x.array = [NaN];
                return x;
            }
            if ((!isFinite(e[0]) && e[0] != "x") || !isFinite(e[1]) || (!isFinite(e[2]) && e[2] != "x") || !isFinite(e[2])) {
                x.array = [Infinity];
                return x;
            }
            if (e[0] != "x" && !Number.isInteger(e[0])) e[0] = Math.floor(e[0]);
            if (!Number.isInteger(e[1])) e[1] = Math.floor(e[1]);
            if (e[2] != "x" && !Number.isInteger(e[2])) e[1] = Math.floor(e[2]);
            if (!Number.isInteger(e[3])) e[1] = Math.floor(e[3]);

        }
        do {
            if (PowiainaNum.debug >= PowiainaNum.ALL) console.log(x.toString());
            b = false;

            // sort array
            x.array.sort(function (a, b) {
                return (function (a, b) {
                    if (typeof a == 'number') {
                        return 1
                    } else if (a[3] > b[3]) {
                        return 1
                    } else if (a[3] < b[3]) {
                        return -1
                    }
                    else if (a[2] == "x" && b[2] != "x") {
                        return 1
                    } else if (a[2] != "x" && b[2] == "x") {
                        return -1
                    } else if (a[2] == "x" && b[2] == "x") {
                        return 1
                    } else if (a[2] > b[2]) {
                        return 1
                    } else if (a[2] < b[2]) {
                        return -1
                    } else if (a[0] == "x" && b[0] != "x") {
                        return 1
                    } else if (a[0] != "x" && b[0] == "x") {
                        return -1
                    } else if (a[0] == "x" && b[0] == "x") {
                        return 1
                    }
                    else if (a[0] > b[0]) {
                        return 1
                    }
                    else if (a[0] < b[0]) {
                        return -1
                    } else if (a[1] > b[1]) {
                        return 1
                    } else if (a[1] < b[1]) {
                        return -1
                    }


                    return 1
                })(a, b)
            })

            if (!x.array.length) x.array = [0]; // if no array set zero
            if (x.array.length > PowiainaNum.maxOps) x.array.splice(1, x.array.length - PowiainaNum.maxOps); // max operators check

            if (x.array[0] > MAX_SAFE_INTEGER) { // check >9e15 first number
                if (x.array.length >= 2 && x.array[1][0] == 1  && x.array[1][2] == 1&& x.array[1][3] == 1) {
                    x.array[1][1]++;
                } else {
                    x.array.splice(1, 0, [1, 1, 1, 1]);
                }
                x.array[0] = Math.log10(x.array[0])
            }
            if (x.array[0] < MAX_E && x.array[1] !== undefined && 
                x.array[1][0] == 1 && x.array[1][1] >= 1 &&
                x.array[1][2] == 1 && x.array[1][3] == 1) { // check < 9e15

                x.array[0] = Math.pow(10, x.array[0]);
                if (x.array[1][1] > 1) {
                    x.array[1][1]--;
                } else {
                    x.array.splice(1, 1);
                }
                b = true;
            }
            while(x.array.length >= 2 && x.array[0] == 1 && x.array[1][1]) {
                if(x.array[1][1] > 1) {
                    x.array[1][1]--;
                } else {
                    x.array.splice(1, 1);
                }
                x.array[0] = 10;
            }
            if (x.array.length >= 2 && x.array[0] < MAX_SAFE_INTEGER && x.array[1][0] >=2 && x.array[1][1]==1) {
                
                x.array.splice(1, 1, [x.array[1][0]-1,x.array[0]-1,1,1]);
                
                x.array[0] = 10;
                b=true
            }
            for (i = 1; i < x.array.length - 1; ++i) {
                if (x.array[i][0] == x.array[i + 1][0] && x.array[i][2] == x.array[i + 1][2] && x.array[i][3] == x.array[i + 1][3]) {
                    // same array's merge
                    x.array[i][1] += x.array[i + 1][1];
                    x.array.splice(i + 1, 1);
                    --i;
                    b = true;
                }

            }
            if (x.array.length>=2&&x.array[1][0]!=1&&x.array[1][0]!="x" && x.array[1][0] < 1000){
                if (x.array[0]) x.array.splice(1,0,[x.array[1][0]-1,x.array[0],x.array[1][2] ,x.array[1][3]]);
                    x.array[0]=1;
                if (x.array[2][1]>1){
                    x.array[2][1]--;
                }else{
                    x.array.splice(2,1);
                } //  && x.array[1][2] == 1 && x.array[1][3] == 1
                b=true;
            }
            if (x.array.length>=2 && x.array[1][2] >= 2 && x.array[1][0] == 1 && x.array[0] < MAX_SAFE_INTEGER){
                
                if (x.array[1][1]==1){
                    x.array.splice(1, 1, ["x", x.array[0]-1, x.array[1][2]-1, x.array[1][3]])
                    x.array[0] = 10
                    b=true;
                }else if (x.array[1][1] > 1){
                    repeatLast = x.array[1][1];
                    x.array.splice(1, 1, ["x", x.array[0]-1, x.array[1][2]-1, x.array[1][3]])
                    x.array.push([1,repeatLast-1,2,1])
                    x.array[0] = 10
                    b=true;
                }
            }
            for (i = 1; i < x.array.length; ++i) {
                if (x.array[i][2] > MAX_SAFE_INTEGER) {
                    // check {}brace >9e15
                    if (i != x.array.length - 1 && x.array[i + 1][2] == "x") {
                        x.array[i + 1][1]++;
                    } else if (x.array[i][2] != "x"){
                        x.array.splice(i + 1, 0, [1, 1, "x", x.array[i][3]]);

                    } else if (x.array[i][2] == "x"){
                        x.array.splice(i + 1, 0, [1, 1, 1, x.array[i][3]]+1);

                    }
                    x.array[0] = x.array[i][2] + 1;
                    x.array.splice(1, i);
                    --i
                    b = true;
                }
                if (i<1) i=1;
                if (x.array[i][1] > MAX_SAFE_INTEGER) {
                    // check repeat count >9e15
                    if (i != x.array.length - 1 && x.array[i + 1][0] == "x") {
                        x.array[i + 1][1]++;
                    } else if (x.array[i][0] != "x"){
                        x.array.splice(i + 1, 0, [x.array[i][0] + 1, 1, x.array[i][2], x.array[i][3]]);

                    } else if (x.array[i][0] == "x"){
                        x.array.splice(i + 1, 0, [1, 1, x.array[i][2]+1, x.array[i][3]]);

                    }
                    x.array[0] = x.array[i][1] + 1;
                    x.array.splice(1, i);
                    --i
                    b = true;
                }
                if (i<1) i=1;/*
                if (x.array[i][2] > MAX_SAFE_INTEGER) {
                    x.array[0] = x.array[i][2] + 1;
                    
                    if (i != x.array.length -1 && x.array[i+1][2] == "x"){
                        x.array[i+1][1]++;
                        x.array.splice(i,1)
                    }else if (x.array[i][2] != "x"){
                        x.array.push([1, 1, "x", x.array[i][3]])
                        x.array.splice(i,1)
                    }
                    --i
                    b = true;
                }*/
                // check 0 repeat count
                if (x.array[i][0] !== 0 && (x.array[i][1] === 0 || x.array[i][1] === null || x.array[i][1] === undefined)) {
                    x.array.splice(i, 1);
                    --i;
                    continue;
                }
                if (i<1) i=1;
                if (x.array[i][0] > MAX_SAFE_INTEGER){
                    x.array[0] = x.array[i][0] + 1;
                    if (i != x.array.length - 1 && x.array[i + 1][0] == "x") {
                        x.array[i + 1][1]++;
                    } else {
                        x.array.splice(i + 1, 0, ["x", 1, x.array[i][2], x.array[i][3]]);
                    }
                    x.array.splice(1, i);
                    
                    b=true;
                }

            }
            whileTimeRuns++
        } while (b && whileTimeRuns < maxWhileTime)
        return x;
    }
    P.overflow = function (start, power, meta = 1) {
        var number = this.clone()
        power = PowiainaNum(power)
        meta = PowiainaNum(meta)
        start = PowiainaNum(start)
        if (number.gte(start)) {
            var s = start.iteratedlog(10, meta)
            number = PowiainaNum(10).iteratedexp(meta, number.iteratedlog(10, meta).div(s).pow(power).mul(s));
        }
        return number
    }
    Q.overflow = function (num, start, power, meta = 1){
        return PowiainaNum(num).overflow(start,power,meta)
    }

    P.toJSON = function() {
        if (PowiainaNum.serializeMode == PowiainaNum.JSON) {
            var a = [];
            a.push(this.array[0])
            for (var i = 1; i < this.array.length; ++i) a.push([this.array[i][0], this.array[i][1], this.array[i][2], this.array[i][3]]);
            return {
                array: a,
                layer: this.layer,
                sign: this.sign
            };
        } else if (PowiainaNum.serializeMode == PowiainaNum.STRING) {
             return this.toString(1);
        }

    }


    P.toString = function (formatType = 0) {
        if (isNaN(this.array[0])) return "NaN";
        if (!isFinite(this.array[0])) return "Infinity";
        var s = "";
        if (formatType == 1){
            s = "l" + (this.layer.toString()) + " s" + (this.sign.toString()) + " a" + JSON.stringify(this.array)
        }else if (formatType == 0){
            for (let i =this.array.length-1;i>0; i--) {

                if (this.array[i][3] == 1 && this.array[i][2] == 1) s += "(" + "10{"+this.array[i][0] + "})"+"^"+this.array[i][1] + " "
                else if (this.array[i][3] == 1)s += "(" + "eps"+this.array[i][2]+",10{"+this.array[i][0] + "})"+"^"+this.array[i][1] + " "
                else s += "(" + "meg"+this.array[i][3]+",eps"+this.array[i][2]+",10{"+this.array[i][0] + "})"+"^"+this.array[i][1] + " "
            }
            s += this.array[0]
            s = (this.sign<0 ? "-" : "") + s
        }
        return s
    }
    Q.fromNumber = function (input) {
        if (typeof input != 'number') throw Error(invalidArgument + "Expected Number");
        var x = new PowiainaNum();
        x.array[0] = Math.abs(input);
        x.sign = input < 0 ? -1 : 1;
        x.normalize();
        return x;
    }

    var LONG_STRING_MIN_LENGTH = 17;
    Q.fromString = function (input) {
        if (typeof input != "string") throw Error(invalidArgument + "Expected String");
        if (input[0] == "l") {
            let temp1 = input.indexOf("l");
            let temp2 = input.indexOf("s");
            let temp3 = input.indexOf("a");
            if (temp2 == -1 || temp3 == -1) {
                console.warn(powiainaNumError + "Malformed input: " + input);
                return PowiainaNum.NaN.clone();
            }
            let layer = Number(input.slice(temp1 + 1, temp2 - 1))
            let sign = Number(input.slice(temp2 + 1, temp3 - 1))
            let array = JSON.parse(input.slice(temp3 + 1, input.length))

            var x = PowiainaNum();
            x.layer = layer;
            x.sign = sign;
            x.array = array;
            x.normalize();
            return x;
        } else {
            // from ExpantaNum.js
            var x = new PowiainaNum();
            var negateIt = false;
            if (input[0] == "-" || input[0] == "+") {
                var numSigns = input.search(/[^-\+]/);
                var signs = input.substring(0, numSigns);
                negateIt = signs.match(/-/g).length % 2 == 1;
                input = input.substring(numSigns);
            }
            if (input == "NaN") x.array = [
                NaN
            ];
            else if (input == "Infinity") x.array = [
                Infinity
            ];
            else {
                x.array = [
                  0
                ];
                var a, b, c, d, i;

                var Klayer = 0;
                if (input[0] == "J") {
                    if (input[1] == "^") {
                        a = input.substring(2).search(/[^0-9]/) + 2;
                        Klayer = Number(input.substring(2, a));
                        input = input.substring(a + 1);
                    } else {
                        a = input.search(/[^J]/);
                        Klayer = a;
                        input = input.substring(a);
                    } 
                }
                while (input) {
                    if (/^\(?10[\^\{]/.test(input)) {
                        if (input[0] == "(") {
                            input = input.substring(1);
                        }
                        var arrows;
                        if (input[2] == "^") {
                            a = input.substring(2).search(/[^\^]/);
                            arrows = a;
                            b = a + 2;
                        } else {
                            a = input.indexOf("}");
                            arrows = Number(input.substring(3, a));
                            b = a + 1;
                        }
                        input = input.substring(b);
                        if (input[0] == ")") {
                            a = input.indexOf(" ");
                            c = Number(input.substring(2, a));
                            input = input.substring(a + 1);
                        } else {
                            c = 1;
                        }
                        if (arrows == 1) {
                            if (x.array.length >= 2 && x.array[1][0] == 1) {
                                x.array[1][1] += c;
                            } else {
                                x.array.splice(1, 0, [1, c, 1, 1]);
                            }
                        } else if (arrows == 2) {
                            a = x.array.length >= 2 && x.array[1][0] == 1 ? x.array[1][1] : 0;
                            b = x.array[0];
                            if (b >= 1e10) ++a;
                            if (b >= 10) ++a;
                            x.array[0] = a;
                            if (x.array.length >= 2 && x.array[1][0] == 1) x.array.splice(1, 1);
                            d = x.getOperatorIndex(2);
                            if (Number.isInteger(d)) x.array[d][1] += c;
                            else x.array.splice(Math.ceil(d), 0, [2, c, 1, 1]);
                        } else {
                            a = x.operatorE(arrows - 1);
                            b = x.operatorE(arrows - 2);
                            if (b >= 10) ++a;
                            d = x.getOperatorIndex(arrows);
                            x.array.splice(1, Math.ceil(d) - 1);
                            x.array[0] = a;
                            if (Number.isInteger(d)) x.array[1][1] += c;
                            else x.array.splice(1, 0, [arrows, c, 1, 1]);
                            
                        }
                    } else {
                        break;
                    }
                }
                a = input.split(/[Ee]/);
                b = [x.array[0], 0];
                c = 1;
                for (let i = a.length - 1; i >= 0; --i) {
                    //The things that are already there
                    if (b[0] < MAX_E && b[1] === 0) {
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
                    if (intPartLen >= LONG_STRING_MIN_LENGTH) b[0] = Math.log10(b[0]) + log10LongString(a[i].substring(0, intPartLen)), b[1] = 1;
                    else if (a[i]) b[0] *= Number(a[i]);
                    } else {
                    d = intPartLen >= LONG_STRING_MIN_LENGTH ? log10LongString(a[i].substring(0, intPartLen)) : a[i] ? Math.log10(Number(a[i])) : 0;
                    if (b[1] == 1) {
                        b[0] += d;
                    } else if (b[1] == 2 && b[0] < MAX_E + Math.log10(d)) {
                        b[0] += Math.log10(1 + Math.pow(10, Math.log10(d) - b[0]));
                    }
                    }
                    //Carrying
                    if (b[0] < MAX_E && b[1]) {
                        b[0] = Math.pow(10, b[0]);
                        b[1]--;
                    } else if (b[0] > MAX_SAFE_INTEGER) {
                        b[0] = Math.log10(b[0]);
                        b[1]++;
                    }
                }
                x.array[0] = b[0];
                if (b[1]) {
                    if (x.array.length >= 2 && x.array[1][0] == 1) x.array[1][1] += b[1];
                    else x.array.splice(1, 0, [1, b[1], 1, 1]);
                }  
                if (Klayer>0){
                    x.array.push(["x",Klayer,1,1])
                }
            }
            if (negateIt) x.sign *= -1;
            x.normalize();
            return x;
            
        }
    }
    P.toNumber = function () {
        if (this.sign == -1) return -1 * (this.abs().toNumber());
        if (this.layer > 0) return Infinity;
        if (this.array.length >= 2 &&
            (
                this.array[1][3] >= 2 ||
                this.array[1][2] == "x" ||
                this.array[1][2] >= 2 ||
                this.array[1][0] == "x" ||
                this.array[1][0] >= 2 ||
                this.array[1][1] >= 2 ||
                this.array[1][1] == 1 && this.array[0][1] > Math.log10(Number.MAX_VALUE)
            )
        ) return Infinity;
        if (this.array.length >= 2 && this.array[1][1] == 1) return Math.pow(10, this.array[0]);
        return this.array[0];
    };
    P.clone = function () {
        var temp = new PowiainaNum();
        var array = [];
        array.push(this.array[0]);
        for (var i = 1; i < this.array.length; ++i)
            array.push([this.array[i][0], this.array[i][1], this.array[i][2], this.array[i][3]]);

        temp.array = array;
        temp.sign = this.sign;
        temp.layer = this.layer;
        return temp;
    };


    //#region toGlobalScope
    function clone(obj) {
        var i, p, ps;
        function PowiainaNum(input) { // constructor of this function
            var x = this;
            if (!(x instanceof PowiainaNum)) return new PowiainaNum(input);
            x.constructor = PowiainaNum;

            var temp, temp2, temp3;

            if (typeof input == "number") {
                temp = PowiainaNum.fromNumber(input);
            } else if (typeof input == "string") {
                temp = PowiainaNum.fromString(input);
            } else if (typeof input == "object" && input instanceof PowiainaNum) {
                temp = input.clone();

            }
            else {
                temp = [NaN];
                temp2 = 1;
                temp3 = 0;
            }
            if (typeof temp2 == "undefined") {
                x.array = temp.array;
                x.sign = temp.sign;
                x.layer = temp.layer;
            } else {
                x.array = temp;
                x.sign = temp2;
                x.layer = temp3
            }
        }
        PowiainaNum.prototype = P;

        PowiainaNum.JSON = 0;
        PowiainaNum.STRING = 1;

        PowiainaNum.NONE = 0;
        PowiainaNum.NORMAL = 1;
        PowiainaNum.ALL = 2;
        PowiainaNum.clone = clone;
        PowiainaNum.config = PowiainaNum.set = config
        for (var prop in Q) {
            //set static methods
            if (Q.hasOwnProperty(prop)) {
                PowiainaNum[prop] = Q[prop];
            }
        }
        if (obj === void 0) obj = {};
        if (obj) {
            ps = ['maxOps', 'serializeMode', 'debug'];
            for (i = 0; i < ps.length;)
                if (!obj.hasOwnProperty(p = ps[i++]))
                    obj[p] = this[p];
        }

        PowiainaNum.config(obj);
        return PowiainaNum;
    }
    function defineConstants(obj) {
        for (var prop in R) {
            if (R.hasOwnProperty(prop)) {
                if (Object.defineProperty) {
                    Object.defineProperty(obj, prop, {
                        configurable: false,
                        enumerable: true,
                        writable: false,
                        value: new PowiainaNum(R[prop])
                    });
                } else {
                    obj[prop] = new PowiainaNum(R[prop]);
                }
            }
        }
        return obj;
    }
    function config(obj) {
        if (!obj || typeof obj !== 'object') {
            throw Error(powiainaNumError + 'Object expected');
        }
        var i, p, v,
            ps = [
                'maxOps', 1, Number.MAX_SAFE_INTEGER,
                'serializeMode', 0, 1,
                'debug', 0, 2
            ];
        for (i = 0; i < ps.length; i += 3) {
            if ((v = obj[p = ps[i]]) !== void 0) {
                if (Math.floor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;
                else throw Error(invalidArgument + p + ': ' + v);
            }
        }

        return this;
    }

    PowiainaNum = clone(PowiainaNum);

    PowiainaNum = defineConstants(PowiainaNum);

    PowiainaNum['default'] = PowiainaNum.PowiainaNum = PowiainaNum;

    // Export.

    // AMD. Asynchronous Module Definition

    if (typeof define == 'function' && define.amd) {
        define(function () {
            return PowiainaNum
        })


        // Node and other environments that support module.exports.
    } else if (typeof module != 'undefined' && module.exports) {
        module.exports = PowiainaNum

        // Browser
    } else {
        if (!globalScope) {
            globalScope = typeof self != 'undefined' && self && self.self == self
                ? self : Function('return this')();
        }
        globalScope.PowiainaNum = PowiainaNum;
    }
    //#endregion

})(this);