// To understand why axios is vendored, check SETUP.md
var axios = require('./vendor-node/axios')
var contentful = require('./lib/contentful').default
module.exports = {
  createClient: function (params) {
    return contentful(axios, params)
  }
}
