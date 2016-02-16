/* @flow */
import test from 'blue-tape'
import sinon from 'sinon'

// $FlowIgnoreRewire
import createCdaApi, {__RewireAPI__ as createCdaApiRewireApi} from '../../lib/create-cda-api'

function setupWithData (promise, resolveLinks = true) {
  const getStub = sinon.stub()
  const api = createCdaApi({
    get: getStub.returns(promise)
  }, resolveLinks)
  return {api, getStub}
}

test('CDA call getSpace', t => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData(Promise.resolve({
    data: data
  }))

  return api.getSpace('spaceid')
  .then(r => {
    console.log('resolving')
    t.looseEqual(r.toPlainObject(), data)
  })
})

test('CDA call getSpace fails', t => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData(Promise.reject({
    data: data
  }))

  return api.getSpace('spaceid')
  .then(() => {}, r => {
    t.looseEqual(r, data)
  })
})

test('CDA call getContentType', t => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData(Promise.resolve({
    data: data
  }))

  return api.getContentType('ctid')
  .then(r => {
    t.looseEqual(r.toPlainObject(), data)
  })
})

test('CDA call getContentType fails', t => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData(Promise.reject({
    data: data
  }))

  return api.getContentType('ctid')
  .then(() => {}, r => {
    t.looseEqual(r, data)
  })
})

test('CDA call getContentTypes', t => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData(Promise.resolve({
    data: data
  }))

  return api.getContentTypes()
  .then(r => {
    t.looseEqual(r.toPlainObject(), data)
  })
})

test('CDA call getContentTypes fails', t => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData(Promise.reject({
    data: data
  }))

  return api.getContentTypes()
  .then(() => {}, r => {
    t.looseEqual(r, data)
  })
})

test('CDA call getEntry', t => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData(Promise.resolve({
    data: data
  }))

  return api.getEntry('eid')
  .then(r => {
    t.looseEqual(r.toPlainObject(), data)
  })
})

test('CDA call getEntry fails', t => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData(Promise.reject({
    data: data
  }))

  return api.getEntry('eid')
  .then(() => {}, r => {
    t.looseEqual(r, data)
  })
})

test('CDA call getEntries', t => {
  t.plan(2)

  const data = {sys: {id: 'id'}}

  const wrapStub = sinon.stub()
  createCdaApiRewireApi.__Rewire__('wrapEntryCollection', wrapStub)
  wrapStub.returns(data)

  const {api} = setupWithData(Promise.resolve({data: data}))

  return api.getEntries()
  .then(r => {
    t.ok(wrapStub.args[0][1], 'resolveLinks turned on by default')
    t.looseEqual(r, data, 'returns expected data')
    createCdaApiRewireApi.__ResetDependency__('wrapEntryCollection')
  })
})

test('CDA call getEntries with global resolve links turned off', t => {
  t.plan(2)

  const data = {sys: {id: 'id'}}

  const wrapStub = sinon.stub()
  createCdaApiRewireApi.__Rewire__('wrapEntryCollection', wrapStub)
  wrapStub.returns(data)

  const resolveLinks = false
  const {api} = setupWithData(Promise.resolve({data: data}), resolveLinks)

  return api.getEntries()
  .then(r => {
    t.notOk(wrapStub.args[0][1], 'resolveLinks turned off globally')
    t.looseEqual(r, data, 'returns expected data')
    createCdaApiRewireApi.__ResetDependency__('wrapEntryCollection')
  })
})

test('CDA call getEntries with global resolve links turned off but overridden', t => {
  t.plan(3)

  const data = {sys: {id: 'id'}}

  const wrapStub = sinon.stub()
  createCdaApiRewireApi.__Rewire__('wrapEntryCollection', wrapStub)
  wrapStub.returns(data)

  const resolveLinks = false
  const {api, getStub} = setupWithData(Promise.resolve({data: data}), resolveLinks)

  return api.getEntries({resolveLinks: true})
  .then(r => {
    t.ok(wrapStub.args[0][1], 'resolveLinks turned on by override')
    t.notOk(getStub.args[0][1].params.resolveLinks, 'resolveLinks was removed from query')
    t.looseEqual(r, data, 'returns expected data')
    createCdaApiRewireApi.__ResetDependency__('wrapEntryCollection')
  })
})

test('CDA call getEntries with global resolve links turned on but overridden', t => {
  t.plan(3)

  const data = {sys: {id: 'id'}}

  const wrapStub = sinon.stub()
  createCdaApiRewireApi.__Rewire__('wrapEntryCollection', wrapStub)
  wrapStub.returns(data)

  const {api, getStub} = setupWithData(Promise.resolve({data: data}))

  return api.getEntries({resolveLinks: false})
  .then(r => {
    t.notOk(wrapStub.args[0][1], 'resolveLinks turned off by override')
    t.notOk(getStub.args[0][1].params.resolveLinks, 'resolveLinks was removed from query')
    t.looseEqual(r, data, 'returns expected data')
    createCdaApiRewireApi.__ResetDependency__('wrapEntryCollection')
  })
})

test('CDA call getEntries fails', t => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData(Promise.reject({
    data: data
  }))

  return api.getEntries()
  .then(() => {}, r => {
    t.looseEqual(r, data)
  })
})

test('CDA call getAsset', t => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData(Promise.resolve({
    data: data
  }))

  return api.getAsset('aid')
  .then(r => {
    t.looseEqual(r.toPlainObject(), data)
  })
})

test('CDA call getAsset fails', t => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData(Promise.reject({
    data: data
  }))

  return api.getAsset('aid')
  .then(() => {}, r => {
    t.looseEqual(r, data)
  })
})

test('CDA call getAssets', t => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData(Promise.resolve({
    data: data
  }))

  return api.getAssets()
  .then(r => {
    t.looseEqual(r.toPlainObject(), data)
  })
})

test('CDA call getAssets fails', t => {
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData(Promise.reject({
    data: data
  }))

  return api.getAssets()
  .then(() => {}, r => {
    t.looseEqual(r, data)
  })
})

test('CDA call sync', t => {
  t.plan(5)
  const {api} = setupWithData(Promise.resolve({
    data: {
      items: [],
      nextSyncUrl: 'http://nextsyncurl?sync_token=thisisthesynctoken'
    }
  }))

  return api.sync({initial: true})
  .then(r => {
    t.ok(r.entries, 'entries')
    t.ok(r.assets, 'assets')
    t.ok(r.deletedEntries, 'deletedEntries')
    t.ok(r.deletedAssets, 'deletedAssets')
    t.equal(r.nextSyncToken, 'thisisthesynctoken', 'sync token')
  })
})

test('CDA call sync fails', t => {
  t.plan(1)
  const {api} = setupWithData(Promise.reject({
    data: 'error'
  }))

  return api.sync({initial: true})
  .then(() => {}, r => {
    t.equal(r, 'error')
  })
})
