const webpack = require('webpack');

module.exports = {
  entry: ['./src/index.js'],
  output: {
    path: path.resolve('./build'),
    filename: 'bundle.[chunkhash].js',
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
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      comments: false,
      sourceMap: false,
      mangle: true,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
};
