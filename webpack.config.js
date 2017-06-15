const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: ['./src/index.js'],
  output: {
    path: path.resolve('./build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      { test: /\.js?$/, loaders: ['babel-loader'] },
    ],
  },
  resolve: {
    alias: {
    },
  },
};
