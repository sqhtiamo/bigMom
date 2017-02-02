// var ngSanitize = require('angular-sanitize')

var app = require('angular').module('app');

var template = require('./template');

require('kindeditor');

require('./plugin/qiniuFileuploader');

require('./default/default');


app.directive('xmallKindeditor', function (qiniuFileUploaderFactory) {
    return {
        restrict: 'E',
        scope: {
            props: '=props',
            dragable: '@',
            class: '@'
        },
        templateUrl: template,

        link: function ($scope, $el, attrs, controller) {

            qiniuFileUploaderFactory();

            var name = $scope.props.name || 'default';
            /* eslint-disable */

            KindEditor.ready(function (K) {


                var options = angular.extend({

                    // KindEditor 本身会创建link标签 无法修改
                    themesPath: '///',
                    loadStyleMode: false,
                    uploadJson: '//up.qbox.me',
                    getTokenUrl: '/api/mall/wsproduct/photoToken',
                    // fileManagerJson: '../asp/file_manager_json.asp',
                    width : '400px',
                    minWidth: '300px',
                    minHeight: '400px',
                    height: '400px',
                    allowFileManager: true,
                    useContextmenu : false,
                    items: [
                        'source', '|', 'undo', 'redo', '|', 'justifyleft', 'justifycenter', 'justifyright',
                        'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
                        'superscript', '|', 'fullscreen', '/',
                        'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
                        'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|',
                        'table', 'hr', 'link', 'unlink', '|',  'qiniuFileUploader', 'preview'
                    ],
                    resizeType: 0,
                    afterCreate: function () {
                        var self = this;
                        K.ctrl(document, 13, function () {
                            self.sync();
                            K('form[name=example]')[0].submit();
                        });
                        K.ctrl(self.edit.doc, 13, function () {
                            self.sync();
                            K('form[name=example]')[0].submit();
                        });
                    },
                    afterBlur: function () {
                        this.sync();
                    }
                }, $scope.props.options);

                $scope.props.editor = K.create('textarea[name="' + name + '"]', options);
            });
        }
    };
});
