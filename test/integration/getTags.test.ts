import * as contentful from '../../lib/contentful'
import { params } from './utils'

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000'
  params.insecure = true
}

const client = contentful.createClient(params)

describe.only('getTags', () => {
  it('returns all tags when no filters are available', async () => {
    const response = await client.getTags()

    console.dir(response, { depth: null })

    expect(response.items[0].sys.type).toBe('Tag')
  })

  describe('tagName filters', () => {
    it('gets the tag with the name equals to the provided value', async () => {
      const response = await client.getTags({ name: 'public tag 1' })

      expect(response.items.length).toBe(1)
      expect(response.items[0].name).toEqual('public tag 1')
    })

    it('gets the tag with the name not equals to the provided value', async () => {
      const response = await client.getTags({ 'name[ne]': 'public tag 1' })

      expect(response.items.length).toBe(0)
      expect(response.items).toEqual([])
    })

    it('gets the tags with the name matching to the provided value', async () => {
      const response = await client.getTags({ 'name[match]': 'public tag' })

      expect(response.items.length).toBe(1)
      expect(response.items[0].name).toEqual('public tag 1')
    })

    it('gets the tags with the name in the list of the provided value', async () => {
      const response = await client.getTags({ 'name[in]': 'public tag,public tag 1' })

      expect(response.items.length).toBe(1)
      expect(response.items[0].name).toEqual('public tag 1')
    })

    it('gets the tags with the name not in the list of the provided value', async () => {
      const response = await client.getTags({ 'name[nin]': 'public tag,public tag 1' })

      expect(response.items.length).toBe(0)
      expect(response.items).toEqual([])
    })

    it('gets the tags with the name exists', async () => {
      const response = await client.getTags({ 'name[exists]': true })

      expect(response.items.length).toBe(1)
      expect(response.items[0].name).toEqual('public tag 1')
    })
  })

  describe('sys filters', () => {
    it('can filter by id', async () => {
      const response = await client.getTags({ 'sys.id': 'publicTag1' })

      expect(response.items.length).toBe(1)
      expect(response.items[0].sys.id).toEqual('publicTag1')
    })

    it('can filter by createdAt', async () => {
      const response = await client.getTags({ 'sys.createdAt': '2021-02-11T14:44:48.594Z' })

      expect(response.items.length).toBe(1)
      expect(response.items[0].sys.id).toEqual('publicTag1')
    })

    it('can filter by updateAt', async () => {
      const response = await client.getTags({ 'sys.updatedAt': '2021-02-11T14:44:48.594Z' })

      expect(response.items.length).toBe(1)
      expect(response.items[0].sys.id).toEqual('publicTag1')
    })

    it('can filter by visibility', async () => {
      const response = await client.getTags({ 'sys.visibility': 'private' })

      expect(response.items.length).toBe(0)
      expect(response.items).toEqual([])
    })

    it('can filter by type', async () => {
      const response = await client.getTags({ 'sys.type': 'Tag' })

      expect(response.items.length).toBe(1)
      expect(response.items[0].sys.id).toEqual('publicTag1')
    })
  })
})
