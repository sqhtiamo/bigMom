// var webpack = require('webpack');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var CopyWebpackPlugin = require('copy-webpack-plugin');

var WebpackMd5Hash = require('webpack-md5-hash');

var CleanWebpackPlugin = require('clean-webpack-plugin');

var WebpackSftpClient = require('webpack-sftp-client');

var WebpackShellPlugin = require('webpack-shell-plugin');

var OpenBrowserPlugin = require('open-browser-webpack-plugin');

var path = require('path');

var env = require('yargs').argv.env;

var XMallEntry = require('./plugin/xmall-entry-plugin');
var entry = XMallEntry.getEntry();

var XMallConfig = require('./plugin/xmall-config-plugin');
XMallConfig.output(env, {
    src: 'config/env.json',
    dist: 'src/config.js'});


var XMallHtml = require('./plugin/xmall-html-plugin');

var XMallLocalServer = require('./plugin/xmall-local-server-plugin');


var config = {
    entry: entry,

    output: {
        path: __dirname + '/local/app/',
        publicPath: '/app/',
        filename: '[name].[chunkhash].js'
    },

    plugins: [

        new CleanWebpackPlugin(['local'], {
            root: __dirname,
            verbose: true,
            dry: false
        }),

        new WebpackMd5Hash(),

        new ExtractTextPlugin('[name].[contenthash].css', {
            disable: false,
            allChunks: true
        }),

        new CopyWebpackPlugin([{
            copyUnmodified: true,
            from: './src/app/lib/',
            to: './lib/'
        }])

    ]
};

var port = '8080';

if (env === 'local') {

    config.plugins.push(
        new XMallLocalServer({
            port: port
        }),
        new OpenBrowserPlugin({
            url: 'http://localhost:' + port + '/html/sample.html'
        }),
        new XMallHtml({
            distPath: __dirname + '/local/html/',
            srcPath: __dirname + '/src/views/',
            cdnHost: ''
        })
    );
}
else if (env === 'localServer') {

    config.output.publicPath = '//localhost:9090/app/';

    config.plugins.push(
        new XMallLocalServer({
            port: port
        }),
        new OpenBrowserPlugin({
            url: 'http://localhost:' + port + '/html/sample.html'
        }),
        new XMallHtml({
            distPath: __dirname + '/local/html/',
            srcPath: __dirname + '/src/views/',
            cdnHost: '//localhost:9090'
        })
    );
}
else if (env === 'dev') {

    config.output.publicPath = '//qiniuHost/dev1/admin/boss/xmall/app';

    config.plugins.push(
        new WebpackSftpClient({
            port: '22',
            host: 'host',
            username: 'user',
            password: 'password',
            path: './local/',
            remotePath: '/data/website/admin/boss/xmall/'
        }),
        new XMallHtml({
            distPath: __dirname + '/local/html/',
            srcPath: __dirname + '/src/views/',
            cdnHost: '//qiniuHost/dev1/admin/boss/xmall/'
        }),

        new WebpackShellPlugin({onBuildEnd: [
            'echo "Webpack End"',
            './plugin/QINIU/qrsync ./plugin/QINIU/QINIU_DEV_APP.json'
        ]})
    );

}


module.exports = {
    entry: entry,
    output: config.output,
    module: {
        loaders: [{
            test: /\.scss$/,
            loaders: ['style',  'css', 'sass']
        },
        //  {
        //     test: /\.(gif|png|jpe?p)$/,
        //     loader: 'url-loader',
        //     query: {
        //         limit: 8192,
        //         name: '[name]-[hash].[ext]'
        //     }
        // },
        {
            test: /template\.html$/,
            loader: 'ngtemplate?relativeTo=' + (path.resolve(__dirname, './src/app')) + '/!html'
        }, {
            test: /\.(gif|png|jpe?p)$/,
            loader: 'file-loader'
        }, {
            test: /component\.html$/,
            loader: 'raw-loader'
        }]
    },
    plugins: config.plugins,
    cache: true,
    resolve: {
        extensions: ['', '.js', '.json', '.scss', '.html', './']
    },
    // devtool: 'sourcemap',
    externals: {
        jquery: 'jQuery',
        angular: 'angular',
        moment: 'moment'
    }
};
