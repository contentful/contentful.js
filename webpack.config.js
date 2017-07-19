const path = require('path')

const webpack = require('webpack')
const BabiliPlugin = require('babili-webpack-plugin')

const PROD = process.env.NODE_ENV === 'production'

const plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.IgnorePlugin(/vertx/),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
]

if (PROD) {
  plugins.push(
    new BabiliPlugin()
  )
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  )
}

const jsLoaderIncludes = [
  path.resolve(__dirname, 'lib'),
  path.resolve(__dirname, 'node_modules', 'mem'),
  path.resolve(__dirname, 'node_modules', 'mimic-fn')
]

module.exports = [
  {
    // Browser
    context: path.join(__dirname, 'lib'),
    entry: './contentful.js',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: `contentful${PROD ? '.min' : ''}.js`,
      libraryTarget: 'umd',
      library: 'contentful'
    },
    module: {
      loaders: [
        {
          test: /\.js?$/,
          include: jsLoaderIncludes,
          loader: 'babel-loader',
          options: {
            env: 'browser'
          }
        }
      ]
    },
    devtool: PROD ? false : 'source-map',
    plugins: plugins
  },
  {
    // Node
    context: path.join(__dirname, 'lib'),
    entry: './contentful.js',
    target: 'node',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: `contentful.node${PROD ? '.min' : ''}.js`,
      libraryTarget: 'commonjs2',
      library: 'contentful'
    },
    module: {
      loaders: [
        {
          test: /\.js?$/,
          include: jsLoaderIncludes,
          loader: 'babel-loader',
          options: {
            env: 'node'
          }
        }
      ]
    },
    devtool: PROD ? false : 'source-map',
    plugins: plugins
  }
]
