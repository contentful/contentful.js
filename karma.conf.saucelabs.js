var karmaBaseConf = require('./karma.base.conf')

var browsers = {
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 10',
    version: '50.0'
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Windows 10',
    version: '46.0'
  },
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 10',
    version: '11.103'
  },
  sl_edge: {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
    version: '13.10586'
  }
}

module.exports = function (config) {
  karmaBaseConf.plugins.push(require('karma-sauce-launcher'))
  karmaBaseConf.reporters.push('saucelabs')
  karmaBaseConf.logLevel = config.LOG_DEBUG
  karmaBaseConf.customLaunchers = browsers
  karmaBaseConf.captureTimeout = 200000
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
