const {merge} = require('webpack-merge')
const common = require('webpack.common.js')
const path = require('path')

function resolve(dir) {
    return path(__dirname, dir)
}

module.exports = merge(common, {
        mode: 'development',
        devtool: "inline-source-map", //控制台提示信息映射
        entry: ['babel-polyfill', './src/components/index.js'],
        output: {
            filename: 'scribe.js',
            path: resolve('lib')
        }
    }
)
