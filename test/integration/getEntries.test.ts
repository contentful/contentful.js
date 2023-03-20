import * as contentful from '../../lib/contentful'
// @ts-ignore
import { params, previewParams } from './utils'

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000'
  params.insecure = true
}

const client = contentful.createClient(params)
const previewClient = contentful.createClient(previewParams)

describe('getEntries via chained clients', () => {
  const entryWithUnresolvableLink = '4SEhTg8sYJ1H3wDAinzhTp'
  const entryWithResolvableLink = 'nyancat'

  describe('default client', () => {
    test('client', async () => {
      const response = await client.getEntries({
        'sys.id': entryWithResolvableLink,
        include: 2,
      })

      expect(response.items[0].fields).toBeDefined()
      expect(response.items[0].fields.bestFriend.sys.type).toBe('Entry')
      expect(response.items[0].fields.color).toBe('rainbow')
      expect(response.items[0].fields.color['en-US']).not.toBeDefined()
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

    test('Gets content types with search query', async () => {
      const response = await client.getContentTypes({ query: 'cat' })
      expect(response.items).toHaveLength(2)
    })

    test('Gets entries with a specific locale', async () => {
      const response = await client.getEntries({ locale: 'tlh' })

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
      const response = await client.getEntries({ include: 2, 'sys.id': entryWithResolvableLink })

      expect(response.includes).toBeDefined()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(response.includes!.Asset).toBeDefined()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(Object.keys(response.includes!.Asset!).length).toBeGreaterThan(0)
      expect(response.items[0].fields.bestFriend.sys.type).toEqual('Entry')
      expect(response.items[0].fields.bestFriend.fields).toBeDefined()
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
      const response = await client.getEntries({ 'sys.id': entryWithResolvableLink })

      expect(response.total).toBe(1)
      expect(response.items[0].sys.id).toBe(entryWithResolvableLink)
    })

    test('Gets entries with inequality query', async () => {
      const response = await client.getEntries({ 'sys.id[ne]': entryWithResolvableLink })
      expect(response.total).toBeGreaterThan(0)
      expect(response.items.filter((item) => item.sys.id === entryWithResolvableLink)).toHaveLength(
        0
      )
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
      const response = await client.getEntries({ 'sys.id[in]': ['finn', 'jake'] })

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
      expect(response.items.filter((item) => item.fields.likes)).toHaveLength(response.total)
    })

    test('Gets entries with inverse exists query', async () => {
      const response = await client.getEntries({
        content_type: 'cat',
        'fields.likes[exists]': 'false',
      })
      expect(response.items.filter((item) => item.fields.likes)).toHaveLength(0)
    })

    test('Gets entries with field link query', async () => {
      const response = await client.getEntries({
        content_type: 'cat',
        'fields.bestFriend.sys.id': 'happycat',
      })

      expect(response.items[0].sys.id).toEqual(entryWithResolvableLink)
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

      expect(response.items[0].fields.description).toMatch(/bacon pancakes/)
    })

    test('Gets entries with location proximity search', async () => {
      const response = await client.getEntries({
        content_type: '1t9IbcfdCk6m04uISSsaIK',
        'fields.center[near]': [38, -122],
      })

      expect(response.items[0].fields.center.lat).toBeDefined()
      expect(response.items[0].fields.center.lon).toBeDefined()
    })

    test('Gets entries with location in bounding object', async () => {
      const response = await client.getEntries({
        content_type: '1t9IbcfdCk6m04uISSsaIK',
        'fields.center[within]': '40,-124,36,-120',
      })

      const lat = response.items[0].fields.center.lat
      const lon = response.items[0].fields.center.lon

      expect(lat).toBeDefined()
      expect(lat).toBeGreaterThan(36)
      expect(lat).toBeLessThan(40)

      expect(lon).toBeDefined()
      expect(lon).toBeGreaterThan(-124)
      expect(lon).toBeLessThan(-120)
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
        'catalog',
        'contentTypeWithMetadataField',
        'dog',
        'human',
        'kangaroo',
        'testEntryReferences',
      ])
      expect(response.items[0].sys.id < response.items[1].sys.id).toBeTruthy()
    })

    test('Gets entries with attached metadata and field called "metadata" on preview', async () => {
      const response = await previewClient.getEntries()

      expect(response.items).toBeDefined()
      expect(response.items.filter(({ fields }) => fields.metadata).length).toBeGreaterThan(0)
      expect(response.items.filter(({ fields }) => fields.metadata)[0].metadata).toBeDefined()
    })
  })

  describe('client has withoutUnresolvableLinks modifier', () => {
    test('client.withoutUnresolvableLinks', async () => {
      const response = await client.withoutUnresolvableLinks.getEntries({
        'sys.id': entryWithUnresolvableLink,
        include: 2,
      })

      expect(response.items[0].fields).toBeDefined()
      expect(response.items[0].fields.bestFriend).toBeUndefined()
    })

    test('client.withoutUnresolvableLinks.withAllLocales', async () => {
      const response = await client.withoutUnresolvableLinks.withAllLocales.getEntries({
        'sys.id': entryWithUnresolvableLink,
        include: 2,
      })

      expect(response.items[0].fields).toBeDefined()
      expect(response.items[0].fields.name).toHaveProperty('en-US')
      expect(response.items[0].fields.color).toHaveProperty('en-US')
      expect(response.items[0].fields.bestFriend).toEqual({})
    })
  })

  describe('client has withAllLocales modifier', () => {
    test('client.withAllLocales', async () => {
      const response = await client.withAllLocales.getEntries({
        include: 5,
        'sys.id': entryWithResolvableLink,
      })
      assertLocalizedEntriesResponse(response)
    })

    test('previewClient.withAllLocales', async () => {
      const response = await previewClient.withAllLocales.getEntries({
        include: 5,
        'sys.id': entryWithResolvableLink,
      })
      assertLocalizedEntriesResponse(response)
    })

    test('client.withAllLocales.withoutLinkResolution', async () => {
      const response = await client.withAllLocales.withoutLinkResolution.getEntries({
        'sys.id': entryWithResolvableLink,
        include: 2,
      })
      expect(response.items[0].fields).toBeDefined()
      expect(response.items[0].fields.color).toHaveProperty('en-US')
      expect(response.items[0].fields.bestFriend['en-US'].sys.type).toBe('Link')
    })

    test('client.withAllLocales.withoutUnresolvableLinks', async () => {
      const response = await client.withAllLocales.withoutUnresolvableLinks.getEntries({
        'sys.id': entryWithUnresolvableLink,
        include: 2,
      })

      expect(response.items[0].fields).toBeDefined()
      expect(response.items[0].fields.name).toHaveProperty('en-US')
      expect(response.items[0].fields.color).toHaveProperty('en-US')
      expect(response.items[0].fields.bestFriend).toEqual({})
    })
  })

  describe('client has withoutLinkResolution modifier', () => {
    test('client.withoutLinkResolution', async () => {
      const response = await client.withoutLinkResolution.getEntries({
        'sys.id': entryWithResolvableLink,
      })

      expect(response.items[0].fields).toBeDefined()
      expect(response.items[0].fields.bestFriend.sys.type).toBe('Link')
    })

    test('client.withoutLinkResolution.withAllLocales', async () => {
      const response = await client.withoutLinkResolution.withAllLocales.getEntries({
        'sys.id': entryWithResolvableLink,
      })

      expect(response.items[0].fields).toBeDefined()
      expect(response.items[0].fields.name).toHaveProperty('en-US')
      expect(response.items[0].fields.color).toHaveProperty('en-US')
      expect(response.items[0].fields.bestFriend['en-US'].sys.type).toBe('Link')
    })
  })
})

// Assertion helpers
function assertLocalizedEntriesResponse(response) {
  expect(response.includes).toBeDefined()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(response.includes!.Asset).toBeDefined()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(Object.keys(response.includes!.Asset!).length).toBeGreaterThan(0)
  expect(response.items[0].fields.bestFriend['en-US'].fields).toBeDefined()
  expect(response.items[0].fields.bestFriend['en-US'].sys.type).toBe('Entry')
  expect(response.items[0].metadata).toEqual({ tags: [] })
}
