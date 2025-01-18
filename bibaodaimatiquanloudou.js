var o = (function () {
    var obj = {
        a: 1,
        b: 2,
    };
    return {
        get: function (k) {
            return obj[k]
        }
    }
})();

// 目标：修改obj对象


// 思路： defineGetter

b = o.get("__defineGetter__")