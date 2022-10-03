const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    filename: 'game.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\*.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  },
  devtool: isDevelopment ? 'eval-source-map' : 'source-map',
  devServer: {
    static: './dist',
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'public', 'assets'), to: './assets' }
      ]
    })
  ]
};