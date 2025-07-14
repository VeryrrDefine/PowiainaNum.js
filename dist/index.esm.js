function compareTuples() {
    var tuples = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        tuples[_i] = arguments[_i];
    }
    for (var i = 0; i < Math.min(tuples[0].length, tuples[1].length); i++) {
        var a = tuples[0][i];
        var b = tuples[1][i];
        if (a < b)
            return -1;
        if (a > b)
            return 1;
    }
    return 0;
}
var PowiainaNum = /** @class */ (function () {
    function PowiainaNum(arg1) {
        this.array = [{ arrow: 0, expans: 1, megota: 1, repeat: NaN }];
        this.small = 0;
        this.sign = 0;
        this.layer = 0;
        if (typeof arg1 == "number") {
            var obj = PowiainaNum.fromNumber(arg1);
            this.resetFromObject(obj);
        }
        if (typeof arg1 == "object") {
            var obj = PowiainaNum.fromObject(arg1);
            this.resetFromObject(obj);
        }
    }
    /**
     * Normalize functions will make this number convert into standard format.(it also change `this`, like [].sort)
     * @returns normalized number
     */
    PowiainaNum.prototype.normalize = function () {
        return this;
    };
    /**
     *
     * @returns number will return the index of the operator in array. return as x.5 if it's between the xth and x+1th operators.
     */
    PowiainaNum.prototype.getOperatorIndex = function (arrow, expans, megota) {
        if (expans === void 0) { expans = 1; }
        if (megota === void 0) { megota = 1; }
        for (var i = 0; i < this.array.length; i++) {
            var cmp = (compareTuples([megota, expans, arrow], [this.array[i].megota, this.array[i].expans, this.array[i].arrow]));
            if (cmp == 0)
                return i; // I find it was [xx,xxx,*xxx*,xxx]!
            if (cmp == 1)
                return i - 0.5; // It's between [xx, xx,xx*,?,*xx]!
        }
        return this.array.length - 0.5;
    };
    /**
     * @returns number repeats of operators with given arguments.
     */
    PowiainaNum.prototype.getOperator = function (arrow, expans, megota) {
        if (expans === void 0) { expans = 1; }
        if (megota === void 0) { megota = 1; }
        var index = this.getOperatorIndex(arrow, expans, megota);
        if (!(this.array[index]))
            return 0;
        return this.array[index].repeat;
    };
    /**
     * Modify the repeat of operator
     * @param number val the repeat of operator will modify to array.
     * @returns bool Is the operators array changed?
     */
    PowiainaNum.prototype.setOperator = function (val, arrow, expans, megota) {
        if (expans === void 0) { expans = 1; }
        if (megota === void 0) { megota = 1; }
        var index = this.getOperatorIndex(arrow, expans, megota);
        if (!(this.array[index])) {
            this.array.splice(Math.floor(index), 0, {
                arrow: arrow,
                expans: expans,
                megota: megota,
                valuereplaced: (expans === Infinity ? 1 : arrow == Infinity ? 0 : -1),
                repeat: val
            });
            return true;
        }
        this.array[index].repeat = val;
        return false;
    };
    PowiainaNum.fromNumber = function (x) {
        var obj = new PowiainaNum(); // NaN
        if (x < 0)
            obj.sign = -1; // negative
        else if (x == 0)
            obj.sign = 0;
        else if (x > 0)
            obj.sign = 1;
        var y = Math.abs(x);
        if (y < 1) {
            obj.small = 1;
            obj.setOperator(1 / y, 0);
        }
        else {
            obj.setOperator(y, 0);
        }
        obj.normalize();
        return obj;
    };
    PowiainaNum.fromObject = function (powlikeObject) {
        var obj = new PowiainaNum();
        obj.array = [];
        for (var i = 0; i < powlikeObject.array.length; i++) {
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
    };
    PowiainaNum.prototype.resetFromObject = function (powlikeObject) {
        this.array = [];
        for (var i = 0; i < powlikeObject.array.length; i++) {
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
    };
    PowiainaNum.ZERO = new PowiainaNum({
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
    PowiainaNum.ONE = new PowiainaNum({
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
    return PowiainaNum;
}());

export { PowiainaNum as default };
