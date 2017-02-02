// Local Server
var connect = require('connect');

var app = connect();

var fs = require('fs');

var url = require('url');



function XmalLocalServerPlugin(options) {

    this.options = options;

}

XmalLocalServerPlugin.prototype.apply = function (compiler) {
//     // ...
//     //
    var self = this;

//     compiler.plugin('after-emit', function (compilation, callback) {

    app.use('/api/', function (req, res) {

        var urlObj = url.parse(req.url, true);

        var cgiPath = __dirname + '/../src/cgiMock/api' + urlObj.pathname + '.js';

        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        var r = fs.createReadStream(cgiPath);

        r.on('error', function (err) {

            res.statusCode = 608;
            res.end(err.toString());
            console.error(err);

        }).pipe(res).on('end', function () {
            res.end();
        });
    })
    .use('/', function (req, res) {
        // res.setHeader('Content-Type', 'text/html');

        var urlObj = url.parse(req.url, true);

        var pagePath = __dirname + '/../local' + urlObj.pathname;

        var r = fs.createReadStream(pagePath);

        r.on('error', function (err) {
            res.statusCode = 404;
            res.end(err.toString());

            // map 文件不报错
            if (pagePath.slice(-4) !== '.map'
                && pagePath.slice(-4) !== '.ico') {
                console.error(err);
            }
        }).pipe(res).on('end', function () {
            res.end();
        });
    })
    .listen(self.options.port);

//         callback();
//     });

};

XmalLocalServerPlugin.apply();
module.exports = XmalLocalServerPlugin;


