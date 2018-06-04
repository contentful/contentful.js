const path = require('path')

const webpack = require('webpack')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const clone = require('lodash/cloneDeep')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const PROD = process.env.NODE_ENV === 'production'

const plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new LodashModuleReplacementPlugin({
    caching: true,
    cloning: true
  })
]

if (PROD) {
  plugins.push(
    new MinifyPlugin()
  )
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  )
}

const baseFileName = `contentful`

const baseBundleConfig = {
  mode: PROD ? 'production' : 'development',
  context: path.join(__dirname, 'lib'),
  entry: [`./${baseFileName}.ts`],
  output: {
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'contentful'
  },
  module: {
    rules: [{ enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }]
  },
  resolve: { extensions: ['.ts', '.js'] },
  devtool: PROD ? false : 'source-map',
  plugins,
  node: {
    os: 'empty'
  },
  // Show minimal information, but all errors and warnings
  // Except for log generation which have to contain all information
  stats: process.env.WEBPACK_MODE === 'log' ? 'verbose' : 'normal'
}

const defaultBabelLoader = {
  test: /\.(t|j)sx?$/,
  use: { loader: 'awesome-typescript-loader',
    options: {
      useCache: true,
      useBabel: true,
      babelOptions: {
        babelrc: true
      },
      babelCore: 'babel-core'
    }
  },
  exclude: /node_modules/
}

// Browsers
const browserBundle = clone(baseBundleConfig)
browserBundle.module.rules.push(defaultBabelLoader)
browserBundle.output.filename = `${baseFileName}.browser${PROD ? '.min' : ''}.js`

// Legacy browsers like IE11
const legacyBundle = clone(baseBundleConfig)
legacyBundle.module.rules.push(defaultBabelLoader)
// To be replaced with babel-polyfill with babel-preset-env 2.0:
// https://github.com/babel/babel-preset-env#usebuiltins
// https://github.com/babel/babel-preset-env/pull/241
legacyBundle.entry = [
  'core-js/fn/promise',
  'core-js/fn/object/assign',
  'core-js/fn/array/from',
  'core-js/fn/array/find',
  'core-js/fn/set'
].concat(legacyBundle.entry)

legacyBundle.output.filename = `${baseFileName}.legacy${PROD ? '.min' : ''}.js`

// Node
const nodeBundle = clone(baseBundleConfig)
nodeBundle.module.rules.push(defaultBabelLoader)

nodeBundle.target = 'node'
nodeBundle.output.libraryTarget = 'commonjs2'
nodeBundle.output.filename = `${baseFileName}.node${PROD ? '.min' : ''}.js`
delete nodeBundle.node

module.exports = [
  browserBundle,
  legacyBundle,
  nodeBundle
]
