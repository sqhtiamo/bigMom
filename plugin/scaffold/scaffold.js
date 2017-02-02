var fs = require('fs');
var args = require('yargs').argv._;

var htmlName;

var jsName = '';

var type = 4;

var cssTypePrefix = 'page-xmall-type';
var cssType = '';

var controllerName = '';
var controllerSuffix = 'Controller';

var tmpl = 'condition';
var tmplPathPrefix = __dirname + '/';
var tmplPathSuffix = 'tmpl';
var tmpPath = '';

if (args.length >= 1 && args.length <= 3) {

    htmlName = args[0];

    jsName = htmlName.replace(/-([a-z])/g, function (match, p1) {
        return p1.toUpperCase();
    });

    controllerName = jsName.replace(/^[a-z]*/, '') + controllerSuffix;

    if (args.length >= 2) {

        tmpl = args[1];

        if (args.length === 3) {
            type = args[2];
        }
    }
}

cssType = cssTypePrefix + type;
tmpPath = tmplPathPrefix + tmpl + tmplPathSuffix;

fs.readFile(tmpPath + '/index.html', 'utf-8', function (err, html) {
    if (err) {
        throw err;
    }
    // 生成html
    html = html.replace('{{js}}', jsName)
               .replace('{{type}}', cssType)
               .replace('{{controller}}', controllerName);

    fs.writeFile(__dirname + '/../../src/views/' + htmlName + '.html', html, 'utf-8', function (err) {
        if (err) {
            throw err;
        }
    });

});

var appPath = __dirname + '/../../src/app/page/' + jsName;

if (!fs.existsSync(appPath)) {
    // console.log(1
    fs.mkdirSync(appPath, '0766');
}

createAppFile();


function createAppFile() {
    fs.readFile(tmpPath + '/index.js', 'utf-8', function (err, js) {
        if (err) {
            throw err;
        }

        // 生成js
        js = js.replace('{{controller}}', controllerName);

        fs.writeFile(appPath + '/index.js', js, 'utf-8', function (err) {
            if (err) {
                throw err;
            }
    // console.log(appPath + '/index2.js')
        // console.log(js)
        });

    });

    fs.readFile(tmpPath + '/index.scss', 'utf-8', function (err, scss) {
        if (err) {
            throw err;
        }

        // if (f.)

        fs.writeFile(appPath + '/style.scss', scss, 'utf-8', function (err) {
            if (err) {
                throw err;
            }
        });

    });
}
