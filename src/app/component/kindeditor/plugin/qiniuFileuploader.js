require('kindeditor');

require('./qiniuFileUploader.scss');


require('../../singleUploader');


var CONFIG = require('../../../../config.js');

var app = require('angular').module('app');

var refreshPic = require('./image/refresh.png');
// app.directive('xmallQiniuFileUploaderPlugin', function ($timeout, $window, $q, httpPostFactory) {
// /* eslint-disable*/

app.factory('qiniuFileUploaderFactory', function ($http, httpPostFactory) {

    return function () {
        KindEditor.plugin('qiniuFileUploader', function (kindEdtr) {

            var self = this;
            var name = 'qiniuFileUploader';
            var allowImageUpload = kindEdtr.undef(self.allowImageUpload, true);
            var allowImageRemote = kindEdtr.undef(self.allowImageRemote, true);
            var allowFileManager = kindEdtr.undef(self.allowFileManager, false);
            var uploadJson = kindEdtr.undef(self.uploadJson, self.basePath + 'php/upload_json.php');
            var getTokenUrl = kindEdtr.undef(self.getTokenUrl, '');
            var imageTabIndex = kindEdtr.undef(self.imageTabIndex, 0);
            var lang = self.lang(name + '.');

            self.plugin.qiniuImageDialog = function (options) {
                // var imageUrl = options.imageUrl;
                // var imageWidth = kindEdtr.undef(options.imageWidth, '');
                // var imageHeight = kindEdtr.undef(options.imageHeight, '');
                // var imageTitle = kindEdtr.undef(options.imageTitle, '');
                // var imageAlign = kindEdtr.undef(options.imageAlign, '');
                var showRemote = kindEdtr.undef(options.showRemote, true);
                var showLocal = kindEdtr.undef(options.showLocal, true);
                var tabIndex = kindEdtr.undef(options.tabIndex, 0);
                var clickFn = options.clickFn;
                // var target = 'kindeditor_upload_iframe_' + new Date().getTime();

                var html = [
                    '<div style="padding:20px;">',
                    '<div class="tabs"></div>',

                    '<div class="tab2" style="display:none;">',
                    '<div class="tab2-uploader">',
                    '<button class="btn btn-primary" type="button">',
                    '<span>上传文件</span>',
                    '</button>',
                    '<input type="file" name="file" class="ke-upload-btn" multiple="multiple" ',
                    'accept="image/png,image/gif,image/jpeg,image/jpg"/>',
                    '</div>',
                    '<div id="images" class="image-block">',

                    '</div>',
                    '</div>',

                    '<div class="tab1" style="display:none;">',
                    '<div class="ke-dialog-row">',
                    '<label for="remoteUrl" style="width:60px;">' + lang.remoteUrl + '</label>',
                    '<input type="text" id="remoteUrl" class="ke-input-text" name="url" '
                    + 'value="" style="width:200px;" /> &nbsp;',
                    '<span class="ke-button-common ke-button-outer">',
                    // '<input type="button" class="ke-button-common ke-button" name="viewServer" value="' + lang.viewServer + '" />',
                    '</span>',
                    '</div>',
                    '<div class="ke-dialog-row">',
                    '<label for="remoteWidth" style="width:60px;">' + lang.size + '</label>',
                    lang.width + ' <input type="text" id="remoteWidth" '
                    + 'class="ke-input-text ke-input-number" name="width" value="" maxlength="4" /> ',
                    lang.height
                    + ' <input type="text" class="ke-input-text ke-input-number" '
                    + 'name="height" value="" maxlength="4" /> ',
                    '<img class="ke-refresh-btn" src="' + refreshPic + '" width="16" height="16" alt="" style="cursor:pointer;" title="' + lang.resetSize + '" />',
                    '</div>',
                    '<div class="ke-dialog-row">',
                    '<label style="width:60px;">' + lang.align + '</label>',
                    '<input type="radio" name="align" class="ke-inline-block" value="" checked="checked" /> <img name="defaultImg" src="' + require('./image/align_top.gif') + '" width="23" height="25" alt="" />',
                    ' <input type="radio" name="align" class="ke-inline-block" value="left" /> <img name="leftImg" src="' + require('./image/align_left.gif') + '" width="23" height="25" alt="" />',
                    ' <input type="radio" name="align" class="ke-inline-block" value="right" /> <img name="rightImg" src="' + require('./image/align_right.gif') + '" width="23" height="25" alt="" />',
                    '</div>',
                    '<div class="ke-dialog-row">',
                    '<label for="remoteTitle" style="width:60px;">' + lang.imgTitle + '</label>',
                    '<input type="text" id="remoteTitle" class="ke-input-text" '
                    + 'name="title" value="" style="width:200px;" />',
                    '</div>',
                    '</div>',
                    '</div>'
                ].join('');

                var urlBox;
                var viewServerBtn;
                var widthBox;
                var heightBox;
                var refreshBtn;
                var uploader;
                var titleBox;
                var alignBox;
                var tabs;
                var images;

                var dialogWidth = showLocal || allowFileManager ? 650 : 600;
                var dialogHeight = showLocal && showRemote ? 450 : 400;
                var dialog = self.createDialog({
                    name: name,
                    width: dialogWidth,
                    height: dialogHeight,
                    title: self.lang(name),
                    body: html,
                    yesBtn: {
                        name: self.lang('yes'),
                        click: function (e) {
                            if (dialog.isLoading) {
                                return;
                            }

                            var imageArr = kindEdtr('img', images);

                            if (showLocal && showRemote && tabs && tabs.selectedIndex === 0 || !showRemote) {
                                for (var i = 0; i < imageArr.length; i++) {
                                    if (imageArr[i].src) {
                                        clickFn.call(self, imageArr[i].src);
                                    }
                                }
                                return;
                            }
                            var url = kindEdtr.trim(urlBox.val());
                            var width = widthBox.val();
                            var height = heightBox.val();
                            var title = titleBox.val();
                            var align = '';
                            alignBox.each(function () {
                                if (this.checked) {
                                    align = this.value;
                                    return false;
                                }
                            });
                            if (url === 'http://' || kindEdtr.invalidUrl(url)) {
                                alert(self.lang('invalidUrl'));
                                urlBox[0].focus();
                                return;
                            }
                            if (!/^\d*$/.test(width)) {
                                alert(self.lang('invalidWidth'));
                                widthBox[0].focus();
                                return;
                            }
                            if (!/^\d*$/.test(height)) {
                                alert(self.lang('invalidHeight'));
                                heightBox[0].focus();
                                return;
                            }
                            clickFn.call(self, url, title, width, height, 0, align);
                        }
                    },
                    beforeRemove: function () {
                        viewServerBtn.unbind();
                        widthBox.unbind();
                        heightBox.unbind();
                        refreshBtn.unbind();
                        uploader.unbind();
                    }
                });
                var div = dialog.div;

                urlBox = kindEdtr('[name="url"]', div);
                viewServerBtn = kindEdtr('[name="viewServer"]', div);
                widthBox = kindEdtr('.tab1 [name="width"]', div);
                heightBox = kindEdtr('.tab1 [name="height"]', div);
                refreshBtn = kindEdtr('.ke-refresh-btn', div);
                uploader = kindEdtr('.ke-upload-btn', div);
                titleBox = kindEdtr('.tab1 [name="title"]', div);
                alignBox = kindEdtr('.tab1 [name="align"]', div);
                images = kindEdtr('#images', div);


                if (showRemote && showLocal) {
                    tabs = kindEdtr.tabs({
                        src: kindEdtr('.tabs', div),
                        afterSelect: function (i) {}
                    });
                    tabs.add({
                        title: lang.localImage,
                        panel: kindEdtr('.tab2', div)
                    });
                    tabs.add({
                        title: lang.remoteImage,
                        panel: kindEdtr('.tab1', div)
                    });
                    tabs.select(tabIndex);
                }
                else if (showRemote) {
                    kindEdtr('.tab1', div).show();
                }
                else if (showLocal) {
                    kindEdtr('.tab2', div).show();
                }


                var originalWidth = 0;
                var originalHeight = 0;
                function setSize(width, height) {
                    widthBox.val(width);
                    heightBox.val(height);
                    originalWidth = width;
                    originalHeight = height;
                }
                refreshBtn.click(function (e) {
                    var tempImg = kindEdtr('<img src="' + urlBox.val() + '" />', document).css({
                        position: 'absolute',
                        visibility: 'hidden',
                        top: 0,
                        left: '-1000px'
                    });
                    tempImg.bind('load', function () {
                        setSize(tempImg.width(), tempImg.height());
                        tempImg.remove();
                    });
                    kindEdtr(document.body).append(tempImg);
                });

                uploader.change(function (el) {



                    var files = uploader[0].files;

                    var config = {
                        method: 'GET',
                        url: getTokenUrl,
                        headers: {
                            token: localStorage.getItem('token'),
                            userId: localStorage.getItem('userId')
                        },
                        params: options.data
                    };

                    Array.prototype.slice.call(files).forEach(function (file) {
                        $http(config).then(function (data, status) {
                            if (data.data.code === '300') {

                                setTimeout(function () {
                                    top.location.href = '../login.html';
                                }, 3000);
                                alert(data && data.data.message ? data.data.message : '登录超时');
                            }
                            var formData = new FormData();
                            formData.append('key', data.data.data.key);
                            formData.append('token', data.data.data.token);
                            formData.append('file', file);


                            httpPostFactory(uploadJson, formData, {
                                onerror: function () {
                                    alert(file.name + ' 上传失败');
                                },
                                onsuccess: function (res) {

                                    var image = kindEdtr('<img />', document)
                                                .attr('src', CONFIG.qiniuUrl + res.key)
                                                .css('display', 'inline-block')
                                                .css('margin-right', '10px');
                                    images.append(image);

                                    // alert('上传成功');

                                }
                            });
                        });
                    });
                });

                widthBox.change(function (e) {
                    if (originalWidth > 0) {
                        heightBox.val(Math.round(originalHeight / originalWidth * parseInt(this.value, 10)));
                    }
                });
                heightBox.change(function (e) {
                    if (originalHeight > 0) {
                        widthBox.val(Math.round(originalWidth / originalHeight * parseInt(this.value, 10)));
                    }
                });
                urlBox.val(options.imageUrl);
                setSize(options.imageWidth, options.imageHeight);
                titleBox.val(options.imageTitle);
                alignBox.each(function () {
                    if (this.value === options.imageAlign) {
                        this.checked = true;
                        return false;
                    }
                });
                if (showRemote && tabIndex === 0) {
                    urlBox[0].focus();
                    urlBox[0].select();
                }
                return dialog;
            };

            self.plugin.qiniuFileUploader = {
                edit: function () {
                    var img = self.plugin.getSelectedImage();
                    self.plugin.qiniuImageDialog({
                        imageUrl: img ? img.attr('data-ke-src') : 'http://',
                        imageWidth: img ? img.width() : '',
                        imageHeight: img ? img.height() : '',
                        imageTitle: img ? img.attr('title') : '',
                        imageAlign: img ? img.attr('align') : '',
                        showRemote: allowImageRemote,
                        showLocal: allowImageUpload,
                        tabIndex: img ? 0 : imageTabIndex,
                        clickFn: function (url, title, width, height, border, align) {
                            if (img) {
                                img.attr('src', url);
                                img.attr('data-ke-src', url);
                                img.attr('width', width);
                                img.attr('height', height);
                                img.attr('title', title);
                                img.attr('align', align);
                                img.attr('alt', title);
                            }
                            else {
                                self.exec('inserthtml', '<p style="text-align: center;"><img src="'
                                        + url + '" style="'
                                        + (width ? ('width: ' + width + ';') : '')
                                        + (height ? ('height: ' + height + ';') : '')
                                        + '" ></p>');

                            }
                            setTimeout(function () {
                                self.hideDialog().focus();
                            }, 0);
                        }
                    });
                },
                delete: function () {
                    var target = self.plugin.getSelectedQiniuImage();
                    if (target.parent().name === 'a') {
                        target = target.parent();
                    }
                    target.remove();
                    self.addBookmarkindEdtr();
                }
            };
            self.clickToolbar(name, self.plugin.qiniuFileUploader.edit);

        });

        KindEditor.lang({
            'qiniuFileUploader.remoteImage': '图片设置',
            'qiniuFileUploader.localImage': '本地上传',
            'qiniuFileUploader.remoteUrl': '图片地址',
            'qiniuFileUploader.localUrl': '上传文件',
            'qiniuFileUploader.size': '图片大小',
            'qiniuFileUploader.width': '宽',
            'qiniuFileUploader.height': '高',
            'qiniuFileUploader.resetSize': '重置大小',
            'qiniuFileUploader.align': '对齐方式',
            'qiniuFileUploader.defaultAlign': '默认方式',
            'qiniuFileUploader.leftAlign': '左对齐',
            'qiniuFileUploader.rightAlign': '右对齐',
            'qiniuFileUploader.imgTitle': '图片说明',
            'qiniuFileUploader.upload': '浏览...',
            'qiniuFileUploader.viewServer': '图片空间',
            qiniuFileUploader: '七牛图片上传'
        });




    };
});
