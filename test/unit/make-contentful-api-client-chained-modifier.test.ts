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
})
