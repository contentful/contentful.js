// To understand why axios is vendored, check SETUP.md
var axios = require('contentful-sdk-core/vendor-browser/axios')
var contentful = require('./dist/contentful').default
module.exports = {
  createClient: function (params) {
    return contentful(axios, params)
  },
  // This is intended to be used only for debug reasons
  // e.g: if you want to add interceptor to axios or if you want to use a different vendor
  // if you want to use a different vendor than axios make sure it is using promises
  createClientWithCustomHttpVendor: function (httpVendor, params) {
    return contentful(httpVendor, params)
  }
}
