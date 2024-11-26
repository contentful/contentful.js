import { vi, test, expect, describe, MockedFunction, beforeEach, afterEach } from 'vitest'
import { createClient } from '../../lib/contentful'
import { createHttpClient } from 'contentful-sdk-core'
import * as CreateContentfulApi from '../../lib/create-contentful-api'

import pkg from '../../package.json' with { type: 'json' }

vi.mock('../../lib/create-contentful-api')
vi.mock('contentful-sdk-core', async (importOriginal) => {
  const mod: object = await importOriginal()

  return {
    ...mod,
    createHttpClient: vi.fn(),
  }
})

const createHttpClientMock = <MockedFunction<typeof createHttpClient>>(<unknown>createHttpClient)
const createContentfulApiMock = <MockedFunction<typeof CreateContentfulApi.default>>(
  (<unknown>CreateContentfulApi.default)
)

describe('contentful', () => {
  beforeEach(() => {
    createHttpClientMock.mockReturnValue({
      // @ts-ignore
      defaults: {
        baseURL: 'http://some-base-url.com/',
      },
      interceptors: {
        // @ts-ignore
        response: {
          use: vi.fn(),
        },
      },
    })
  })

  afterEach(() => {
    createHttpClientMock.mockReset()
    createContentfulApiMock.mockReset()
  })

  test('Throws if no accessToken is defined', () => {
    // @ts-ignore
    expect(() => createClient({ space: 'spaceId' })).toThrow(/Expected parameter accessToken/)
  })

  test('Throws if no space is defined', () => {
    // @ts-ignore
    expect(() => createClient({ accessToken: 'accessToken' })).toThrow(/Expected parameter space/)
  })

  test('Generate the correct User Agent Header', () => {
    createClient({
      accessToken: 'accessToken',
      space: 'spaceId',
      application: 'myApplication/1.1.1',
      integration: 'myIntegration/1.0.0',
    })

    expect(createHttpClientMock).toHaveBeenCalledTimes(1)

    const callConfig = createHttpClientMock.mock.calls[0][1]
    if (!callConfig.headers) {
      throw new Error('httpClient was created without headers')
    }
    expect(callConfig.headers['Content-Type']).toBeDefined()
    expect(callConfig.headers['X-Contentful-User-Agent']).toBeDefined()

    const headerParts = callConfig.headers['X-Contentful-User-Agent'].split('; ')
    expect(headerParts).toHaveLength(5)
    expect(headerParts[0]).toEqual('app myApplication/1.1.1')
    expect(headerParts[1]).toEqual('integration myIntegration/1.0.0')
    expect(headerParts[2]).toEqual(`sdk contentful.js/${pkg.version}`)
  })

  test('Passes along HTTP client parameters', () => {
    createClient({
      accessToken: 'accessToken',
      space: 'spaceId',
    })
    const callConfig = createHttpClientMock.mock.calls[0][1]
    if (!callConfig.headers) {
      throw new Error('httpClient was created without headers')
    }
    expect(callConfig.headers['Content-Type']).toBeDefined()
    expect(callConfig.headers['X-Contentful-User-Agent']).toBeDefined()
  })

  // So what?
  test.skip('Returns a client instance', () => {
    const client = createClient({
      accessToken: 'accessToken',
      space: 'spaceId',
    })

    expect(client.getSpace).toBeDefined()
    expect(client.getEntry).toBeDefined()
    expect(client.getEntries).toBeDefined()
    expect(client.getContentType).toBeDefined()
    expect(client.getContentTypes).toBeDefined()
    expect(client.getAsset).toBeDefined()
    expect(client.getAssets).toBeDefined()
  })

  test('Initializes API and attaches default environment', () => {
    createClient({
      accessToken: 'accessToken',
      space: 'spaceId',
    })
    const callConfig = createContentfulApiMock.mock.calls[0]
    expect(callConfig[0].http.defaults.baseURL).toEqual(
      'http://some-base-url.com/environments/master',
    )
  })

  test('Initializes API and attaches custom environment', () => {
    createClient({
      accessToken: 'accessToken',
      space: 'spaceId',
      environment: 'stage',
    })
    const callConfig = createContentfulApiMock.mock.calls[0]
    expect(callConfig[0].http.defaults.baseURL).toEqual(
      'http://some-base-url.com/environments/stage',
    )
  })

  test('Initializes API with includeContentSourceMaps option', () => {
    createClient({
      accessToken: 'accessToken',
      space: 'spaceId',
      includeContentSourceMaps: true,
    })
    const callConfig = createHttpClientMock.mock.calls[0]

    expect(callConfig[1].includeContentSourceMaps).toBe(true)
  })
})
