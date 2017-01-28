var path = require('path');

module.exports = {
    devtool: "inline-sourcemap",
    entry: [ 'babel-polyfill', './app.js'],
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { 
              test: /\.js$/,
              loader: 'babel-loader',
              query: {
                presets: [ 'es2015', 'stage-0' ],
                plugins: ['transform-decorators-legacy', 'transform-class-properties']
              }
            },
            {
              test: /\.css$/,
              include: /node_modules/,
              loaders: ['style', 'css']
            }
        ]
    }
};