import { HeadersDefaults } from 'axios'
import createGlobalOptions from '../../lib/create-global-options'
import { makeClient } from '../../lib/make-client'
import * as resolveCircular from '../../lib/utils/resolve-circular'
import * as mocks from './mocks'

class RejectError extends Error {
  private data: unknown

  constructor(data) {
    super('RejectError')
    this.data = data
  }
}

const now = () => Math.floor(Date.now() / 1000)

function setupWithData({
  promise,
  getGlobalOptions = jest.fn().mockReturnValue({
    resolveLinks: true,
    removeUnresolved: false,
    spaceBaseUrl: 'spaceUrl',
    environment: 'master',
    environmentBaseUrl: 'environmentUrl',
  }),
}) {
  const getStub = jest.fn()
  const postStub = jest.fn()
  const api = makeClient({
    // @ts-ignore
    http: {
      // @ts-expect-error
      defaults: { baseURL: 'baseURL', logHandler: jest.fn(), headers: {} as HeadersDefaults },
      get: getStub.mockReturnValue(promise),
      post: postStub.mockReturnValue(promise),
    },
    getGlobalOptions,
  })

  return {
    api,
    getStub,
    postStub,
  }
}

describe('make Contentful API client', () => {
  const resolveCircularMock = jest.fn()
  // @ts-ignore
  resolveCircular.default = resolveCircularMock

  beforeEach(() => {
    resolveCircularMock.mockImplementation((args) => {
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
        type: 'Space',
      },
      name: 'name',
      locales: ['en-US'],
    }
    const { api } = setupWithData({
      promise: Promise.resolve({ data: data }),
    })
    await expect(api.getSpace()).resolves.toEqual(data)
  })

  test('API call getSpace fails', async () => {
    const data = {
      sys: {
        id: 'id',
      },
    }
    const rejectError = new RejectError(data)
    const { api } = setupWithData({
      promise: Promise.reject(rejectError),
    })
    await expect(api.getSpace()).rejects.toHaveProperty('data', data)
  })

  test('API call getContentType', async () => {
    const { api } = setupWithData({
      promise: Promise.resolve({ data: mocks.contentTypeMock }),
    })
    await expect(api.getContentType('ctid')).resolves.toEqual(mocks.contentTypeMock)
  })

  test('API call getContentType fails', async () => {
    const data = {
      sys: {
        id: 'id',
      },
    }
    const rejectError = new RejectError(data)
    const { api } = setupWithData({
      promise: Promise.reject(rejectError),
    })
    await expect(api.getContentType('ctid')).rejects.toHaveProperty('data', data)
  })

  test('API call getContentTypes', async () => {
    const data = {
      total: 100,
      skip: 0,
      limit: 10,
      items: [mocks.contentTypeMock],
    }
    const { api } = setupWithData({
      promise: Promise.resolve({ data: data }),
    })
    await expect(api.getContentTypes()).resolves.toEqual(data)
  })

  test('API call getContentTypes fails', async () => {
    const data = {
      sys: {
        id: 'id',
      },
    }
    const rejectError = new RejectError(data)
    const { api } = setupWithData({
      promise: Promise.reject(rejectError),
    })
    await expect(api.getContentTypes()).rejects.toHaveProperty('data', data)
  })

  // skip it for now cause it relying on old implementation
  test.skip('API call getEntry', async () => {
    const { api } = setupWithData({
      promise: Promise.resolve({ data: mocks.entryMock }),
    })
    api.getEntries = jest.fn().mockResolvedValue({ items: [mocks.entryMock] })
    await expect(api.getEntry<mocks.EntryFields>('eid')).resolves.toEqual(mocks.entryMock)
    expect(api.getEntries).toHaveBeenCalledTimes(1)
  })

  test('API call getEntry fails', async () => {
    const data = {
      sys: {
        id: 'id',
      },
    }
    const rejectError = new RejectError(data)
    const { api } = setupWithData({
      promise: Promise.reject(rejectError),
    })
    await expect(api.getEntry<mocks.EntryFields>('eid')).rejects.toHaveProperty('data', data)
  })

  test('API call getEntries', async () => {
    const data = {
      total: 100,
      skip: 0,
      limit: 10,
      items: [mocks.entryMock],
    }
    const { api } = setupWithData({
      promise: Promise.resolve({ data: data }),
    })
    await expect(api.getEntries()).resolves.toEqual(data)
  })

  test('API call getEntries with global resolveLinks overridden by chained modifier', async () => {
    const data = { sys: { id: 'id' } }
    const { api } = setupWithData({
      promise: Promise.resolve({ data: data }),
      // @ts-ignore
      getGlobalOptions: createGlobalOptions({
        environment: 'master',
        environmentBaseUrl: 'environmentUrl',
      }),
    })

    await expect(api.withoutLinkResolution.getEntries()).resolves.toEqual(data)
    expect(resolveCircularMock.mock.calls[0][1].resolveLinks).toBeFalsy()
  })

  test('API call getEntries with global resolveLinks turned on', async () => {
    const data = { sys: { id: 'id' } }

    const { api } = setupWithData({
      promise: Promise.resolve({ data: data }),
      getGlobalOptions: jest.fn().mockReturnValue({
        environment: 'master',
        environmentBaseUrl: 'environmentUrl',
        resolveLinks: true,
        removeUnresolved: false,
      }),
    })

    await expect(api.getEntries()).resolves.toEqual(data)
    expect(resolveCircularMock.mock.calls[0][1].resolveLinks).toBeTruthy()
  })

  test('API call getEntries fails', async () => {
    const data = {
      sys: {
        id: 'id',
      },
    }
    const rejectError = new RejectError(data)
    const { api } = setupWithData({
      promise: Promise.reject(rejectError),
    })

    await expect(api.getEntries()).rejects.toHaveProperty('data', data)
  })

  test('API call getAsset', async () => {
    const { api } = setupWithData({
      promise: Promise.resolve({ data: mocks.assetMock }),
    })

    await expect(api.getAsset('aid')).resolves.toEqual(mocks.assetMock)
  })

  test('API call getAsset fails', async () => {
    const data = {
      sys: {
        id: 'id',
      },
    }
    const rejectError = new RejectError(data)
    const { api } = setupWithData({
      promise: Promise.reject(rejectError),
    })

    await expect(api.getAsset('aid')).rejects.toHaveProperty('data', data)
  })

  test('API call getAssets', async () => {
    const data = {
      total: 100,
      skip: 0,
      limit: 10,
      items: [mocks.assetMock],
    }
    const { api } = setupWithData({
      promise: Promise.resolve({ data: data }),
    })
    await expect(api.getAssets()).resolves.toEqual(data)
  })

  test('API call getAssets fails', async () => {
    const data = {
      sys: {
        id: 'id',
      },
    }
    const rejectError = new RejectError(data)
    const { api } = setupWithData({
      promise: Promise.reject(rejectError),
    })

    await expect(api.getAssets()).rejects.toHaveProperty('data', data)
  })

  test('API call getTag', async () => {
    const { api } = setupWithData({
      promise: Promise.resolve({ data: mocks.tagMock }),
    })

    await expect(api.getTag('tid')).resolves.toEqual(mocks.tagMock)
  })

  test('API call getTag fails', async () => {
    const data = {
      sys: {
        id: 'id',
      },
    }
    const rejectError = new RejectError(data)
    const { api } = setupWithData({
      promise: Promise.reject(rejectError),
    })

    await expect(api.getTag('tid')).rejects.toHaveProperty('data', data)
  })

  test('API call getTags', async () => {
    const data = {
      total: 1,
      skip: 0,
      limit: 100,
      items: [mocks.tagMock],
    }
    const { api } = setupWithData({
      promise: Promise.resolve({ data: data }),
    })
    await expect(api.getTags()).resolves.toEqual(data)
  })

  test('API call getTags fails', async () => {
    const data = {
      sys: {
        id: 'id',
      },
    }
    const rejectError = new RejectError(data)
    const { api } = setupWithData({
      promise: Promise.reject(rejectError),
    })
    await expect(api.getTags()).rejects.toHaveProperty('data', data)
  })

  test('API call createAssetKey', async () => {
    const { api } = setupWithData({
      promise: Promise.resolve({ data: mocks.assetKeyMock }),
    })

    await expect(api.createAssetKey(now() + 60)).resolves.toEqual(mocks.assetKeyMock)
  })

  test('API call createAssetKey fails', async () => {
    const data = {
      sys: { type: 'Error', id: 'AccessDenied' },
      message: 'Forbidden',
      details: { reasons: 'Embargoed assets not enabled for space' },
    }
    const rejectError = new RejectError(data)
    const { api } = setupWithData({
      promise: Promise.reject(rejectError),
    })

    await expect(api.createAssetKey(now() + 60)).rejects.toHaveProperty('data', data)
  })

  test('API call getLocales', async () => {
    const data = {
      total: 100,
      skip: 0,
      limit: 10,
      items: [mocks.localeMock],
    }
    const { api } = setupWithData({
      promise: Promise.resolve({ data: data }),
    })
    await expect(api.getLocales()).resolves.toEqual(data)
  })

  test('API call getLocales fails', async () => {
    const data = {
      sys: {
        id: 'id',
      },
    }
    const rejectError = new RejectError(data)
    const { api } = setupWithData({
      promise: Promise.reject(rejectError),
    })
    await expect(api.getLocales()).rejects.toHaveProperty('data', data)
  })

  test('CDA call sync', async () => {
    const { api } = setupWithData({
      promise: Promise.resolve({
        data: {
          items: [],
          nextSyncUrl: 'http://nextsyncurl?sync_token=thisisthesynctoken',
        },
      }),
    })

    const r = await api.sync({ initial: true })
    expect(r.entries).toBeDefined()
    expect(r.assets).toBeDefined()
    expect(r.deletedEntries).toBeDefined()
    expect(r.deletedAssets).toBeDefined()
    expect(r.nextSyncToken).toEqual('thisisthesynctoken')
  })

  test('CDA call sync fails', async () => {
    const rejectError = new RejectError('error')
    const { api } = setupWithData({
      promise: Promise.reject(rejectError),
    })

    await expect(api.sync({ initial: true })).rejects.toHaveProperty('data', 'error')
  })
})
