import test from 'blue-tape'
import sinon from 'sinon'

import * as contentful from '../../lib/contentful'

const params = {
  accessToken: '59fceefbb829023353b4961933b699896e2e5d92078f5e752aaee8d7c2612dfc',
  space: 'ezs1swce23xe'
}
const localeSpaceParams = {
  accessToken: 'da1dc0e316213fe11e6139d3cd02f853b12da3f3fd0b4f146a1613a9cca277cd',
  space: '7dh3w86is8ls'
}

const previewParams = {
  host: 'preview.contentful.com',
  accessToken: 'fc9c8a0968c592bd7a0a5a9167d6fb6002dbbc3b8f900a75708ec269332d250a',
  space: 'ezs1swce23xe'
}

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000'
  params.insecure = true
}

const client = contentful.createClient(params)
const previewClient = contentful.createClient(previewParams)
const localeClient = contentful.createClient(localeSpaceParams)

const responseLoggerStub = sinon.stub()
const requestLoggerStub = sinon.stub()
const clientWithLoggers = contentful.createClient({
  ...params,
  responseLogger: responseLoggerStub,
  requestLogger: requestLoggerStub
})

test('Gets space', async (t) => {
  t.plan(3)
  const response = await client.getSpace()
  t.ok(response.sys, 'sys')
  t.ok(response.name, 'name')
  t.ok(response.locales, 'locales')
})

test('Gets content type', async (t) => {
  t.plan(3)
  const response = await client.getContentType('1t9IbcfdCk6m04uISSsaIK')
  t.ok(response.sys, 'sys')
  t.ok(response.name, 'name')
  t.ok(response.fields, 'fields')
})

test('Gets content types', async (t) => {
  t.plan(1)
  const response = await client.getContentTypes()
  t.ok(response.items, 'items')
})

test('Gets entry', async (t) => {
  t.plan(2)
  const response = await client.getEntry('5ETMRzkl9KM4omyMwKAOki')
  t.ok(response.sys, 'sys')
  t.ok(response.fields, 'fields')
})

test('Gets an entry with a specific locale', async (t) => {
  t.plan(1)
  const entry = await client.getEntry('nyancat', {
    locale: 'tlh'
  })
  t.equal(entry.sys.locale, 'tlh')
})

test('Get entry fails if entryId does not exist', async (t) => {
  t.plan(1)
  await t.shouldFail(client.getEntry('nyancatblah'))
})

test('Get entry fails if an entryId is not passed', async (t) => {
  t.plan(1)
  await t.shouldFail(client.getEntry())
})

test('Get entry with fallback locale', async (t) => {
  t.plan(5)
  const entries = await Promise.all([
    localeClient.getEntry('no-af-and-no-zu-za', { locale: 'af' }),
    localeClient.getEntry('no-af-and-no-zu-za', { locale: 'zu-ZA' }),
    localeClient.getEntry('no-zu-ZA', { locale: 'zu-ZA' }),
    localeClient.getEntry('no-ne-NP', { locale: 'ne-NP' }),
    localeClient.getEntry('no-af', { locale: 'af' })
  ])

  t.notEqual(entries[0].fields.title, '')
  t.notEqual(entries[1].fields.title, '')
  t.notEqual(entries[2].fields.title, '')
  t.notEqual(entries[3].fields.title, '')
  t.notEqual(entries[4].fields.title, '')
})

test('Gets entries', async (t) => {
  t.plan(1)
  const response = await client.getEntries()

  t.ok(response.items, 'items')
})
test('Gets entries with select', async (t) => {
  t.plan(4)
  const response = await client.getEntries({ select: 'fields.name,fields.likes', content_type: 'cat' })

  t.ok(response.items, 'items')
  t.ok(response.items[0].fields.name, 'fields.name')
  t.ok(response.items[0].fields.likes, 'fields.likes')
  t.notOk(response.items[0].fields.color, 'no fields.color')
})

test('Gets entries with a specific locale', async (t) => {
  t.plan(2)
  const response = await client.getEntries({
    locale: 'tlh'
  })

  t.equal(response.items[0].sys.locale, 'tlh')
  t.ok(response.items, 'items')
})

test('Gets entries with a limit parameter', async (t) => {
  t.plan(2)
  const response = await client.getEntries({
    limit: 2
  })

  t.ok(response.items, 'items')
  t.equal(response.items.length, 2)
})

test('Gets entries with a skip parameter', async (t) => {
  t.plan(2)
  const response = await client.getEntries({
    skip: 2
  })

  t.ok(response.items, 'items')
  t.equal(response.skip, 2)
})

test('Gets entries with linked includes', async (t) => {
  t.plan(5)
  const response = await client.getEntries({ include: 2, 'sys.id': 'nyancat' })

  t.ok(response.includes, 'includes')
  t.ok(response.includes.Asset, 'includes for Assets')
  t.ok(Object.keys(response.includes.Asset).length > 0, 'list of includes has asset items')
  t.equal(response.items[0].fields.bestFriend.sys.type, 'Entry', 'entry gets resolved from other entries in collection')
  t.ok(response.items[0].fields.bestFriend.fields, 'resolved entry has fields')
})

test('Gets entry with link resolution', async (t) => {
  t.plan(2)
  const response = await client.getEntry('nyancat', { include: 2 })

  t.equal(response.fields.bestFriend.sys.type, 'Entry', 'entry gets resolved from other entries in collection')
  t.ok(response.fields.bestFriend.fields, 'resolved entry has fields')
})

test('Gets entries with content type query param', async (t) => {
  t.plan(2)
  const response = await client.getEntries({ content_type: 'cat' })

  t.equal(response.total, 3)
  t.looseEqual(response.items.map((item) => item.sys.contentType.sys.id), ['cat', 'cat', 'cat'])
})

test('Gets entries with equality query', async (t) => {
  t.plan(2)
  const response = await client.getEntries({ 'sys.id': 'nyancat' })

  t.equal(response.total, 1)
  t.equal(response.items[0].sys.id, 'nyancat')
})

test('Gets entries with inequality query', async (t) => {
  t.plan(2)
  const response = await client.getEntries({ 'sys.id[ne]': 'nyancat' })

  t.ok(response.total > 0)
  t.equal(response.items.filter((item) => item.sys.id === 'nyancat').length, 0)
})

test('Gets entries with array equality query', async (t) => {
  t.plan(2)
  const response = await client.getEntries({
    content_type: 'cat',
    'fields.likes': 'lasagna'
  })

  t.equal(response.total, 1)
  t.equal(response.items[0].fields.likes.filter((i) => i === 'lasagna').length, 1)
})

test('Gets entries with array inequality query', async (t) => {
  t.plan(2)
  const response = await client.getEntries({
    content_type: 'cat',
    'fields.likes[ne]': 'lasagna'
  })

  t.ok(response.total > 0)
  t.equal(response.items[0].fields.likes.filter((i) => i === 'lasagna').length, 0)
})

test('Gets entries with inclusion query', async (t) => {
  t.plan(3)
  const response = await client.getEntries({ 'sys.id[in]': 'finn,jake' })

  t.equal(response.total, 2)
  t.equal(response.items.filter((item) => item.sys.id === 'finn').length, 1)
  t.equal(response.items.filter((item) => item.sys.id === 'jake').length, 1)
})

test('Gets entries with exclusion query', async (t) => {
  t.plan(3)
  const response = await client.getEntries({
    content_type: 'cat',
    'fields.likes[nin]': 'rainbows,lasagna'
  })

  t.ok(response.total > 0)
  t.equal(response.items[0].fields.likes.filter((i) => i === 'lasagna').length, 0)
  t.equal(response.items[0].fields.likes.filter((i) => i === 'rainbows').length, 0)
})

test('Gets entries with exists query', async (t) => {
  t.plan(1)
  const response = await client.getEntries({
    content_type: 'cat',
    'fields.likes[exists]': 'true'
  })

  t.equal(response.items.map((item) => item.fields.likes).length, response.total)
})

test('Gets entries with inverse exists query', async (t) => {
  t.plan(1)
  const response = await client.getEntries({
    content_type: 'cat',
    'fields.likes[exists]': 'false'
  })

  t.equal(response.items.map((item) => item.fields.likes).length, 0)
})

test('Gets entries with field link query', async (t) => {
  t.plan(1)
  const response = await client.getEntries({
    content_type: 'cat',
    'fields.bestFriend.sys.id': 'happycat'
  })

  t.equal(response.items[0].sys.id, 'nyancat', 'returned entry has link to specified linked entry')
})

test('Gets entries with gte range query', async (t) => {
  t.plan(1)
  const response = await client.getEntries({
    'sys.updatedAt[gte]': '2013-01-01T00:00:00Z'
  })

  t.ok(response.total > 0)
})

test('Gets entries with lte range query', async (t) => {
  t.plan(1)
  const response = await client.getEntries({
    'sys.updatedAt[lte]': '2013-01-01T00:00:00Z'
  })

  t.equal(response.total, 0)
})

test('Gets entries with full text search query', async (t) => {
  t.plan(1)
  const response = await client.getEntries({
    query: 'bacon'
  })

  t.ok(response.items[0].fields.description.match(/bacon/))
})

test('Gets entries with full text search query on field', async (t) => {
  t.plan(1)
  const response = await client.getEntries({
    content_type: 'dog',
    'fields.description[match]': 'bacon pancakes'
  })

  t.ok(response.items[0].fields.description.match(/bacon/))
})

test('Gets entries with location proximity search', async (t) => {
  t.plan(2)
  const response = await client.getEntries({
    content_type: '1t9IbcfdCk6m04uISSsaIK',
    'fields.center[near]': '38,-122'
  })

  t.ok(response.items[0].fields.center.lat, 'has latitude')
  t.ok(response.items[0].fields.center.lon, 'has longitude')
})

test('Gets entries with location in bounding object', async (t) => {
  t.plan(2)
  const response = await client.getEntries({
    content_type: '1t9IbcfdCk6m04uISSsaIK',
    'fields.center[within]': '40,-124,36,-120'
  })

  t.ok(response.items[0].fields.center.lat, 'has latitude')
  t.ok(response.items[0].fields.center.lon, 'has longitude')
})

test('Gets entries by creation order', async (t) => {
  t.plan(1)
  const response = await client.getEntries({
    order: 'sys.createdAt'
  })

  t.ok(response.items[0].sys.createdAt < response.items[1].sys.createdAt)
})

test('Gets entries by inverse creation order', async (t) => {
  t.plan(1)
  const response = await client.getEntries({
    order: '-sys.createdAt'
  })

  t.ok(response.items[0].sys.createdAt > response.items[1].sys.createdAt)
})

/**
 * This test checks if entries can be ordered by two properties. The first
 * property (in this case content type id) takes priority. The test checks if two
 * entries with the same content type are ordered by the second property, id.
 * It also checks if the entry which comes before these has a lower id.
 *
 * It's a slightly fragile test as it can break if entries are added or deleted
 * from the space.
 */
test('Gets entries by creation order and id order', async (t) => {
  t.plan(2)
  const response = await client.getEntries({
    order: 'sys.contentType.sys.id,sys.id'
  })

  const contentTypeOrder = response.items
    .map((item) => item.sys.contentType.sys.id)
    .filter((value, index, self) => self.indexOf(value) === index)

  t.deepEqual(contentTypeOrder, ['1t9IbcfdCk6m04uISSsaIK', 'cat', 'dog', 'human'], 'orders')
  t.ok(response.items[0].sys.id < response.items[1].sys.id, 'id of entry with index 1 is higher than the one of index 0 since they share content type')
})

test('Gets assets with only images', async (t) => {
  t.plan(1)
  const response = await client.getAssets({
    mimetype_group: 'image'
  })
  t.ok(response.items[0].fields.file.contentType.match(/image/))
})

test('Gets asset', async (t) => {
  t.plan(2)
  const response = await client.getAsset('1x0xpXu4pSGS4OukSyWGUK')
  t.ok(response.sys, 'sys')
  t.ok(response.fields, 'fields')
})

test('Gets an entry with a specific locale', async (t) => {
  t.plan(1)
  const entry = await client.getEntry('jake', {
    locale: 'tlh'
  })
  t.equal(entry.sys.locale, 'tlh')
})

test('Gets assets', async (t) => {
  t.plan(1)
  const response = await client.getAssets()
  t.ok(response.items, 'items')
})
test('Gets Locales', async (t) => {
  t.plan(2)
  const response = await client.getLocales()
  t.ok(response.items, 'items')
  t.equals(response.items[0].code, 'en-US', 'first locale is en-US')
})
test('Sync space', async (t) => {
  t.plan(6)
  const response = await client.sync({ initial: true })
  t.ok(response.entries, 'entries')
  t.ok(response.assets, 'assets')
  t.ok(response.deletedEntries, 'deleted entries')
  t.ok(response.deletedAssets, 'deleted assets')
  t.ok(response.nextSyncToken, 'next sync token')
  t.equal(response.entries[0].fields.image['en-US'].sys.type, 'Asset', 'links are resolved')
})

test('Sync space with token', async (t) => {
  t.plan(5)
  const response = await client.sync({ nextSyncToken: 'w5ZGw6JFwqZmVcKsE8Kow4grw45QdybDsm4DWMK6OVYsSsOJwqPDksOVFXUFw54Hw65Tw6MAwqlWw5QkdcKjwqrDlsOiw4zDolvDq8KRRwUVBn3CusK6wpB3w690w6vDtMKkwrHDmsKSwobCuMKww57Cl8OGwp_Dq1QZCA' })
  t.ok(response.entries, 'entries')
  t.ok(response.assets, 'assets')
  t.ok(response.deletedEntries, 'deleted entries')
  t.ok(response.deletedAssets, 'deleted assets')
  t.ok(response.nextSyncToken, 'next sync token')
})

test('Sync spaces assets', async (t) => {
  t.plan(4)
  const response = await client.sync({ initial: true, type: 'Asset' })
  t.ok(response.assets, 'assets')
  t.ok(response.assets[0].toPlainObject, 'toPlainObject exists on asset')
  t.ok(response.deletedAssets, 'deleted assets')
  t.ok(response.nextSyncToken, 'next sync token')
})

test('Sync space entries by content type', async (t) => {
  t.plan(4)
  const response = await client.sync({ initial: true, type: 'Entry', content_type: 'dog' })
  t.ok(response.entries, 'entries')
  t.ok(response.entries[0].toPlainObject, 'toPlainObject exists on entry')
  t.ok(response.deletedEntries, 'deleted entries')
  t.ok(response.nextSyncToken, 'next sync token')
})

test('Gets entries with linked includes with locale:*', async (t) => {
  t.plan(5)
  const response = await client.getEntries({ locale: '*', include: 5, 'sys.id': 'nyancat' })
  t.ok(response.includes, 'includes')
  t.ok(response.includes.Asset, 'includes for Assets from preview endpoint')
  t.ok(Object.keys(response.includes.Asset).length > 0, 'list of includes has asset items from preview endpoint')
  t.ok(response.items[0].fields.bestFriend['en-US'].fields, 'resolved entry has fields from preview endpoint')
  t.equal(response.items[0].fields.bestFriend['en-US'].sys.type, 'Entry', 'entry gets resolved from other entries in collection from preview endpoint')
})

test('Gets entries with linked includes with local:* in preview', async (t) => {
  t.plan(5)
  const response = await previewClient.getEntries({ locale: '*', include: 5, 'sys.id': 'nyancat' })
  t.ok(response.includes, 'includes')
  t.ok(response.includes.Asset, 'includes for Assets from preview endpoint')
  t.ok(Object.keys(response.includes.Asset).length > 0, 'list of includes has asset items from preview endpoint')
  t.ok(response.items[0].fields.bestFriend['en-US'].fields, 'resolved entry has fields from preview endpoint')
  t.equal(response.items[0].fields.bestFriend['en-US'].sys.type, 'Entry', 'entry gets resolved from other entries in collection from preview endpoint')
})

test('Logs request and response with custom loggers', async (t) => {
  t.plan(4)

  await clientWithLoggers.getEntries()
  t.equal(responseLoggerStub.callCount, 1, 'responseLogger is called')
  t.equal(requestLoggerStub.callCount, 1, 'requestLogger is called')
  t.equal(requestLoggerStub.args[0][0].baseURL, 'https://cdn.contentful.com:443/spaces/ezs1swce23xe/environments/master', 'requestLogger is called with correct base url')
  t.equal(requestLoggerStub.args[0][0].url, 'entries', 'requestLogger is called with correct url')
})
