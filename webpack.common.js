const path = require("path")
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const {VueLoaderPlugin} = require("vue-loader")
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    plugins: [
        new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            title:'index',
            template:'./index.html',
            filename:'index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{loader: "style-loader"}, {loader: "css-loader"}]
            },
            {
                test: /\.styl(us)?$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                    {loader: "stylus-loader"}
                ]
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                options: {
                    presets: ["es2015"]
                },
                include: path.resolve(__dirname, "node_modules")
            },
            {
                test: /\.svg$/,
                loader: "svg-sprite-loader"
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: "url-loader",
                options: {
                    limit: 1024,
                    name: "img/[name].[hash:8].[ext]"
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    esModule: false
                }
            }
        ]
    },
    resolve: {
        alias: {
            vue$: "vue/dist/vue.esm.js",
        },
        extensions: ["*", ".js", ".vue", ".json", '.png', '.jpg']
    }
};
