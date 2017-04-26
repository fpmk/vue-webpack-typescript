const helpers = require("./helpers"),
  DefinePlugin = require('webpack/lib/DefinePlugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin');
var vueLoaderConfig = require('./vue-loader.conf');

let config = {
  entry: {
    "main": helpers.root("/src/main.ts")
  },
  output: {
    path: helpers.root("/dist/js"),
    filename: "[name].js"
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js", ".vue", ".html"],
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  module: {
    rules: [
      {test: /\.ts$/, exclude: /node_modules/, enforce: 'pre', loader: 'tslint-loader'},
      {test: /\.ts$/, exclude: /node_modules/, loader: "awesome-typescript-loader"},
      {test: /\.css$/, exclude: /node_modules/, loader: "css-loader"},
      {test: /\.html$/, loader: 'raw-loader', exclude: ['./src/index.html']},
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {from: 'src/assets', to: '../assets'},
      {from: 'src/css', to: '../css'}
    ]),
    new DefinePlugin({
      'process.env': {
        'ENV': process.env.NODE_ENV,
        'NODE_ENV': process.env.NODE_ENV
      }
    })
  ]
};

module.exports = config;
