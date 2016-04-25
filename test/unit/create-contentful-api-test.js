import test from 'blue-tape'
import sinon from 'sinon'

import createContentfulApi from '../../lib/create-contentful-api'
import {contentTypeMock, assetMock, entryMock} from './mocks'

let entitiesMock

function setupWithData ({promise, shouldLinksResolve = sinon.stub().returns(true)}) {
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
    }
  }
  const getStub = sinon.stub()
  const api = createContentfulApi({
    http: {
      get: getStub.returns(promise)
    },
    entities: entitiesMock,
    shouldLinksResolve: shouldLinksResolve
  })
  return {api, getStub}
}

test('API call getSpace', (t) => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id',
      type: 'Space'
    },
    name: 'name',
    locales: [ 'en-US' ]
  }
  const {api} = setupWithData({
    promise: Promise.resolve({ data: data })
  })
  entitiesMock.space.wrapSpace.returns(data)

  return api.getSpace('spaceid')
  .then((r) => {
    t.looseEqual(r, data)
  })
})

test('API call getSpace fails', (t) => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData({
    promise: Promise.reject({ data: data })
  })
  entitiesMock.space.wrapSpace.returns(data)

  return api.getSpace('spaceid')
  .then(() => {}, (r) => {
    t.looseEqual(r, data)
  })
})

test('API call getContentType', (t) => {
  t.plan(1)
  const {api} = setupWithData({
    promise: Promise.resolve({ data: contentTypeMock })
  })
  entitiesMock.contentType.wrapContentType.returns(contentTypeMock)

  return api.getContentType('ctid')
  .then((r) => {
    t.looseEqual(r, contentTypeMock)
  })
})

test('API call getContentType fails', (t) => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData({
    promise: Promise.reject({ data: data })
  })
  entitiesMock.contentType.wrapContentType.returns(data)

  return api.getContentType('ctid')
  .then(() => {}, (r) => {
    t.looseEqual(r, data)
  })
})

test('API call getContentTypes', (t) => {
  t.plan(1)
  const data = {
    total: 100,
    skip: 0,
    limit: 10,
    items: [contentTypeMock]
  }
  const {api} = setupWithData({
    promise: Promise.resolve({ data: data })
  })
  entitiesMock.contentType.wrapContentTypeCollection.returns(data)

  return api.getContentTypes()
  .then((r) => {
    t.looseEqual(r, data)
  })
})

test('API call getContentTypes fails', (t) => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData({
    promise: Promise.reject({ data: data })
  })
  entitiesMock.contentType.wrapContentTypeCollection.returns(data)

  return api.getContentTypes()
  .then(() => {}, (r) => {
    t.looseEqual(r, data)
  })
})

test('API call getEntry', (t) => {
  t.plan(1)
  const {api} = setupWithData({
    promise: Promise.resolve({ data: entryMock })
  })
  entitiesMock.entry.wrapEntry.returns(entryMock)

  return api.getEntry('eid')
  .then((r) => {
    t.looseEqual(r, entryMock)
  })
})

test('API call getEntry fails', (t) => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData({
    promise: Promise.reject({ data: data })
  })
  entitiesMock.entry.wrapEntry.returns(data)

  return api.getEntry('eid')
  .then(() => {}, (r) => {
    t.looseEqual(r, data)
  })
})

test('API call getEntries', (t) => {
  t.plan(2)

  const data = {
    total: 100,
    skip: 0,
    limit: 10,
    items: [entryMock]
  }

  const {api} = setupWithData({
    promise: Promise.resolve({ data: data })
  })
  entitiesMock.entry.wrapEntryCollection.returns(data)

  return api.getEntries()
  .then((r) => {
    t.ok(entitiesMock.entry.wrapEntryCollection.args[0][1], 'resolveLinks turned on by default')
    t.looseEqual(r, data, 'returns expected data')
  })
})

test('API call getEntries with global resolve links turned off', (t) => {
  t.plan(2)

  const data = {sys: {id: 'id'}}

  const {api} = setupWithData({
    promise: Promise.resolve({ data: data }),
    shouldLinksResolve: sinon.stub().returns(false)
  })
  entitiesMock.entry.wrapEntryCollection.returns(data)

  return api.getEntries()
  .then((r) => {
    t.notOk(entitiesMock.entry.wrapEntryCollection.args[0][1], 'resolveLinks turned off globally')
    t.looseEqual(r, data, 'returns expected data')
  })
})

test('API call getEntries fails', (t) => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData({
    promise: Promise.reject({ data: data })
  })
  entitiesMock.entry.wrapEntryCollection.returns(data)

  return api.getEntries()
  .then(() => {}, (r) => {
    t.looseEqual(r, data)
  })
})

test('API call getAsset', (t) => {
  t.plan(1)
  const {api} = setupWithData({
    promise: Promise.resolve({ data: assetMock })
  })
  entitiesMock.asset.wrapAsset.returns(assetMock)

  return api.getAsset('aid')
  .then((r) => {
    t.looseEqual(r, assetMock)
  })
})

test('API call getAsset fails', (t) => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData({
    promise: Promise.reject({ data: data })
  })
  entitiesMock.asset.wrapAsset.returns(data)

  return api.getAsset('aid')
  .then(() => {}, (r) => {
    t.looseEqual(r, data)
  })
})

test('API call getAssets', (t) => {
  t.plan(1)
  const data = {
    total: 100,
    skip: 0,
    limit: 10,
    items: [assetMock]
  }
  const {api} = setupWithData({
    promise: Promise.resolve({ data: data })
  })
  entitiesMock.asset.wrapAssetCollection.returns(data)

  return api.getAssets()
  .then((r) => {
    t.looseEqual(r, data)
  })
})

test('API call getAssets fails', (t) => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData({
    promise: Promise.reject({ data: data })
  })
  entitiesMock.asset.wrapAssetCollection.returns(data)

  return api.getAssets()
  .then(() => {}, (r) => {
    t.looseEqual(r, data)
  })
})
