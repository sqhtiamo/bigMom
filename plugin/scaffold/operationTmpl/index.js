var angular = require('angular');

var app = angular.module('app', ['datePicker']);

var Loading = require('../../component/loading');

require('../../constraints/xmallOperation/index');

require('../../component/panel');

require('../../component/tip');

require('../../service/ajax');

require('../../service/dateTool');

require('../../service/validate');

require('../../service/common');

require('./style.scss');

require('../base/style.scss');

var ajaxUrl = {

};

app.controller('{{controller}}', function ($scope, Ajax, DateTool, Validate, Common) {

    // 错误提示弹出框
    $scope.errTip = {
        message: '错误',
        type: 'error',
        interval: 3000,
        show: function () {}
    };

    $scope.operation = {
        show: true,
        title: '新增Term商品',
        data: [
            {
                title: 'Term Id',
                type: 'text',
                value: ''
            }, {
                title: '商品编号',
                type: 'inputButton',
                buttonText: '获取商品',
                buttonStyle: 'primary',
                id: 'productId',
                value: '',
                placeholder: '请输入预售商品编号',
                callback: function () {
                    $scope.fetchGoodDetail();
                },
                validate: [{
                    rule: 'noEmptyWithTrim',
                    errMsg: '请填写商品编号'
                }]
            },
            {
                title: 'Term名称',
                type: 'input',
                maxLength: 8,
                inputStyle: 'long-input',
                id: 'termName',
                placeholder: '最多8个字符',
                value: '',
                validate: [{
                    rule: 'noEmptyWithTrim',
                    errMsg: 'Term名称不可为空'
                }, {
                    rule: 'maxLength',
                    errMsg: '最多录入8个字符的Term名称',
                    extra: 8
                }]
            }
        ],
        buttons: [{
            text: '保存',
            type: 'primary',
            hide: false,
            callback: function () {
                $scope.save();
            }
        }, {
            text: '取消',
            type: 'default',
            hide: false,
            callback: function () {
                $scope.close();
            }
        }, {
            text: '返回',
            type: 'default',
            hide: true,
            callback: function () {
                $scope.close();
            }
        }]
    };

    /**
     * [页面初始化函数]
     */
    $scope.initPage = function () {

    };


    /**
     * [init 初始化函数]
     */
    var init = function () {

        // 初始化页面
        $scope.initPage();

        // 掩藏loading遮罩
        Loading.hide();
    };

    // 调用初始化页面代码
    init();
});
