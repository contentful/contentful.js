import * as contentful from '../../lib/contentful'
import { params, previewParams } from './utils'

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000'
  params.insecure = true
}

const client = contentful.createClient(params)
const previewClient = contentful.createClient(previewParams)

describe('getAsset', () => {
  const asset = '1x0xpXu4pSGS4OukSyWGUK'

  test('default client', async () => {
    const response = await client.getAsset(asset)

    expect(response.fields).toBeDefined()
    expect(typeof response.fields.title).toBe('string')
  })

  test('client has withAllLocales modifier', async () => {
    const response = await client.withAllLocales.getAsset(asset)

    expect(response.fields).toBeDefined()
    expect(typeof response.fields.title).toBe('object')
  })

  test('client has alpha_withContentSourceMaps modifier', async () => {
    const response = await previewClient.alpha_withContentSourceMaps.getAsset(asset)

    expect(response.fields).toBeDefined()
    expect(typeof response.fields.title).toBe('string')
    expect(response.sys.contentSourceMaps).toBeDefined()
    expect(response.sys.contentSourceMapsLookup).toBeDefined()
  })

  test('client has alpha_withContentSourceMaps.withAllLocales modifier', async () => {
    const response = await previewClient.alpha_withContentSourceMaps.withAllLocales.getAsset(asset)

    expect(response.fields).toBeDefined()
    expect(typeof response.fields.title).toBe('object')
    expect(response.sys.contentSourceMaps).toBeDefined()
    expect(response.sys.contentSourceMapsLookup).toBeDefined()
  })
})
