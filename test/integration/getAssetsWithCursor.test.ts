import { describe, expect, test } from 'vitest'
import * as contentful from '../../lib/contentful'
import { params, previewParamsWithCSM } from './utils'

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000'
  params.insecure = true
}

const deliveryClient = contentful.createClient(params)
const previewClient = contentful.createClient(previewParamsWithCSM)
const clients = [
  { type: 'default', client: deliveryClient },
  { type: 'preview', client: previewClient },
]

describe('getAssetsWithCursor', () => {
  clients.forEach(({ type, client }) => {
    describe(`${type} client`, () => {
      test('should return cursor paginated asset collection when no query provided', async () => {
        const response = await client.getAssetsWithCursor()

        expect(response.items).not.toHaveLength(0)
        expect(response.pages).toBeDefined()
        expect((response as { total?: number }).total).toBeUndefined()

        response.items.forEach((item) => {
          expect(item.sys.type).toEqual('Asset')
          expect(item.fields).toBeDefined()
          expect(typeof item.fields.title).toBe('string')
        })
      })

      test('should return [limit] number of items', async () => {
        const response = await client.getAssetsWithCursor({ limit: 3 })

        expect(response.items).toHaveLength(3)
        expect(response.pages).toBeDefined()
        expect((response as { total?: number }).total).toBeUndefined()

        response.items.forEach((item) => {
          expect(item.sys.type).toEqual('Asset')
          expect(item.fields).toBeDefined()
          expect(typeof item.fields.title).toBe('string')
        })
      })

      test('should support forward pagination', async () => {
        const firstPage = await client.getAssetsWithCursor({ limit: 2 })
        const secondPage = await client.getAssetsWithCursor({
          limit: 2,
          pageNext: firstPage.pages.next,
        })

        expect(secondPage.items).toHaveLength(2)
        expect(firstPage.items[0].sys.id).not.equal(secondPage.items[0].sys.id)
      })

      test('should support backward pagination', async () => {
        const firstPage = await client.getAssetsWithCursor({ limit: 2, order: ['sys.createdAt'] })
        const secondPage = await client.getAssetsWithCursor({
          limit: 2,
          pageNext: firstPage.pages.next,
          order: ['sys.createdAt'],
        })
        const result = await client.getAssetsWithCursor({
          limit: 2,
          pagePrev: secondPage.pages.prev,
          order: ['sys.createdAt'],
        })

        expect(result.items).toHaveLength(2)

        firstPage.items.forEach((item, index) => {
          expect(item.sys.id).equal(result.items[index].sys.id)
        })
      })
    })
  })
})
