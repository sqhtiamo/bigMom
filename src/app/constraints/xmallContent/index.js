// var ngSanitize = require('angular-sanitize')

var app = require('angular').module('app');

var template = require('./template');

require('../../component/table');

require('./style');

app.directive('xmallContent', function () {
    return {
        restrict: 'E',
        scope: {
            props: '=props',
            dragable: '@',
            class: '@'
        },
        templateUrl: template,

        link: function ($scope, $el, attrs, controller) {
        }
    };
});

