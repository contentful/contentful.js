const path = require('path')

const webpack = require('webpack')
const clone = require('lodash/cloneDeep')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const babelConfig = require('./babel.config.js')

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

const baseFileName = `contentful`

const baseBundleConfig = {
  mode: PROD ? 'production' : 'development',
  context: path.join(__dirname, 'lib'),
  entry: [`./${baseFileName}.js`],
  output: {
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'contentful'
  },
  module: {
    rules: []
  },
  devtool: PROD ? false : 'source-map',
  plugins,
  node: {
    os: 'empty'
  },
  // Show minimal information, but all errors and warnings
  // Except for log generation which have to contain all information
  stats: process.env.WEBPACK_MODE === 'log' ? 'verbose' : 'normal'
}

function getBabelLoader (scope) {
  console.log({ scope })
  let targets = 'last 2 versions, not IE < 13, not dead'
  if (scope === 'legacy') {
    targets = 'last 5 versions, not IE < 10, not dead'
  }
  if (scope === 'node') {
    targets = { node: '4.7' }
  }
  const options = clone(babelConfig)
  options.presets.push([
    '@babel/preset-env',
    {
      debug: true,
      modules: false,
      useBuiltIns: 'usage',
      targets: clone(targets)
    }
  ])
  console.log('options.presets[0]', JSON.stringify(options.presets[0], null, 2))
  return clone({
    test: /\.js?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: clone(options)
    }
  })
}

// Browsers
const browserBundle = clone(baseBundleConfig)
browserBundle.module.rules = [getBabelLoader('browser')]
browserBundle.output.filename = `${baseFileName}.browser${
  PROD ? '.min' : ''
}.js`

// Legacy browsers like IE11
const legacyBundle = clone(baseBundleConfig)
legacyBundle.module.rules = [getBabelLoader('legacy')]
legacyBundle.output.filename = `${baseFileName}.legacy${PROD ? '.min' : ''}.js`
// legacyBundle.entry = [
//   'core-js/fn/promise',
//   // 'core-js/fn/object/assign',
//   // 'core-js/fn/array/from',
//   // 'core-js/fn/array/find',
//   // 'core-js/fn/set'
// ].concat(legacyBundle.entry)

// Node
const nodeBundle = clone(baseBundleConfig)
nodeBundle.module.rules = [getBabelLoader('node')]
nodeBundle.target = 'node'
nodeBundle.output.libraryTarget = 'commonjs2'
nodeBundle.output.filename = `${baseFileName}.node${PROD ? '.min' : ''}.js`
delete nodeBundle.node

module.exports = [browserBundle, legacyBundle, nodeBundle]

// module.exports = nodeBundle
