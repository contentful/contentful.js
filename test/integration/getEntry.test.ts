import * as contentful from '../../lib/contentful'
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
describe('getEntry via chained clients', () => {
  const entryWithUnresolvableLink = '4SEhTg8sYJ1H3wDAinzhTp'
  const entryWithResolvableLink = 'nyancat'

  describe('default client', () => {
    test('client', async () => {
      const response = await client.getEntry(entryWithResolvableLink, {
        include: 2,
      })

      expect(response.fields.bestFriend.sys.type).toBe('Entry')
      expect(response.fields.color).toBe('rainbow')
      expect(response.fields.color['en-US']).not.toBeDefined()
    })
  })

  describe('client has withoutUnresolvableLinks modifier', () => {
    test('client.withoutUnresolvableLinks', async () => {
      const response = await client.withoutUnresolvableLinks.getEntry(entryWithUnresolvableLink, {
        include: 2,
      })

      expect(response.fields.bestFriend).toBeUndefined()
    })

    test('client.withoutUnresolvableLinks.withAllLocales', async () => {
      const response = await client.withoutUnresolvableLinks.withAllLocales.getEntry(
        entryWithUnresolvableLink,
        {
          include: 2,
        }
      )

      expect(response.fields.color).toHaveProperty('en-US')
      expect(response.fields.bestFriend).toEqual({})
    })
  })

  describe('client has withAllLocales modifier', () => {
    test('client.withAllLocales', async () => {
      const response = await client.withAllLocales.getEntry(entryWithResolvableLink, {
        include: 2,
      })

      expect(response.fields.color).toHaveProperty('en-US')
      expect(response.fields.bestFriend['en-US'].sys.type).not.toBe('Link')
    })

    test('client.withAllLocales.withoutLinkResolution', async () => {
      const response = await client.withAllLocales.withoutLinkResolution.getEntry(
        entryWithResolvableLink,
        {
          include: 2,
        }
      )
      expect(response.fields.color).toHaveProperty('en-US')
      expect(response.fields.bestFriend['en-US'].sys.type).toBe('Link')
    })

    test('client.withAllLocales.withoutUnresolvableLinks', async () => {
      const response = await client.withAllLocales.withoutUnresolvableLinks.getEntry(
        entryWithUnresolvableLink,
        {
          include: 2,
        }
      )

      expect(response.fields.color).toHaveProperty('en-US')
      expect(response.fields.bestFriend).toEqual({})
    })
  })

  describe('client has withoutLinkResolution modifier', () => {
    test('client.withoutLinkResolution', async () => {
      const response = await client.withoutLinkResolution.getEntry(entryWithResolvableLink)

      expect(response.fields.bestFriend.sys.type).toBe('Link')
    })

    test('client.withoutLinkResolution.withAllLocales', async () => {
      const response = await client.withoutLinkResolution.withAllLocales.getEntry(
        entryWithResolvableLink
      )

      expect(response.fields.color).toHaveProperty('en-US')
      expect(response.fields.bestFriend['en-US'].sys.type).toBe('Link')
    })
  })
})
