const mocks = require('./mocks')
const createGlobalOptions = require('../../lib/create-global-options').default
const createContentfulApi = require('../../lib/create-contentful-api').default
const resolveCircular = require('../../lib/utils/resolve-circular')

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
  const getStub = jest.fn()
  const api = createContentfulApi({
    http: {
      defaults: { baseURL: 'baseURL' },
      get: getStub.mockReturnValue(promise),
      cloneWithNewParams: jest.fn().mockReturnValue({
        defaults: { baseURL: 'baseURL' },
        get: getStub.mockReturnValue(promise),
      })
    },
    getGlobalOptions: getGlobalOptions
  })
  return {
    api,
    getStub
  }
}

describe('create-contentful-api', () => {
  resolveCircular.default = jest.fn()
  const resolveCircularMock = resolveCircular.default

  beforeEach(() => {
    resolveCircularMock.mockImplementation(args => {
      return args
    })
  })

  afterEach(() => {
    resolveCircularMock.mockReset()
  })

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
    await expect(api.getSpace()).rejects.toEqual(rejectError.data)
  })

  test('API call getContentType', async () => {
    const { api } = setupWithData({
      promise: Promise.resolve({ data: mocks.contentTypeMock })
    })
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
    await expect(api.getContentTypes()).rejects.toEqual(data)
  })

  test('API call getEntry', async () => {
    const { api } = setupWithData({
      promise: Promise.resolve({ data: mocks.entryMock })
    })
    api.getEntries = jest.fn().mockResolvedValue({ items: [mocks.entryMock] })
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
    await expect(api.getEntries()).resolves.toEqual(data)
  })

  test('API call getEntries with global resolve links overridden by query', async () => {
    const data = { sys: { id: 'id' } }
    const { api } = setupWithData({
      promise: Promise.resolve({ data: data }),
      getGlobalOptions: createGlobalOptions({
        environment: 'master',
        environmentBaseUrl: 'environmentUrl'
      })
    })

    await expect(api.getEntries()).resolves.toEqual(data)
    expect(resolveCircularMock.mock.calls[0][1].resolveLinks).toBeFalsy()
  })

  test('API call getEntries with global resolve links turned off', async () => {
    const data = { sys: { id: 'id' } }

    const { api } = setupWithData({
      promise: Promise.resolve({ data: data }),
      getGlobalOptions: jest.fn().mockReturnValue({
        environment: 'master',
        environmentBaseUrl: 'environmentUrl',
        resolveLinks: true,
        removeUnresolved: false
      })
    })

    await expect(api.getEntries()).resolves.toEqual(data)
    expect(resolveCircularMock.mock.calls[0][1].resolveLinks).toBeTruthy()
  })

  test('API call getEntries fails', async () => {
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

    await expect(api.getEntries()).rejects.toEqual(data)
  })

  test('API call getAsset', async () => {
    const { api } = setupWithData({
      promise: Promise.resolve({ data: mocks.assetMock })
    })

    await expect(api.getAsset('aid')).resolves.toEqual(mocks.assetMock)
  })

  test('API call getAsset fails', async () => {
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

    await expect(api.getAsset('aid')).rejects.toEqual(data)
  })

  test('API call getAssets', async () => {
    const data = {
      total: 100,
      skip: 0,
      limit: 10,
      items: [mocks.assetMock]
    }
    const { api } = setupWithData({
      promise: Promise.resolve({ data: data })
    })
    await expect(api.getAssets()).resolves.toEqual(data)
  })

  test('API call getAssets fails', async () => {
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

    await expect(api.getAssets()).rejects.toEqual(data)
  })

  test('API call getLocales', async () => {
    const data = {
      total: 100,
      skip: 0,
      limit: 10,
      items: [mocks.localeMock]
    }
    const { api } = setupWithData({
      promise: Promise.resolve({ data: data })
    })
    await expect(api.getLocales()).resolves.toEqual(data)
  })

  test('API call getLocales fails', async () => {
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
    await expect(api.getLocales()).rejects.toEqual(data)
  })

  test('CDA call sync', async () => {
    const { api } = setupWithData({
      promise: Promise.resolve({
        data: {
          items: [],
          nextSyncUrl: 'http://nextsyncurl?sync_token=thisisthesynctoken'
        }
      })
    })

    const r = await api.sync({ initial: true })
    expect(r.entries).toBeDefined()
    expect(r.assets).toBeDefined()
    expect(r.deletedEntries).toBeDefined()
    expect(r.deletedAssets).toBeDefined()
    expect(r.nextSyncToken).toEqual('thisisthesynctoken')
  })

  test('CDA call sync fails', async () => {
    const rejectError = new Error()
    rejectError.data = 'error'
    const { api } = setupWithData({
      promise: Promise.reject(rejectError)
    })

    await expect(api.sync({ initial: true })).rejects.toEqual(new Error())
  })
})
