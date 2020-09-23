const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  resolve: {
    alias: {

    }
  },
  devServer: {
    contentBase: baseWebpackConfig.externals.paths.src,
    overlay: {
      warnings: true,
      errors: true
    },
    port: 8081,
  }
})

module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig)
})
