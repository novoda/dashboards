var webpack = require('webpack');
var path = require('path');

// variables
var isProduction = process.argv.indexOf('-p') >= 0;
var sourcePath = path.join(__dirname, './src');
var outPath = path.join(__dirname, './dist');

// plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    context: sourcePath,
    entry: {
        main: './index.jsx',
        vendor: [
            'react',
            'react-dom',
            'react-redux',
            'react-router',
            'redux'
        ]
    },
    output: {
        path: outPath,
        publicPath: '/',
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    target: 'web',
    module: {
        loaders: [
            // .ts, .tsx
            {
                test: /.jsx?$/,
                exclude: /node_modules/,
                include: path.join(__dirname, 'src'),
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            plugins: ['transform-object-rest-spread'],
                            presets: [
                                ['es2015', { modules: false }],
                                'react'
                            ],
                        }
                    }
                ]
            },

            // css
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                modules: true,
                                sourceMap: !isProduction,
                                importLoaders: 1,
                                localIdentName: '[local]__[hash:base64:5]'
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    require('postcss-import')({ addDependencyTo: webpack }),
                                    require('postcss-url')(),
                                    require('postcss-cssnext')(),
                                    require('postcss-reporter')(),
                                    require('postcss-browser-reporter')({ disabled: isProduction }),
                                ]
                            }
                        }
                    ]
                })
            },
            // static assets
            { test: /\.html$/, use: 'html-loader' },
            { test: /\.png$/, use: 'url-loader?limit=10000' },
            { test: /\.jpg$/, use: 'file-loader' },
        ],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.bundle.js',
            minChunks: Infinity
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new ExtractTextPlugin({
            filename: 'styles.css',
            disable: !isProduction
        }),
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ],
    devServer: {
        contentBase: sourcePath,
        hot: true,
        stats: {
            warnings: false
        },
        historyApiFallback: {
            index: 'index.html'
        }
    }
}
