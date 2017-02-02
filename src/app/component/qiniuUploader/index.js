
var app = require('angular').module('app');


require('../singleUploader');

require('../../service/ajax.js');

var template = require('./template');

app.directive('xmallQiniuUploader', function (Ajax) {

    return {
        restrict: 'E',
        scope: {
            props: '=props',
            class: '@'
        },
        templateUrl: template,
        link: function ($scope, $el, attrs, controller) {
            var events = $scope.props.events;
            var url = $scope.props.getTokenUrl || '/api/mall/wsproduct/photoToken';
            $scope.props.beforeUpload = function (callback) {
                Ajax.get({
                    url: url
                }).then(function (data) {
                    $scope.props.token = data.data.token;
                    $scope.props.key = data.data.key;
                    callback && callback();
                }).catch(function (err) {
                    events && events.onerror && events.onerror(err);
                });
            };

        }
    };


});
