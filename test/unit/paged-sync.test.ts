import { vi } from 'vitest'
import copy from 'fast-copy'

import pagedSync from '../../lib/paged-sync'
import { assetMock, entryMock, entryWithLinkMock } from './mocks'

function createEntry(id, deleted = false) {
  const entry = copy(entryMock)
  entry.sys.id = id
  if (deleted) {
    entry.sys.type = ('Deleted' + entry.sys.type) as any
  }
  return entry
}

function createLinkedEntry() {
  const entry = copy(entryWithLinkMock)
  return entry
}

function createAsset(id, deleted = false): any {
  const asset = copy(assetMock)
  asset.sys.id = id
  if (deleted) {
    asset.sys.type = ('Deleted' + asset.sys.type) as any
  }
  return asset
}

describe('paged-sync', () => {
  let http

  beforeEach(() => {
    http = { get: vi.fn() }
  })

  afterEach(() => {
    http.get.mockReset()
  })

  test('Rejects with no parameters', async () => {
    await expect(pagedSync(http, {})).rejects.toEqual(
      new Error(
        'Please provide one of `initial`, `nextSyncToken` or `nextPageToken` parameters for syncing',
      ),
    )
  })

  test('Rejects with incompatible content_type and type parameter', async () => {
    await expect(
      pagedSync(
        http,
        {
          initial: true,
          content_type: 'id',
          // @ts-ignore
          type: 'ContentType',
        },
        { resolveLinks: true },
      ),
    ).rejects.toEqual(
      new Error(
        'When using the `content_type` filter your `type` parameter cannot be different from `Entry`.',
      ),
    )
  })

  test('Returns empty response if response has no items', async () => {
    http.get.mockResolvedValue({
      data: {
        nextSyncUrl: 'http://nextsyncurl?sync_token=nextsynctoken',
      },
    })

    const response = await pagedSync(http, { initial: true })
    expect(response).toEqual({
      entries: [],
      assets: [],
      deletedEntries: [],
      deletedAssets: [],
      nextSyncToken: 'nextsynctoken',
    })
    expect(http.get).toBeCalledWith('sync', {
      params: {
        initial: true,
      },
    })
  })

  test('Returns empty response if response is empty', async () => {
    http.get.mockResolvedValue({})

    const response = await pagedSync(http, { initial: true })
    expect(response).toEqual({
      entries: [],
      assets: [],
      deletedEntries: [],
      deletedAssets: [],
    })
  })

  test('Initial sync with one page', async () => {
    const entryWithLink = createLinkedEntry()

    http.get.mockResolvedValue({
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
          createAsset('3', true),
        ],
        nextSyncUrl: 'http://nextsyncurl?sync_token=nextsynctoken',
      },
    })

    const response = await pagedSync(http, { initial: true })
    expect(http.get.mock.calls[0][1].params.initial).toBeTruthy()
    expect(response.entries).toHaveLength(3)
    expect(response.deletedEntries).toHaveLength(2)
    expect(response.assets).toHaveLength(3)
    expect(response.deletedAssets).toHaveLength(1)
    expect(response.nextSyncToken).toEqual('nextsynctoken')
    expect(response.entries[0].fields.linked).toHaveProperty('sys.linkType', 'Entry')
  })

  test('Initial sync with one page and filter', async () => {
    http.get.mockResolvedValue({
      data: {
        items: [createEntry('1'), createEntry('2'), createEntry('3')],
        nextSyncUrl: 'http://nextsyncurl?sync_token=nextsynctoken',
      },
    })

    const response = await pagedSync(http, { initial: true, content_type: 'cat' })

    expect(http.get).toBeCalledWith('sync', {
      params: {
        initial: true,
        content_type: 'cat',
        type: 'Entry',
      },
    })

    expect(http.get.mock.calls[0][1].params.initial).toBeTruthy()
    expect(http.get.mock.calls[0][1].params.content_type).toEqual('cat')
    expect(http.get.mock.calls[0][1].params.type).toEqual('Entry')
    expect(response.entries).toHaveLength(3)
    expect(response.nextSyncToken).toEqual('nextsynctoken')
  })

  test('Initial sync with one page and limit', async () => {
    http.get.mockResolvedValue({
      data: {
        items: [createEntry('1'), createEntry('2'), createEntry('3')],
        nextSyncUrl: 'http://nextsyncurl?sync_token=nextsynctoken',
      },
    })

    const response = await pagedSync(http, { initial: true, limit: 10 })

    expect(http.get).toBeCalledWith('sync', {
      params: {
        initial: true,
        limit: 10,
      },
    })

    expect(http.get.mock.calls[0][1].params.initial).toBeTruthy()
    expect(http.get.mock.calls[0][1].params.limit).toEqual(10)
    expect(response.entries).toHaveLength(3)
    expect(response.nextSyncToken).toEqual('nextsynctoken')
  })

  test('Initial sync with multiple pages', async () => {
    http.get.mockImplementation((...args) => {
      if (
        args[0] === 'sync' &&
        JSON.stringify(args[1]) === JSON.stringify({ params: { initial: true, type: 'Entry' } })
      ) {
        return Promise.resolve({
          data: {
            items: [createEntry('1'), createEntry('2')],
            nextPageUrl: 'http://nextsyncurl?sync_token=nextpage1',
          },
        })
      }
      if (
        args[0] === 'sync' &&
        JSON.stringify(args[1]) === JSON.stringify({ params: { sync_token: 'nextpage1' } })
      ) {
        return Promise.resolve({
          data: {
            items: [
              createEntry('3'),
              createEntry('3', true),
              createEntry('3', true),
              createAsset('1'),
            ],
            nextPageUrl: 'http://nextsyncurl?sync_token=nextpage2',
          },
        })
      }
      if (
        args[0] === 'sync' &&
        JSON.stringify(args[1]) === JSON.stringify({ params: { sync_token: 'nextpage2' } })
      ) {
        return Promise.resolve({
          data: {
            items: [createAsset('2'), createAsset('3'), createAsset('3', true)],
            nextSyncUrl: 'http://nextsyncurl?sync_token=nextsynctoken',
          },
        })
      }
    })

    const response = await pagedSync(http, { initial: true, type: 'Entry' })

    expect(http.get.mock.calls[0][1].params.initial).toBeTruthy()
    expect(http.get.mock.calls[0][1].params.type).toEqual('Entry')
    expect(http.get.mock.calls[1][1].params.initial).toBeFalsy()
    expect(http.get.mock.calls[1][1].params.type).not.toBeDefined()
    expect(http.get.mock.calls[1][1].params.sync_token).toEqual('nextpage1')
    expect(http.get.mock.calls[2][1].params.sync_token).toEqual('nextpage2')
    expect(response.entries).toHaveLength(3)
    expect(response.deletedEntries).toHaveLength(2)
    expect(response.assets).toHaveLength(3)
    expect(response.deletedAssets).toHaveLength(1)
    expect(response.nextSyncToken).toEqual('nextsynctoken')
  })

  test('Initial sync with limit and multiple pages', async () => {
    http.get.mockImplementation((...args) => {
      if (
        args[0] === 'sync' &&
        JSON.stringify(args[1]) ===
          JSON.stringify({ params: { initial: true, limit: 10, type: 'Entry' } })
      ) {
        return Promise.resolve({
          data: {
            items: [createEntry('1'), createEntry('2')],
            nextPageUrl: 'http://nextsyncurl?sync_token=nextpage1',
          },
        })
      }

      if (
        args[0] === 'sync' &&
        JSON.stringify(args[1]) === JSON.stringify({ params: { sync_token: 'nextpage1' } })
      ) {
        return Promise.resolve({
          data: {
            items: [
              createEntry('3'),
              createEntry('3', true),
              createEntry('3', true),
              createAsset('1'),
            ],
            nextPageUrl: 'http://nextsyncurl?sync_token=nextpage2',
          },
        })
      }

      if (
        args[0] === 'sync' &&
        JSON.stringify(args[1]) === JSON.stringify({ params: { sync_token: 'nextpage2' } })
      ) {
        return Promise.resolve({
          data: {
            items: [createAsset('2'), createAsset('3'), createAsset('3', true)],
            nextSyncUrl: 'http://nextsyncurl?sync_token=nextsynctoken',
          },
        })
      }
    })

    const response = await pagedSync(http, { initial: true, limit: 10, type: 'Entry' })
    expect(http.get.mock.calls[0][1].params.initial).toBeTruthy()
    expect(http.get.mock.calls[0][1].params.limit).toEqual(10)
    expect(http.get.mock.calls[0][1].params.type).toEqual('Entry')
    expect(http.get.mock.calls[1][1].params.initial).toBeFalsy()
    expect(http.get.mock.calls[1][1].params.limit).toBeFalsy()
    expect(http.get.mock.calls[1][1].params.type).not.toBeDefined()
    expect(http.get.mock.calls[1][1].params.sync_token).toEqual('nextpage1')
    expect(http.get.mock.calls[2][1].params.sync_token).toEqual('nextpage2')
    expect(response.entries).toHaveLength(3)
    expect(response.deletedEntries).toHaveLength(2)
    expect(response.assets).toHaveLength(3)
    expect(response.deletedAssets).toHaveLength(1)
    expect(response.nextSyncToken).toEqual('nextsynctoken')
  })

  test('Sync with existing token', async () => {
    http.get.mockImplementation((...args) => {
      if (
        args[0] === 'sync' &&
        JSON.stringify(args[1]) === JSON.stringify({ params: { sync_token: 'nextsynctoken' } })
      ) {
        return Promise.resolve({
          data: {
            items: [
              createEntry('1'),
              createEntry('3', true),
              createAsset('1'),
              createAsset('3', true),
            ],
            nextSyncUrl: 'http://nextsyncurl?sync_token=nextsynctoken',
          },
        })
      }
    })

    const response = await pagedSync(http, { nextSyncToken: 'nextsynctoken' })
    expect(http.get.mock.calls[0][1].params.sync_token).toEqual('nextsynctoken')
    expect(response.entries).toHaveLength(1)
    expect(response.deletedEntries).toHaveLength(1)
    expect(response.assets).toHaveLength(1)
    expect(response.deletedAssets).toHaveLength(1)
    expect(response.nextSyncToken).toEqual('nextsynctoken')
  })

  test('Initial sync with multiple pages but pagination disabled', async () => {
    http.get.mockImplementation((...args) => {
      if (
        args[0] === 'sync' &&
        JSON.stringify(args[1]) === JSON.stringify({ params: { initial: true, type: 'Entry' } })
      ) {
        return Promise.resolve({
          data: {
            items: [createEntry('1'), createEntry('2')],
            nextPageUrl: 'http://nextsyncurl?sync_token=nextpage1',
          },
        })
      }
      if (
        args[0] === 'sync' &&
        JSON.stringify(args[1]) === JSON.stringify({ params: { sync_token: 'nextpage1' } })
      ) {
        return Promise.resolve({
          data: {
            items: [
              createEntry('3'),
              createEntry('3', true),
              createEntry('3', true),
              createAsset('1'),
            ],
            nextPageUrl: 'http://nextsyncurl?sync_token=nextpage2',
          },
        })
      }
      if (
        args[0] === 'sync' &&
        JSON.stringify(args[1]) === JSON.stringify({ params: { sync_token: 'nextpage2' } })
      ) {
        return Promise.resolve({
          data: {
            items: [createAsset('2'), createAsset('3'), createAsset('3', true)],
            nextSyncUrl: 'http://nextsyncurl?sync_token=nextsynctoken',
          },
        })
      }
    })

    const response = await pagedSync(http, { initial: true, type: 'Entry' }, { paginate: false })
    expect(http.get).toHaveBeenCalledTimes(1)
    expect(http.get.mock.calls[0][1].params.initial).toBeDefined()
    expect(http.get.mock.calls[0][1].params.type).toEqual('Entry')
    expect(response.entries).toHaveLength(2)
    expect(response.deletedEntries).toHaveLength(0)
    expect(response.assets).toHaveLength(0)
    expect(response.deletedAssets).toHaveLength(0)
    expect(response.nextPageToken).toEqual('nextpage1')
    expect(response.nextSyncToken).toBeUndefined()

    // Manually sync next page
    const response2 = await pagedSync(
      http,
      { nextPageToken: response.nextPageToken },
      { paginate: false },
    )
    expect(http.get).toHaveBeenCalledTimes(2)
    expect(http.get.mock.calls[1][1].params.initial).toBeUndefined()
    expect(response2.nextPageToken).toEqual('nextpage2')
    expect(response2.nextSyncToken).toBeUndefined()

    // Manually sync next (last) page
    const response3 = await pagedSync(
      http,
      { nextPageToken: response2.nextPageToken },
      { paginate: false },
    )
    expect(http.get).toHaveBeenCalledTimes(3)
    expect(http.get.mock.calls[2][1].params.initial).toBeUndefined()
    expect(response3.nextPageToken).toBeUndefined()
    expect(response3.nextSyncToken).toEqual('nextsynctoken')
  })
})
