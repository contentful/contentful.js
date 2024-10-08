async function run() {
  if (!contentful) {
    throw 'Contentful.js could not be loaded. Please check the build output.'
  }

  const client = contentful.createClient({
    accessToken: 'QGT8WxED1nwrbCUpY6VEK6eFvZwvlC5ujlX-rzUq97U',
    space: 'ezs1swce23xe',
  })

  const response = await client.getEntry('nyancat')

  const loadedDiv = document.createElement('div')
  loadedDiv.id = 'contentful-loaded'
  document.querySelector('body').appendChild(loadedDiv)

  document.querySelector('#content').innerHTML = response.sys.id

  document.querySelector('#version').innerHTML = client.version
}

run()
