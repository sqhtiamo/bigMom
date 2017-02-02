// var ngSanitize = require('angular-sanitize')

var app = require('angular').module('app');

var template = require('./template');



// require('./style');

app.directive('xmallDynamicComponent', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            props: '=props',
            class: '@'
        },
        templateUrl: template,
        link: function ($scope, $el, attrs, controller) {

            var template = $scope.props.template;

            $scope.data = $scope.props.data;

            $el.append($compile(template)($scope));
        }

    };
});

