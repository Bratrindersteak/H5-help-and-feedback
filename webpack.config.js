const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        contact: __dirname + '/src/contactUS',
        im: __dirname + '/src/im',
    },
    output: {
        path: path.resolve(__dirname + '/build'),
        filename: '[name]-[hash].js',
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: '/public',
        port: 3000,
        inline: true,
        historyApiFallback: true,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: 'babel-loader',
                },
                exclude: /node_modules/,
            }, {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader',
                    }, {
                        loader: 'css-loader',
                    }, {
                        loader: 'postcss-loader',
                    }, {
                        loader: 'sass-loader',
                    },
                ],
            }, {
                test: /\.(jpg|png|gif|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        name: '[path][name].[ext]',
                        outputPath: 'img/',
                    },
                }],
            },
        ]
    },
    plugins: [
        new webpack.BannerPlugin(`${ new Date() }`),
        new HtmlWebpackPlugin({
            template: __dirname + '/public/contact.html',
            filename: 'contact.html',
            chunks: ['contact'],
            inject: true,
            title: '联系我们',
        }),
        new HtmlWebpackPlugin({
            template: __dirname + '/public/im.html',
            filename: 'im.html',
            chunks: ['im'],
            inject: true,
            title: '意见反馈',
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
};