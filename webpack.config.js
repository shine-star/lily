var path = require('path');
var WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  entry: './app/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    new WebpackNotifierPlugin(),
  ]
};