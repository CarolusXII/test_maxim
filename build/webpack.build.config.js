const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const buildWebpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  resolve: {
    alias: {

    }
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: baseWebpackConfig.externals.paths.static, to: path.join(__dirname, '../dist/static') }
      ]
    }),
    new HtmlWebpackPlugin({
      hash: false,
      template: './src/index.html',
      filename: path.resolve(__dirname, '../dist/index.html'),
    })
  ]
});

module.exports = new Promise((resolve, reject) => {
  resolve(buildWebpackConfig)
})
