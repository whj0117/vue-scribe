const {merge} = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const TerserJSPlugin = require("terser-webpack-plugin")

function resolve(name) {
    return path.resolve(__dirname, name)
}

module.exports = merge(common, {
        mode: 'production',
        entry: ['babel-polyfill', './src/components/index.js'],
        output: {
            filename: 'js/scribe.js',
            path: resolve('./lib'),
            publicPath:'/lib/',
            library:'scribe',
            libraryTarget:'umd',
            umdNamedDefine:true
        },
        optimization: {
            minimizer: [new OptimizeCSSAssetsPlugin({}), new TerserJSPlugin({})], //css,js压缩混稀
        }
    }
)
