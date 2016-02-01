try {
  module.exports = require('./dist/contentful').default
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    require('babel-register')
    module.exports = require('./lib/contentful').default
  } else {
    console.log(err)
    process.exit(1)
  }
}
