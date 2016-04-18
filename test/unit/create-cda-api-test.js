import test from 'blue-tape'
import sinon from 'sinon'

import createCdaApi from '../../lib/create-cda-api'
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
  const api = createCdaApi({
    http: {
      get: getStub.returns(promise)
    },
    entities: entitiesMock,
    shouldLinksResolve: shouldLinksResolve
  })
  return {api, getStub}
}

test('CDA call getSpace', t => {
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
  .then(r => {
    t.looseEqual(r, data)
  })
})

test('CDA call getSpace fails', t => {
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
  .then(() => {}, r => {
    t.looseEqual(r, data)
  })
})

test('CDA call getContentType', t => {
  t.plan(1)
  const {api} = setupWithData({
    promise: Promise.resolve({ data: contentTypeMock })
  })
  entitiesMock.contentType.wrapContentType.returns(contentTypeMock)

  return api.getContentType('ctid')
  .then(r => {
    t.looseEqual(r, contentTypeMock)
  })
})

test('CDA call getContentType fails', t => {
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
  .then(() => {}, r => {
    t.looseEqual(r, data)
  })
})

test('CDA call getContentTypes', t => {
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
  .then(r => {
    t.looseEqual(r, data)
  })
})

test('CDA call getContentTypes fails', t => {
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
  .then(() => {}, r => {
    t.looseEqual(r, data)
  })
})

test('CDA call getEntry', t => {
  t.plan(1)
  const {api} = setupWithData({
    promise: Promise.resolve({ data: entryMock })
  })
  entitiesMock.entry.wrapEntry.returns(entryMock)

  return api.getEntry('eid')
  .then(r => {
    t.looseEqual(r, entryMock)
  })
})

test('CDA call getEntry fails', t => {
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
  .then(() => {}, r => {
    t.looseEqual(r, data)
  })
})

test('CDA call getEntries', t => {
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
  .then(r => {
    t.ok(entitiesMock.entry.wrapEntryCollection.args[0][1], 'resolveLinks turned on by default')
    t.looseEqual(r, data, 'returns expected data')
  })
})

test('CDA call getEntries with global resolve links turned off', t => {
  t.plan(2)

  const data = {sys: {id: 'id'}}

  const {api} = setupWithData({
    promise: Promise.resolve({ data: data }),
    shouldLinksResolve: sinon.stub().returns(false)
  })
  entitiesMock.entry.wrapEntryCollection.returns(data)

  return api.getEntries()
  .then(r => {
    t.notOk(entitiesMock.entry.wrapEntryCollection.args[0][1], 'resolveLinks turned off globally')
    t.looseEqual(r, data, 'returns expected data')
  })
})

test('CDA call getEntries fails', t => {
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
  .then(() => {}, r => {
    t.looseEqual(r, data)
  })
})

test('CDA call getAsset', t => {
  t.plan(1)
  const {api} = setupWithData({
    promise: Promise.resolve({ data: assetMock })
  })
  entitiesMock.asset.wrapAsset.returns(assetMock)

  return api.getAsset('aid')
  .then(r => {
    t.looseEqual(r, assetMock)
  })
})

test('CDA call getAsset fails', t => {
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
  .then(() => {}, r => {
    t.looseEqual(r, data)
  })
})

test('CDA call getAssets', t => {
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
  .then(r => {
    t.looseEqual(r, data)
  })
})

test('CDA call getAssets fails', t => {
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
  .then(() => {}, r => {
    t.looseEqual(r, data)
  })
})
