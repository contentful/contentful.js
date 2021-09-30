import { CreateClientParams, EntryFields } from '../../lib'
import * as contentful from '../../lib/contentful'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const version = require('../../package.json').version

const params: CreateClientParams = {
  accessToken: '59fceefbb829023353b4961933b699896e2e5d92078f5e752aaee8d7c2612dfc',
  space: 'ezs1swce23xe',
}
const localeSpaceParams = {
  accessToken: 'da1dc0e316213fe11e6139d3cd02f853b12da3f3fd0b4f146a1613a9cca277cd',
  space: '7dh3w86is8ls',
}

const previewParams = {
  host: 'preview.contentful.com',
  accessToken: 'fc9c8a0968c592bd7a0a5a9167d6fb6002dbbc3b8f900a75708ec269332d250a',
  space: 'ezs1swce23xe',
}

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000'
  params.insecure = true
}

const client = contentful.createClient(params)
const previewClient = contentful.createClient(previewParams)
const localeClient = contentful.createClient(localeSpaceParams)

const responseLoggerStub = jest.fn()
const requestLoggerStub = jest.fn()
const clientWithLoggers = contentful.createClient({
  ...params,
  // @ts-ignore
  responseLogger: responseLoggerStub,
  requestLogger: requestLoggerStub,
})

test('Gets space', async () => {
  const response = await client.getSpace()
  expect(response.sys).toBeDefined()
  expect(response.name).toBeDefined()
  expect(response.locales).toBeDefined()
})

test('Gets content type', async () => {
  const response = await client.getContentType('1t9IbcfdCk6m04uISSsaIK')
  expect(response.sys).toBeDefined()
  expect(response.name).toBeDefined()
  expect(response.fields).toBeDefined()
})

test('Gets content types', async () => {
  const response = await client.getContentTypes()
  expect(response.items).toBeDefined()
})

test('Gets entry', async () => {
  const response = await client.getEntry('5ETMRzkl9KM4omyMwKAOki')
  expect(response.sys).toBeDefined()
  expect(response.fields).toBeDefined()
})

test('Gets an entry with a specific locale', async () => {
  const entry = await client.localized.getEntry<{ test: EntryFields.Symbol }>('nyancat', {}, 'tlh')
  expect(entry.sys.locale).toBe('tlh')
})

test('Get entry fails if entryId does not exist', async () => {
  await expect(client.getEntry('nyancatblah')).rejects.toThrow()
})

test('Get entry fails if an entryId is not passed', async () => {
  // @ts-ignore
  await expect(client.getEntry()).rejects.toThrow()
})

test('Get entry with fallback locale', async () => {
  type Fields = { title: string }

  const entries = await Promise.all([
    localeClient.localized.getEntry<Fields>('no-af-and-no-zu-za', {}, 'af'),
    localeClient.localized.getEntry<Fields>('no-af-and-no-zu-za', {}, 'zu-ZA'),
    localeClient.localized.getEntry<Fields>('no-zu-ZA', {}, 'zu-ZA'),
    localeClient.localized.getEntry<Fields>('no-ne-NP', {}, 'ne-NP'),
    localeClient.localized.getEntry<Fields>('no-af', {}, 'af'),
    localeClient.localized.getEntry<Fields, 'af'>('no-af', {}, 'af'),
  ])

  expect(entries[0].fields.title).not.toBe('')
  expect(entries[1].fields.title).not.toBe('')
  expect(entries[2].fields.title).not.toBe('')
  expect(entries[3].fields.title).not.toBe('')
  expect(entries[4].fields.title).not.toBe('')
})

test('Gets entries', async () => {
  const response = await client.getEntries()

  expect(response.items).toBeDefined()
})
test('Gets entries with select', async () => {
  type Fields = {
    name: string
    likes: string
    color: string
  }

  const response = await client.getEntries<Fields>({
    select: ['fields.name', 'fields.likes'],
    content_type: 'cat',
  })

  expect(response.items).toBeDefined()
  expect(response.items[0].fields.name).toBeDefined()
  expect(response.items[0].fields.likes).toBeDefined()
  expect(response.items[0].fields.color).toBeUndefined()
})

test('Gets entries with a specific locale', async () => {
  const response = await client.localized.getEntries({}, 'tlh')

  expect(response.items[0].sys.locale).toBe('tlh')
  expect(response.items).toBeDefined()
})

test('Gets entries with a limit parameter', async () => {
  const response = await client.getEntries({
    limit: 2,
  })

  expect(response.items).toBeDefined()
  expect(response.items).toHaveLength(2)
})

test('Gets entries with a skip parameter', async () => {
  const response = await client.getEntries({
    skip: 2,
  })

  expect(response.items).toBeDefined()
  expect(response.skip).toBe(2)
})

test('Gets entries with linked includes', async () => {
  const response = await client.getEntries({ include: 2, 'sys.id': 'nyancat' })

  expect(response.includes).toBeDefined()
  expect(response.includes!.Asset).toBeDefined()
  expect(Object.keys(response.includes!.Asset!).length).toBeGreaterThan(0)
  expect(response.items[0].fields.bestFriend.sys.type).toEqual('Entry')
  expect(response.items[0].fields.bestFriend.fields).toBeDefined()
})

test('Gets entry with link resolution', async () => {
  const response = await client.getEntry('nyancat', { include: 2 })

  expect(response.fields.bestFriend.sys.type).toEqual('Entry')
  expect(response.fields.bestFriend.fields).toBeDefined()
})

test('Gets entries with content type query param', async () => {
  const response = await client.getEntries({ content_type: 'cat' })

  expect(response.total).toBe(4)
  expect(response.items.map((item) => item.sys.contentType.sys.id)).toEqual([
    'cat',
    'cat',
    'cat',
    'cat',
  ])
})

test('Gets entries with equality query', async () => {
  const response = await client.getEntries({ 'sys.id': 'nyancat' })

  expect(response.total).toBe(1)
  expect(response.items[0].sys.id).toBe('nyancat')
})

test('Gets entries with inequality query', async () => {
  const response = await client.getEntries({ 'sys.id[ne]': 'nyancat' })

  expect(response.total > 0).toBeDefined()
  expect(response.items.filter((item) => item.sys.id === 'nyancat')).toHaveLength(0)
})

test('Gets entries with array equality query', async () => {
  const response = await client.getEntries({
    content_type: 'cat',
    'fields.likes': 'lasagna',
  })

  expect(response.total).toBe(1)
  expect(response.items[0].fields.likes.filter((i) => i === 'lasagna')).toHaveLength(1)
})

test('Gets entries with array inequality query', async () => {
  const response = await client.getEntries({
    content_type: 'cat',
    'fields.likes[ne]': 'lasagna',
  })

  expect(response.total).toBeGreaterThan(0)
  expect(response.items[0].fields.likes.filter((i) => i === 'lasagna')).toHaveLength(0)
})

test('Gets entries with inclusion query', async () => {
  const response = await client.getEntries({ 'sys.id[in]': 'finn,jake' })

  expect(response.total).toBe(2)
  expect(response.items.filter((item) => item.sys.id === 'finn')).toHaveLength(1)
  expect(response.items.filter((item) => item.sys.id === 'jake')).toHaveLength(1)
})

test('Gets entries with exclusion query', async () => {
  const response = await client.getEntries({
    content_type: 'cat',
    'fields.likes[nin]': 'rainbows,lasagna',
  })

  expect(response.total).toBeGreaterThan(0)
  expect(response.items[0].fields.likes.filter((i) => i === 'lasagna')).toHaveLength(0)
  expect(response.items[0].fields.likes.filter((i) => i === 'rainbow')).toHaveLength(0)
})

test('Gets entries with exists query', async () => {
  const response = await client.getEntries({
    content_type: 'cat',
    'fields.likes[exists]': 'true',
  })

  expect(response.items.map((item) => item.fields.likes)).toHaveLength(response.total)
})

test('Gets entries with inverse exists query', async () => {
  const response = await client.getEntries({
    content_type: 'cat',
    'fields.likes[exists]': 'false',
  })

  expect(response.items.map((item) => item.fields.likes)).toHaveLength(0)
})

test('Gets entries with field link query', async () => {
  const response = await client.getEntries({
    content_type: 'cat',
    'fields.bestFriend.sys.id': 'happycat',
  })

  expect(response.items[0].sys.id).toEqual('nyancat')
})

test('Gets entries with gte range query', async () => {
  const response = await client.getEntries({
    'sys.updatedAt[gte]': '2013-01-01T00:00:00Z',
  })

  expect(response.total).toBeGreaterThan(0)
})

test('Gets entries with lte range query', async () => {
  const response = await client.getEntries({
    'sys.updatedAt[lte]': '2013-01-01T00:00:00Z',
  })

  expect(response.total).toBe(0)
})

test('Gets entries with full text search query', async () => {
  const response = await client.getEntries({
    query: 'bacon',
  })

  expect(response.items[0].fields.description).toMatch(/bacon/)
})

test('Gets entries with full text search query on field', async () => {
  const response = await client.getEntries({
    content_type: 'dog',
    'fields.description[match]': 'bacon pancakes',
  })

  expect(response.items[0].fields.description).toMatch(/bacon/)
})

test('Gets entries with location proximity search', async () => {
  const response = await client.getEntries({
    content_type: '1t9IbcfdCk6m04uISSsaIK',
    'fields.center[near]': '38,-122',
  })

  expect(response.items[0].fields.center.lat).toBeDefined()
  expect(response.items[0].fields.center.lon).toBeDefined()
})

test('Gets entries with location in bounding object', async () => {
  const response = await client.getEntries({
    content_type: '1t9IbcfdCk6m04uISSsaIK',
    'fields.center[within]': '40,-124,36,-120',
  })

  expect(response.items[0].fields.center.lat).toBeDefined()
  expect(response.items[0].fields.center.lon).toBeDefined()
})

test('Gets entries by creation order', async () => {
  const response = await client.getEntries({
    order: 'sys.createdAt',
  })

  expect(new Date(response.items[0].sys.createdAt).getTime()).toBeLessThan(
    new Date(response.items[1].sys.createdAt).getTime()
  )
})

test('Gets entries by inverse creation order', async () => {
  const response = await client.getEntries({
    order: '-sys.createdAt',
  })

  expect(new Date(response.items[0].sys.createdAt).getTime()).toBeGreaterThan(
    new Date(response.items[1].sys.createdAt).getTime()
  )
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
test('Gets entries by creation order and id order', async () => {
  const response = await client.getEntries({
    order: 'sys.contentType.sys.id,sys.id',
  })

  const contentTypeOrder = response.items
    .map((item) => item.sys.contentType.sys.id)
    .filter((value, index, self) => self.indexOf(value) === index)

  expect(contentTypeOrder).toEqual([
    '1t9IbcfdCk6m04uISSsaIK',
    'cat',
    'contentTypeWithMetadataField',
    'dog',
    'human',
    'kangaroo',
    'testEntryReferences',
  ])
  expect(response.items[0].sys.id < response.items[1].sys.id).toBeTruthy()
})

test('Gets assets with only images', async () => {
  const response = await client.getAssets({
    mimetype_group: 'image',
  })
  expect(response.items[0].fields.file.contentType).toMatch(/image/)
})

test('Gets asset', async () => {
  const response = await client.getAsset('1x0xpXu4pSGS4OukSyWGUK')
  expect(response.sys).toBeDefined()
  expect(response.fields).toBeDefined()
})

test('Gets an entry with a specific locale', async () => {
  const entry = await client.getEntry('jake', {
    locale: 'tlh',
  })
  expect(entry.sys.locale).toBe('tlh')
})

test('Gets assets', async () => {
  const response = await client.getAssets()
  expect(response.items).toBeDefined()
})
test('Gets Locales', async () => {
  const response = await client.getLocales()
  expect(response.items).toBeDefined()
  expect(response.items[0].code).toBe('en-US')
})

describe('Sync API', () => {
  test('Sync space', async () => {
    const response = await client.sync({ initial: true })
    expect(response.entries).toBeDefined()
    expect(response.assets).toBeDefined()
    expect(response.deletedEntries).toBeDefined()
    expect(response.deletedAssets).toBeDefined()
    expect(response.nextSyncToken).toBeDefined()
  })

  test('Sync space with token', async () => {
    const response = await client.sync({
      nextSyncToken:
        'w5ZGw6JFwqZmVcKsE8Kow4grw45QdybDsm4DWMK6OVYsSsOJwqPDksOVFXUFw54Hw65Tw6MAwqlWw5QkdcKjwqrDlsOiw4zDolvDq8KRRwUVBn3CusK6wpB3w690w6vDtMKkwrHDmsKSwobCuMKww57Cl8OGwp_Dq1QZCA',
    })
    expect(response.entries).toBeDefined()
    expect(response.assets).toBeDefined()
    expect(response.deletedEntries).toBeDefined()
    expect(response.deletedAssets).toBeDefined()
    expect(response.nextSyncToken).toBeDefined()
  })

  test('Sync spaces assets', async () => {
    const response = await client.sync({ initial: true, type: 'Asset' })
    expect(response.assets).toBeDefined()
    expect(response.deletedAssets).toBeDefined()
    expect(response.nextSyncToken).toBeDefined()
  })

  test('Sync space entries by content type', async () => {
    const response = await client.sync({ initial: true, type: 'Entry', content_type: 'dog' })
    expect(response.entries).toBeDefined()
    expect(response.deletedEntries).toBeDefined()
    expect(response.nextSyncToken).toBeDefined()
  })
})

test('Gets entries with linked includes with locale:*', async () => {
  const response = await client.localized.getEntries({ include: 5, 'sys.id': 'nyancat' }, '*')
  expect(response.includes).toBeDefined()
  expect(response.includes!.Asset).toBeDefined()
  expect(Object.keys(response.includes!.Asset!).length).toBeGreaterThan(0)
  expect(response.items[0].fields.bestFriend['en-US'].fields).toBeDefined()
  expect(response.items[0].fields.bestFriend['en-US'].sys.type).toBe('Entry')
})

test('Gets entries with linked includes with local:* in preview', async () => {
  const response = await previewClient.localized.getEntries({
    locale: '*',
    include: 5,
    'sys.id': 'nyancat',
  })
  expect(response.includes).toBeDefined()
  expect(response.includes!.Asset).toBeDefined()
  expect(Object.keys(response.includes!.Asset!).length).toBeGreaterThan(0)
  expect(response.items[0].fields.bestFriend['en-US'].fields).toBeDefined()
  expect(response.items[0].fields.bestFriend['en-US'].sys.type).toBe('Entry')
})

test('Logs request and response with custom loggers', async () => {
  await clientWithLoggers.getEntries()
  expect(responseLoggerStub).toHaveBeenCalledTimes(1)
  expect(requestLoggerStub).toHaveBeenCalledTimes(1)
})

test.skip('Client object exposes current version', async () => {
  expect(client.version).toEqual(version)
})
