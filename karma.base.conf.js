// This file is just a base configuration for karma and not directly usable
// Use karma.conf.local.js for local tests
// Use karma.conf.saucelabs.js for saucelabs tests

const cloneDeep = require('lodash/cloneDeep')
const webpackConfig = cloneDeep(require('./webpack.config.js')[1])
delete webpackConfig.entry
delete webpackConfig.output
webpackConfig.devtool = 'inline-source-map'

// https://webpack.github.io/docs/configuration.html#node
// https://rmurphey.com/blog/2015/07/20/karma-webpack-tape-code-coverage
webpackConfig.node = {
  fs: 'empty'
}

webpackConfig.module.rules = webpackConfig.module.rules.map((rule) => {
  if (rule.loader === 'babel-loader') {
    rule.options.forceEnv = 'test'
  }
  return rule
})

console.log('Karma webpack config:')
console.log(JSON.stringify(webpackConfig, null, 2))

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
  browserDisconnectTolerance: 5,
  browserNoActivityTimeout: 4 * 60 * 1000,
  browserDisconnectTimeout: 10000,
  captureTimeout: 4 * 60 * 1000,
  reporters: [ 'dots' ],
  port: 9876,
  colors: true,
  autoWatch: false,
  singleRun: true
}
