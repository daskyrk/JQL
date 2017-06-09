const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: ['./src/index.js'],
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      { test: /\.js?$/, loaders: ['babel-loader'] }
    ],
  },
  resolve: {
    alias: {
      '_': 'lodash',
    }
  },
};
