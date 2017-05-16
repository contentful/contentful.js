import test from 'tape'
import sinon from 'sinon'
import {createClient, __RewireAPI__ as createClientRewireApi} from '../../lib/contentful'

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
  const headerRegEx = /(app|sdk|platform|integration|os) (\S+\/\d.\d.\d)(-\w+)?/igm
  createClientRewireApi.__Rewire__('axios', sinon.stub)
  createClientRewireApi.__Rewire__('version', 'version')
  const createHttpClientStub = sinon.stub()
  const rateLimitStub = sinon.stub()
  createClientRewireApi.__Rewire__('createHttpClient', createHttpClientStub)
  createClientRewireApi.__Rewire__('rateLimit', rateLimitStub)

  createClient({accessToken: 'accesstoken', space: 'spaceid', application: 'myApplication/1.0.0', integration: 'myIntegration/1.0.0'})
  t.ok(createHttpClientStub.args[0][1].headers['Content-Type'])
  t.ok(createHttpClientStub.args[0][1].headers['X-Contentful-User-Agent'])
  t.equal(createHttpClientStub.args[0][1].headers['X-Contentful-User-Agent'].match(headerRegEx).length, 5)

  createClientRewireApi.__ResetDependency__('rateLimit')
  createClientRewireApi.__ResetDependency__('createHttpClient')
  createClientRewireApi.__ResetDependency__('axios')
  t.end()
})
test('Passes along HTTP client parameters', (t) => {
  createClientRewireApi.__Rewire__('axios', sinon.stub)
  createClientRewireApi.__Rewire__('version', 'version')
  const createHttpClientStub = sinon.stub()
  const rateLimitStub = sinon.stub()
  createClientRewireApi.__Rewire__('createHttpClient', createHttpClientStub)
  createClientRewireApi.__Rewire__('rateLimit', rateLimitStub)
  createClient({accessToken: 'accesstoken', space: 'spaceid'})
  t.ok(createHttpClientStub.args[0][1].headers['Content-Type'])
  t.ok(createHttpClientStub.args[0][1].headers['X-Contentful-User-Agent'])
  createClientRewireApi.__ResetDependency__('rateLimit')
  createClientRewireApi.__ResetDependency__('createHttpClient')
  createClientRewireApi.__ResetDependency__('axios')
  t.end()
})

test('Returns a client instance', (t) => {
  const createHttpClientStub = sinon.stub()
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
  const createHttpClientStub = sinon.stub()
  const rateLimitStub = sinon.stub()
  createClientRewireApi.__Rewire__('createHttpClient', createHttpClientStub)
  createClientRewireApi.__Rewire__('rateLimit', rateLimitStub)
  const apiStub = sinon.stub().returns({})
  createClientRewireApi.__Rewire__('createContentfulApi', apiStub)
  createClient({accessToken: 'accesstoken', space: 'spaceid'})
  t.ok(apiStub.args[0][0].shouldLinksResolve({}), 'not overriden by query')
  t.notOk(apiStub.args[0][0].shouldLinksResolve({resolveLinks: false}), 'overriden by query')
  createClientRewireApi.__ResetDependency__('createHttpClient')
  createClientRewireApi.__ResetDependency__('rateLimit')
  t.end()
})

test('Initializes API with link resolution turned on explicitly', (t) => {
  const createHttpClientStub = sinon.stub()
  const rateLimitStub = sinon.stub()
  createClientRewireApi.__Rewire__('createHttpClient', createHttpClientStub)
  createClientRewireApi.__Rewire__('rateLimit', rateLimitStub)
  const apiStub = sinon.stub().returns({})
  createClientRewireApi.__Rewire__('createContentfulApi', apiStub)
  createClient({accessToken: 'accesstoken', space: 'spaceid', resolveLinks: true})
  t.ok(apiStub.args[0][0].shouldLinksResolve({}), 'not overriden by query')
  t.notOk(apiStub.args[0][0].shouldLinksResolve({resolveLinks: false}), 'overriden by query')
  createClientRewireApi.__ResetDependency__('createHttpClient')
  createClientRewireApi.__ResetDependency__('rateLimit')
  t.end()
})

test('Initializes API with link resolution turned off explicitly', (t) => {
  const createHttpClientStub = sinon.stub()
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
