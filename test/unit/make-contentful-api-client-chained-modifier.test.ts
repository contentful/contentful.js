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
    resolveCircularMock.mockImplementation((args) => {
      return args
    })
  })

  afterEach(() => {
    resolveCircularMock.mockReset()
  })

  describe('Restricted client params', () => {
    describe('Default client', () => {
      it('getEntries: throws a warning when locale is passed to the options', () => {
        const consoleWarnSpy = jest.spyOn(global.console, 'warn')
        api.getEntries({ locale: '*' })
        expect(consoleWarnSpy).toBeCalled()
        expect(consoleWarnSpy.mock.calls[0][0]).toBe(
          `If you want to fetch entries in all existing locales, we recommend you to use client.withAllLocales instead of the locale='*' parameter`
        )
        consoleWarnSpy.mockRestore()
      })

      it('getEntry: throws a warning when locale is passed to the options', async () => {
        const consoleWarnSpy = jest.spyOn(global.console, 'warn')
        await api.getEntry('id', { locale: '*' })

        expect(consoleWarnSpy).toBeCalled()
        expect(consoleWarnSpy.mock.calls[0][0]).toBe(
          `If you want to fetch entries in all existing locales, we recommend you to use client.withAllLocales instead of the locale='*' parameter`
        )
        consoleWarnSpy.mockRestore()
      })
    })

    describe('Localized client', () => {
      it('getEntries: throws an error when locale is passed to the options', async () => {
        await expect(
          api.withAllLocales.getEntries({
            // @ts-ignore
            locale: '*',
          })
        ).rejects.toThrow(ValidationError)
      })

      it('getEntries: .withoutLinkResolution: throws an error when locale is passed to the options', async () => {
        await expect(
          api.withAllLocales.withoutLinkResolution.getEntries({
            // @ts-ignore
            locale: '*',
          })
        ).rejects.toThrow(ValidationError)
      })

      it('getEntry: throws an error when locale is passed to the options', async () => {
        await expect(
          api.withAllLocales.getEntry('id', {
            // @ts-ignore
            locale: '*',
          })
        ).rejects.toThrow(ValidationError)
      })

      it('getEntry: .withoutLinkResolution: throws an error when locale is passed to the options', async () => {
        await expect(
          api.withAllLocales.withoutLinkResolution.getEntry('id', {
            // @ts-ignore
            locale: '*',
          })
        ).rejects.toThrow(ValidationError)
      })
    })
  })
})
