import * as contentful from '../../lib/contentful'
import { params } from './utils'

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000'
  params.insecure = true
}

const client = contentful.createClient(params)

describe('getConceptScheme', () => {
  it('returns a single concept scheme', async () => {
    const response = await client.getConceptScheme('7lcOh0M5JAu5xvEwWzs00H')

    expect(response.sys.type).toBe('TaxonomyConceptScheme')
  })
})
