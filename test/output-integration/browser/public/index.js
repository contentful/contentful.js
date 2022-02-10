/* eslint-disable */
async function run() {
  if (!contentful) {
    throw 'Contentful.js could not be loaded. Please check the build output.'
  }

  const client = contentful.createClient({
    accessToken: 'QGT8WxED1nwrbCUpY6VEK6eFvZwvlC5ujlX-rzUq97U',
    space: 'ezs1swce23xe',
  })

  const response = await client.getEntry('nyancat')
  document.querySelector('#content').innerHTML = response.sys.id
}

run()
