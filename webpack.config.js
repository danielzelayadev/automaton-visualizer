var path = require('path');

module.exports = {
    devtool: "inline-sourcemap",
    entry: [ 'babel-polyfill', './app/index.js'],
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
                loaders: ['style', 'css?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]']
            },
            {
              test: /\.css$/,
              include: /node_modules/,
              loaders: ['style', 'css']
            }
        ]
    }
};