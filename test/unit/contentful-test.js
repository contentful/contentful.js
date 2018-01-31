import test from 'blue-tape'
import sinon from 'sinon'
import {createClient, __RewireAPI__ as createClientRewireApi} from '../../lib/contentful'
import {version} from '../../package.json'

test('Throws if no accessToken is defined', (t) => {
  t.throws(() => {
    createClient({space: 'spaceid'})
  }, /Expected parameter accessToken/)
  t.end()
})

test('Throws if no space is defined', (t) => {
  t.throws(() => {
    createClient({accessToken: 'accesstoken'})
  }, /Expected parameter space/)
  t.end()
})
test('Generate the correct User Agent Header', (t) => {
  createClientRewireApi.__Rewire__('@contentful/axios', sinon.stub)
  const createHttpClientStub = sinon.stub().returns({
    defaults: {
      baseURL: 'http://some-base-url.com'
    }
  })
  const rateLimitStub = sinon.stub()
  createClientRewireApi.__Rewire__('createHttpClient', createHttpClientStub)
  createClientRewireApi.__Rewire__('rateLimit', rateLimitStub)

  createClient({accessToken: 'accesstoken', space: 'spaceid', application: 'myApplication/1.1.1', integration: 'myIntegration/1.0.0'})
  t.ok(createHttpClientStub.args[0][1].headers['Content-Type'])
  t.ok(createHttpClientStub.args[0][1].headers['X-Contentful-User-Agent'])
  const headerParts = createHttpClientStub.args[0][1].headers['X-Contentful-User-Agent'].split('; ')
  t.equal(headerParts.length, 5)
  t.equal(headerParts[0], 'app myApplication/1.1.1')
  t.equal(headerParts[1], 'integration myIntegration/1.0.0')
  t.equal(headerParts[2], `sdk contentful.js/${version}`)

  createClientRewireApi.__ResetDependency__('rateLimit')
  createClientRewireApi.__ResetDependency__('createHttpClient')
  createClientRewireApi.__ResetDependency__('@contentful/axios')
  t.end()
})
test('Passes along HTTP client parameters', (t) => {
  createClientRewireApi.__Rewire__('@contentful/axios', sinon.stub)
  createClientRewireApi.__Rewire__('version', 'version')
  const createHttpClientStub = sinon.stub().returns({
    defaults: {
      baseURL: 'http://some-base-url.com'
    }
  })
  const rateLimitStub = sinon.stub()
  createClientRewireApi.__Rewire__('createHttpClient', createHttpClientStub)
  createClientRewireApi.__Rewire__('rateLimit', rateLimitStub)
  createClient({accessToken: 'accesstoken', space: 'spaceid'})
  t.ok(createHttpClientStub.args[0][1].headers['Content-Type'])
  t.ok(createHttpClientStub.args[0][1].headers['X-Contentful-User-Agent'])
  createClientRewireApi.__ResetDependency__('rateLimit')
  createClientRewireApi.__ResetDependency__('createHttpClient')
  createClientRewireApi.__ResetDependency__('@contentful/axios')
  t.end()
})

test('Returns a client instance', (t) => {
  const createHttpClientStub = sinon.stub().returns({
    defaults: {
      baseURL: 'http://some-base-url.com'
    }
  })
  const rateLimitStub = sinon.stub()
  createClientRewireApi.__Rewire__('createHttpClient', createHttpClientStub)
  createClientRewireApi.__Rewire__('rateLimit', rateLimitStub)
  const client = createClient({accessToken: 'accesstoken', space: 'spaceid'})
  t.ok(client.getSpace, 'getSpace')
  t.ok(client.getEntry, 'getEntry')
  t.ok(client.getEntries, 'getEntries')
  t.ok(client.getContentType, 'getContentType')
  t.ok(client.getContentTypes, 'getContentTypes')
  t.ok(client.getAsset, 'getAsset')
  t.ok(client.getAssets, 'getAssets')
  createClientRewireApi.__ResetDependency__('rateLimit')
  createClientRewireApi.__ResetDependency__('createHttpClient')
  t.end()
})

test('Initializes API with link resolution turned on by default', (t) => {
  const createHttpClientStub = sinon.stub().returns({
    defaults: {
      baseURL: 'http://some-base-url.com'
    }
  })
  const rateLimitStub = sinon.stub()
  createClientRewireApi.__Rewire__('createHttpClient', createHttpClientStub)
  createClientRewireApi.__Rewire__('rateLimit', rateLimitStub)
  const apiStub = sinon.stub().returns({})
  createClientRewireApi.__Rewire__('createContentfulApi', apiStub)
  createClient({accessToken: 'accesstoken', space: 'spaceid'})
  t.ok(apiStub.args[0][0].getGlobalOptions({}).resolveLinks, 'not overriden by query')
  t.notOk(apiStub.args[0][0].getGlobalOptions({resolveLinks: false}).resolveLinks, 'overriden by query')
  createClientRewireApi.__ResetDependency__('createHttpClient')
  createClientRewireApi.__ResetDependency__('rateLimit')
  t.end()
})

test('Initializes API with link resolution turned on explicitly', (t) => {
  const createHttpClientStub = sinon.stub().returns({
    defaults: {
      baseURL: 'http://some-base-url.com'
    }
  })
  const rateLimitStub = sinon.stub()
  createClientRewireApi.__Rewire__('createHttpClient', createHttpClientStub)
  createClientRewireApi.__Rewire__('rateLimit', rateLimitStub)
  const apiStub = sinon.stub().returns({})
  createClientRewireApi.__Rewire__('createContentfulApi', apiStub)
  createClient({accessToken: 'accesstoken', space: 'spaceid', resolveLinks: true})
  t.ok(apiStub.args[0][0].getGlobalOptions({}).resolveLinks, 'not overriden by query')
  t.notOk(apiStub.args[0][0].getGlobalOptions({resolveLinks: false}).resolveLinks, 'overriden by query')
  createClientRewireApi.__ResetDependency__('createHttpClient')
  createClientRewireApi.__ResetDependency__('rateLimit')
  t.end()
})

test('Initializes API with link resolution turned off explicitly', (t) => {
  const createHttpClientStub = sinon.stub().returns({
    defaults: {
      baseURL: 'http://some-base-url.com'
    }
  })
  const rateLimitStub = sinon.stub()
  createClientRewireApi.__Rewire__('createHttpClient', createHttpClientStub)
  createClientRewireApi.__Rewire__('rateLimit', rateLimitStub)
  const apiStub = sinon.stub().returns({})
  createClientRewireApi.__Rewire__('createContentfulApi', apiStub)
  createClient({accessToken: 'accesstoken', space: 'spaceid', resolveLinks: false})
  t.notOk(apiStub.args[0][0].resolveLinksGlobalSetting)
  createClientRewireApi.__ResetDependency__('createHttpClient')
  createClientRewireApi.__ResetDependency__('rateLimit')
  t.end()
})

test('Initializes API and attaches default environment', (t) => {
  const createHttpClientStub = sinon.stub().returns({
    defaults: {
      baseURL: 'http://some-base-url.com'
    }
  })
  const rateLimitStub = sinon.stub()
  createClientRewireApi.__Rewire__('createHttpClient', createHttpClientStub)
  createClientRewireApi.__Rewire__('rateLimit', rateLimitStub)
  const apiStub = sinon.stub().returns({})
  createClientRewireApi.__Rewire__('createContentfulApi', apiStub)
  createClient({accessToken: 'accesstoken', space: 'spaceid'})
  t.is(apiStub.args[0][0].http.defaults.baseURL, 'http://some-base-url.com/environments/master')
  createClientRewireApi.__ResetDependency__('createHttpClient')
  createClientRewireApi.__ResetDependency__('rateLimit')
  t.end()
})

test('Initializes API and attaches custom environment', (t) => {
  const createHttpClientStub = sinon.stub().returns({
    defaults: {
      baseURL: 'http://some-base-url.com'
    }
  })
  const rateLimitStub = sinon.stub()
  createClientRewireApi.__Rewire__('createHttpClient', createHttpClientStub)
  createClientRewireApi.__Rewire__('rateLimit', rateLimitStub)
  const apiStub = sinon.stub().returns({})
  createClientRewireApi.__Rewire__('createContentfulApi', apiStub)
  createClient({accessToken: 'accesstoken', space: 'spaceid', environment: 'stage'})
  t.is(apiStub.args[0][0].http.defaults.baseURL, 'http://some-base-url.com/environments/stage')
  createClientRewireApi.__ResetDependency__('createHttpClient')
  createClientRewireApi.__ResetDependency__('rateLimit')
  t.end()
})
