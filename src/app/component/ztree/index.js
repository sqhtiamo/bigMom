// var ngSanitize = require('angular-sanitize')

var app = require('angular').module('app');

var template = require('./template');


var $ = require('jquery');

require('ztree');

require('./style');

/**
 *
 * data格式：111
 * class透传
 * event支持
 *
 *
 *	TODO：
 * 1. html中默认text可以拖动。
 * 2. 不支持html转义
 * 3. 事件委托优化
 */
app.directive('xmallZtree', function () {
    return {
        restrict: 'E',
        scope: {
            props: '=props',
            dragable: '@',
            class: '@'
        },
        templateUrl: template,

        link: function ($scope, $el, attrs, controller) {

            var t = $('#ztree');

            var setting = ($scope.props && $scope.props.setting) || {
                data: {
                    key: {
                        title: 't'
                    },
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                }
            };

            var zNodes = $scope.props.data;
            t = $.fn.zTree.init(t, setting, zNodes);

            $scope.props.ztree = t;
        }
    };
});
