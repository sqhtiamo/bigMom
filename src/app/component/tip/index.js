
var app = require('angular').module('app');

require('./style.scss');

app.directive('xmallTip', ['$interval', function ($interval) {
    var types = ['success', 'error'];
    var allTypeStr = types.join(' ');
    return {
        scope: {
            props: '=props',
            type: '@',
            class: '@'
        },
        template: '<div class="xmall-tip  {{class}}"></div>',
        restrict: 'E',
        link: function (scope, element, attrs) {
            var defConf = {
                message: 'tip message',

                // type of type
                type: 'success',

                // time to hide element
                interval: 3000
            };
            var timer;
            scope.props.show = function (conf) {
                var _conf = angular.extend(defConf, conf);

                if (_conf.type === 'success') {
                    _conf.interval = 2000;
                }

                element
                    .text(_conf.message)
                    .removeClass(allTypeStr)
                    .addClass(_conf.type)
                    .addClass('xmall-tip-show')
                    .css({left: (window.innerWidth / 2 - 300) + 'px'});

                if (timer) {
                    $interval.cancel(timer);
                    timer = null;
                }

                timer = $interval(function () {
                    if (timer) {
                        $interval.cancel(timer);
                        timer = null;
                    }
                    element.removeClass('xmall-tip-show')
                           .addClass('');

                }, _conf.interval);
            };
        }
    };
}]);
