import test from 'tape'
import sinon from 'sinon'
import createClient from '../../lib/contentful'

const axios = {create: sinon.stub()}

test('Throws if no accessToken is defined', (t) => {
  t.throws(() => {
    createClient(axios, {space: 'spaceid'})
  }, /Expected parameter accessToken/)
  t.end()
})

test('Throws if no space is defined', (t) => {
  t.throws(() => {
    createClient(axios, {accessToken: 'accesstoken'})
  }, /Expected parameter space/)
  t.end()
})

test('Passes along HTTP client parameters', (t) => {
  createClient.__Rewire__('version', 'version')
  const createHttpClientStub = sinon.stub()
  const wrapHttpClientStub = sinon.stub()
  createClient.__Rewire__('createHttpClient', createHttpClientStub)
  createClient.__Rewire__('wrapHttpClient', wrapHttpClientStub)
  createClient(axios, {accessToken: 'accesstoken', space: 'spaceid'})
  t.ok(createHttpClientStub.args[0][1].headers['Content-Type'])
  t.equals(createHttpClientStub.args[0][1].headers['X-Contentful-User-Agent'], 'contentful.js/version')
  createClient.__ResetDependency__('wrapHttpClient')
  createClient.__ResetDependency__('createHttpClient')
  t.end()
})

test('Returns a client instance', (t) => {
  const createHttpClientStub = sinon.stub()
  const wrapHttpClientStub = sinon.stub()
  createClient.__Rewire__('createHttpClient', createHttpClientStub)
  createClient.__Rewire__('wrapHttpClient', wrapHttpClientStub)
  const client = createClient(axios, {accessToken: 'accesstoken', space: 'spaceid'})
  t.ok(client.getSpace, 'getSpace')
  t.ok(client.getEntry, 'getEntry')
  t.ok(client.getEntries, 'getEntries')
  t.ok(client.getContentType, 'getContentType')
  t.ok(client.getContentTypes, 'getContentTypes')
  t.ok(client.getAsset, 'getAsset')
  t.ok(client.getAssets, 'getAssets')
  createClient.__ResetDependency__('wrapHttpClient')
  createClient.__ResetDependency__('createHttpClient')
  t.end()
})

test('Initializes API with link resolution turned on by default', (t) => {
  const createHttpClientStub = sinon.stub()
  const wrapHttpClientStub = sinon.stub()
  createClient.__Rewire__('createHttpClient', createHttpClientStub)
  createClient.__Rewire__('wrapHttpClient', wrapHttpClientStub)
  const apiStub = sinon.stub().returns({})
  createClient.__Rewire__('createContentfulApi', apiStub)
  createClient(axios, {accessToken: 'accesstoken', space: 'spaceid'})
  t.ok(apiStub.args[0][0].shouldLinksResolve({}), 'not overriden by query')
  t.notOk(apiStub.args[0][0].shouldLinksResolve({resolveLinks: false}), 'overriden by query')
  createClient.__ResetDependency__('createHttpClient')
  createClient.__ResetDependency__('wrapHttpClient')
  t.end()
})

test('Initializes API with link resolution turned on explicitly', (t) => {
  const createHttpClientStub = sinon.stub()
  const wrapHttpClientStub = sinon.stub()
  createClient.__Rewire__('createHttpClient', createHttpClientStub)
  createClient.__Rewire__('wrapHttpClient', wrapHttpClientStub)
  const apiStub = sinon.stub().returns({})
  createClient.__Rewire__('createContentfulApi', apiStub)
  createClient(axios, {accessToken: 'accesstoken', space: 'spaceid', resolveLinks: true})
  t.ok(apiStub.args[0][0].shouldLinksResolve({}), 'not overriden by query')
  t.notOk(apiStub.args[0][0].shouldLinksResolve({resolveLinks: false}), 'overriden by query')
  createClient.__ResetDependency__('createHttpClient')
  createClient.__ResetDependency__('wrapHttpClient')
  t.end()
})

test('Initializes API with link resolution turned off explicitly', (t) => {
  const createHttpClientStub = sinon.stub()
  const wrapHttpClientStub = sinon.stub()
  createClient.__Rewire__('createHttpClient', createHttpClientStub)
  createClient.__Rewire__('wrapHttpClient', wrapHttpClientStub)
  const apiStub = sinon.stub().returns({})
  createClient.__Rewire__('createContentfulApi', apiStub)
  createClient(axios, {accessToken: 'accesstoken', space: 'spaceid', resolveLinks: false})
  t.notOk(apiStub.args[0][0].resolveLinksGlobalSetting)
  createClient.__ResetDependency__('createHttpClient')
  createClient.__ResetDependency__('wrapHttpClient')
  t.end()
})
