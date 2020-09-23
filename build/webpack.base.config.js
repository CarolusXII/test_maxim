const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  static: path.join(__dirname, '../src/static')
}

module.exports = {
  resolve: {
    alias: {
      '@mdi': path.join(__dirname, '../node_modules/@mdi/font/css/materialdesignicons.css')
    }
  },
  externals: {
    paths: PATHS,
  },
  entry: './src/main.js',
  output: {
    path: PATHS.dist,
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.s(c|a)ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: ['file-loader']
      },
      {
        test:/\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
