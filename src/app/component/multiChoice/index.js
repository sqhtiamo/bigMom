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

app.directive('xmallMultiChoice', function () {
    return {
        restrict: 'E',
        scope: {
            props: '=',
            type: '@',
            class: '@'
        },
        templateUrl: template,

        link: function ($scope, $el, attrs, controller) {
            if (!$scope.props.id) {
                $scope.props.id = '_multiChoiceId_' + Math.round(Math.random() * 10000);
            }
            var moduleId = $scope.props.id;

            $scope.props.getSelectData = function (opt) {
                var checkedChannel = $scope.props.data.reduce(
                    function (pre, curr) {
                        if (curr.checked) {
                            pre.push(curr.id);
                        }
                        return pre;
                    }, []);

                if (checkedChannel.indexOf('-1') > -1) {

                    // 选了全部只返回－1，而不返回所有id
                    if (opt && opt.onlyAllChoice) {
                        return ['-1'];
                    }
                    checkedChannel = $scope.props.data.reduce(
                    function (pre, curr) {
                        if (curr.id !== '-1') {
                            pre.push(curr.id);
                        }
                        return pre;
                    }, []);
                }

                return checkedChannel;
            };

            $el.bind('change', function (ev) {

                var targetId = ev.target.id;

                var checked = ev.target.checked;

                var id = targetId.substr(moduleId.length + 1,
                    targetId.length - moduleId.length);

                var i;
                // checkall的逻辑
                if (id === '-1' && checked) {
                    for (i = 0; i < $scope.props.data.length; i++) {
                        if ($scope.props.data[i].id !== '-1') {
                            $scope.props.data[i].checked = false;
                        }
                    }
                }
                else if (id !== '-1' && checked) {
                    for (i = 0; i < $scope.props.data.length; i++) {
                        if ($scope.props.data[i].id === '-1') {
                            $scope.props.data[i].checked = false;
                        }
                    }
                }

                $scope.$apply();

            });
        }
    };
});
