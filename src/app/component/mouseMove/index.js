var app = require('angular').module('app');

app.directive('mouseMove', function () {
    return {
        restrict: 'A',
        scope: {
            props: '='
        },
        link: function ($scope, $el, attrs, controller) {
            // this gives us the native JS object

            if (!$scope.$parent.props || !$scope.$parent.props.mouseMove) {
                return;
            }
            $scope.panel = $el[0];
            $scope.isMove = false;
            // 鼠标拖动预留超出屏幕的距离
            $scope.distance = 50;
            $scope.documentWidth;
            $scope.documentHeight;
            $scope.panel.addEventListener(
                'mousedown',
                function (e) {
                    $scope.documentWidth = document.documentElement.clientWidth;
                    $scope.documentHeight = document.documentElement.clientHeight;
                    $scope.isMove = true;
                    $scope.left = $scope.panel.offsetLeft;
                    $scope.top = $scope.panel.offsetTop;
                    var style = 'margin: 0; width: ' + $scope.panel.style.width
                              + '; height: ' + $scope.panel.style.height;
                    style += '; left: ' + $scope.left + 'px; top: ' + $scope.top + 'px;';
                    $scope.panel.style.cssText = style;
                    $scope.startX = e.clientX;
                    $scope.startY = e.clientY;
                }
            );

            $scope.panel.addEventListener(
                'mousemove',
                function (e) {
                    if (!$scope.isMove) {
                        return;
                    }
                    if (e.clientX < $scope.distance && e.clientY < $scope.distance
                        || e.clientX > ($scope.documentWidth - $scope.distance) && e.clientY < ($scope.distance)
                        || e.clientX < $scope.distance && e.clientY > ($scope.documentHeight - $scope.distance)
                        || e.clientY > ($scope.documentHeight - $scope.distance)
                            && e.clientX > ($scope.documentWidth - $scope.distance)) {
                        $scope.isMove = false;
                        return;
                    }
                    if (e.clientX >= $scope.distance && e.clientX <= ($scope.documentWidth - $scope.distance)) {
                        $scope.panel.style.left = ($scope.left + (e.clientX - $scope.startX)) + 'px';
                    }
                    if (e.clientY >= $scope.distance && e.clientY <= ($scope.documentHeight - $scope.distance)) {
                        $scope.panel.style.top = ($scope.top + (e.clientY - $scope.startY)) + 'px';
                    }
                }
            );

            $scope.panel.addEventListener(
                'mouseup',
                function (e) {
                    $scope.isMove = false;
                }
            );
        }
    };
});
