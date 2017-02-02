var sep = require('path').sep;

var fs = require('fs');


var output = function (env, opt) {

    var srcPath = __dirname + sep + '..' + sep + opt.src;

    var distPath = __dirname + sep + '..' + sep + opt.dist;

    var config = JSON.parse(fs.readFileSync(srcPath, 'utf-8'));

    var content = 'module.exports = ' + JSON.stringify(config[env]);

    fs.writeFileSync(distPath, content, 'utf-8');

    // return '';
};

module.exports = {
    output: output
};
