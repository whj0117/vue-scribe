const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
module.exports = {
    plugins: [
        new VueLoaderPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{ loader: "style-loader" }, { loader: "css-loader" }]
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.sass$/,
                use: ["style-loader", "css-loader", "sass-loader?indentedSyntax"]
            },
            {
                test: /\.styl(us)?$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    { loader: "stylus-loader" }
                ]
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loaders: {
                        stylus: [
                            { loader: "style-loader" },
                            {
                                loader: "css-loader",
                                options: {
                                    esModule: false,
                                    import: [
                                        path.resolve(
                                            __dirname,
                                            "./src/weblive/src/assets/css/base.styl"
                                        )
                                    ]
                                }
                            },
                            {
                                loader: "stylus-loader",
                                options: {
                                    "resolve url": true,
                                    esModule: false,
                                    import: [
                                        path.resolve(
                                            __dirname,
                                            "./src/weblive/src/assets/css/iconfont.css"
                                        ),
                                        path.resolve(
                                            __dirname,
                                            "./src/weblive/src/assets/css/tim.css"
                                        )
                                    ]
                                }
                            }
                        ],
                        scss: ["style-loader", "css-loader", "sass-loader"],
                        sass: ["style-loader", "css-loader", "sass-loader?indentedSyntax"]
                    }
                }
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                options: {
                    presets: ["es2015"]
                },
                include: [
                    path.resolve(__dirname, "src"),
                ]
                // exclude: /node_modules/
            },
            {
                test: /\.svg$/,
                loader: "svg-sprite-loader",
                options: {
                    symbolId: "[name]"
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: "url-loader",
                options: {
                    limit: 1024,
                    esModule: false, // 这里设置为false
                    // outputPath: "img",
                    encoding: "base64",
                    //publicPath: "./img", //   /public/image
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
        extensions: ["*", ".js", ".vue", ".json",'.png','.jpg'],
        // modules: [path.resolve(__dirname, "src"), "node_modules"]
    }
};
