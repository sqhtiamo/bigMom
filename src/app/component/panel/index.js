var app = require('angular').module('app');

require('../../component/mouseMove');

require('./style.scss');

var template = require('./template.html');

app.directive('xmallPanel', function () {
    return {
        restrict: 'E',
        scope: {
            props: '=props',
            type: '@',
            class: '@'
        },
        templateUrl: template,

        link: function ($scope, el, attrs, controller) {

            $scope.close = function () {
                $scope.props.show = false;
            };

            $scope.props.width = ($scope.props.width || window.innerWidth / 2);

            if (!/%/.test($scope.props.width)) {
                $scope.props.width += 'px';
            }

            $scope.props.height = ($scope.props.height || window.innerHeight / 2);

            if (!/%/.test($scope.props.height)) {
                $scope.props.height += 'px';
            }

        }
    };
});
