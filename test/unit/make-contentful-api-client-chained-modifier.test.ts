import { MockedObject, vi } from 'vitest'
import { AxiosRequestHeaders, HeadersDefaults } from 'axios'
import { makeClient } from '../../lib/make-client'
import * as resolveCircular from '../../lib/utils/resolve-circular'
import { ValidationError } from '../../lib/utils/validation-error'

vi.mock('../../lib/utils/resolve-circular')

const resolveCircularMock = <MockedObject<typeof resolveCircular>>(<unknown>resolveCircular)

function setupWithData({
  promise,
  getGlobalOptions = vi.fn().mockReturnValue({
    resolveLinks: true,
    removeUnresolved: false,
    spaceBaseUrl: 'spaceUrl',
    environment: 'master',
    environmentBaseUrl: 'environmentUrl',
  }),
}) {
  const getStub = vi.fn()
  const postStub = vi.fn()
  const api = makeClient({
    // @ts-ignore
    http: {
      defaults: {
        baseURL: 'baseURL',
        logHandler: vi.fn(),
        headers: {} as AxiosRequestHeaders & HeadersDefaults,
      },
      get: getStub.mockReturnValue(promise),
      post: postStub.mockReturnValue(promise),
    },
    getGlobalOptions,
  })

  return {
    api,
    getStub,
    postStub,
  }
}

describe('Contentful API client chain modifiers', () => {
  const data = {
    items: [
      {
        sys: {
          id: 'id',
        },
      },
    ],
  }

  const { api } = setupWithData({
    promise: Promise.resolve({ data }),
  })

  beforeEach(() => {
    vi.clearAllMocks()
    resolveCircularMock.default.mockImplementation((args) => {
      return args
    })
  })

  describe('Restricted client params', () => {
    describe('Default client', () => {
      describe('getEntries', () => {
        it('passes when locale=en-US is passed to the options', async () => {
          const entries = await api.getEntries({ locale: 'en-US' })
          expect(entries.items).toBeDefined()
        })
        it('throws an error when locale=* is passed to the options', async () => {
          await expect(
            // @ts-ignore
            api.getEntries({ locale: '*' }),
          ).rejects.toThrow(ValidationError)
        })

        it('throws an error when resolveLinks parameter is used', async () => {
          // @ts-ignore
          await expect(api.getEntries({ resolveLinks: false })).rejects.toThrow(ValidationError)
        })
      })

      describe('getEntry', () => {
        it('passes when locale=en-US is passed to the options', async () => {
          const entry = await api.getEntry('id', { locale: 'en-US' })
          expect(entry).toBeDefined()
        })
        it('throws an error when locale=* is passed to the options', async () => {
          await expect(
            api.getEntry('id', {
              // @ts-ignore
              locale: '*',
            }),
          ).rejects.toThrow(ValidationError)
        })

        it('throws an error when resolveLinks parameter is used', async () => {
          // @ts-ignore
          await expect(api.getEntry('id', { resolveLinks: false })).rejects.toThrow(ValidationError)
        })
      })
    })

    describe('client with chained modifiers', () => {
      describe('getEntries', () => {
        it('throws error when any locale parameter is passed to client.withAllLocales', async () => {
          await expect(
            api.withAllLocales.getEntries({
              // @ts-ignore
              locale: 'en-US',
            }),
          ).rejects.toThrow(ValidationError)
        })

        it('throws error when any locale parameter is passed to client.withAllLocales.withoutLinkResolution', async () => {
          await expect(
            api.withAllLocales.withoutLinkResolution.getEntries({
              // @ts-ignore
              locale: 'en-US',
            }),
          ).rejects.toThrow(ValidationError)
        })
        it('throws error when resolveLinks parameter is passed to client.withoutLinkResolution', async () => {
          await expect(
            api.withoutLinkResolution.getEntries({
              // @ts-ignore
              resolveLinks: false,
            }),
          ).rejects.toThrow(ValidationError)
          await expect(
            api.withoutLinkResolution.getEntries({
              // @ts-ignore
              resolveLinks: true,
            }),
          ).rejects.toThrow(ValidationError)
        })
        it('throws error when resolveLinks parameter is passed to client.withoutLinkResolution.withAllLocales', async () => {
          await expect(
            api.withAllLocales.withoutLinkResolution.getEntries({
              // @ts-ignore
              resolveLinks: false,
            }),
          ).rejects.toThrow(ValidationError)
          await expect(
            api.withAllLocales.withoutLinkResolution.getEntries({
              // @ts-ignore
              resolveLinks: true,
            }),
          ).rejects.toThrow(ValidationError)
        })
      })

      describe('getEntry', () => {
        it('throws error when any locale parameter is passed to client.withAllLocales', async () => {
          await expect(
            api.withAllLocales.getEntry('id', {
              // @ts-ignore
              locale: 'en-US',
            }),
          ).rejects.toThrow(ValidationError)
        })

        it('throws error when any locale parameter is passed to client.withAllLocales.withoutLinkResolution', async () => {
          await expect(
            api.withAllLocales.withoutLinkResolution.getEntry('id', {
              // @ts-ignore
              locale: 'en-US',
            }),
          ).rejects.toThrow(ValidationError)
        })

        it('throws error when resolveLinks parameter is passed to client.withoutLinkResolution', async () => {
          await expect(
            api.withoutLinkResolution.getEntry('id', {
              // @ts-ignore
              resolveLinks: false,
            }),
          ).rejects.toThrow(ValidationError)
          await expect(
            api.withoutLinkResolution.getEntry('id', {
              // @ts-ignore
              resolveLinks: true,
            }),
          ).rejects.toThrow(ValidationError)
        })
        it('throws error when resolveLinks parameter is passed to client.withoutLinkResolution.withAllLocales', async () => {
          await expect(
            api.withAllLocales.withoutLinkResolution.getEntry('id', {
              // @ts-ignore
              resolveLinks: false,
            }),
          ).rejects.toThrow(ValidationError)
          await expect(
            api.withAllLocales.withoutLinkResolution.getEntry('id', {
              // @ts-ignore
              resolveLinks: true,
            }),
          ).rejects.toThrow(ValidationError)
        })
      })
    })
  })

  describe('withLocaleBasedPublishing', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      resolveCircularMock.default.mockImplementation((args) => {
        return args
      })
    })

    describe('getEntries', () => {
      it('adds X-Contentful-Locale-Based-Publishing header when calling getEntries', async () => {
        const { api, getStub } = setupWithData({
          promise: Promise.resolve({ data }),
        })

        await api.withLocaleBasedPublishing.getEntries()

        expect(getStub).toHaveBeenCalledWith(
          expect.stringContaining('entries'),
          expect.objectContaining({
            headers: {
              'X-Contentful-Locale-Based-Publishing': true,
            },
          }),
        )
      })

      it('adds header when chained with withAllLocales', async () => {
        const { api, getStub } = setupWithData({
          promise: Promise.resolve({ data }),
        })

        await api.withLocaleBasedPublishing.withAllLocales.getEntries()

        expect(getStub).toHaveBeenCalledWith(
          expect.stringContaining('entries'),
          expect.objectContaining({
            headers: {
              'X-Contentful-Locale-Based-Publishing': true,
            },
          }),
        )
      })

      it('adds header when chained with withoutLinkResolution', async () => {
        const { api, getStub } = setupWithData({
          promise: Promise.resolve({ data }),
        })

        await api.withLocaleBasedPublishing.withoutLinkResolution.getEntries()

        expect(getStub).toHaveBeenCalledWith(
          expect.stringContaining('entries'),
          expect.objectContaining({
            headers: {
              'X-Contentful-Locale-Based-Publishing': true,
            },
          }),
        )
      })

      it('adds header when chained with withoutUnresolvableLinks', async () => {
        const { api, getStub } = setupWithData({
          promise: Promise.resolve({ data }),
        })

        await api.withLocaleBasedPublishing.withoutUnresolvableLinks.getEntries()

        expect(getStub).toHaveBeenCalledWith(
          expect.stringContaining('entries'),
          expect.objectContaining({
            headers: {
              'X-Contentful-Locale-Based-Publishing': true,
            },
          }),
        )
      })

      it('adds header when chained with multiple modifiers', async () => {
        const { api, getStub } = setupWithData({
          promise: Promise.resolve({ data }),
        })

        await api.withLocaleBasedPublishing.withAllLocales.withoutLinkResolution.getEntries()

        expect(getStub).toHaveBeenCalledWith(
          expect.stringContaining('entries'),
          expect.objectContaining({
            headers: {
              'X-Contentful-Locale-Based-Publishing': true,
            },
          }),
        )
      })

      it('does not add header when not using withLocaleBasedPublishing', async () => {
        const { api, getStub } = setupWithData({
          promise: Promise.resolve({ data }),
        })

        await api.getEntries()

        const callArgs = getStub.mock.calls[0]
        const config = callArgs[1]
        expect(config?.headers).toBeUndefined()
      })
    })

    describe('getEntry', () => {
      it('adds X-Contentful-Locale-Based-Publishing header when calling getEntry', async () => {
        const { api, getStub } = setupWithData({
          promise: Promise.resolve({ data }),
        })

        await api.withLocaleBasedPublishing.getEntry('test-id')

        expect(getStub).toHaveBeenCalledWith(
          expect.stringContaining('entries'),
          expect.objectContaining({
            headers: {
              'X-Contentful-Locale-Based-Publishing': true,
            },
          }),
        )
      })

      it('adds header when chained with withAllLocales for getEntry', async () => {
        const { api, getStub } = setupWithData({
          promise: Promise.resolve({ data }),
        })

        await api.withLocaleBasedPublishing.withAllLocales.getEntry('test-id')

        expect(getStub).toHaveBeenCalledWith(
          expect.stringContaining('entries'),
          expect.objectContaining({
            headers: {
              'X-Contentful-Locale-Based-Publishing': true,
            },
          }),
        )
      })

      it('does not add header when not using withLocaleBasedPublishing', async () => {
        const { api, getStub } = setupWithData({
          promise: Promise.resolve({ data }),
        })

        await api.getEntry('test-id')

        const callArgs = getStub.mock.calls[0]
        const config = callArgs[1]
        expect(config?.headers).toBeUndefined()
      })
    })

    describe('getAssets', () => {
      it('adds X-Contentful-Locale-Based-Publishing header when calling getAssets', async () => {
        const assetData = {
          items: [
            {
              sys: { id: 'asset-id', type: 'Asset' },
              fields: { title: 'Test Asset' },
            },
          ],
        }
        const { api, getStub } = setupWithData({
          promise: Promise.resolve({ data: assetData }),
        })

        await api.withLocaleBasedPublishing.getAssets()

        expect(getStub).toHaveBeenCalledWith(
          expect.stringContaining('assets'),
          expect.objectContaining({
            headers: {
              'X-Contentful-Locale-Based-Publishing': true,
            },
          }),
        )
      })

      it('adds header when chained with withAllLocales for getAssets', async () => {
        const assetData = {
          items: [
            {
              sys: { id: 'asset-id', type: 'Asset' },
              fields: { title: 'Test Asset' },
            },
          ],
        }
        const { api, getStub } = setupWithData({
          promise: Promise.resolve({ data: assetData }),
        })

        await api.withLocaleBasedPublishing.withAllLocales.getAssets()

        expect(getStub).toHaveBeenCalledWith(
          expect.stringContaining('assets'),
          expect.objectContaining({
            headers: {
              'X-Contentful-Locale-Based-Publishing': true,
            },
          }),
        )
      })

      it('does not add header when not using withLocaleBasedPublishing', async () => {
        const assetData = {
          items: [
            {
              sys: { id: 'asset-id', type: 'Asset' },
              fields: { title: 'Test Asset' },
            },
          ],
        }
        const { api, getStub } = setupWithData({
          promise: Promise.resolve({ data: assetData }),
        })

        await api.getAssets()

        const callArgs = getStub.mock.calls[0]
        const config = callArgs[1]
        expect(config?.headers).toBeUndefined()
      })
    })

    describe('getAsset', () => {
      it('adds X-Contentful-Locale-Based-Publishing header when calling getAsset', async () => {
        const assetData = {
          sys: { id: 'asset-id', type: 'Asset' },
          fields: { title: 'Test Asset' },
        }
        const { api, getStub } = setupWithData({
          promise: Promise.resolve({ data: assetData }),
        })

        await api.withLocaleBasedPublishing.getAsset('test-asset-id')

        expect(getStub).toHaveBeenCalledWith(
          expect.stringContaining('assets/test-asset-id'),
          expect.objectContaining({
            headers: {
              'X-Contentful-Locale-Based-Publishing': true,
            },
          }),
        )
      })

      it('adds header when chained with withAllLocales for getAsset', async () => {
        const assetData = {
          sys: { id: 'asset-id', type: 'Asset' },
          fields: { title: 'Test Asset' },
        }
        const { api, getStub } = setupWithData({
          promise: Promise.resolve({ data: assetData }),
        })

        await api.withLocaleBasedPublishing.withAllLocales.getAsset('test-asset-id')

        expect(getStub).toHaveBeenCalledWith(
          expect.stringContaining('assets/test-asset-id'),
          expect.objectContaining({
            headers: {
              'X-Contentful-Locale-Based-Publishing': true,
            },
          }),
        )
      })

      it('does not add header when not using withLocaleBasedPublishing', async () => {
        const assetData = {
          sys: { id: 'asset-id', type: 'Asset' },
          fields: { title: 'Test Asset' },
        }
        const { api, getStub } = setupWithData({
          promise: Promise.resolve({ data: assetData }),
        })

        await api.getAsset('test-asset-id')

        const callArgs = getStub.mock.calls[0]
        const config = callArgs[1]
        expect(config?.headers).toBeUndefined()
      })
    })

    describe('getEntriesWithCursor', () => {
      it('adds X-Contentful-Locale-Based-Publishing header when calling getEntriesWithCursor', async () => {
        const cursorData = {
          items: [
            {
              sys: { id: 'entry-id' },
            },
          ],
          sys: {
            type: 'Array',
          },
          pages: {
            next: null,
            prev: null,
          },
        }
        const { api, getStub } = setupWithData({
          promise: Promise.resolve({ data: cursorData }),
        })

        await api.withLocaleBasedPublishing.getEntriesWithCursor()

        expect(getStub).toHaveBeenCalledWith(
          expect.stringContaining('entries'),
          expect.objectContaining({
            headers: {
              'X-Contentful-Locale-Based-Publishing': true,
            },
          }),
        )
      })
    })

    describe('getAssetsWithCursor', () => {
      it('adds X-Contentful-Locale-Based-Publishing header when calling getAssetsWithCursor', async () => {
        const cursorData = {
          items: [
            {
              sys: { id: 'asset-id', type: 'Asset' },
              fields: { title: 'Test Asset' },
            },
          ],
          sys: {
            type: 'Array',
          },
          pages: {
            next: null,
            prev: null,
          },
        }
        const { api, getStub } = setupWithData({
          promise: Promise.resolve({ data: cursorData }),
        })

        await api.withLocaleBasedPublishing.getAssetsWithCursor()

        expect(getStub).toHaveBeenCalledWith(
          expect.stringContaining('assets'),
          expect.objectContaining({
            headers: {
              'X-Contentful-Locale-Based-Publishing': true,
            },
          }),
        )
      })
    })

    describe('chaining behavior', () => {
      it('allows chaining in any order', async () => {
        const { api, getStub } = setupWithData({
          promise: Promise.resolve({ data }),
        })

        await api.withAllLocales.withLocaleBasedPublishing.getEntries()

        expect(getStub).toHaveBeenCalledWith(
          expect.stringContaining('entries'),
          expect.objectContaining({
            headers: {
              'X-Contentful-Locale-Based-Publishing': true,
            },
          }),
        )
      })

      it('allows chaining with withoutLinkResolution first', async () => {
        const { api, getStub } = setupWithData({
          promise: Promise.resolve({ data }),
        })

        await api.withoutLinkResolution.withLocaleBasedPublishing.getEntries()

        expect(getStub).toHaveBeenCalledWith(
          expect.stringContaining('entries'),
          expect.objectContaining({
            headers: {
              'X-Contentful-Locale-Based-Publishing': true,
            },
          }),
        )
      })

      it('allows chaining with withoutUnresolvableLinks first', async () => {
        const { api, getStub } = setupWithData({
          promise: Promise.resolve({ data }),
        })

        await api.withoutUnresolvableLinks.withLocaleBasedPublishing.getEntries()

        expect(getStub).toHaveBeenCalledWith(
          expect.stringContaining('entries'),
          expect.objectContaining({
            headers: {
              'X-Contentful-Locale-Based-Publishing': true,
            },
          }),
        )
      })
    })
  })
})
