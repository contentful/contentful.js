const { readFileSync } = require('fs')
const { resolve } = require('path')

const express = require('express')
const app = express()

const mode = process.env.CONTENTFUL_E2E_MODE || 'browser'

app.get('/', function (req, res) {
  res.send(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>end to end tests</title>
  </head>
  <body>
    <h1>Contentful CDA end 2 end test</h1>
    <pre></pre>
    <script src="/sdk.js"></script>
    <script src="/test.js"></script>
  </body>
</html>`)
})

app.get('/sdk.js', function (req, res) {
  const sdk = readFileSync(resolve(__dirname, '..', '..', 'dist', `contentful.${mode}.min.js`))
  res.send(sdk)
})

app.get('/test.js', function (req, res) {
  res.send(`
  function updateStatus (status) {
    console.log(status)
    document.querySelector('h1').innerText = status
  }

  updateStatus('Initialising client')

  const client = contentful.createClient({
    space: 'developer_bookshelf',
    accessToken: '0b7f6x59a0'
  })

  updateStatus('Getting entries')

  client.getEntries()
    .then(function (response) {
      updateStatus('Found ' + response.items.length + ' entries')

      updateStatus('Getting assets')

      return client.getAssets()
        .then(function (response) {
          updateStatus('Found ' + response.items.length + ' assets')
        })
    })
    .then(function () {
      updateStatus('Success')
    })
    .catch(function (err) {
      updateStatus('Error')
      console.error(err)
      document.querySelector('pre').innerText = JSON.stringify(err, null, 2)
    })
`)
})

module.exports = function initServer (cb) {
  const server = app.listen(3000, () => cb(server))
}
