// var ngSanitize = require('angular-sanitize')

var app = require('angular').module('app');

var template = require('./template');

require('./style');

require('../../component/multiChoice');

require('../../component/datePicker');

app.directive('xmallCondition', function () {
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

