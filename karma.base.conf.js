// This file is just a base configuration for karma and not directly usable
// Use karma.conf.local.js for local tests
// Use karma.conf.saucelabs.js for saucelabs tests
var _ = require('lodash')
var webpackConfig = _.cloneDeep(require('./webpack.config.js'))
delete webpackConfig.entry
delete webpackConfig.output
webpackConfig.devtool = 'inline-source-map'

// https://webpack.github.io/docs/configuration.html#node
// https://rmurphey.com/blog/2015/07/20/karma-webpack-tape-code-coverage
webpackConfig.node = {
  fs: 'empty'
}

module.exports = {
  plugins: [
    require('karma-tap'),
    require('karma-webpack')
  ],

  basePath: '',
  frameworks: [ 'tap' ],
  files: [
    'test/runner-browser.js'
  ],

  preprocessors: {
    'test/runner-browser.js': ['webpack'],
    'test/unit/**/*.js': ['webpack']
  },

  webpack: webpackConfig,

  reporters: [ 'dots' ],
  port: 9876,
  colors: true,
  autoWatch: false,
  singleRun: true
}
