import * as contentful from '../../lib/contentful'
import { localeSpaceParams, params, previewParams } from './utils'

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000'
  params.insecure = true
}

const client = contentful.createClient(params)
const previewClient = contentful.createClient(previewParams)
const localeClient = contentful.createClient(localeSpaceParams)

// TODO:
// expand to cover also previewClient and localeClient
describe('getEntry via chained clients', () => {
  const defaultClient = client
  const clientWithAllLocales = client.withAllLocales
  const clientWithoutLinkResolution = client.withoutLinkResolution
  const clientWithAllLocalesAndWithoutLinkResolution = client.withAllLocales.withoutLinkResolution
  const clientWithoutLinkResolutionAndWithoutLinkResolution =
    client.withoutLinkResolution.withAllLocales

  const entryId = 'nyancat'

  const matrix = [
    [
      'client',
      'with link resolution',
      defaultClient,
      'rainbow',
      [{ sys: { id: 'happycat', linkType: 'Entry', type: 'Link' } }, true],
    ],
    [
      'client.withAllLocales',
      'with all locales, with link resolution',
      clientWithAllLocales,
      { 'en-US': 'rainbow' },
      [{ 'en-US': { sys: { id: 'happycat', linkType: 'Entry', type: 'Link' } } }, true],
    ],
    [
      'client.withoutLinkResolution',
      'without link resolution',
      clientWithoutLinkResolution,
      'rainbow',
      [{ sys: { id: 'happycat', linkType: 'Entry', type: 'Link' } }, false],
    ],
    [
      'client.withAllLocales.withoutLinkResolution',
      'with all locales, without link resolution',
      clientWithAllLocalesAndWithoutLinkResolution,
      { 'en-US': 'rainbow' },
      [{ 'en-US': { sys: { id: 'happycat', linkType: 'Entry', type: 'Link' } } }, false],
    ],
    [
      'client.withoutLinkResolution.withAllLocales',
      'with all locales, without link resolution',
      clientWithoutLinkResolutionAndWithoutLinkResolution,
      { 'en-US': 'rainbow' },
      [{ 'en-US': { sys: { id: 'happycat', linkType: 'Entry', type: 'Link' } } }, false],
    ],
  ]

  test.each(matrix)(
    'getEntry: %s (%s)',
    // @ts-ignore
    async (
      _name,
      _description,
      client,
      expectedLocalization,
      // @ts-ignore
      [unresolvedLink, shouldBeResolved]
    ) => {
      // @ts-ignore
      const entry = await client.getEntry(entryId)

      // checking for expected localization
      expect(entry.fields.color).toEqual(expectedLocalization)

      // checking for expected entry link resolution
      shouldBeResolved
        ? expect(entry.fields.bestFriend).not.toEqual(unresolvedLink)
        : expect(entry.fields.bestFriend).toEqual(unresolvedLink)
    }
  )
})
