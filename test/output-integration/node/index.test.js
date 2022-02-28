const contentful = require('contentful')

/**
 * This test project should ensure that the builds are actually functioning.
 * Mostly useful for changes to building/transpiling/bundling/...
 */

const client = contentful.createClient({
  accessToken: 'QGT8WxED1nwrbCUpY6VEK6eFvZwvlC5ujlX-rzUq97U',
  space: 'ezs1swce23xe',
})

test('Gets entry', async () => {
  const response = await client.getEntry('nyancat')
  expect(response.sys).toBeDefined()
  expect(response.fields).toBeDefined()
})

test('Has correct user agent version', async () => {
  const version = require('../../../package.json').version
  // When we make a publish run, we need to ensure that semantic-release has set a valid package version
  if (process.env.PUBLISH_RUN === 'true') {
    expect(client.version).toEqual(expect.not.stringContaining('semantic-release'))
    expect(client.version).toEqual(version)
  } else {
    expect(client.version).toEqual(version)
  }
})
