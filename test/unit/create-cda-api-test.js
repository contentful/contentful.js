/* @flow */
import test from 'blue-tape'
import sinon from 'sinon'

import createCdaApi from '../../lib/create-cda-api'

function setupWithData (promise) {
  const getStub = sinon.stub()
  const api = createCdaApi({
    get: getStub.returns(promise)
  })
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
  t.plan(1)
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData(Promise.resolve({
    data: data
  }))

  return api.getEntries()
  .then(r => {
    t.looseEqual(r.toPlainObject(), data)
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
