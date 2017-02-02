#!/usr/bin/env node
var os = require('os');
var exec = require('child_process').exec;
var argv = require('yargs').argv;

var cmdFile = 'qrsync-linux';
if ('win32' === os.platform()) {
    cmdFile = 'qrsync.exe';
}
else if ('darwin' === os.platform()) {
    cmdFile = 'qrsync';
}

// 七牛上传scripts
function deployScripts() {
    console.log(__dirname + '/CMD/' + cmdFile + ' ' + __dirname + '/' + argv.file);
    exec(__dirname + '/CMD/' + cmdFile + ' ' + __dirname + '/' + argv.file, function (err, result, msg) {
        console.log(msg);
        console.log(result);
        if (err) {
            console.error('error while qrsync scripts' + err);
            var errString = err + '';
            if (errString.indexOf('maxBuffer exceeded') !== -1) {
                deployScripts();
            }
        }
        else {
            console.log('qrsync success scripts');
        }
    });
}

deployScripts();
