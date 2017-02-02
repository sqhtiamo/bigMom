// var ngSanitize = require('angular-sanitize')

var app = require('angular').module('app');

var template = require('./template');

require('./style');

app.directive('xmallLightLoading', function () {
    return {
        restrict: 'E',
        scope: {
            props: '=props',
            dragable: '@',
            class: '@'
        },
        templateUrl: template,

        link: function ($scope, $el, attrs, controller) {
            $scope.props.show = function () {
                $scope.show = true;
            };

            $scope.props.hide = function () {
                $scope.show = false;
            };
        }
    };
});

