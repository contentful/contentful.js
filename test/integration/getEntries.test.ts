import * as contentful from '../../lib/contentful'
// @ts-ignore
import { localeSpaceParams, params, previewParams } from './utils'

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000'
  params.insecure = true
}

const client = contentful.createClient(params)
const previewClient = contentful.createClient(previewParams)
const localeClient = contentful.createClient(localeSpaceParams)

// TODO:
// expand to cover also previewClient and localeClient
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

    test.skip('client.withoutUnresolvableLinks.withAllLocales', async () => {
      const response = await client.withoutUnresolvableLinks.withAllLocales.getEntries({
        'sys.id': entryWithUnresolvableLink,
        include: 2,
      })

      expect(response.items[0].fields).toBeDefined()
      expect(response.items[0].fields.name).toHaveProperty('en-US')
      expect(response.items[0].fields.color).toHaveProperty('en-US')
      //TODO: why are we returning an empty object?
      expect(response.items[0].fields.bestFriend).toBeUndefined()
    })
  })

  describe('client has withAllLocales modifier', () => {
    test('client.withAllLocales', async () => {
      const response = await client.withAllLocales.getEntries({
        'sys.id': entryWithResolvableLink,
        include: 2,
      })

      expect(response.items[0].fields.color).toHaveProperty('en-US')
      expect(response.items[0].fields.bestFriend['en-US'].sys.type).not.toBe('Link')
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

    test.skip('client.withAllLocales.withoutUnresolvableLinks', async () => {
      const response = await client.withAllLocales.withoutUnresolvableLinks.getEntries({
        'sys.id': entryWithUnresolvableLink,
        include: 2,
      })

      expect(response.items[0].fields).toBeDefined()
      expect(response.items[0].fields.name).toHaveProperty('en-US')
      expect(response.items[0].fields.color).toHaveProperty('en-US')
      //TODO: why are we returning an empty object?
      expect(response.items[0].fields.bestFriend).toBeUndefined()
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
