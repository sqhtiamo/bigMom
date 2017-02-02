var app = require('angular').module('app');

var template = require('./template');

require('./style');

/**
  *
  * data格式：111
  * class透传
  * event支持
  *
  *
  * TODO：
  * 1. html中默认text可以拖动。
  * 2. 不支持html转义
  * 3. 事件委托优化
  */
app.filter('short', function () {
    return function (input) {
        if (input.length > 20) {
            return input.substr(0, 20) + '...';
        }
        return input;
    };
})
.directive('onFinishRenderFilters', function ($timeout) {
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, el, attr) {
            if (scope.$parent.$last === true) {
                var module = 'ng' + attr.onFinishRenderFilters + 'Finished';
                $timeout(function () {
                    scope.$emit(module);
                });
            }
        }
    };
})
.directive('xmallComplexTable', function ($window, $timeout) {
    return {
        restrict: 'E',
        scope: {
            props: '=props',
            dragable: '@',
            class: '@'
        },
        templateUrl: template,

        link: function ($scope, $el, attrs, controller) {

            $scope.props.tabId = 'tb_' + +new Date();
            $scope.resize = function () {

                $scope.el = document.querySelector('#' + $scope.props.tabId + ' .table-box');
                $scope.opEL = document.querySelector('#' + $scope.props.tabId + ' .op-table');

                var scrollWidth = $scope.el.scrollWidth;
                var offsetWidth = $scope.el.offsetWidth;

                if (scrollWidth > offsetWidth) {
                    $scope.opEL.style.display = 'block';
                }
                else if ($scope.opEL) {

                    $scope.opEL.style.display = 'none';
                }
            };

            $scope.$on('ngListFinished', function () {
                $scope.resize();
            });

            $window.addEventListener('resize', function () {
                $scope.resize();
            });

            // checkbox
            $scope.check = function (id, checked) {

                var checkAll = true;

                for (var i = 0; i < $scope.props.body.length; i++) {
                    for (var j = 0; j < $scope.props.body[i].length; j++) {
                        if (id === -1) {
                            $scope.props.body[i][j].checked = $scope.props.checkAll;
                        }
                        if ((typeof ($scope.props.body[i][j].checked) !== 'undefined')
                            && !$scope.props.body[i][j].checked) {
                            checkAll = false;
                        }

                    }
                }

                $scope.props.checkAll = checkAll;

            };

            // drag
            $el.bind('dragstart', function (ev) {

                ev.dataTransfer.setData('text', ev.target.id);
            });

            $el.bind('drop', function (ev) {
                ev.preventDefault();
                var data = ev.dataTransfer.getData('text');

                var target = ev.target;
                while (target.id.indexOf('tr-') === -1) {
                    target = target.parentElement;

                }

                var tr = target;
                var tbody = target.parentNode;

                $scope.props.orderList = [];

                insertAfter(document.getElementById(data), tr);
                for (var i = 0; i < tbody.children.length; i++) {
                    if (tbody.children[i] && tbody.children[i].id && tbody.children[i].id.indexOf('tr-') !== -1) {
                        $scope.props.orderList.push(tbody.children[i].id.substr(('tr-').length));
                    }
                }
            });

            $el.bind('dragover', function (ev) {
                ev.preventDefault();
            });

            function insertAfter(newEl, targetEl) {
                var parentEl = targetEl.parentNode;

                if (parentEl.lastChild === targetEl) {
                    parentEl.appendChild(newEl);
                }
                else {
                    parentEl.insertBefore(newEl, targetEl.nextSibling);
                }
            }
        }
    };
});

