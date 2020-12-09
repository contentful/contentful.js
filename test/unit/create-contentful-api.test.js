const mocks = require('./mocks')
const createGlobalOptions = require('../../lib/create-global-options')
const createContentfulApi = require('../../lib/create-contentful-api')

let entitiesMock

function setupWithData ({
  promise,
  getGlobalOptions = jest.fn().mockReturnValue({
    resolveLinks: true,
    removeUnresolved: false,
    spaceBaseUrl: 'spaceUrl',
    environment: 'master',
    environmentBaseUrl: 'environmentUrl'
  })
}) {
  entitiesMock = {
    space: {
      wrapSpace: jest.fn()
    },
    contentType: {
      wrapContentType: jest.fn(),
      wrapContentTypeCollection: jest.fn()
    },
    entry: {
      wrapEntry: jest.fn(),
      wrapEntryCollection: jest.fn()
    },
    asset: {
      wrapAsset: jest.fn(),
      wrapAssetCollection: jest.fn()
    },
    locale: {
      wrapLocale: jest.fn(),
      wrapLocaleCollection: jest.fn()
    }
  }

  const getStub = jest.fn()
  const api = createContentfulApi.default({
    http: {
      defaults: { baseURL: 'baseURL' },
      get: getStub.mockReturnValue(promise)
    },
    getGlobalOptions: getGlobalOptions
  })
  return {
    api,
    getStub
  }
}

describe('create-contentful-api', () => {
  test('API call getSpace', async () => {
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
    entitiesMock.space.wrapSpace.mockReturnValue(data)
    await expect(api.getSpace()).resolves.toEqual(data)
  })

  test('API call getSpace fails', async () => {
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
    entitiesMock.space.wrapSpace.mockReturnValue(data)
    await expect(api.getSpace()).rejects.toEqual(rejectError.data)
  })

  test('API call getContentType', async () => {
    const { api } = setupWithData({
      promise: Promise.resolve({ data: mocks.contentTypeMock })
    })
    entitiesMock.contentType.wrapContentType.mockReturnValue(mocks.contentTypeMock)
    await expect(api.getContentType('ctid')).resolves.toEqual(mocks.contentTypeMock)
  })

  test('API call getContentType fails', async () => {
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
    entitiesMock.contentType.wrapContentType.mockReturnValue(data)
    await expect(api.getContentType('ctid')).rejects.toEqual(data)
  })

  test('API call getContentTypes', async () => {
    const data = {
      total: 100,
      skip: 0,
      limit: 10,
      items: [mocks.contentTypeMock]
    }
    const { api } = setupWithData({
      promise: Promise.resolve({ data: data })
    })
    entitiesMock.contentType.wrapContentTypeCollection.mockReturnValue(data)
    await expect(api.getContentTypes()).resolves.toEqual(data)
  })

  test('API call getContentTypes fails', async () => {
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
    entitiesMock.contentType.wrapContentTypeCollection.mockReturnValue(data)
    await expect(api.getContentTypes()).rejects.toEqual(data)
  })

  test('API call getEntry', async () => {
    const { api } = setupWithData({
      promise: Promise.resolve({ data: mocks.entryMock })
    })
    api.getEntries = jest.fn().mockResolvedValue({ items: [mocks.entryMock] })
    entitiesMock.entry.wrapEntry.mockReturnValue(mocks.entryMock)

    await expect(api.getEntry('eid')).resolves.toEqual(mocks.entryMock)
    expect(api.getEntries).toHaveBeenCalledTimes(1)
  })

  test('API call getEntry fails', async () => {
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
    entitiesMock.entry.wrapEntry.mockReturnValue(data)
    await expect(api.getEntry('eid')).rejects.toEqual(data)
  })

  test('API call getEntries', async () => {
    const data = {
      total: 100,
      skip: 0,
      limit: 10,
      items: [mocks.entryMock]
    }

    const { api } = setupWithData({
      promise: Promise.resolve({ data: data })
    })
    entitiesMock.entry.wrapEntryCollection.mockReturnValue(data)
    await expect(api.getEntries()).resolves.toEqual(data)
    // expect(entitiesMock.entry.wrapEntryCollection.mock).toHaveBeenCalledTimes(1)
    // console.log(entitiesMock.entry.wrapEntryCollection.mock.calls)
  })

  test.skip('API call getEntries with global resolve links overriden by query', async (t) => {
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

  test.skip('API call getEntries with global resolve links turned off', async (t) => {
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

  test.skip('API call getEntries fails', async (t) => {
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

  test.skip('API call getAsset', async (t) => {
    t.plan(1)
    const { api } = setupWithData({
      promise: Promise.resolve({ data: mocks.assetMock })
    })
    entitiesMock.asset.wrapAsset.returns(mocks.assetMock)

    try {
      const r = await api.getAsset('aid')
      t.looseEqual(r, mocks.assetMock)
    } finally {
      teardown()
    }
  })

  test.skip('API call getAsset fails', async (t) => {
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

  test.skip('API call getAssets', async (t) => {
    t.plan(1)
    const data = {
      total: 100,
      skip: 0,
      limit: 10,
      items: [mocks.assetMock]
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

  test.skip('API call getAssets fails', async (t) => {
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

  test.skip('API call getLocales', async (t) => {
    t.plan(1)
    const data = {
      total: 100,
      skip: 0,
      limit: 10,
      items: [mocks.localeMock]
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

  test.skip('API call getLocaless fails', async (t) => {
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

  test.skip('CDA call sync', async (t) => {
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

  test.skip('CDA call sync fails', async (t) => {
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

  test.skip('Given json should be parsed correctly as a collection of entries', (t) => {
    const api = createContentfulApi({
      http: {},
      getGlobalOptions: sinon.stub().returns({ resolveLinks: true })
    })
    const data = {
      items: [
        {
          sys: {
            type: 'Entry',
            locale: 'en-US'
          },
          fields: {
            animal: {
              sys: {
                type: 'Link',
                linkType: 'Animal',
                id: 'oink'
              }
            },
            anotheranimal: {
              sys: {
                type: 'Link',
                linkType: 'Animal',
                id: 'middle-parrot'
              }
            }
          }
        }
      ],
      includes: {
        Animal: [
          {
            sys: {
              type: 'Animal',
              id: 'oink',
              locale: 'en-US'
            },
            fields: {
              name: 'Pig',
              friend: {
                sys: {
                  type: 'Link',
                  linkType: 'Animal',
                  id: 'groundhog'
                }
              }
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
})
