/**
 * See <a href="https://www.contentful.com/developers/docs/concepts/sync/">Synchronization</a> for more information.
 * @namespace Sync
 */
import resolveResponse from 'contentful-resolve-response'
import { AxiosInstance, createRequestConfig, freezeSys, toPlainObject } from 'contentful-sdk-core'
import mixinStringifySafe from './mixins/stringify-safe'
import {
  SyncPageQuery,
  SyncResponse,
  SyncPageResponse,
  SyncCollection,
  SyncOptions,
  SyncEntities,
  SyncQuery,
} from './types'

/**
 * This module retrieves all the available pages for a sync operation
 * @private
 * @param {AxiosInstance} http - HTTP client
 * @param {SyncQuery} query - Query object
 * @param {SyncOptions} options - Sync options object
 * @param {boolean} [options.paginate = true] - If further sync pages should automatically be crawled
 * @return {Promise<SyncCollection>}
 */
export default async function pagedSync(
  http: AxiosInstance,
  query: SyncQuery,
  options: SyncOptions
): Promise<SyncCollection> {
  if (!query || (!query.initial && !query.nextSyncToken && !query.nextPageToken)) {
    throw new Error(
      'Please provide one of `initial`, `nextSyncToken` or `nextPageToken` parameters for syncing'
    )
  }

  if (query['content_type'] && !query.type) {
    query.type = 'Entry'
  } else if (query['content_type'] && query.type && query.type !== 'Entry') {
    throw new Error(
      'When using the `content_type` filter your `type` parameter cannot be different from `Entry`.'
    )
  }

  const defaultOptions = { resolveLinks: true, removeUnresolved: false, paginate: true }
  const { resolveLinks, removeUnresolved, paginate } = {
    ...defaultOptions,
    ...options,
  }

  const syncOptions = {
    paginate,
  }

  const response = await getSyncPage(http, [], query, syncOptions)
  // clones response.items used in includes because we don't want these to be mutated
  if (resolveLinks) {
    response.items = resolveResponse(response, { removeUnresolved, itemEntryPoints: ['fields'] })
  }
  // maps response items again after getters are attached
  const mappedResponseItems = mapResponseItems(response.items)

  if (response.nextSyncToken) {
    mappedResponseItems.nextSyncToken = response.nextSyncToken
  }

  if (response.nextPageToken) {
    mappedResponseItems.nextPageToken = response.nextPageToken
  }

  return freezeSys(mixinStringifySafe(toPlainObject(mappedResponseItems)))
}

/**
 * @private
 * @param {Array<Entry|Array|DeletedEntry|DeletedAsset>} items
 * @return {Object} Entities mapped to an object for each entity type
 */
function mapResponseItems(items): any {
  const reducer = (type) => {
    return (accumulated, item) => {
      if (item.sys.type === type) {
        accumulated.push(toPlainObject(item))
      }
      return accumulated
    }
  }

  return {
    entries: items.reduce(reducer('Entry'), []),
    assets: items.reduce(reducer('Asset'), []),
    deletedEntries: items.reduce(reducer('DeletedEntry'), []),
    deletedAssets: items.reduce(reducer('DeletedAsset'), []),
  }
}

function createRequestQuery(originalQuery: SyncPageQuery): SyncPageQuery {
  if (originalQuery.nextPageToken) {
    return { sync_token: originalQuery.nextPageToken }
  }

  if (originalQuery.nextSyncToken) {
    return { sync_token: originalQuery.nextSyncToken }
  }

  if (originalQuery.sync_token) {
    return { sync_token: originalQuery.sync_token }
  }

  return originalQuery
}

/**
 * If the response contains a nextPageUrl, extracts the sync token to get the
 * next page and calls itself again with that token.
 * Otherwise, if the response contains a nextSyncUrl, extracts the sync token
 * and returns it.
 * On each call of this function, any retrieved items are collected in the
 * supplied items array, which gets returned in the end
 * @private
 * @param {AxiosInstance} http
 * @param {Array<Entry|Asset|DeletedEntry|DeletedAsset>} items
 * @param {SyncPageQuery} query
 * @param {SyncOptions} options - Sync page options object
 * @param {boolean} [options.paginate = true] - If further sync pages should automatically be crawled
 * @return {Promise<SyncPageResponse>}
 */
async function getSyncPage(
  http: AxiosInstance,
  items: SyncEntities[],
  query: SyncPageQuery,
  { paginate }: SyncOptions
): Promise<SyncPageResponse> {
  const requestQuery = createRequestQuery(query)

  const response = await http.get<SyncResponse>(
    'sync',
    createRequestConfig({ query: requestQuery })
  )

  const data = response.data || {}
  items = items.concat(data.items || [])
  if (data.nextPageUrl) {
    if (paginate) {
      delete requestQuery.initial
      requestQuery.sync_token = getToken(data.nextPageUrl)
      return getSyncPage(http, items, requestQuery, { paginate })
    }
    return {
      items,
      nextPageToken: getToken(data.nextPageUrl),
    }
  } else if (data.nextSyncUrl) {
    return {
      items,
      nextSyncToken: getToken(data.nextSyncUrl),
    }
  } else {
    return { items: [] }
  }
}

/**
 * Extracts token out of an url
 * @private
 */
function getToken(url: string) {
  const urlParts = url.split('?')
  return urlParts.length > 0 ? urlParts[1].replace('sync_token=', '') : ''
}
