var angular = require('angular');

var app = angular.module('app', ['datePicker']);

var Loading = require('../../component/loading');

require('../../constraints/xmallNewCondition/index');

require('../../constraints/xmallNewContent/index');

// require('../../constraints/xmallNewOperation/index');

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

    // 查询条件配置
    $scope.condition = {
        conditions: [{
            title: '下单日期时间',
            titleWidth: '100px',
            style: 'block',
            type: 'timeRangeMinuteView',
            startDate: DateTool.startDay(+new Date() - 6 * 24 * 3600 * 1000),
            endDate: +new Date()
        }, {
            // 用来换行，无意义的
            style: 'block'
        }, {
            title: '现金账单号',
            style: 'inline',
            type: 'input',
            inputStyle: 'long-input'
        }],

        buttons: [{
            buttonText: '查询',
            style: 'inline',
            type: 'button',
            class: 'btn-primary',
            callback: function () {
                $scope.search(1);
                // 重新查询后 分页回到第一页
                $scope.table.pagination.currentPage = 1;
                $scope.table.pagination.inputPage = 1;
            }
        }, {
            buttonText: '导出报表',
            style: 'inline',
            type: 'button',
            callback: function () {
                $scope.export();
            }
        }]
    };

    // 查询内容配置
    $scope.table = {
        data: {
            emptyWords: '请输入查询条件并点击查询按钮',
            header: ['Term ID', 'Term名称', '开始日期', '结束日期', '预售渠道', '发布状态', '操作'],
            body: [],
            orderList: []
        },
        buttons: [{
            text: '新增预售Term',
            type: 'primary',
            callback: function () {
                $scope.add();
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
