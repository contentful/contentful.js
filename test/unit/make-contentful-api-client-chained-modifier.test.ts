import { AxiosRequestHeaders, HeadersDefaults } from 'axios'
import { makeClient } from '../../lib/make-client'
import * as resolveCircular from '../../lib/utils/resolve-circular'
import { ValidationError } from '../../lib/utils/validation-error'

function setupWithData({
  promise,
  getGlobalOptions = jest.fn().mockReturnValue({
    resolveLinks: true,
    removeUnresolved: false,
    spaceBaseUrl: 'spaceUrl',
    environment: 'master',
    environmentBaseUrl: 'environmentUrl',
  }),
}) {
  const getStub = jest.fn()
  const postStub = jest.fn()
  const api = makeClient({
    // @ts-ignore
    http: {
      defaults: {
        baseURL: 'baseURL',
        logHandler: jest.fn(),
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

describe('Contentful API client chained modifier', () => {
  const resolveCircularMock = jest.fn()
  // @ts-ignore
  resolveCircular.default = resolveCircularMock

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
    jest.clearAllMocks()
    resolveCircularMock.mockImplementation((args) => {
      return args
    })
  })

  describe('Restricted client params', () => {
    describe('Default client', () => {
      describe('getEntries', () => {
        it('throws a warning when locale is passed to the options', async () => {
          const consoleWarnSpy = jest.spyOn(global.console, 'warn')
          await api.getEntries({ locale: '*' })
          expect(consoleWarnSpy).toBeCalled()
          expect(consoleWarnSpy.mock.calls[0][0]).toBe(
            `If you want to fetch entries in all existing locales, we recommend you to use client.withAllLocales instead of the locale='*' parameter.`
          )
        })

        it('throws a warning when resolveLinks is explicitly set to false', async () => {
          const consoleWarnSpy = jest.spyOn(global.console, 'warn')
          await api.getEntries({ resolveLinks: false })
          expect(consoleWarnSpy).toBeCalled()
          expect(consoleWarnSpy.mock.calls[0][0]).toBe(
            'The use of the `resolveLinks` parameter is discouraged. By default, links are resolved. If you do not want to resolve links, we recommend you to use client.withoutLinkResolution.'
          )
        })
      })

      describe('getEntry', () => {
        it('throws a warning when locale is passed to the options', async () => {
          const consoleWarnSpy = jest.spyOn(global.console, 'warn')
          await api.getEntry('id', { locale: '*' })
          expect(consoleWarnSpy).toBeCalled()
          expect(consoleWarnSpy.mock.calls[0][0]).toBe(
            `If you want to fetch entries in all existing locales, we recommend you to use client.withAllLocales instead of the locale='*' parameter.`
          )
        })

        it('throws a warning when resolveLinks parameter is explicitly set to false', async () => {
          const consoleWarnSpy = jest.spyOn(global.console, 'warn')
          await api.getEntry('id', { resolveLinks: false })
          expect(consoleWarnSpy).toBeCalled()
          expect(consoleWarnSpy.mock.calls[0][0]).toBe(
            'The use of the `resolveLinks` parameter is discouraged. By default, links are resolved. If you do not want to resolve links, we recommend you to use client.withoutLinkResolution.'
          )
        })
      })
    })

    describe('client with chained modifiers', () => {
      describe('getEntries', () => {
        it('throws error when locale parameter is passed to client.withAllLocales', async () => {
          await expect(
            api.withAllLocales.getEntries({
              // @ts-ignore
              locale: '*',
            })
          ).rejects.toThrow(ValidationError)
        })

        it('throws error when locale parameter is passed to client.withAllLocales.withoutLinkResolution', async () => {
          await expect(
            api.withAllLocales.withoutLinkResolution.getEntries({
              // @ts-ignore
              locale: '*',
            })
          ).rejects.toThrow(ValidationError)
        })
        it('throws error when resolveLinks parameter is passed to client.withoutLinkResolution', async () => {
          await expect(
            api.withoutLinkResolution.getEntries({
              // @ts-ignore
              resolveLinks: false,
            })
          ).rejects.toThrow(ValidationError)
          await expect(
            api.withoutLinkResolution.getEntries({
              // @ts-ignore
              resolveLinks: true,
            })
          ).rejects.toThrow(ValidationError)
        })
        it('throws error when resolveLinks parameter is passed to client.withoutLinkResolution.withAllLocales', async () => {
          await expect(
            api.withAllLocales.withoutLinkResolution.getEntries({
              // @ts-ignore
              resolveLinks: false,
            })
          ).rejects.toThrow(ValidationError)
          await expect(
            api.withAllLocales.withoutLinkResolution.getEntries({
              // @ts-ignore
              resolveLinks: true,
            })
          ).rejects.toThrow(ValidationError)
        })
      })

      describe('getEntry', () => {
        it('throws error when locale parameter is passed to client.withAllLocales', async () => {
          await expect(
            api.withAllLocales.getEntry('id', {
              // @ts-ignore
              locale: '*',
            })
          ).rejects.toThrow(ValidationError)
        })

        it('throws error when locale parameter is passed to client.withAllLocales.withoutLinkResolution', async () => {
          await expect(
            api.withAllLocales.withoutLinkResolution.getEntry('id', {
              // @ts-ignore
              locale: '*',
            })
          ).rejects.toThrow(ValidationError)
        })

        it('throws error when resolveLinks parameter is passed to client.withoutLinkResolution', async () => {
          await expect(
            api.withoutLinkResolution.getEntry('id', {
              // @ts-ignore
              resolveLinks: false,
            })
          ).rejects.toThrow(ValidationError)
          await expect(
            api.withoutLinkResolution.getEntry('id', {
              // @ts-ignore
              resolveLinks: true,
            })
          ).rejects.toThrow(ValidationError)
        })
        it('throws error when resolveLinks parameter is passed to client.withoutLinkResolution.withAllLocales', async () => {
          await expect(
            api.withAllLocales.withoutLinkResolution.getEntry('id', {
              // @ts-ignore
              resolveLinks: false,
            })
          ).rejects.toThrow(ValidationError)
          await expect(
            api.withAllLocales.withoutLinkResolution.getEntry('id', {
              // @ts-ignore
              resolveLinks: true,
            })
          ).rejects.toThrow(ValidationError)
        })
      })
    })
  })
})
