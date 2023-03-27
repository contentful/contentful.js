import * as contentful from '../../lib/contentful'
import { TypeCatSkeleton } from './parseEntries.test'
import { params } from './utils'

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000'
  params.insecure = true
}

const client = contentful.createClient(params)

describe('Sync API', () => {
  test('Sync space', async () => {
    const response = await client.sync({ initial: true })
    expect(response.entries).toBeDefined()
    expect(response.assets).toBeDefined()
    expect(response.deletedEntries).toBeDefined()
    expect(response.deletedAssets).toBeDefined()
    expect(response.nextSyncToken).toBeDefined()
  })

  test('Sync space asset links are resolved', async () => {
    const response = await client.sync({ initial: true })
    expect(response.entries).toBeDefined()

    const entryWithImageLink = response.entries.find((entry) => entry.fields && entry.fields.image)
    expect(entryWithImageLink?.fields?.image).toHaveProperty(`[en-US]sys.type`, 'Asset')
  })

  test('Sync space with token', async () => {
    const response = await client.sync({
      nextSyncToken:
        'w5ZGw6JFwqZmVcKsE8Kow4grw45QdybDsm4DWMK6OVYsSsOJwqPDksOVFXUFw54Hw65Tw6MAwqlWw5QkdcKjwqrDlsOiw4zDolvDq8KRRwUVBn3CusK6wpB3w690w6vDtMKkwrHDmsKSwobCuMKww57Cl8OGwp_Dq1QZCA',
    })
    expect(response.entries).toBeDefined()
    expect(response.assets).toBeDefined()
    expect(response.deletedEntries).toBeDefined()
    expect(response.deletedAssets).toBeDefined()
    expect(response.nextSyncToken).toBeDefined()
  })

  test('Sync spaces assets', async () => {
    const response = await client.sync({ initial: true, type: 'Asset' })
    expect(response.assets).toBeDefined()
    expect(response.deletedAssets).toBeDefined()
    expect(response.nextSyncToken).toBeDefined()
  })

  test('Sync space entries by content type', async () => {
    const response = await client.sync({
      initial: true,
      type: 'Entry',
      content_type: 'dog',
    })
    expect(response.entries).toBeDefined()
    expect(response.deletedEntries).toBeDefined()
    expect(response.nextSyncToken).toBeDefined()
  })

  test('Sync has withoutUnresolvableLinks modifier', async () => {
    const response = await client.withoutUnresolvableLinks.sync<TypeCatSkeleton>({
      initial: true,
      type: 'Entry',
      content_type: 'cat',
    })

    expect(response.entries[0].fields).toBeDefined()
    expect(response.entries[0].fields.bestFriend).toEqual({})
  })

  test('Sync ignores withAllLocales modifier', async () => {
    const responseWithLocales = await client.withAllLocales.sync({
      initial: true,
      type: 'Entry',
      content_type: 'cat',
    })

    const responseWithoutLocales = await client.sync({
      initial: true,
      type: 'Entry',
      content_type: 'cat',
    })

    expect(responseWithLocales).toStrictEqual(responseWithoutLocales)
  })

  test('Sync has withoutLinkResolution modifier', async () => {
    const response = await client.withoutLinkResolution.sync<TypeCatSkeleton>({
      initial: true,
      type: 'Entry',
      content_type: 'cat',
    })

    expect(response.entries[0].fields).toBeDefined()
    expect(response.entries[0].fields.bestFriend).toHaveProperty('[en-US]sys.type', 'Link')
  })
})
