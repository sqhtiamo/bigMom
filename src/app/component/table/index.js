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
  *	TODO：
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
.directive('xmallTable', function () {
    return {
        restrict: 'E',
        scope: {
            props: '=props',
            dragable: '@',
            class: '@'
        },
        templateUrl: template,

        link: function ($scope, $el, attrs, controller) {

            // checkbox
            $scope.check = function (id, checked) {

                if (id === -1) {
                    for (var i = 0; i < $scope.props.body.length; i++) {
                        for (var j = 0; j < $scope.props.body[i].length; j++) {
                            $scope.props.body[i][j].checked = $scope.props.checkAll;
                        }
                    }
                }
                else if (!checked) {
                    $scope.props.checkAll = false;
                }
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

