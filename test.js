const contentful = require('./dist/contentful.node')
const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: '6fqijljzyr0e', // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  // accessToken: "123"
  accessTokenBySpaceId: {
    '6fqijljzyr0e': 'foo',
    'kdtd0watvk6m': 'bar'
  }
})
// This API call will request an entry with the specified ID from the space defined at the top, using a space-specific access token.
client
  .getEntry('66NQogu3bNHRMDaDASSgFm')
  .then(entry => console.dir(entry, {depth: 10}))
  .catch(err => console.log(err))