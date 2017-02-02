var app = require('angular').module('app');


app.service('Common', function () {

    var common = {

        /**
         *
         * [focus description] 用来指定id所在的input 进行光标focus
         *
         * @param {[string]} id [dom id in html]
         *
         */
        focus: function (id) {
            setTimeout(function () {
                document.getElementById(id).focus();
            }, 0);
        },

        /**
         * [getUrlParam description] 用来获取URL参数
         *
         * @return {[Array]} [URL上的参数数组]
         *
         */
        getUrlParam: function () {

            var param = {};

            if (window.location.search.split('?').length > 1) {

                var params = window.location.search.split('?')[1].split('&');

                params.forEach(function (value) {
                    param[value.split('=')[0]] = value.split('=')[1];
                });

                return param;
            }

            return null;
        },


        /**
         * [getObjectFromId description] Get The Object in an Array with a specified key
         * @param  {[Array]} arr     [The Array for Choosing from]
         * @param  {[string]} id     [The key Name]
         * @param  {[string]} idName [The key Value]
         * @return {[Object]}        [The Object to Choose]
         */
        getObjectFromId: function (arr, id, idName) {

            idName = idName;
            var _value;

            arr.forEach(function (value, key) {

                if (arguments.length === 3) {
                    if (id.toString() === value[idName].toString()) {
                        _value = value;
                    }
                }
                else if (arguments.length === 4) {
                    if (id.toString() === value[idName][arguments[3]].toString()) {
                        _value = value;
                    }
                }
            });

            return _value;
        },


        setScope: function () {

        },

        getScope: function () {

        },

        openTab: function (title, id, url) {
            var rand = Math.round(Math.random() * 100000);

            if (url.indexOf('?') > -1) {
                url += '&randId=' + rand;
            }
            else {
                url += '?randId=' + rand;
            }

            var url2 = url.split('/');
            url2.shift();

            if (window.self === window.top) {
                window.open(url2.join('/'));
            }
            else {
                window.top.tabCont(title, id + rand, url);
            }
        },

        closeTab: function (id) {
            if (window.self === window.top) {
                window.close();
            }
            else {
                window.top.document.querySelector('#close_' + id
                    + this.getUrlParam().randId).click();
            }
        }
    };

    return common;
});
