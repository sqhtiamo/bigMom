// var ngSanitize = require('angular-sanitize')

var app = require('angular').module('app');

var template = require('./template');

require('./style');

require('../tip');

app.filter('paginationRound', function () {
    return function (input) {

        return Math.ceil(input);
    };
}).directive('xmallPagination', function () {
    return {
        restrict: 'E',
        scope: {
            props: '=props',
            dragable: '@',
            class: '@'
        },
        templateUrl: template,

        link: function ($scope, $el, attrs, controller) {

            $scope.errTip = {
                message: '错误',
                type: 'error',
                interval: 3000,
                show: function () {}
            };

            $scope.props = angular.extend({

                totalItem: 0,

                pageNums: [20, 50, 100],
                currentPageNum: 20,
                currentPage: 1,
                inputPage: 1,
                events: {
                    goPage: function (page, pageNum) {}
                }
            }, $scope.props);


            $scope.$watch('props.currentPageNum', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.pageNumberChange(arguments);
                    $scope.props.currentPage = 1;
                    $scope.props.inputPage = 1;
                }
            });

            $scope.pageNumberChange = function () {
                $scope.props.events.goPage(1, $scope.props.currentPageNum);
            };

            $scope.goPage = function (page) {
                page = page || $scope.props.inputPage;

                // 校验page是否合法
                if (window.isNaN(page) || !angular.isNumber(+page) || +page < 1
                    || +page > Math.ceil($scope.props.totalItem / $scope.props.currentPageNum)) {

                    $scope.errTip.show({
                        message: '请输入正确的跳转页数',
                        type: 'error'
                    });

                    return;
                }
                $scope.props.currentPage = page;
                $scope.props.inputPage = page;
                $scope.props.events.goPage(page, $scope.props.currentPageNum);

            };

            $scope.goFirstPage = function () {
                if ($scope.props.currentPage !== 1) {

                    $scope.goPage(1);

                }
            };

            $scope.goLastPage = function () {
                if ($scope.props.currentPage !== Math.ceil(
                    $scope.props.totalItem / $scope.props.currentPageNum)) {

                    $scope.goPage(Math.ceil(
                        $scope.props.totalItem / $scope.props.currentPageNum));

                }
            };

            $scope.goPrevPage = function () {
                if ($scope.props.currentPage !== 1) {

                    $scope.goPage($scope.props.currentPage - 1);

                }
            };

            $scope.goNextPage = function () {

                if (+$scope.props.currentPage !== +Math.ceil(
                    $scope.props.totalItem / $scope.props.currentPageNum)) {

                    $scope.goPage(+$scope.props.currentPage + 1);

                }
            };

            $scope.changeCurrentPage = function () {
                var inputPage = $scope.props.inputPage;

                if (window.isNaN(inputPage) || !angular.isNumber(+inputPage) || +inputPage < 1
                    || +inputPage > Math.ceil($scope.props.totalItem / $scope.props.currentPageNum)) {
                    $scope.props.inputPage = inputPage.slice(0, inputPage.length - 1);
                }

            };

        }
    };
});

