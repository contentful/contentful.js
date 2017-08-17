var karmaBaseConf = require('./karma.base.conf')

var browsers = {
  'SL_Chrome': {
    base: 'SauceLabs',
    platform: 'OS X 10.11',
    browserName: 'chrome',
    customData: {
      awesome: true
    }
  },
  'SL_Firefox': {
    base: 'SauceLabs',
    platform: 'OS X 10.11',
    browserName: 'firefox'
  },
  'SL_Edge': {
    base: 'SauceLabs',
    platform: 'Windows 10',
    browserName: 'microsoftedge'
  }
}

module.exports = function (config) {
  karmaBaseConf.plugins.push(require('karma-sauce-launcher'))
  karmaBaseConf.plugins.push(require('karma-firefox-launcher'))
  karmaBaseConf.reporters.push('saucelabs')
  karmaBaseConf.logLevel = config.LOG_DEBUG
  karmaBaseConf.customLaunchers = browsers
  karmaBaseConf.captureTimeout = 200000
  karmaBaseConf.browserDisconnectTolerance = 5
  karmaBaseConf.concurrency = 2
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
