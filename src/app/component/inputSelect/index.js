var angular = require('angular');

var app = angular.module('app');


var template = require('./template.html');

require('./style.scss');

/**
  *
  * data格式：
  * class透传
  * event支持
  *
  */

app.directive('xmallInputSelect', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            props: '=',
            type: '@',
            class: '@'
        },
        templateUrl: template,

        link: function ($scope, $el, attrs, controller) {

            // console.log($scope.props)
            $scope.props.defaultText = $scope.props.text;
            $scope.props.defaultValue = $scope.props.value;

            $scope.props.reset = function () {

                $scope.props.text = $scope.props.defaultText;
                $scope.props.value = $scope.props.defaultValue;
                $scope.props.options.forEach(function (opt) {
                    opt.hide = false;
                });
            };

            $scope.change = function () {


                var regEx = new RegExp(/[(\+)(\\)(\[)(\])(\()(\))(\.)(\?)(\^)(\$)(\*)]/g);
                var newText = $scope.props.text.replace(regEx, '\\$1');
                //  去
                $scope.props.options.forEach(function (opt) {
                    // 输入框是否有匹配到下拉框里的字符
                    if ((new RegExp(newText)).test(opt.text)) {
                    // var matchArr = (opt.text + '').match($scope.props.text + '') || [];
                    // console.log(matchArr);
                    // console.log(opt.text + ' ' + $scope.props.text)
                    // if (matchArr.length) {
                        opt.hide = false;
                    }
                    else {
                        opt.hide = true;
                    }
                });

                // 如不匹配自动退格
                if ($scope.props.options.filter(function (opt) {
                    return !opt.hide;
                }).length === 0) {
                    $scope.props.text = $scope.props.text.slice(0, $scope.props.text.length - 1);
                    $scope.change();
                }
                // 输入恰好匹配下拉框
                else if ($scope.props.options.filter(function (opt) {
                    return opt.text + '' === $scope.props.text + '';
                }).length > 0) {
                    var opts = $scope.props.options.filter(function (opt) {
                        return opt.text + '' === $scope.props.text + '';
                    });

                    $scope.props.value = opts[0].value;
                    $scope.props.text = opts[0].text;
                }
                // 回退为空
                else if ($scope.props.text + '' === '') {
                    $scope.props.value = '';
                    $scope.props.text = '';
                }
            };


            $scope.choose = function (text, value) {
                $scope.props.value = value || '';
                $scope.props.text = text || '';
                $scope.show = false;

            };


            $scope.focus = function () {
                $scope.props.options.forEach(function (opt) {
                    opt.hide = false;
                });
            };

            var blur = function () {
                $timeout(function () {
                    $scope.show = false;
                    var opts = $scope.props.options.filter(function (opt) {
                        return opt.text + '' === $scope.props.text + '';
                    });
                    if (opts.length === 0) {
                        $scope.props.text = $scope.props.defaultText;
                        $scope.props.value = $scope.props.defaultValue;

                        $scope.props.options.forEach(function (opt) {
                            opt.hide = false;
                        });
                    }
                    else {
                        $scope.props.value = opts[0].value;
                        $scope.props.text = opts[0].text;
                    }
                }, 300);
            };

            $el.find('input').bind('blur', blur);

            $scope.$watch('props.value', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.props.options.forEach(function (opt) {
                        if (opt.value === newValue) {
                            $scope.props.text = opt.text;
                        }
                    });
                }
            });

        }
    };
}]);
