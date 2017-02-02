// XmallHtmlPlugin.js

var _ = require('lodash');

var fs = require('fs');

var path = require('path');

var mkdirp = require('mkdirp');

var sep = path.sep;

function XmallHtmlPlugin(options) {

    this.options = options;

}




var getEntries = function (compilation) {

    var files = {
        js: {},
        css: {},
        lib: {},
        map: {}
    };

    _.each(compilation.assets, function (content, file) {

        // console.log(file)
        var fileArray = file.split('/');

        var filename = fileArray[fileArray.length - 1].split('.')[0];

        // 去除map
        if (/map$/.test(file)) {
            files.map[filename] = file;
        }

        else if (/^(\.\/)?lib\//.test(file)) {
            files.lib[filename] = file;
        }
        else if (/js$/.test(file)) {
            files.js[filename] = file;
        }
        else if (/css$/.test(file)) {
            files.css[filename] = file;
        }
    });

    return files;

};


var replaceConfig = function (html) {

    var reg = /\<xmall\-config\>([\s\S]*)\<\/xmall\-config\>/;

    var data = html.match(reg);

    if (data) {

        var config = JSON.parse(data[1]).data;

        var header = config.header;

        var footer = config.footer;

        var headerSrc = __dirname + '/../src/views' + header.src;

        var footerSrc = __dirname + '/../src/views' + footer.src;

        var headerHtml = fs.readFileSync(headerSrc, 'utf-8');

        var footerHtml = fs.readFileSync(footerSrc, 'utf-8');

        var css = header.css.map(function (file) {
            return '<link href="{{{'
            + file
            + '}}}" rel="stylesheet" type="text/css">';

        });

        headerHtml = headerHtml.replace('{{{=title}}}', header.title)
                  .replace('{{{=controller}}}', header.controller)
                  .replace('{{{=pageClass}}}', header.pageClass)
                  .replace('{{{=style}}}', css.join('\n'));


        var js = footer.js.map(function (file) {
            return '<script type="text/javascript" src="{{{'
            + file
            + '}}}"></script>';
        });

        footerHtml = footerHtml.replace('{{{=script}}}', js.join('\n'));

        return headerHtml + html.replace(reg, '') + footerHtml;
    }

    return html;
};

var replaceMd5 = function (html, entry, cdnHost, filename) {
    var reg = new RegExp('({{{.*\.js}}}|{{{.*\.css}}})', 'g');

    var scriptList = html.toString().split(reg);

    return scriptList.map(function (resource) {
        // 为了优化全局减少正则判断，此处判断不够严谨
        if (resource.slice(0, 3) === '{{{') {
            var lineReg = new RegExp('^({{{)(.*/)([a-zA-Z0-9]+)(\.[a-zA-Z0-9]*)*(\.js}}}|\.css}}})$');

            var tags = resource.split(lineReg);
            var path = tags[2];
            var name = tags[3];
            var suffix = tags[5].replace('}}}', '');
            var url = '';


            if (entry.js[name] && suffix === '.js') {
                url = cdnHost + path + entry.js[name];
            }
            else if (entry.css[name] && suffix === '.css') {
                url = cdnHost + path + entry.css[name];
            }
            else if (entry.lib[name]) {
                var lib = entry.lib[name].split('/');

                url = cdnHost + path + lib[lib.length - 1];
            }
            // 需要修改
            else if (/app\/lib\//.test(path)) {

                url = cdnHost + path + name + '.min' + suffix;
            }
            else {

                console.error('Cannot find resource ' + path + name + suffix
                    + ' in ' + filename);
            }

            return url;
        }
        return resource;

    }).join('');
};

XmallHtmlPlugin.prototype.apply = function (compiler) {
    // ...
    //
    var self = this;

    compiler.plugin('emit', function (compilation, callback) {

        var entry = getEntries(compilation);

        var srcPath = self.options.srcPath;

        var distPath = self.options.distPath;

        var cdnHost = self.options.cdnHost;

        mkdirp.sync(distPath);

        _.each(fs.readdirSync(srcPath), function (file) {

            if (/\.html$/.test(file)) {

                var rs = fs.createReadStream(srcPath + sep + file);

                var ws = fs.createWriteStream(distPath + sep + file);

                // compilation.assets[file] = {
                //     size: function size() {
                //         return fs.statSync(srcPath + sep + file).size;
                //     },
                //     source: function source() {
                //         return fs.readFileSync(srcPath + sep + file);
                //     }
                // };


                rs.on('data', function (html) {

                    html = replaceConfig(html.toString());

                    html = replaceMd5(html, entry, cdnHost, file);

                    // console.log()


                    ws.write(html);


                    // console.log(compilation.assets[file])
                });
            }
        });

        callback();
    });

};

module.exports = XmallHtmlPlugin;
