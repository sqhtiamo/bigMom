
var app = require('angular').module('app');

require('./style.scss');

require('../../service/dateTool');

require('../inputSelect');

var template = require('./template.html');

app.directive('xmallDatepickerMinute', function ($interval, DateTool) {

    return {
        scope: {
            props: '=props',
            class: '@'
        },
        templateUrl: template,
        replace: false,
        restrict: 'E',
        link: function ($scope, $element, attrs) {

            var date = new Date($scope.props);
            var hour = date.getHours();
            var minute = date.getMinutes();

            $scope.day = {};
            // 秒数归0
            date.setMilliseconds(0);
            date.setSeconds(0);
            $scope.props = +date;

            $scope.day.value = DateTool.startDay($scope.props);


            $scope.minute = {
                options: (new Array(61).join(0).split('')).map(function (value, index) {
                    return {
                        text: index < 10 ? '0' + index : index,
                        value: index
                    };
                }),
                text: minute < 10 ? '0' + minute : minute,
                value: minute
            };

            $scope.hour = {
                options: (new Array(25).join(0).split('')).map(function (value, index) {
                    return {
                        text: index < 10 ? '0' + index : index,
                        value: index
                    };
                }),
                text: hour < 10 ? '0' + hour : hour,
                value: hour
            };

            $scope.$watch('hour.value', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.props = date.setHours(newValue);
                }
            });
            $scope.$watch('minute.value', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.props = date.setMinutes(newValue);
                }
            });

            $scope.$watch('day.value', function (newValue, oldValue) {

                if (newValue !== oldValue) {
                    // 获取时、分
                    var min = date.getMinutes();
                    if (window.isNaN(min)) {
                        min = +$scope.minute.value;
                    }
                    var hour = date.getHours();
                    if (window.isNaN(hour)) {
                        hour = +$scope.hour.value;
                    }

                    date = new Date(newValue);

                    date.setHours(hour);
                    date.setMinutes(min);

                    $scope.props = +date;
                }
            });
            // $scope.$watch()
        }
    };
});
