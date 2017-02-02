var app = require('angular').module('app');


app.service('Validate', function () {

    var rules = {
        noEmpty: function (input) {
            return !!input;
        },
        noEmptyWithTrim: function (input) {

            if (!input) {
                return false;
            }

            return !!input.replace(/^\s+|\s+$/, '');
        },
        isNumber: function (input) {

            if (!input) {
                return false;
            }

            input = +input;

            if (window.isNaN(input)) {
                return false;
            }

            return angular.isNumber(input);
        },

        /**
         * 判断是否为空的数组
         * @param {Array} [array] [description]
         * @return {Boolean} [description]
         */
        isEmptyArray: function (array) {

            if (!array) {
                return !!array;
            }

            return array.length !== 0;
        },
        /*
         * '1111' is integer
         */
        isInteger: function (input) {
            return ~~input === +input;
        },

        /**
         * 验证是否为正整数
         * @param {Number} [number] [description]
         * @return {Boolean} [description]
         */
        isPositiveNumber: function (number) {

            if (!number) {
                return false;
            }

            number = number + '';

            return /^[0-9]\d*$/g.test(number);

        },

        /**
         * 大于0的自己正整数
         * @param  {[type]}  number [description]
         * @return {Boolean}        [description]
         */
        isOverZeroNumber: function (number) {

            if (!number) {
                return false;
            }

            number = number + '';

            return /^[1-9]\d*$/g.test(number);

        },

        /**
         * 检查number是不是价格所需要的格式
         * @param  {[type]}  number [description]
         * @return {Boolean}        [description]
         */
        isValidPriceFormat: function (number) {

            if (typeof number === undefined) {
                return false;
            }

            if (+number === 0) {
                return true;
            }

            number = number + '';

            return /^(0.[0-9]{1,}|[1-9][0-9]{0,10}(.[0-9]{1,})?)$/.test(number);

        },

        between: function (input, opt) {
            return (input <= opt.max && input > opt.min);
        },
        max: function (input, max) {
            return input <= max;
        },
        min: function (input, min) {
            return input >= min;
        },
        telphoneNumber: function () {},
        date: function () {},
        maxLength: function (input, maxLength) {
            return input.length <= maxLength;
        },
        minLength: function (input, minLength) {
            return input.length >= minLength;
        }
    };

    var validate = {

        /**
         * [test description]
         * @return {[type]} [description]
         */
        test: function () {

            var validaters;
            var input;

            // 支持Object参数
            if (arguments.length === 1) {
                validaters = arguments[0].validate;
                input = arguments[0].value;
            }
            else {
                validaters = arguments[0];
                input = arguments[1];
            }
            // 支持validater + input 参数
            for (var i = 0; i < validaters.length; i++) {
                if (typeof validaters[i].rule === 'object') {

                    // 匹配错误规则
                    if (validaters[i].unmatch) {
                        if (input.test(validaters[i].rule)) {
                            return validaters[i].errMsg;
                        }
                    }
                    // 匹配正确规则
                    else {
                        if (input.test(validaters[i].rule)) {
                            continue;
                        }
                        else {
                            return validaters[i].errMsg;
                        }

                    }
                }
                // 预设规则
                else if (typeof validaters[i].rule === 'string') {

                    if (rules[validaters[i].rule] && !rules[validaters[i].rule](input, validaters[i].extra)) {

                        return validaters[i].errMsg;
                    }
                }

                else if (typeof validaters[i].rule === 'function') {

                }
            }

            // 没有匹配到错误
            return '';
        }
    };

    return validate;
});
