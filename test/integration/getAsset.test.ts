import * as contentful from '../../lib/contentful'
// @ts-ignore
import { params } from './utils'

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000'
  params.insecure = true
}

const client = contentful.createClient(params)

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
})
