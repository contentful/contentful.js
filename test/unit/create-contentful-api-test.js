import test from 'blue-tape'
import sinon from 'sinon'
import createGlobalOptions from '../../lib/create-global-options'

import createContentfulApi, { __RewireAPI__ as createContentfulApiRewireApi } from '../../lib/create-contentful-api'
import { contentTypeMock, assetMock, entryMock, localeMock } from './mocks'

let entitiesMock

function setupWithData ({
  promise,
  getGlobalOptions = sinon.stub().returns({
    resolveLinks: true,
    removeUnresolved: false,
    spaceBaseUrl: 'spaceUrl',
    environment: 'master',
    environmentBaseUrl: 'environementUrl'
  })
}) {
  entitiesMock = {
    space: {
      wrapSpace: sinon.stub()
    },
    contentType: {
      wrapContentType: sinon.stub(),
      wrapContentTypeCollection: sinon.stub()
    },
    entry: {
      wrapEntry: sinon.stub(),
      wrapEntryCollection: sinon.stub()
    },
    asset: {
      wrapAsset: sinon.stub(),
      wrapAssetCollection: sinon.stub()
    },
    locale: {
      wrapLocale: sinon.stub(),
      wrapLocaleCollection: sinon.stub()
    }
  }
  createContentfulApiRewireApi.__Rewire__('entities', entitiesMock)
  const getStub = sinon.stub()
  const api = createContentfulApi({
    http: {
      defaults: { baseURL: 'baseURL' },
      get: getStub.returns(promise)
    },
    getGlobalOptions: getGlobalOptions
  })
  return { api, getStub }
}

function teardown () {
  createContentfulApiRewireApi.__ResetDependency__('entities')
}

test('API call getSpace', async (t) => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id',
      type: 'Space'
    },
    name: 'name',
    locales: ['en-US']
  }
  const { api } = setupWithData({
    promise: Promise.resolve({ data: data })
  })
  entitiesMock.space.wrapSpace.returns(data)

  try {
    const r = await api.getSpace('spaceid')
    t.looseEqual(r, data)
  } finally {
    teardown()
  }
})

test('API call getSpace fails', async (t) => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const rejectError = new Error()
  rejectError.data = data
  const { api } = setupWithData({
    promise: Promise.reject(rejectError)
  })
  entitiesMock.space.wrapSpace.returns(data)

  try {
    await api.getSpace('spaceid')
  } catch (r) {
    t.looseEqual(r, data)
  } finally {
    teardown()
  }
})

test('API call getContentType', async (t) => {
  t.plan(1)
  const { api } = setupWithData({
    promise: Promise.resolve({ data: contentTypeMock })
  })
  entitiesMock.contentType.wrapContentType.returns(contentTypeMock)

  try {
    const r = await api.getContentType('ctid')
    t.looseEqual(r, contentTypeMock)
  } finally {
    teardown()
  }
})

test('API call getContentType fails', async (t) => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const rejectError = new Error()
  rejectError.data = data
  const { api } = setupWithData({
    promise: Promise.reject(rejectError)
  })
  entitiesMock.contentType.wrapContentType.returns(data)

  try {
    await api.getContentType('ctid')
  } catch (r) {
    t.looseEqual(r, data)
  } finally {
    teardown()
  }
})

test('API call getContentTypes', async (t) => {
  t.plan(1)
  const data = {
    total: 100,
    skip: 0,
    limit: 10,
    items: [contentTypeMock]
  }
  const { api } = setupWithData({
    promise: Promise.resolve({ data: data })
  })
  entitiesMock.contentType.wrapContentTypeCollection.returns(data)

  try {
    const r = await api.getContentTypes()
    t.looseEqual(r, data)
  } finally {
    teardown()
  }
})

test('API call getContentTypes fails', async (t) => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const rejectError = new Error()
  rejectError.data = data
  const { api } = setupWithData({
    promise: Promise.reject(rejectError)
  })
  entitiesMock.contentType.wrapContentTypeCollection.returns(data)

  try {
    await api.getContentTypes()
  } catch (r) {
    t.looseEqual(r, data)
  } finally {
    teardown()
  }
})

test('API call getEntry', async (t) => {
  t.plan(2)
  const { api } = setupWithData({
    promise: Promise.resolve({ data: entryMock })
  })
  api.getEntries = sinon.stub().resolves({ items: [entryMock] })
  entitiesMock.entry.wrapEntry.returns(entryMock)

  try {
    const r = await api.getEntry('eid')
    t.looseEqual(r, entryMock)
    t.true(api.getEntries.calledOnce)
  } finally {
    teardown()
  }
})

test('API call getEntry fails', async (t) => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const rejectError = new Error()
  rejectError.data = data
  const { api } = setupWithData({
    promise: Promise.reject(rejectError)
  })
  entitiesMock.entry.wrapEntry.returns(data)

  try {
    await api.getEntry('eid')
  } catch (r) {
    t.looseEqual(r, data)
  } finally {
    teardown()
  }
})

test('API call getEntries', async (t) => {
  t.plan(2)

  const data = {
    total: 100,
    skip: 0,
    limit: 10,
    items: [entryMock]
  }

  const { api } = setupWithData({
    promise: Promise.resolve({ data: data })
  })
  entitiesMock.entry.wrapEntryCollection.returns(data)

  try {
    const r = await api.getEntries()
    t.ok(entitiesMock.entry.wrapEntryCollection.args[0][1], 'resolveLinks turned on by default')
    t.looseEqual(r, data, 'returns expected data')
  } finally {
    teardown()
  }
})

test('API call getEntries with global resolve links overriden by query', async (t) => {
  t.plan(1)

  const data = { sys: { id: 'id' } }

  const { api } = setupWithData({
    promise: Promise.resolve({ data: data }),
    getGlobalOptions: createGlobalOptions({})
  })
  entitiesMock.entry.wrapEntryCollection.returns(data)

  try {
    await api.getEntries({ resolveLinks: true })
    t.ok(entitiesMock.entry.wrapEntryCollection.args[0][1].resolveLinks, 'resolveLinks turned off globally')
  } finally {
    teardown()
  }
})

test('API call getEntries with global resolve links turned off', async (t) => {
  t.plan(2)

  const data = { sys: { id: 'id' } }

  const { api } = setupWithData({
    promise: Promise.resolve({ data: data }),
    getGlobalOptions: sinon.stub().returns({ resolveLinks: false })
  })
  entitiesMock.entry.wrapEntryCollection.returns(data)

  try {
    const r = await api.getEntries()
    t.notOk(entitiesMock.entry.wrapEntryCollection.args[0][1].resolveLinks, 'resolveLinks turned off globally')
    t.looseEqual(r, data, 'returns expected data')
  } finally {
    teardown()
  }
})

test('API call getEntries fails', async (t) => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const rejectError = new Error()
  rejectError.data = data
  const { api } = setupWithData({
    promise: Promise.reject(rejectError)
  })
  entitiesMock.entry.wrapEntryCollection.returns(data)

  try {
    await api.getEntries()
  } catch (r) {
    t.looseEqual(r, data)
  } finally {
    teardown()
  }
})

test('API call getAsset', async (t) => {
  t.plan(1)
  const { api } = setupWithData({
    promise: Promise.resolve({ data: assetMock })
  })
  entitiesMock.asset.wrapAsset.returns(assetMock)

  try {
    const r = await api.getAsset('aid')
    t.looseEqual(r, assetMock)
  } finally {
    teardown()
  }
})

test('API call getAsset fails', async (t) => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const rejectError = new Error()
  rejectError.data = data
  const { api } = setupWithData({
    promise: Promise.reject(rejectError)
  })
  entitiesMock.asset.wrapAsset.returns(data)

  try {
    await api.getAsset('aid')
  } catch (r) {
    t.looseEqual(r, data)
  } finally {
    teardown()
  }
})

test('API call getAssets', async (t) => {
  t.plan(1)
  const data = {
    total: 100,
    skip: 0,
    limit: 10,
    items: [assetMock]
  }
  const { api } = setupWithData({
    promise: Promise.resolve({ data: data })
  })
  entitiesMock.asset.wrapAssetCollection.returns(data)

  try {
    const r = await api.getAssets()
    t.looseEqual(r, data)
  } finally {
    teardown()
  }
})

test('API call getAssets fails', async (t) => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const rejectError = new Error()
  rejectError.data = data
  const { api } = setupWithData({
    promise: Promise.reject(rejectError)
  })
  entitiesMock.asset.wrapAssetCollection.returns(data)

  try {
    await api.getAssets()
  } catch (r) {
    t.looseEqual(r, data)
  } finally {
    teardown()
  }
})

test('API call getLocales', async (t) => {
  t.plan(1)
  const data = {
    total: 100,
    skip: 0,
    limit: 10,
    items: [localeMock]
  }
  const { api } = setupWithData({
    promise: Promise.resolve({ data: data })
  })
  entitiesMock.locale.wrapLocaleCollection.returns(data)

  try {
    const r = await api.getLocales()
    t.looseEqual(r, data)
  } finally {
    teardown()
  }
})

test('API call getLocaless fails', async (t) => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const rejectError = new Error()
  rejectError.data = data
  const { api } = setupWithData({
    promise: Promise.reject(rejectError)
  })
  entitiesMock.locale.wrapLocaleCollection.returns(data)

  try {
    await api.getLocales()
  } catch (r) {
    t.looseEqual(r, data)
  } finally {
    teardown()
  }
})

test('CDA call sync', async (t) => {
  t.plan(5)
  const { api } = setupWithData({
    promise: Promise.resolve({
      data: {
        items: [],
        nextSyncUrl: 'http://nextsyncurl?sync_token=thisisthesynctoken'
      }
    })
  })

  try {
    const r = await api.sync({ initial: true })
    t.ok(r.entries, 'entries')
    t.ok(r.assets, 'assets')
    t.ok(r.deletedEntries, 'deletedEntries')
    t.ok(r.deletedAssets, 'deletedAssets')
    t.equal(r.nextSyncToken, 'thisisthesynctoken', 'sync token')
  } finally {
    teardown()
  }
})

test('CDA call sync fails', async (t) => {
  t.plan(1)
  const rejectError = new Error()
  rejectError.data = 'error'
  const { api } = setupWithData({
    promise: Promise.reject(rejectError)
  })
  try {
    await api.sync({ initial: true })
  } catch (r) {
    t.equal(r.data, 'error')
  } finally {
    teardown()
  }
})

test('Given json should be parsed correctly as a collection of entries', (t) => {
  const api = createContentfulApi({
    http: {},
    getGlobalOptions: sinon.stub().returns({ resolveLinks: true })
  })
  const data = {
    items: [
      {
        sys: { type: 'Entry', locale: 'en-US' },
        fields: {
          animal: { sys: { type: 'Link', linkType: 'Animal', id: 'oink' } },
          anotheranimal: { sys: { type: 'Link', linkType: 'Animal', id: 'middle-parrot' } }
        }
      }
    ],
    includes: {
      Animal: [
        {
          sys: { type: 'Animal', id: 'oink', locale: 'en-US' },
          fields: {
            name: 'Pig',
            friend: { sys: { type: 'Link', linkType: 'Animal', id: 'groundhog' } }
          }
        }
      ]
    }
  }
  const parsedData = api.parseEntries(data)
  t.ok(parsedData)
  t.looseEquals(parsedData.items[0].fields.animal.sys, data.includes.Animal[0].sys, 'oink')
  t.end()
})
