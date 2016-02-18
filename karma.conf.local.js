var karmaBaseConf = require('./karma.base.conf')

module.exports = function (config) {
  karmaBaseConf.plugins.push(require('karma-chrome-launcher'))
  karmaBaseConf.browsers = ['Chrome']
  karmaBaseConf.logLevel = config.LOG_DEBUG

  config.set(karmaBaseConf)
}
