import * as contentful from '../../lib/contentful'
// @ts-ignore
import { params } from './utils'

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000'
  params.insecure = true
}

const client = contentful.createClient(params)

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
})
