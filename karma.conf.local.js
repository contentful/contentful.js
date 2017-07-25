var karmaBaseConf = require('./karma.base.conf')

module.exports = function (config) {
  karmaBaseConf.plugins.push(require('karma-chrome-launcher'))
  karmaBaseConf.plugins.push(require('karma-firefox-launcher'))
  karmaBaseConf.browsers = ['Chrome', 'Firefox']
  karmaBaseConf.logLevel = config.LOG_DEBUG

  config.set(karmaBaseConf)
}
