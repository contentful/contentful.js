import * as contentful from '../../lib/contentful'
import { params, previewParams } from './utils'

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000'
  params.insecure = true
}

const client = contentful.createClient(params)
const previewClient = contentful.createClient(previewParams)

describe('getAssets', () => {
  test('default client', async () => {
    const response = await client.getAssets()

    expect(response.items).not.toHaveLength(0)

    response.items.forEach((item) => {
      expect(item.sys.type).toEqual('Asset')
      expect(item.fields).toBeDefined()
      expect(typeof item.fields.title).toBe('string')
    })
  })

  test('client has withAllLocales modifier', async () => {
    const response = await client.withAllLocales.getAssets()

    expect(response.items).not.toHaveLength(0)

    response.items.forEach((item) => {
      expect(item.sys.type).toEqual('Asset')
      expect(item.fields).toBeDefined()
      expect(typeof item.fields.title).toBe('object')
    })
  })

  test('client has alpha_withContentSourceMaps modifer', async () => {
    const response = await previewClient.alpha_withContentSourceMaps.getAssets()

    expect(response.items).not.toHaveLength(0)

    response.items.forEach((item) => {
      expect(item.sys.type).toEqual('Asset')
      expect(item.fields).toBeDefined()
      expect(typeof item.fields.title).toBe('string')
    })

    // @ts-expect-error this isn't an error
    expect(response.sys.contentSourceMapsLookup).toBeDefined()
  })

  test('client has alpha_withContentSourceMaps.withAllLocales modifier', async () => {
    const response = await previewClient.alpha_withContentSourceMaps.withAllLocales.getAssets()

    expect(response.items).not.toHaveLength(0)

    response.items.forEach((item) => {
      expect(item.sys.type).toEqual('Asset')
      expect(item.fields).toBeDefined()
      expect(typeof item.fields.title).toBe('object')
    })

    // @ts-expect-error this isn't an error
    expect(response.sys.contentSourceMapsLookup).toBeDefined()
  })
})
