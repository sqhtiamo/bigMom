/**
 * Created by patrickliu on 15/12/28.
 */

// singleUploader 上传单个文件功能
//
var app = require('angular').module('app');

var template = require('./template');

require('./style');

app.directive('xmallSingleUploader', function ($timeout, $window, $q, httpPostFactory) {

    // var UPLOAD_ERROR = {
    //     ERROR_FILE_TYPES: 1,
    //     EXCEED_MAX_SIZE: 2,
    //     UPLOAD_LOGIC_ERROR: 3,
    //     ZERO_BYTE_FILE: 4,
    //     EXCEED_MAX_WIDTH_HEIGHT: 5
    // };


    return {

        restrict: 'E',

        replace: true,

        templateUrl: template,

        scope: {
            // upload callback
            props: '=props'
        },

        link: function ($scope, $element, $attrs) {

            // key 和 token
            $scope.props.key = $scope.props.key || '';
            $scope.props.token = $scope.props.token || '';
            $scope.props.fileType = $scope.props.fileType || [];

            var url = $scope.props.url;

            // var fileType = $scope.props.fileType || [];

            /**
             * fileSize
             * fileName
             * maxFileSize
             */
            var DEFAULT_MAX_IMAGE_WIDTH = 4000;
            var DEFAULT_MAX_IMAGE_HEIGHT = 4000;


            // if not set, set to default value
            var maxImageWidth = $scope.props.maxImageWidth || DEFAULT_MAX_IMAGE_WIDTH;
            var maxImageHeight = $scope.props.maxImageHeight || DEFAULT_MAX_IMAGE_HEIGHT;

            var events = $scope.props.events || {};

            events.onerror = events.onerror || function (opt) {
                if (opt && opt.error && opt.error.msg) {
                    alert(opt.error.msg);
                }
                else {
                    alert('上传出错');
                }
            };

            events.onsuccess = events.onsuccess || function () {
                alert('上传成功');
            };




            // use form data
            if ($window.FormData) {
                // 绑定input type=file的change事件
                // change is only for ie10+ and chrome etc. modern browser

                $scope.upload = function (el) {
                    var val = el.value;
                    var file = el.files[0];

                    // console.log($element(el.target))
                    var extension = fileExtension(val).toLowerCase();

                    // check file type


                    if ($scope.props.fileType && $scope.props.fileType.length
                            && !checkFileType($scope.props.fileType)) {
                        // 错误的文件后缀
                        events.onerror('文件类型错误');
                        clear(el);
                        return;
                    }

                    // check file size
                    $scope.fileSize = 0;
                    $scope.fileSize = file.size || 0;

                    $scope.maxFileSize = $scope.maxFileSize || 2 * 1024 * 1024;

                    if ($scope.fileSize > $scope.maxFileSize) {
                        // 超出文件大小
                        events.onerror('文件大小不得超过' + ($scope.maxFileSize / (1024 * 1024) + 'M'));
                        clear(el);
                        return;
                    }

                    if ($scope.fileSize === 0) {

                        // 文件大小为0
                        events.onerror('文件大小不得为0');
                        clear(el);
                        return;

                    }
                    // check the maxImageWidth and maxImageHeight
                    var _URL = $window.URL || $window.webkitURL;

                    // 非图片
                    if (file.type.indexOf('image') === -1) {
                        startUpload(file, function () {
                            clear(el);
                        });
                    }
                    // 图片
                    else {
                        getImageSize(_URL.createObjectURL(file)).then(function (imageInfo) {
                            // if exceed the maxImageWidth or exceed the maxImageHeight
                            // report error
                            if (imageInfo.width > maxImageWidth || imageInfo.height > maxImageHeight) {
                                clear(el);
                                events.onerror('图片长宽过大');
                            }
                            else {
                                startUpload(file, function () {
                                    clear(el);
                                });
                            }

                        }, function (error) {
                            if (error) {
                                events.onerror(error);
                            }
                            else {
                                events.onerror('文件类型错误');
                            }
                            clear(el);

                        });
                    }


                    function startUpload(file, callback) {

                        var formData = new FormData();

                        $scope.props.loading = true;

                        if ($scope.props.beforeUpload) {
                            $scope.props.beforeUpload(function () {

                                formData.append('key', $scope.props.key);
                                formData.append('token', $scope.props.token);
                                formData.append('file', file);
                                httpPostFactory(url, formData, events, function () {
                                    $scope.props.loading = false;
                                    callback && callback();
                                });
                            });
                        }
                        else {

                            formData.append('key', $scope.props.key);
                            formData.append('token', $scope.props.token);
                            formData.append('file', file);
                            httpPostFactory(url, formData, events, function () {
                                $scope.props.loading = false;
                                callback && callback();
                            });
                        }

                    }

                    function checkFileType(whatIsAccept) {

                        // 判断是否符合accept
                        var accepts = whatIsAccept || [];
                        // var accepts = accept.split(' ');
                        var isAccept = false;

                        angular.forEach(accepts, function (accept) {
                            if (accept.toLowerCase() === extension.toLowerCase()) {
                                isAccept = true;
                            }
                        });
                        return isAccept;
                    }



                    function fileExtension(path) {

                        var matches = path.match(/.*\.(.+?)$/);

                        return (matches && matches.length > 1) ? matches[1] : '';
                    }

                    function clear(el) {
                        var newEl = el.cloneNode();
                        el.parentNode.insertBefore(newEl, el);
                        el.remove();
                    }
                };
            }

            function getImageSize(localFilePath) {

                var newImage = new Image();
                return $q(function (resolve, reject) {

                    // if onload pass the width and height
                    newImage.onload = function () {

                        resolve({
                            width: newImage.width,
                            height: newImage.height
                        });
                    };

                    newImage.onerror = function () {
                        reject('文件类型错误');
                    };

                    newImage.src = localFilePath;

                });
            }
        }
    };
});


app.factory('httpPostFactory', function ($http) {
    return function (url, data, events, callback) {

        events && events.onbeforeSend && events.onbeforeSend();

        $http({
            url: url,
            method: 'POST',
            data: data,
            headers: {
                token: localStorage.getItem('token') || '',
                userId: localStorage.getItem('userId') || '',
                'Process-Data': undefined,
                'Content-Type': undefined
            },
            uploadEventHandlers: {
                progress: function (e) {
                    events && events.onprogress && events.onprogress();
                }
            }
        }).success(function (response) {

            events && events.onsuccess && events.onsuccess(response);

            callback && callback();

        }).error(function (err) {

            if (typeof err === 'string') {
                events && events.onerror && events.onerror(err);
            }
            else if (typeof err === 'object' && err !== null) {
                // 兼容七牛和自己的协议报错
                events && events.onerror && events.onerror(err.error || err.message);
            }
            else {
                events && events.onerror && events.onerror('上传出错');
            }
            callback && callback();
        });
    };
});

