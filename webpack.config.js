const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

/**
 * A module to get package informations from package.json
 * @module getPackageJson
 * @param {...string} keys from package.json if no arguments passed it returns package.json content as object
 * @returns {object} with given keys or content of package.json as object
 */

/**
 * Returns package info
 */
const getPackageJson = function (...args) {
  const packageJSON = JSON.parse(fs.readFileSync(path.join(__dirname, './package.json')))
  if (!args.length) {
    return packageJSON
  }
  return args.reduce((out, key) => {
    out[key] = packageJSON[key]
    return out
  }, {})
}

const {
  version,
  name,
  license,
  repository,
  author
} = getPackageJson('version', 'name', 'license', 'repository', 'author')

const banner = `
  ${name} v${version}
  ${repository.url}

  Copyright (c) ${author.replace(/ *\<[^)]*\> */g, ' ')} and project contributors.

  This source code is licensed under the ${license} license found in the
  LICENSE file in the root directory of this source tree.
`

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    filename: 'pek.js',
    path: path.resolve(__dirname, 'build'),
    library: 'pekjs',
    libraryTarget: 'umd',
    clean: true
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({ extractComments: false }),
      new CssMinimizerPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/index.css'
    }),
    new webpack.BannerPlugin(banner)
  ]
}
