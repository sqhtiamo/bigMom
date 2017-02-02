var app = require('angular').module('app');


app.service('ammd', function () {

    // 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
    // 调用：accAdd(arg1,arg2)
    // 返回值：arg1加上arg2的精确结果
    function accAdd(arg1, arg2) {
        var r1;
        var r2;
        var m;

        try {
            r1 = arg1.toString().split('.')[1].length;
        }
        catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split('.')[1].length;
        }
        catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        return (arg1 * m + arg2 * m) / m;
    }

    function accSub(arg1, arg2) {
        return accAdd(arg1, -arg2);
    }


    function accMul(arg1, arg2) {
        var m = 0;
        var s1 = arg1.toString();
        var s2 = arg2.toString();

        try {
            m += s1.split('.')[1].length;
        }
        catch (e) {}
        try {
            m += s2.split('.')[1].length;
        }
        catch (e) {}
        return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
    }

    function accDiv(arg1, arg2) {
        var t1 = 0;
        var t2 = 0;
        var r1;
        var r2;

        try {
            t1 = arg1.toString().split('.')[1].length;
        }
        catch (e) {}
        try {
            t2 = arg2.toString().split('.')[1].length;
        }
        catch (e) {}

        r1 = Number(arg1.toString().replace('.', ''));
        r2 = Number(arg2.toString().replace('.', ''));
        return (r1 / r2) * Math.pow(10, t2 - t1);
    }

    return {
        add: accAdd,
        minus: accSub,
        multiply: accMul,
        divide: accDiv
    };
});
