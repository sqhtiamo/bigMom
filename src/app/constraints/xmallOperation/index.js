// var ngSanitize = require('angular-sanitize')

var app = require('angular').module('app');

var template = require('./template');

require('../../component/multiChoice');

require('../../component/datePicker');

require('../../component/datePickerViewMinute');

require('../../component/dynamicComponent');

require('./style');

app.directive('xmallOperation', function () {
    return {
        restrict: 'E',
        scope: {
            props: '=props',
            class: '@'
        },
        templateUrl: template,

        link: function ($scope, $el, attrs, controller) {
            // console.log($scope)
        }
    };
});

