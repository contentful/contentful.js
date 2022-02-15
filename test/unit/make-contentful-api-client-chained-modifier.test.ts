import { AxiosRequestHeaders, HeadersDefaults } from 'axios'
import createGlobalOptions from '../../lib/create-global-options'
import { makeClient } from '../../lib/make-client'
import * as resolveCircular from '../../lib/utils/resolve-circular'
import { ValidationError } from '../../lib/utils/validation-error'
import * as mocks from './mocks'

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
      // @ts-expect-error
      defaults: { baseURL: 'baseURL', logHandler: jest.fn(), headers: {} as HeadersDefaults },
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
    sys: {
      id: 'id',
    },
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
    describe('default client', () => {
      it('throws a warning when locale is passed to the options', () => {
        const consoleWarnSpy = jest.spyOn(global.console, 'warn')
        api.getEntries({ 'sys.id': 'nyancat', locale: '*' })
        expect(consoleWarnSpy).toBeCalled()
        expect(consoleWarnSpy.mock.calls[0][0]).toBe(
          'If you want to fetch entries in all existing locales, we recommend you to use client.withAllLocales'
        )
      })
    })

    describe('Localized api', () => {
      it('throws an error when locale is passed to the options', async () => {
        await expect(
          api.withAllLocales.getEntries({
            // @ts-ignore
            locale: '*',
          })
        ).rejects.toThrow(ValidationError)
      })
      it('.withoutLinkResolution: throws an error when locale is passed to the options', async () => {
        await expect(
          api.withAllLocales.withoutLinkResolution.getEntries({
            // @ts-ignore
            locale: '*',
          })
        ).rejects.toThrow(ValidationError)
      })
    })
  })
})
