var axios = require('axios')
var contentful = require('./dist/contentful').default
module.exports = {
  createClient: function (params) {
    return contentful(axios, params)
  }
}
