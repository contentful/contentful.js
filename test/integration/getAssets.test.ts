import * as contentful from '../../lib/contentful'
import { ValidationError } from '../../lib/utils/validation-error'
import { params, previewParamsWithCSM } from './utils'

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000'
  params.insecure = true
}

const client = contentful.createClient(params)
const invalidClient = contentful.createClient({
  ...params,
  alphaFeatures: { withContentSourceMaps: true },
})
const previewClient = contentful.createClient(previewParamsWithCSM)

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

  describe('has (alpha) withContentSourceMaps enabled', () => {
    test('cdn client', async () => {
      await expect(invalidClient.getAssets()).rejects.toThrow(
        `The 'withContentSourceMaps' parameter can only be used with the CPA. Please set host to 'preview.contentful.com' to include Content Source Maps.`,
      )
      await expect(invalidClient.getAssets()).rejects.toThrow(ValidationError)
    })

    describe('preview client', () => {
      it('requests content source maps', async () => {
        const response = await previewClient.getAssets()

        expect(response.items).not.toHaveLength(0)

        response.items.forEach((item) => {
          expect(item.sys.type).toEqual('Asset')
          expect(item.fields).toBeDefined()
          expect(typeof item.fields.title).toBe('string')
        })

        expect(response.sys?.contentSourceMapsLookup).toBeDefined()
      })

      it('enforces selection of sys if query.select is present', async () => {
        const response = await previewClient.getAssets({
          select: ['fields.title', 'sys.id', 'sys.type'],
        })

        expect(response.items).not.toHaveLength(0)

        response.items.forEach((item) => {
          expect(item.sys.type).toEqual('Asset')
          expect(item.fields).toBeDefined()
          expect(typeof item.fields.title).toBe('string')
          expect(item.sys.contentSourceMaps).toBeDefined()
        })

        expect(response.sys?.contentSourceMapsLookup).toBeDefined()
      })

      it('works with withAllLocales modifier', async () => {
        const response = await previewClient.withAllLocales.getAssets()

        expect(response.items).not.toHaveLength(0)

        response.items.forEach((item) => {
          expect(item.sys.type).toEqual('Asset')
          expect(item.fields).toBeDefined()
          expect(typeof item.fields.title).toBe('object')
        })

        expect(response.sys?.contentSourceMapsLookup).toBeDefined()
      })
    })
  })
})
