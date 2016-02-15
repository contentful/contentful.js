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
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData(Promise.resolve({
    data: data
  }))

  api.sync({})
  .then(r => {
    t.looseEqual(r, data)
    t.end()
  })
})

test('CDA call sync fails', t => {
  const data = {
    sys: {
      id: 'id'
    }
  }
  const {api} = setupWithData(Promise.reject({
    data: data
  }))

  api.sync({})
  .then(() => {}, r => {
    t.looseEqual(r, data)
    t.end()
  })
})
