// const version = require('../../package.json').version
// for some reason, import is not working.
const cfSDKCore = require('contentful-sdk-core')
const { createClient } = require('../../lib/contentful')

cfSDKCore.createHttpClient = jest.fn()
const createHttpClientMock = cfSDKCore.createHttpClient

describe('contentful', () => {
  beforeEach(() => {
    createHttpClientMock.mockReturnValue({
      defaults: {
        baseURL: 'http://some-base-url.com/'
      },
      interceptors: {
        response: {
          use: jest.fn()
        }
      }
    })
  })

  afterEach(() => {
    createHttpClientMock.mockReset()
  })

  test('Throws if no accessToken is defined', () => {
    expect(() => createClient({ space: 'spaceId' }))
      .toThrow(/Expected parameter accessToken/)
  })

  test('Throws if no space is defined', () => {
    expect(() => createClient({ accessToken: 'accessToken' }))
      .toThrow(/Expected parameter space/)
  })

  test('Generate the correct User Agent Header', () => {
    createClient({
      accessToken: 'accessToken',
      space: 'spaceId',
      application: 'myApplication/1.1.1',
      integration: 'myIntegration/1.0.0'
    })

    expect(createHttpClientMock).toHaveBeenCalledTimes(1)

    const callConfig = createHttpClientMock.mock.calls[0][1]

    expect(callConfig.headers['Content-Type']).toBeDefined()
    expect(callConfig.headers['X-Contentful-User-Agent']).toBeDefined()

    const headerParts = callConfig.headers['X-Contentful-User-Agent'].split('; ')
    expect(headerParts).toHaveLength(5)
    expect(headerParts[0]).toEqual('app myApplication/1.1.1')
    expect(headerParts[1]).toEqual('integration myIntegration/1.0.0')
    // expect(headerParts[2]).toEqual(`sdk contentful.js/${version}`)
  })

  test('Passes along HTTP client parameters', () => {
    createClient({
      accessToken: 'accessToken',
      space: 'spaceId'
    })
    const callConfig = createHttpClientMock.mock.calls[0][1]
    expect(callConfig.headers['Content-Type']).toBeDefined()
    expect(callConfig.headers['X-Contentful-User-Agent']).toBeDefined()
  })

  test('Returns a client instance', () => {
    const client = createClient({
      accessToken: 'accessToken',
      space: 'spaceId'
    })

    expect(client.getSpace).toBeDefined()
    expect(client.getEntry).toBeDefined()
    expect(client.getEntries).toBeDefined()
    expect(client.getContentType).toBeDefined()
    expect(client.getContentTypes).toBeDefined()
    expect(client.getAsset).toBeDefined()
    expect(client.getAssets).toBeDefined()
  })

  /*
    test('Initializes API with link resolution turned on by default', (t) => {
      const createHttpClientStub = sinon.stub().returns({
        defaults: {
          baseURL: 'http://some-base-url.com/'
        },
        interceptors: {
          response: {
            use: sinon.stub()
          }
        }
      })
      const rateLimitStub = sinon.stub()
      createClientRewireApi.__Rewire__('createHttpClient', createHttpClientStub)
      createClientRewireApi.__Rewire__('rateLimit', rateLimitStub)
      const apiStub = sinon.stub().returns({})
      createClientRewireApi.__Rewire__('createContentfulApi', apiStub)
      createClient({ accessToken: 'accesstoken', space: 'spaceid' })
      t.ok(apiStub.args[0][0].getGlobalOptions({}).resolveLinks, 'not overriden by query')
      t.notOk(apiStub.args[0][0].getGlobalOptions({ resolveLinks: false }).resolveLinks, 'overriden by query')
      createClientRewireApi.__ResetDependency__('createHttpClient')
      createClientRewireApi.__ResetDependency__('rateLimit')
      t.end()
    })
  /*

    test('Initializes API with link resolution turned on explicitly', (t) => {
      const createHttpClientStub = sinon.stub().returns({
        defaults: {
          baseURL: 'http://some-base-url.com/'
        },
        interceptors: {
          response: {
            use: sinon.stub()
          }
        }
      })
      const rateLimitStub = sinon.stub()
      createClientRewireApi.__Rewire__('createHttpClient', createHttpClientStub)
      createClientRewireApi.__Rewire__('rateLimit', rateLimitStub)
      const apiStub = sinon.stub().returns({})
      createClientRewireApi.__Rewire__('createContentfulApi', apiStub)
      createClient({
        accessToken: 'accesstoken',
        space: 'spaceid',
        resolveLinks: true
      })
      t.ok(apiStub.args[0][0].getGlobalOptions({}).resolveLinks, 'not overriden by query')
      t.notOk(apiStub.args[0][0].getGlobalOptions({ resolveLinks: false }).resolveLinks, 'overriden by query')
      createClientRewireApi.__ResetDependency__('createHttpClient')
      createClientRewireApi.__ResetDependency__('rateLimit')
      t.end()
    })

    test('Initializes API with link resolution turned off explicitly', (t) => {
      const createHttpClientStub = sinon.stub().returns({
        defaults: {
          baseURL: 'http://some-base-url.com/'
        },
        interceptors: {
          response: {
            use: sinon.stub()
          }
        }
      })
      const rateLimitStub = sinon.stub()
      createClientRewireApi.__Rewire__('createHttpClient', createHttpClientStub)
      createClientRewireApi.__Rewire__('rateLimit', rateLimitStub)
      const apiStub = sinon.stub().returns({})
      createClientRewireApi.__Rewire__('createContentfulApi', apiStub)
      createClient({
        accessToken: 'accesstoken',
        space: 'spaceid',
        resolveLinks: false
      })
      t.notOk(apiStub.args[0][0].resolveLinksGlobalSetting)
      createClientRewireApi.__ResetDependency__('createHttpClient')
      createClientRewireApi.__ResetDependency__('rateLimit')
      t.end()
    })

    test('Initializes API and attaches default environment', (t) => {
      const createHttpClientStub = sinon.stub().returns({
        defaults: {
          baseURL: 'http://some-base-url.com/'
        },
        interceptors: {
          response: {
            use: sinon.stub()
          }
        }
      })
      const rateLimitStub = sinon.stub()
      createClientRewireApi.__Rewire__('createHttpClient', createHttpClientStub)
      createClientRewireApi.__Rewire__('rateLimit', rateLimitStub)
      const apiStub = sinon.stub().returns({})
      createClientRewireApi.__Rewire__('createContentfulApi', apiStub)
      createClient({
        accessToken: 'accesstoken',
        space: 'spaceid'
      })
      t.is(apiStub.args[0][0].http.defaults.baseURL, 'http://some-base-url.com/environments/master')
      createClientRewireApi.__ResetDependency__('createHttpClient')
      createClientRewireApi.__ResetDependency__('rateLimit')
      t.end()
    })

    test('Initializes API and attaches custom environment', (t) => {
      const createHttpClientStub = sinon.stub().returns({
        defaults: {
          baseURL: 'http://some-base-url.com/'
        },
        interceptors: {
          response: {
            use: sinon.stub()
          }
        }
      })
      const rateLimitStub = sinon.stub()
      createClientRewireApi.__Rewire__('createHttpClient', createHttpClientStub)
      createClientRewireApi.__Rewire__('rateLimit', rateLimitStub)
      const apiStub = sinon.stub().returns({})
      createClientRewireApi.__Rewire__('createContentfulApi', apiStub)
      createClient({
        accessToken: 'accesstoken',
        space: 'spaceid',
        environment: 'stage'
      })
      t.is(apiStub.args[0][0].http.defaults.baseURL, 'http://some-base-url.com/environments/stage')
      createClientRewireApi.__ResetDependency__('createHttpClient')
      createClientRewireApi.__ResetDependency__('rateLimit')
      t.end()
    })

     */
})
