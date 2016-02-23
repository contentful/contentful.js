import test from 'blue-tape'
import {filter, map} from 'lodash/collection'
import contentful from '../../'

const client = contentful.createClient({
  accessToken: 'b4c0n73n7fu1',
  space: 'cfexampleapi'
})

test('Gets space', t => {
  t.plan(3)
  return client.getSpace()
  .then(response => {
    t.ok(response.sys, 'sys')
    t.ok(response.name, 'name')
    t.ok(response.locales, 'locales')
  })
})

test('Gets content type', t => {
  t.plan(3)
  return client.getContentType('1t9IbcfdCk6m04uISSsaIK')
  .then(response => {
    t.ok(response.sys, 'sys')
    t.ok(response.name, 'name')
    t.ok(response.fields, 'fields')
  })
})

test('Gets content types', t => {
  t.plan(1)
  return client.getContentTypes()
  .then(response => {
    t.ok(response.items, 'items')
  })
})

test('Gets entry', t => {
  t.plan(2)
  return client.getEntry('5ETMRzkl9KM4omyMwKAOki')
  .then(response => {
    t.ok(response.sys, 'sys')
    t.ok(response.fields, 'fields')
  })
})

test('Gets entries', t => {
  t.plan(1)
  return client.getEntries()
  .then(response => {
    t.ok(response.items, 'items')
  })
})

test('Gets entries with linked includes', t => {
  t.plan(3)
  return client.getEntries({include: 2})
  .then(response => {
    t.ok(response.includes, 'includes')
    t.ok(response.includes.Asset, 'includes for Assets')
    t.ok(Object.keys(response.includes.Asset).length > 0, 'list of includes has asset items')
  })
})

test('Gets entries with content type query param', t => {
  t.plan(2)
  return client.getEntries({content_type: 'cat'})
  .then(response => {
    t.equal(response.total, 3)
    t.looseEqual(map(response.items, 'sys.contentType.sys.id'), ['cat', 'cat', 'cat'])
  })
})

test('Gets entries with equality query', t => {
  t.plan(2)
  return client.getEntries({'sys.id': 'nyancat'})
  .then(response => {
    t.equal(response.total, 1)
    t.equal(response.items[0].sys.id, 'nyancat')
  })
})

test('Gets entries with inequality query', t => {
  t.plan(2)
  return client.getEntries({'sys.id[ne]': 'nyancat'})
  .then(response => {
    t.ok(response.total > 0)
    t.equal(filter(response.items, ['sys.id', 'nyancat']).length, 0)
  })
})

test('Gets entries with array equality query', t => {
  t.plan(2)
  return client.getEntries({
    content_type: 'cat',
    'fields.likes': 'lasagna'
  })
  .then(response => {
    t.equal(response.total, 1)
    t.equal(filter(response.items[0].fields.likes, i => i === 'lasagna').length, 1)
  })
})

test('Gets entries with array inequality query', t => {
  t.plan(2)
  return client.getEntries({
    content_type: 'cat',
    'fields.likes[ne]': 'lasagna'
  })
  .then(response => {
    t.ok(response.total > 0)
    t.equal(filter(response.items[0].fields.likes, i => i === 'lasagna').length, 0)
  })
})

test('Gets entries with inclusion query', t => {
  t.plan(3)
  return client.getEntries({'sys.id[in]': 'finn,jake'})
  .then(response => {
    t.equal(response.total, 2)
    t.equal(filter(response.items, ['sys.id', 'finn']).length, 1)
    t.equal(filter(response.items, ['sys.id', 'jake']).length, 1)
  })
})

test('Gets entries with exclusion query', t => {
  t.plan(3)
  return client.getEntries({
    content_type: 'cat',
    'fields.likes[nin]': 'rainbows,lasagna'
  })
  .then(response => {
    t.ok(response.total > 0)
    t.equal(filter(response.items[0].fields.likes, i => i === 'lasagna').length, 0)
    t.equal(filter(response.items[0].fields.likes, i => i === 'rainbows').length, 0)
  })
})

test('Gets entries with exists query', t => {
  t.plan(1)
  return client.getEntries({
    content_type: 'cat',
    'fields.likes[exists]': 'true'
  })
  .then(response => {
    t.equal(map(response.items, 'fields.likes').length, response.total)
  })
})

test('Gets entries with inverse exists query', t => {
  t.plan(1)
  return client.getEntries({
    content_type: 'cat',
    'fields.likes[exists]': 'false'
  })
  .then(response => {
    t.equal(map(response.items, 'fields.likes').length, 0)
  })
})

test('Gets entries with gte range query', t => {
  t.plan(1)
  return client.getEntries({
    'sys.updatedAt[gte]': '2013-01-01T00:00:00Z'
  })
  .then(response => {
    t.ok(response.total > 0)
  })
})

test('Gets entries with lte range query', t => {
  t.plan(1)
  return client.getEntries({
    'sys.updatedAt[lte]': '2013-01-01T00:00:00Z'
  })
  .then(response => {
    t.equal(response.total, 0)
  })
})

test('Gets entries with full text search query', t => {
  t.plan(1)
  return client.getEntries({
    query: 'bacon'
  })
  .then(response => {
    t.ok(response.items[0].fields.description.match(/bacon/))
  })
})

test('Gets entries with full text search query on field', t => {
  t.plan(1)
  return client.getEntries({
    content_type: 'dog',
    'fields.description[match]': 'bacon pancakes'
  })
  .then(response => {
    t.ok(response.items[0].fields.description.match(/bacon/))
  })
})

test('Gets entries with location proximity search', t => {
  t.plan(2)
  return client.getEntries({
    content_type: '1t9IbcfdCk6m04uISSsaIK',
    'fields.center[near]': '38,-122'
  })
  .then(response => {
    t.ok(response.items[0].fields.center.lat, 'has latitude')
    t.ok(response.items[0].fields.center.lon, 'has longitude')
  })
})

test('Gets entries with location in bounding object', t => {
  t.plan(2)
  return client.getEntries({
    content_type: '1t9IbcfdCk6m04uISSsaIK',
    'fields.center[within]': '40,-124,36,-120'
  })
  .then(response => {
    t.ok(response.items[0].fields.center.lat, 'has latitude')
    t.ok(response.items[0].fields.center.lon, 'has longitude')
  })
})

test('Gets entries by creation order', t => {
  t.plan(1)
  return client.getEntries({
    order: 'sys.createdAt'
  })
  .then(response => {
    t.ok(response.items[0].sys.createdAt < response.items[1].sys.createdAt)
  })
})

test('Gets entries by inverse creation order', t => {
  t.plan(1)
  return client.getEntries({
    order: '-sys.createdAt'
  })
  .then(response => {
    t.ok(response.items[0].sys.createdAt > response.items[1].sys.createdAt)
  })
})

test('Gets entries by creation order and id order', t => {
  t.plan(2)
  return client.getEntries({
    order: 'sys.createdAt,sys.id'
  })
  .then(response => {
    t.ok(response.items[0].sys.createdAt < response.items[1].sys.createdAt, 'createdAt')
    t.ok(response.items[0].sys.id < response.items[1].sys.id, 'id')
  })
})

test('Gets assets with only images', t => {
  t.plan(1)
  return client.getAssets({
    mimetype_group: 'image'
  })
  .then(response => {
    t.ok(response.items[0].fields.file.contentType.match(/image/))
  })
})

test('Gets asset', t => {
  t.plan(2)
  return client.getAsset('1x0xpXu4pSGS4OukSyWGUK')
  .then(response => {
    t.ok(response.sys, 'sys')
    t.ok(response.fields, 'fields')
  })
})

test('Gets assets', t => {
  t.plan(1)
  return client.getAssets()
  .then(response => {
    t.ok(response.items, 'items')
  })
})

test('Sync space', t => {
  t.plan(5)
  return client.sync({initial: true})
  .then(response => {
    t.ok(response.entries, 'entries')
    t.ok(response.assets, 'assets')
    t.ok(response.deletedEntries, 'deleted entries')
    t.ok(response.deletedAssets, 'deleted assets')
    t.ok(response.nextSyncToken, 'next sync token')
  })
})
