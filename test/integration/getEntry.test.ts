import * as contentful from '../../lib/contentful'
// @ts-ignore
import { localeSpaceParams, params, previewParams } from './utils'
import { EntryFields } from '../../lib'
import { FieldsWithContentTypeIdType } from '../../lib/types/query/util'

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000'
  params.insecure = true
}

const client = contentful.createClient(params)
const previewClient = contentful.createClient(previewParams)
const localeClient = contentful.createClient(localeSpaceParams)

describe('getEntry via chained clients', () => {
  const entryWithUnresolvableLink = '4SEhTg8sYJ1H3wDAinzhTp'
  const entryWithResolvableLink = 'nyancat'

  describe('default client', () => {
    test('Gets an entry with the correct ID', async () => {
      const response = await client.getEntry(entryWithResolvableLink, {
        include: 2,
      })

      expect(response.fields.bestFriend.sys.type).toBe('Entry')
      expect(response.fields.color).toBe('rainbow')
      expect(response.fields.color['en-US']).not.toBeDefined()
    })

    test('Gets an entry with a specific locale', async () => {
      const entry = await client.getEntry<
        FieldsWithContentTypeIdType<{ test: EntryFields.Symbol }>
      >(entryWithResolvableLink, {
        locale: 'tlh',
      })
      expect(entry.sys.locale).toBe('tlh')
    })

    test('Get entry fails if entryId does not exist', async () => {
      await expect(client.getEntry('nyancatblah')).rejects.toThrow()
    })

    test('Get entry fails if an entryId is not passed', async () => {
      // @ts-ignore
      await expect(client.getEntry()).rejects.toThrow()
    })

    test('Gets entry with link resolution', async () => {
      const response = await client.getEntry(entryWithResolvableLink, { include: 2 })

      expect(response.fields.bestFriend.sys.type).toEqual('Entry')
      expect(response.fields.bestFriend.fields).toBeDefined()
    })

    test('Gets an entry that has resource links', async () => {
      const response = await client.getEntry('xspaceEntry')

      expect(response.sys).toBeDefined()
      expect(response.fields).toBeDefined()
      expect(response.fields).toEqual({
        items: [
          {
            sys: {
              type: 'ResourceLink',
              linkType: 'Contentful:Entry',
              urn: 'crn:contentful:::content:spaces/ocrd5ofpzqgz/entries/1hTi7NUq74QfA8DI8rF8gL',
            },
          },
          {
            sys: {
              type: 'ResourceLink',
              linkType: 'Contentful:Entry',
              urn: 'crn:contentful:::content:spaces/ocrd5ofpzqgz/entries/3V5lyzzmJ2vH5f8kTmLtuZ',
            },
          },
        ],
      })
    })

    test('Gets entry with link resolution, and includes, keeping unresolvable links', async () => {
      const response = await client.getEntry(entryWithUnresolvableLink, {
        include: 2,
      })
      expect(response.fields).toBeDefined()
      expect(response.fields.bestFriend).toMatchObject({
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: '6SiPbntBPYYjnVHmipxJBF',
        },
      })
    })
  })

  describe('client has withoutUnresolvableLinks modifier', () => {
    test('client.withoutUnresolvableLinks.withAllLocales', async () => {
      const response = await client.withoutUnresolvableLinks.withAllLocales.getEntry(
        entryWithUnresolvableLink,
        {
          include: 2,
        }
      )

      expect(response.fields.color).toHaveProperty('en-US')
      expect(response.fields.bestFriend).toEqual({})
    })

    test('Gets entry with link resolution and includes, removing unresolvable links via client chain', async () => {
      const response = await client.withoutUnresolvableLinks.getEntry(entryWithUnresolvableLink, {
        include: 2,
      })
      expect(response.fields).toBeDefined()
      expect(response.fields.bestFriend).toBeUndefined()
    })
  })

  describe('client has withAllLocales modifier', () => {
    test('client.withAllLocales', async () => {
      const response = await client.withAllLocales.getEntry(entryWithResolvableLink, {
        include: 2,
      })

      expect(response.fields.color).toHaveProperty('en-US')
      expect(response.fields.bestFriend['en-US'].sys.type).not.toBe('Link')
    })

    test('client.withAllLocales.withoutLinkResolution', async () => {
      const response = await client.withAllLocales.withoutLinkResolution.getEntry(
        entryWithResolvableLink,
        {
          include: 2,
        }
      )
      expect(response.fields.color).toHaveProperty('en-US')
      expect(response.fields.bestFriend['en-US'].sys.type).toBe('Link')
    })

    test('client.withAllLocales.withoutUnresolvableLinks', async () => {
      const response = await client.withAllLocales.withoutUnresolvableLinks.getEntry(
        entryWithUnresolvableLink,
        {
          include: 2,
        }
      )

      expect(response.fields.color).toHaveProperty('en-US')
      expect(response.fields.bestFriend).toEqual({})
    })
  })

  describe('client has withoutLinkResolution modifier', () => {
    test('client.withoutLinkResolution', async () => {
      const response = await client.withoutLinkResolution.getEntry(entryWithResolvableLink)

      expect(response.fields.bestFriend.sys.type).toBe('Link')
    })

    test('client.withoutLinkResolution.withAllLocales', async () => {
      const response = await client.withoutLinkResolution.withAllLocales.getEntry(
        entryWithResolvableLink
      )

      expect(response.fields.color).toHaveProperty('en-US')
      expect(response.fields.bestFriend['en-US'].sys.type).toBe('Link')
    })

    test('Gets entry with without link resolution but with includes', async () => {
      const response = await client.withoutLinkResolution.getEntry(entryWithUnresolvableLink, {
        include: 2,
      })
      expect(response.fields).toBeDefined()
      expect(response.fields.bestFriend).toMatchObject({
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: '6SiPbntBPYYjnVHmipxJBF',
        },
      })
    })
  })
})

test('Get entry with fallback locale', async () => {
  type FieldsWithContentTypeId = FieldsWithContentTypeIdType<{ title: string }>

  const entries = await Promise.all([
    localeClient.getEntry<FieldsWithContentTypeId>('no-af-and-no-zu-za', { locale: 'af' }),
    localeClient.getEntry<FieldsWithContentTypeId>('no-af-and-no-zu-za', { locale: 'zu-ZA' }),
    localeClient.getEntry<FieldsWithContentTypeId>('no-zu-ZA', { locale: 'zu-ZA' }),
    localeClient.getEntry<FieldsWithContentTypeId>('no-ne-NP', { locale: 'ne-NP' }),
    localeClient.getEntry<FieldsWithContentTypeId>('no-af', { locale: 'af' }),
  ])

  expect(entries[0].fields.title).not.toBe('')
  expect(entries[1].fields.title).not.toBe('')
  expect(entries[2].fields.title).not.toBe('')
  expect(entries[3].fields.title).not.toBe('')
  expect(entries[4].fields.title).not.toBe('')
})

test('Gets entry with attached metadata and field called "metadata" on preview', async () => {
  const entryWithMetadataFieldAndMetadata = '1NnAC4eF9IRMpHtFB1NleW'
  const response = await previewClient.getEntry(entryWithMetadataFieldAndMetadata)
  expect(response.sys).toBeDefined()
  expect(response.fields).toBeDefined()
  expect(response.fields.metadata).toBeDefined()
  expect(response.metadata).toBeDefined()
})
