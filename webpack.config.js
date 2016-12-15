var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: [
        './app/app.jsx'
    ],
    output: {
        path: __dirname,
        filename: './public/bundle.js'
    },
    resolve: {
        root: __dirname,
        alias: {
            applicationStyles: 'app/styles/app.scss'
        },
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [{
            loader: 'babel-loader',
            query: {
                presets: ['react', 'es2015', 'stage-0']
            },
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        }]
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: "./public",
        hot: true
    },
    plugins: [
        new ExtractTextPlugin("bundle.css")
    ]
};