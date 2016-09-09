import test from 'blue-tape'
import sinon from 'sinon'
import contentful from '../../'
import createContentfulApi, {__RewireAPI__ as createContentfulApiRewireApi} from '../../lib/create-contentful-api'
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
  createContentfulApiRewireApi.__Rewire__('entities', entitiesMock)
  const getStub = sinon.stub()
  const api = createContentfulApi({
    http: {
      get: getStub.returns(promise)
    },
    shouldLinksResolve: shouldLinksResolve
  })
  return {api, getStub}
}

function teardown () {
  createContentfulApiRewireApi.__ResetDependency__('entities')
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
    teardown()
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
    teardown()
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
    teardown()
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
    teardown()
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
    teardown()
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
    teardown()
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
    teardown()
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
    teardown()
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
    teardown()
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
    teardown()
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
    teardown()
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
    teardown()
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
    teardown()
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
    teardown()
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
    teardown()
  })
})

test('CDA call sync', (t) => {
  t.plan(5)
  const {api} = setupWithData({
    promise: Promise.resolve({
      data: {
        items: [],
        nextSyncUrl: 'http://nextsyncurl?sync_token=thisisthesynctoken'
      }
    })
  })

  return api.sync({initial: true})
  .then((r) => {
    t.ok(r.entries, 'entries')
    t.ok(r.assets, 'assets')
    t.ok(r.deletedEntries, 'deletedEntries')
    t.ok(r.deletedAssets, 'deletedAssets')
    t.equal(r.nextSyncToken, 'thisisthesynctoken', 'sync token')
    teardown()
  })
})

test('CDA call sync fails', (t) => {
  t.plan(1)
  const {api} = setupWithData({
    promise: Promise.reject({ data: 'error' })
  })

  return api.sync({initial: true})
  .then(() => {}, (r) => {
    t.equal(r, 'error')
    teardown()
  })
})

test('Given json should be parsed correctly as a collection of entries', (t) => {
  const client = contentful.createClient({accessToken: 'blablabla', space: 'bla'})
  const data = {items: [
    {
      sys: {type: 'Entry', locale: 'en-US'},
      fields: {
        animal: {sys: {type: 'Link', linkType: 'Animal', id: 'oink'}},
        anotheranimal: {sys: {type: 'Link', linkType: 'Animal', id: 'middle-parrot'}}
      }
    },
    {
      sys: {type: 'Entry', locale: 'en-US'},
      fields: {
        birds: [
          {sys: {type: 'Link', linkType: 'Animal', id: 'parrot'}},
          {sys: {type: 'Link', linkType: 'Animal', id: 'middle-parrot'}},
          {sys: {type: 'Link', linkType: 'Animal', id: 'aussie-parrot'}}
        ]
      }
    },
    {
      sys: {type: 'Entry'},
      fields: {
        animal: {
          'en-US': {sys: {type: 'Link', linkType: 'Animal', id: 'oink'}}
        },
        animals: {
          'en-US': [{sys: {type: 'Link', linkType: 'Animal', id: 'oink'}}]
        }
      }
    }
  ],
  includes: {
    Animal: [
      {
        sys: {type: 'Animal', id: 'oink', locale: 'en-US'},
        fields: {
          name: 'Pig',
          friend: {sys: {type: 'Link', linkType: 'Animal', id: 'groundhog'}}
        }
      },
      {
        sys: {type: 'Animal', id: 'groundhog', locale: 'en-US'},
        fields: {name: 'Phil'}
      },
      {
        sys: {type: 'Animal', id: 'parrot', locale: 'en-US'},
        fields: {name: 'Parrot'}
      },
      {
        sys: {type: 'Animal', id: 'aussie-parrot', locale: 'en-US'},
        fields: {name: 'Aussie Parrot'}
      }
    ]
  }
}
  let parsedData = client.parseEntries(data)
  t.ok(parsedData)
  t.looseEquals(parsedData.items[0].fields.animal.sys, data.includes.Animal[0].sys, 'oink')
  t.end()
})
