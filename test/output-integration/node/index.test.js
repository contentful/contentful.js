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
