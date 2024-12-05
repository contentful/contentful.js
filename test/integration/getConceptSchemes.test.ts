import * as contentful from '../../lib/contentful'
import { params } from './utils'

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000'
  params.insecure = true
}

const client = contentful.createClient(params)

describe('getConceptSchemes', () => {
  it('returns all concept schemes when no filters are available', async () => {
    const response = await client.getConceptSchemes()

    expect(response.items[0].sys.type).toBe('TaxonomyConceptScheme')
  })

  describe('order', () => {
    it('orders the concept schemes by createdAt', async () => {
      const response = await client.getConceptSchemes({ order: ['sys.createdAt'] })

      expect(new Date(response.items[0].sys.createdAt).getTime()).toBeLessThan(
        new Date(response.items[1].sys.createdAt).getTime(),
      )
    })

    it('orders the concept schemes by updatedAt', async () => {
      const response = await client.getConceptSchemes({ order: ['sys.updatedAt'] })

      expect(new Date(response.items[0].sys.updatedAt).getTime()).toBeLessThan(
        new Date(response.items[1].sys.updatedAt).getTime(),
      )
    })

    it('orders the concept schemes by prefLabel', async () => {
      const response = await client.getConceptSchemes({ order: ['prefLabel'] })

      expect(
        response.items[0].prefLabel['en-US'].localeCompare(response.items[1].prefLabel['en-US']),
      ).toBeLessThan(0)
    })
  })

  describe('pagination', () => {
    it('returns limit and next page cursor', async () => {
      const response = await client.getConceptSchemes({ limit: 1 })

      expect(response.items).toHaveLength(1)
      expect(response.limit).toBe(1)
      expect(response.sys.type).toBe('Array')
      expect(response.pages?.next).toBeDefined()
    })
  })
})
