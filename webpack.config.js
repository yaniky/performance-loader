const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    target: ["web", "es5"],
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        port: 3001,
        host: "127.0.0.1",
        historyApiFallback: true
    },
    entry: "./test/entry.js",
    output: {
        filename:  `[name].js`,
        path: path.resolve(__dirname, "./dist"),
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.(j|t)s$/,
                use: [
                    {
                        loader: path.resolve(__dirname, "./index.js"),
                        options: {
                            performanceTime: 500
                        },
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./test/index.html")
        })
    ]
}