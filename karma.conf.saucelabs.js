var karmaBaseConf = require('./karma.base.conf')

var browsers = {
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 7',
    version: '48'
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: '44'
  },
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11'
  },
  sl_edge: {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
    version: '20.10240'
  }
}

module.exports = function (config) {
  karmaBaseConf.plugins.push(require('karma-sauce-launcher'))
  karmaBaseConf.reporters.push('saucelabs')
  karmaBaseConf.logLevel = config.LOG_DEBUG
  karmaBaseConf.customLaunchers = browsers
  karmaBaseConf.captureTimeout = 120000
  karmaBaseConf.browserDisconnectTolerance = 3
  karmaBaseConf.concurrency = 5
  karmaBaseConf.browsers = Object.keys(browsers)
  karmaBaseConf.sauceLabs = {
    // Should be false for running on travis, as travis already starts its own
    // sauce connect
    startConnect: false,
    // https://github.com/karma-runner/karma-sauce-launcher/issues/73
    tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
  }

  config.set(karmaBaseConf)
}
