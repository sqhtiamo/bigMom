var angular = require('angular');

var app = angular.module('app', ['datePicker']);

var Loading = require('../../component/loading');

require('../../constraints/xmallOperation/index');

require('../../component/panel');

require('../../component/tip');

require('../../component/singleUploader');

require('../../component/qiniuUploader');

require('../../component/kindeditor');

require('../../component/ztree');

require('../../component/inputSelect');

require('../../component/timePicker');

require('../../component/complexTable');

require('../../service/ajax');

require('../../service/dateTool');

require('../../service/validate');

require('./style');

require('../base/style');

var CONFIG = require('../../../config');

var template = require('./xmall-all-component.html');

var template2 = require('./xmall-all2-component.html');

var inputSelect = require('./xmall-inputSelect-component.html');

var timePicker = require('./xmall-timePicker-component.html');


app.controller('PresellController', function ($scope, Ajax, DateTool, Validate, $timeout) {


    $scope.stage = 2;

    $scope.operationStage1 = {

    };

    $scope.operationStage2 = {
        show: true,
        data: [{

            title: 'TimePicker',
            type: 'dynamic',
            template: timePicker,
            data: {

            }
        }, {
            title: 'InputSelect',
            type: 'dynamic',
            template: inputSelect,
            data: {
                options: [{
                    value: 1,
                    text: 1
                }, {
                    value: 2,
                    text: 2
                }, {
                    value: 122,
                    text: 122
                }, {
                    value: 111,
                    text: 111
                }],
                name: 'test2',
                value: ''
            }
        }, {
            title: '分类名称',
            type: 'input',
            inputStyle: 'long-input',
            value: '',
            callback: function () {
                $scope.fetchGoodDetail();
            },
            validate: [{
                rule: 'noEmptyWithTrim',
                errMsg: '请输入预售商品编号'
            }]

        }, {
            title: '所属分类',
            type: 'text',
            value: ''
        }, {
            title: '是否启用',
            type: 'radio',
            name: 'use',
            data: [{
                id: '1',
                value: '是',
                checked: true
            }, {
                id: '0',
                value: '否',
                checked: false
            }]
        }, {
            title: '七牛上传',
            type: 'dynamic',
            template: template,
            data: {
                getTokenUrl: '/api/mall/wsproduct/photoToken',
                url: '//up.qbox.me',
                // url: '//dn-dev-ubank-web-server.qbox.me',
                // url: '//7xntuy.com2.z0.glb.qiniucdn.com/',
                // token: 'e111',
                buttonText: '上传图片',
                picSrc: '',
                events: {
                    onsuccess: function (res) {
                        $scope.operationStage2.data[3].data.picSrc = res.key;
                        $scope.operationStage2.data[3].data.qiniuHost = CONFIG.qiniuUrl;
                    },
                    onerror: function (errMsg) {
                        $scope.errTip.show({
                            message: errMsg || '获取信息失败',
                            type: 'error'
                        });

                    },
                    openprogress: function () {

                    }
                }
            }
        }, {
            title: '富文本编辑器',
            type: 'dynamic',
            template: template2,
            data: {
                name: 'test',
                options: {
                    width: '400px',
                    minWidth: '400px'
                }
            }
        }],
        buttons: [{
            text: '增加下一级分类',
            type: 'default',
            callback: function () {
                alert($scope.operationStage2.data[0].value);
            }
        }]
    };

    $scope.operationStage3 = {
        show: true,
        data: [{
            title: '分类名称',
            type: 'input',
            value: '',
            callback: function () {
                $scope.fetchGoodDetail();
            },
            validate: [{
                rule: 'noEmptyWithTrim',
                errMsg: '请输入预售商品编号'
            }]
        }, {
            title: '所属分类',
            type: 'text',
            value: '',
            callback: function () {
                $scope.fetchGoodDetail();
            },
            validate: [{
                rule: 'noEmptyWithTrim',
                errMsg: '请输入预售商品编号'
            }]
        }, {
            title: '是否启用',
            type: 'radio',
            name: 'use',
            data: [{
                id: '1',
                value: 2222
            }, {
                id: '111',
                value: 222231
            }]
        }],
        buttons: [{
            text: '编辑',
            type: 'primary',
            callback: function () {
                // $scope.save();
            }
        }, {
            text: '增加下一级分类',
            type: 'default',
            callback: function () {
                $scope.close();
            }
        }]
    };

    $scope.errTip = {
        message: '错误',
        type: 'error',
        interval: 3000,
        show: function () {}
    };


    $scope.content = {
        setting: {
            data: {
                key: {
                    title: 't'
                },
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick: function () {
                    $scope.clickZtree();
                }
            }
        },
        data: [
        ]

    };

    $scope.cancelPanel = {
        title: '取消',
        content: '是否取消新增商品?',
        height: 200,
        width: 500,
        buttons: [{
            text: '是',
            style: 'primary',
            callback: function () {
                $scope.cancelPanel.show = false;
            }
        }, {
            text: '否',
            style: 'default',
            callback: function () {
                $scope.cancelPanel.show = false;
            }
        }],
        id: ''
    };

    $scope.table = {
        emptyWords: '暂无商品',
        header: ['商品简称', '会员价', '商城价', '销量', '银行渠道', '商品类型',
            '上架状态', '商品编号', '创建时间', {type: 'op', text: '操作'}
        ],
        body: [],
        productList: []
    };

    $scope.changeList = function () {
        $scope.table.loading = true;
        $scope.table.body = [];

        $timeout(function () {
            $scope.table.body.push(
                [
                    '1',
                    'ddd',
                    'ddd',
                    '2',
                    '3',
                    '32',
                    '32',
                    'ffewfew',
                    '份额及违法份额及违法份额及违法份额及违法份额及违法份额及违法份额及违法份额及违法份额及违法',
                    {
                        type: 'op',
                        ops: [
                            {
                                text: '编辑',
                                type: 'text',
                                func: function (id) {
                                }
                            },
                            {
                                text: '查看',
                                type: 'text',
                                func: function (id) {
                                }
                            }
                        ]
                    }
                ],
                [
                    '2',
                    '32',
                    '3232',
                    'ffewfew',
                    '1',
                    '32',
                    '3232',
                    'ffewfew',
                    '份额及违法',
                    {
                        type: 'op',
                        ops: [
                            {
                                text: '编辑',
                                type: 'text',
                                func: function (id) {
                                }
                            },
                            {
                                text: '查看',
                                type: 'text',
                                func: function (id) {
                                }
                            }
                        ]
                    }
                ]
            );
            $scope.table.loading = false;
        });
    };

    // $scope.save = function() {


    // };

    var init = function () {

        $scope.getAllCategory();

        Loading.hide();
    };


    $scope.clickZtree = function () {
        alert(3);
    };

    /**
     * 获取所有的分类
     */
    $scope.getAllCategory = function () {

        Ajax.get({
            url: '/api/mall/wscategory/query'
        }).then(function (data) {

            var myData = data.data || {};

            // 如果code不是0000
            // productCategoryList
            if (data.code !== '0000' || !myData.productCategoryList || myData.productCategoryList.length <= 0) {

                $scope.errTip.show({
                    message: myData.message || '获取信息失败',
                    type: 'error'
                });

                return;
            }


            var productCategoryList = myData.productCategoryList;

            // 将categoryList设置到$scope中
            $scope.productCategoryList = productCategoryList;

            var ztree = $scope.content.ztree;

            // 将第一级的分类数据放到第一个selector的scope中
            productCategoryList.forEach(function (category, index) {


                $scope.content.data.push({
                    id: '0',
                    pId: '0',
                    name: '普通的父节点'
                        // t: '我很普通，随便点我吧',
                        // open: true
                });

            });



            ztree.addNodes(null, $scope.content.data);


        }).catch(function (errMsg) {

            $scope.errTip.show({
                message: errMsg || '获取信息失败',
                type: 'error'
            });

        });

    };

    init();
});
