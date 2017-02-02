var app = require('angular').module('app');


app.service('Ajax', function ($http, $q) {


    function httpRequest(config) {

        var deferred = $q.defer();

        $http(config).then(function (data, status) {
            if (data.data.code === '0000') {

                return deferred.resolve(data.data);

            }
            else if (data.data.code === '300') {

                setTimeout(function () {
                    top.location.href = '../login.html';
                }, 3000);
                return deferred.reject(data && data.data.message ? data.data.message : '登录超时');

            }

            else if (data.data.code === '400') {

                return deferred.reject(data && data.data.message ? data.data.message : '没有权限');

            }
            // 后端错误状态码写成200时候的容错
            return deferred.reject(data && data.data.message ? data.data.message : '系统错误');

        }, function (data, status) {
            if (data.data.code === '300') {

                setTimeout(function () {
                    top.location.href = '../login.html';
                }, 3000);

                return deferred.reject(data && data.data.message ? data.data.message : '登录超时');

            }
            else if (data.data.code === '400') {

                return deferred.reject(data && data.data.message ? data.data.message : '没有权限');

            }
            // 后端错误状态码写成200时候的容错
            return deferred.reject(data && data.data.message ? data.data.message : '系统错误');
        });

        return deferred.promise;

    }
    var Ajax =  {

        get: function (options) {

            var config = {
                method: 'GET',
                url: options.url,
                headers: {
                    token: localStorage.getItem('token'),
                    userId: localStorage.getItem('userId')
                },
                params: options.data
            };

            return httpRequest(config);

        },

        post: function (options) {

            var config = {
                method: 'POST',
                url: options.url,
                headers: {
                    token: localStorage.getItem('token'),
                    userId: localStorage.getItem('userId')
                },
                data: options.data
            };

            return httpRequest(config);

        }

    };

    return Ajax;
});
