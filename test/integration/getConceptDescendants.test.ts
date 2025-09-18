import * as contentful from '../../lib/contentful'
import { params } from './utils'

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000'
  params.insecure = true
}

type AvailableLocales = 'de-de' | 'en-US'

const client = contentful.createClient(params)

describe('getConcept', () => {
  it('returns a single concept', async () => {
    const response = await client.getConceptDescendants<AvailableLocales>('3eXhEIEzcZqwHyYWHbzSoS')

    expect(response.sys.type).toBe('TaxonomyConcept')
  })
})
