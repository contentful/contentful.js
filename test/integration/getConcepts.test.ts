import * as contentful from '../../lib/contentful'
// import { ValidationError } from '../../lib/utils/validation-error'
import {
  // assetMappings,
  // localisedAssetMappings,
  params,
  // previewParamsWithCSM,
  // testEncodingDecoding,
} from './utils'

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000'
  params.insecure = true
}

const client = contentful.createClient(params)
// const invalidClient = contentful.createClient({
//   ...params,
//   includeContentSourceMaps: true,
// })
// const previewClient = contentful.createClient(previewParamsWithCSM)

describe.only('getConcepts', () => {
  test('default client', async () => {
    const response = await client.getConcepts()

    expect(response.items).toBeDefined()
    expect(typeof response.items[0].sys.id).toBe('string')
  })

  //   test('client has withAllLocales modifier', async () => {
  //     const response = await client.withAllLocales.getAsset(asset)

  //     expect(response.fields).toBeDefined()
  //     expect(typeof response.fields.title).toBe('object')
  //   })

  //   describe('has includeContentSourceMaps enabled', () => {
  //     test('cdn client', async () => {
  //       await expect(invalidClient.getAsset(asset)).rejects.toThrow(
  //         `The 'includeContentSourceMaps' parameter can only be used with the CPA. Please set host to 'preview.contentful.com' to include Content Source Maps.`,
  //       )
  //       await expect(invalidClient.getAsset(asset)).rejects.toThrow(ValidationError)
  //     })

  //     test('preview client', async () => {
  //       const response = await previewClient.getAsset(asset)

  //       expect(response.fields).toBeDefined()
  //       expect(typeof response.fields.title).toBe('string')
  //       expect(response.sys.contentSourceMaps).toBeDefined()
  //       expect(response.sys?.contentSourceMapsLookup).toBeDefined()
  //       testEncodingDecoding(response, assetMappings)
  //     })

  //     test('preview client withAllLocales modifier', async () => {
  //       const response = await previewClient.withAllLocales.getAsset(asset)

  //       expect(response.fields).toBeDefined()
  //       expect(typeof response.fields.title).toBe('object')
  //       expect(response.sys.contentSourceMaps).toBeDefined()
  //       expect(response.sys?.contentSourceMapsLookup).toBeDefined()
  //       testEncodingDecoding(response, localisedAssetMappings)
  //     })
  //   })
})
