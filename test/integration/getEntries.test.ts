import * as contentful from '../../lib/contentful'
import { ValidationError } from '../../lib/utils/validate-timestamp'
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
describe('getEntries via chained clients', () => {
  const defaultClient = client
  const clientWithAllLocales = client.withAllLocales
  const clientWithoutLinkResolution = client.withoutLinkResolution
  const clientWithAllLocalesAndWithoutLinkResolution = client.withAllLocales.withoutLinkResolution
  const clientWithoutLinkResolutionAndWithoutLinkResolution =
    client.withAllLocales.withoutLinkResolution

  const query = { 'sys.id': 'nyancat' }

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
    'getEntries: %s (%s)',
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
      const entries = await client.getEntries(query)

      // checking for expected localization
      expect(entries.items[0].fields.color).toEqual(expectedLocalization)

      // checking for expected entry link resolution
      shouldBeResolved
        ? expect(entries.items[0].fields.bestFriend).not.toEqual(unresolvedLink)
        : expect(entries.items[0].fields.bestFriend).toEqual(unresolvedLink)
    }
  )
  describe('Restricted client params', () => {
    describe('default client', () => {
      it('throws a warning when locale is passed to the options', () => {
        const consoleWarnSpy = jest.spyOn(global.console, 'warn')
        client.getEntries({ 'sys.id': 'nyancat', locale: '*' })
        expect(consoleWarnSpy).toBeCalled()
        expect(consoleWarnSpy.mock.calls[0][0]).toBe(
          'If you want to fetch all the locales, we recommend to use the .withAllLocales'
        )
      })
    })

    describe('Localized client', () => {
      it('throws an error when locale is passed to the options', async () => {
        await expect(
          client.withAllLocales.getEntries({
            'sys.id': 'nyancat',
            // @ts-ignore
            locale: '*',
          })
        ).rejects.toThrow(ValidationError)
      })
      it('.withoutLinkResolution: throws an error when locale is passed to the options', async () => {
        await expect(
          client.withAllLocales.withoutLinkResolution.getEntries({
            'sys.id': 'nyancat',
            // @ts-ignore
            locale: '*',
          })
        ).rejects.toThrow(ValidationError)
      })
    })
  })
})
