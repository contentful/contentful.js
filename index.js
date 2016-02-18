// To understand why axios is vendored, check SETUP.md
var axios = require('./vendor-node/axios')
var contentful
try {
  contentful = require('./dist/contentful').default
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    require('babel-register')
    contentful = require('./lib/contentful').default
  } else {
    console.log(err)
    process.exit(1)
  }
}

module.exports = {
  createClient: function (params) {
    return contentful(axios, params)
  }
}
