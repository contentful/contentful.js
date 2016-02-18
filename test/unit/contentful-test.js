import test from 'tape'
import sinon from 'sinon'
import createClient from '../../lib/contentful'

const axios = {create: () => {}}

test('Throws if no accessToken is defined', t => {
  t.throws(() => {
    createClient(axios, {space: 'spaceid'})
  }, /Expected parameter accessToken/)
  t.end()
})

test('Throws if no space is defined', t => {
  t.throws(() => {
    createClient(axios, {accessToken: 'accesstoken'})
  }, /Expected parameter space/)
  t.end()
})

test('Returns a client instance', t => {
  const client = createClient(axios, {accessToken: 'accesstoken', space: 'spaceid'})
  t.ok(client.getSpace, 'getSpace')
  t.ok(client.getEntry, 'getEntry')
  t.ok(client.getEntries, 'getEntries')
  t.ok(client.getContentType, 'getContentType')
  t.ok(client.getContentTypes, 'getContentTypes')
  t.ok(client.getAsset, 'getAsset')
  t.ok(client.getAssets, 'getAssets')
  t.end()
})

test('Initializes API with link resolution turned on by default', t => {
  const apiStub = sinon.stub()
  createClient.__Rewire__('createCdaApi', apiStub)
  createClient(axios, {accessToken: 'accesstoken', space: 'spaceid'})
  t.ok(apiStub.args[0][1])
  t.end()
})

test('Initializes API with link resolution turned on explicitly', t => {
  const apiStub = sinon.stub()
  createClient.__Rewire__('createCdaApi', apiStub)
  createClient(axios, {accessToken: 'accesstoken', space: 'spaceid', resolveLinks: true})
  t.ok(apiStub.args[0][1])
  t.end()
})

test('Initializes API with link resolution turned off explicitly', t => {
  const apiStub = sinon.stub()
  createClient.__Rewire__('createCdaApi', apiStub)
  createClient(axios, {accessToken: 'accesstoken', space: 'spaceid', resolveLinks: false})
  t.notOk(apiStub.args[0][1])
  t.end()
})
