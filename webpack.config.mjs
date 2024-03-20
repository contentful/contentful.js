import { fileURLToPath } from 'url'
import path from 'path'
import copy from 'fast-copy'
import webpack from 'webpack'
import pkg from './package.json' assert { type: 'json' }

import { BundleStatsWebpackPlugin } from 'bundle-stats-webpack-plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const __VERSION__ = pkg.version

const PROD = process.env.NODE_ENV === 'production'
const baseFileName = 'contentful'

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    __VERSION__: JSON.stringify(__VERSION__),
  }),
]

if (PROD) {
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
  )
    plugins.push(
      new BundleStatsWebpackPlugin()
    )
}

const baseBundleConfig = {
  mode: PROD ? 'production' : 'development',
  entry: [pkg.exports["."].import],
  output: {
    path: path.join(__dirname, 'dist'),
  },
  plugins,
}

const browserBundle = copy(baseBundleConfig)
browserBundle.output.library = {
  type: 'umd2',
  name: 'contentful',
}

browserBundle.target = 'browserslist'
browserBundle.output.filename = `${baseFileName}.browser${PROD ? '.min' : ''}.js`

export default browserBundle
