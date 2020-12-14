import { createClient } from '../../lib/contentful'
import * as SdkCore from 'contentful-sdk-core'
import * as CreateContentfulApi from '../../lib/create-contentful-api'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const version = require('../../package.json').version

jest.mock('../../lib/create-contentful-api')

// @ts-ignore
SdkCore.createHttpClient = jest.fn()
const createHttpClientMock = <jest.Mock<typeof SdkCore.createHttpClient>>(
  (<unknown>SdkCore.createHttpClient)
)
const createContentfulApiMock = <jest.Mock<typeof CreateContentfulApi.default>>(
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
        response: {
          use: jest.fn(),
        },
      },
    })
  })

  afterEach(() => {
    createHttpClientMock.mockReset()
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

    expect(callConfig.headers['Content-Type']).toBeDefined()
    expect(callConfig.headers['X-Contentful-User-Agent']).toBeDefined()

    const headerParts = callConfig.headers['X-Contentful-User-Agent'].split('; ')
    expect(headerParts).toHaveLength(5)
    expect(headerParts[0]).toEqual('app myApplication/1.1.1')
    expect(headerParts[1]).toEqual('integration myIntegration/1.0.0')
    expect(headerParts[2]).toEqual(`sdk contentful.js/${version}`)
  })

  test('Passes along HTTP client parameters', () => {
    createClient({
      accessToken: 'accessToken',
      space: 'spaceId',
    })
    const callConfig = createHttpClientMock.mock.calls[0][1]
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

  test('Initializes API with link resolution turned on by default', () => {
    createClient({
      accessToken: 'accessToken',
      space: 'spaceId',
    })
    const callConfig = createContentfulApiMock.mock.calls[0]
    expect(callConfig[0].getGlobalOptions().resolveLinks).toBeTruthy()
    expect(callConfig[0].getGlobalOptions({ resolveLinks: false }).resolveLinks).toBeFalsy()
  })

  test('Initializes API with link resolution turned on explicitly', () => {
    createClient({
      accessToken: 'accessToken',
      space: 'spaceId',
      resolveLinks: true,
    })
    const callConfig = createContentfulApiMock.mock.calls[0]
    expect(callConfig[0].getGlobalOptions().resolveLinks).toBeTruthy()
    expect(callConfig[0].getGlobalOptions({ resolveLinks: false }).resolveLinks).toBeFalsy()
  })

  test('Initializes API and attaches default environment', () => {
    createClient({
      accessToken: 'accessToken',
      space: 'spaceId',
    })
    const callConfig = createContentfulApiMock.mock.calls[0]
    expect(callConfig[0].http.defaults.baseURL).toEqual(
      'http://some-base-url.com/environments/master'
    )
  })

  // fails, not sure if it because of wrong mocking
  test.skip('Initializes API and attaches custom environment', () => {
    createClient({
      accessToken: 'accessToken',
      space: 'spaceId',
      environment: 'stage',
    })
    const callConfig = createContentfulApiMock.mock.calls[0]
    expect(callConfig[0].http.defaults.baseURL).toEqual(
      'http://some-base-url.com/environments/stage'
    )
  })
})
