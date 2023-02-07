const contentful = require('./dist/contentful.node')
const client = contentful.createClient({
  space: '6fqijljzyr0e',
  accessToken: '123', // Get your token from https://app.contentful.com/spaces/6fqijljzyr0e/api/keys
  additionalTokens: {
    kdtd0watvk6m: 'foo', // Get your token from https://app.contentful.com/spaces/kdtd0watvk6m/api/keys
    wbikpgc0fqzf: 'foo', // Get your token from https://app.contentful.com/spaces/wbikpgc0fqzf/api/keys
    bqct66ehcfcf: 'foo', // Get your token from https://app.contentful.com/spaces/bqct66ehcfcf/api/keys
    pwi5ymchftec: 'foo' // Get your token from https://app.contentful.com/spaces/pwi5ymchftec/api/keys
  }
})
// This API call will request an entry with the specified ID from the space defined at the top, using a space-specific access token.
client
  .getEntry('66NQogu3bNHRMDaDASSgFm', { include: 10 })
  .then(entry => console.dir(entry, { depth: 10 }))
  .catch(err => console.log(err))
