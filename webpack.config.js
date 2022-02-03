const path = require('path')
const copy = require('fast-copy')
const webpack = require('webpack')

const PROD = process.env.NODE_ENV === 'production'
const baseFileName = 'contentful'

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),
]

if (PROD) {
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    })
  )
}

const defaultTsLoader = {
  test: /\.ts?$/,
  exclude: /node_modules/,
  loader: 'ts-loader',
  options: {},
}

const baseBundleConfig = {
  mode: PROD ? 'production' : 'development',
  context: path.join(__dirname, 'lib'),
  entry: [`./index.ts`],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
  },
  module: {
    rules: [defaultTsLoader],
  },
  plugins,
}

const nodeBundle = copy(baseBundleConfig)
nodeBundle.output.library = {
  type: 'umd2',
  name: 'contentful',
}

nodeBundle.target = 'node'
nodeBundle.output.filename = `${baseFileName}.node${PROD ? '.min' : ''}.js`

const browserBundle = copy(baseBundleConfig)
browserBundle.output.library = {
  type: 'umd2',
  name: 'contentful',
}

browserBundle.target = 'browserslist'
browserBundle.output.filename = `${baseFileName}.browser${PROD ? '.min' : ''}.js`

module.exports = [nodeBundle, browserBundle]
