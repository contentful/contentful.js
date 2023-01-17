const contentful = require('./dist/contentful.node')
const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: '6fqijljzyr0e', // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  // accessToken: "123"
  accessTokenBySpaceId: {
    '6fqijljzyr0e': 'foo',
    kdtd0watvk6m: 'foo', // Get your token from https://app.contentful.com/spaces/kdtd0watvk6m/api/keys/4GjyewOzLJapX3v8uhCPmT
    wbikpgc0fqzf: 'foo', // Get your token from https://app.contentful.com/spaces/wbikpgc0fqzf/api/keys/2par7jzLTMGLSdl2X0o7Wy
    bqct66ehcfcf: 'foo', // Get your token from https://app.contentful.com/spaces/bqct66ehcfcf/environments/master/api/keys/4mcK4YrrrSmZbJk7MB0ITH
    pwi5ymchftec: 'foo' // Get your token https://app.contentful.com/spaces/pwi5ymchftec/environments/master/api/keys
  },
  resolveResourceLinks: true
})
// This API call will request an entry with the specified ID from the space defined at the top, using a space-specific access token.
client
  .getEntry('66NQogu3bNHRMDaDASSgFm', undefined, 10)
  .then(entry => console.dir(entry, { depth: 10 }))
  .catch(err => console.log(err))
