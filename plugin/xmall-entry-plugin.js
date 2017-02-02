var sep = require('path').sep;

var fs = require('fs');

var srcPage = './src/app/page/';

var viewPath = __dirname + sep + '../src/views';

var pagePath = __dirname + sep + '../src/app/page';

var getEntry = function () {

    return fs.readdirSync(pagePath).reduce(function (pre, cur) {

        var curPath = pagePath + sep + cur;

        var curIndexFile = curPath + sep + 'index.js';

        if (fs.statSync(curPath).isDirectory()
            && fs.existsSync(curIndexFile)
            && fs.statSync(curIndexFile).isFile()) {

            pre[cur] = srcPage + cur + sep + 'index.js';
        }

        // 生成 _dep.js并加入entry中 主要用于引入监听所有html文件
        pre['_page.js'] = srcPage + '_page.js';

        var viewPages = fs.readdirSync(viewPath).filter(function (page) {
            return /\.html$/.test(page);
        }).map(function (page) {
            return 'require(\'raw!../../views/' + page + '\');';
        }).join('\n') + '\n';

        fs.writeFileSync(srcPage + '_page.js', viewPages);

        return pre;

    }, {});

};

module.exports = {
    getEntry: getEntry
};
