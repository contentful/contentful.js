import test from 'tape'
import contentful from '../../lib/contentful'

const client = contentful.createClient({
  accessToken: 'b4c0n73n7fu1',
  space: 'cfexampleapi'
})

test('Gets space', t => {
  client.getSpace()
  .then(response => {
    t.ok(response.sys, 'sys')
    t.ok(response.name, 'name')
    t.ok(response.locales, 'locales')
    t.end()
  })
})

test('Gets content type', t => {
  client.getContentType('1t9IbcfdCk6m04uISSsaIK')
  .then(response => {
    t.ok(response.sys, 'sys')
    t.ok(response.name, 'name')
    t.ok(response.fields, 'fields')
    t.end()
  })
})

test('Gets content types', t => {
  client.getContentTypes()
  .then(response => {
    t.ok(response.items, 'items')
    t.end()
  })
})

test('Gets entry', t => {
  client.getEntry('5ETMRzkl9KM4omyMwKAOki')
  .then(response => {
    t.ok(response.sys, 'sys')
    t.ok(response.fields, 'fields')
    t.end()
  })
})

test('Gets entries', t => {
  client.getEntries()
  .then(response => {
    t.ok(response.items, 'items')
    t.end()
  })
})

test('Gets asset', t => {
  client.getAsset('1x0xpXu4pSGS4OukSyWGUK')
  .then(response => {
    t.ok(response.sys, 'sys')
    t.ok(response.fields, 'fields')
    t.end()
  })
})

test('Gets assets', t => {
  client.getAssets()
  .then(response => {
    t.ok(response.items, 'items')
    t.end()
  })
})
