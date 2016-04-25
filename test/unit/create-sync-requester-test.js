import test from 'blue-tape'
import sinon from 'sinon'
import {cloneDeep} from 'lodash/lang'
import {entryMock, assetMock} from './mocks'
import createSyncRequester from '../../lib/create-sync-requester'

function createEntry (id, deleted) {
  const entry = cloneDeep(entryMock)
  entry.sys.id = id
  if (deleted) {
    entry.sys.type = 'Deleted' + entry.sys.type
  }
  return entry
}

function createAsset (id, deleted) {
  const asset = cloneDeep(assetMock)
  asset.sys.id = id
  if (deleted) {
    asset.sys.type = 'Deleted' + asset.sys.type
  }
  return asset
}

test('Throws with no parameters', (t) => {
  t.plan(1)
  const http = {get: sinon.stub()}
  const sync = createSyncRequester(http, sinon.stub().returns(true))
  t.throws(() => {
    sync({})
  }, /initial.*nextSyncToken/)
})

test('Throws with incompatible content_type and type parameter', (t) => {
  t.plan(1)
  const http = {get: sinon.stub()}
  const sync = createSyncRequester(http, sinon.stub().returns(true))
  t.throws(() => {
    sync({
      initial: true,
      content_type: 'id',
      type: 'ContentType'
    })
  }, /content_type.*type.*Entry/)
})

test('Initial sync with one page', (t) => {
  t.plan(7)
  const http = {get: sinon.stub()}
  const entryWithLink = createEntry('1')
  entryWithLink.fields.linked = {
    sys: {
      id: '2',
      type: 'Link',
      linkType: 'Entry'
    }
  }
  http.get.withArgs('sync', {params: {initial: true}}).returns(Promise.resolve({
    data: {
      items: [
        entryWithLink,
        createEntry('2'),
        createEntry('3'),
        createEntry('3', true),
        createEntry('3', true),
        createAsset('1'),
        createAsset('2'),
        createAsset('3'),
        createAsset('3', true)
      ],
      nextSyncUrl: 'http://nextsyncurl?sync_token=nextsynctoken'
    }
  }))
  const sync = createSyncRequester(http, sinon.stub().returns(true))

  return sync({initial: true})
  .then((response) => {
    t.ok(http.get.args[0][1].params.initial, 'http request has initial param')
    t.equal(response.entries.length, 3, 'entries length')
    t.equal(response.deletedEntries.length, 2, 'deleted entries length')
    t.equal(response.assets.length, 3, 'entries length')
    t.equal(response.deletedAssets.length, 1, 'deleted assets length')
    t.equal(response.nextSyncToken, 'nextsynctoken', 'next sync token')
    t.equal(response.entries[0].fields.linked.sys.type, 'Entry', 'linked entry is resolved')
  })
})

test('Initial sync with one page and filter', (t) => {
  t.plan(5)
  const http = {get: sinon.stub()}
  http.get.withArgs('sync', {params: {
    initial: true,
    content_type: 'cat',
    type: 'Entry'
  }}).returns(Promise.resolve({
    data: {
      items: [
        createEntry('1'),
        createEntry('2'),
        createEntry('3')
      ],
      nextSyncUrl: 'http://nextsyncurl?sync_token=nextsynctoken'
    }
  }))
  const sync = createSyncRequester(http, sinon.stub().returns(true))

  return sync({initial: true, content_type: 'cat'})
  .then((response) => {
    t.ok(http.get.args[0][1].params.initial, 'http request has initial param')
    t.equal(http.get.args[0][1].params.content_type, 'cat', 'http request has content type filter param')
    t.equal(http.get.args[0][1].params.type, 'Entry', 'http request has entity type filter param')
    t.equal(response.entries.length, 3, 'entries length')
    t.equal(response.nextSyncToken, 'nextsynctoken', 'next sync token')
  })
})

test('Initial sync with multiple pages', (t) => {
  t.plan(9)
  const http = {get: sinon.stub()}
  http.get.withArgs('sync', {params: {initial: true}}).returns(Promise.resolve({
    data: {
      items: [
        createEntry('1'),
        createEntry('2')
      ],
      nextPageUrl: 'http://nextsyncurl?sync_token=nextpage1'
    }
  }))

  http.get.withArgs('sync', {params: {sync_token: 'nextpage1'}}).returns(Promise.resolve({
    data: {
      items: [
        createEntry('3'),
        createEntry('3', true),
        createEntry('3', true),
        createAsset('1')
      ],
      nextPageUrl: 'http://nextsyncurl?sync_token=nextpage2'
    }
  }))

  http.get.withArgs('sync', {params: {sync_token: 'nextpage2'}}).returns(Promise.resolve({
    data: {
      items: [
        createAsset('2'),
        createAsset('3'),
        createAsset('3', true)
      ],
      nextSyncUrl: 'http://nextsyncurl?sync_token=nextsynctoken'
    }
  }))
  const sync = createSyncRequester(http, sinon.stub().returns(true))

  return sync({initial: true})
  .then((response) => {
    const objResponse = response.toPlainObject()
    t.ok(http.get.args[0][1].params.initial, 'http request has initial param')
    t.equal(http.get.args[1][1].params.sync_token, 'nextpage1', 'http request param for first page')
    t.equal(http.get.args[2][1].params.sync_token, 'nextpage2', 'http request param for second page')
    t.equal(objResponse.entries.length, 3, 'entries length')
    t.equal(objResponse.deletedEntries.length, 2, 'deleted entries length')
    t.equal(objResponse.assets.length, 3, 'entries length')
    t.equal(objResponse.deletedAssets.length, 1, 'deleted assets length')
    t.equal(objResponse.nextSyncToken, 'nextsynctoken', 'next sync token')
    t.ok(response.stringifySafe(), 'stringifies response')
  })
})

test('Sync with existing token', (t) => {
  t.plan(6)
  const http = {get: sinon.stub()}
  http.get.withArgs('sync', {params: {sync_token: 'nextsynctoken'}}).returns(Promise.resolve({
    data: {
      items: [
        createEntry('1'),
        createEntry('3', true),
        createAsset('1'),
        createAsset('3', true)
      ],
      nextSyncUrl: 'http://nextsyncurl?sync_token=nextsynctoken'
    }
  }))
  const sync = createSyncRequester(http, sinon.stub().returns(true))

  return sync({nextSyncToken: 'nextsynctoken'})
  .then((response) => {
    t.equal(http.get.args[0][1].params.sync_token, 'nextsynctoken', 'http request param for sync')
    t.equal(response.entries.length, 1, 'entries length')
    t.equal(response.deletedEntries.length, 1, 'deleted entries length')
    t.equal(response.assets.length, 1, 'entries length')
    t.equal(response.deletedAssets.length, 1, 'deleted assets length')
    t.equal(response.nextSyncToken, 'nextsynctoken', 'next sync token')
  })
})
