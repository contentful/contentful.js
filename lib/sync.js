/* @flow */
import {filter} from 'lodash/collection'
import {cloneDeep} from 'lodash/lang'
import type {Entry, DeletedEntry} from './entities/entry'
import type {Asset, DeletedAsset} from './entities/asset'
import type {ResponseItems} from './responses'
import createRequestConfig from './create-request-config'
import mixinLinkGetters from './mixins/link-getters'

/**
 * SyncCollection type
 */
export type SyncCollection = {
  entries: Array<Entry>,
  assets: Array<Asset>,
  deletedEntries: Array<DeletedEntry>,
  deletedAssets: Array<DeletedAsset>,
  nextSyncToken: string
}

/**
 * @private
 * This module retrieves all the available pages for a sync operation
 */
export default function pagedSync (http: Object, query: Object, resolveLinks: boolean): Promise<SyncCollection> {
  if (!query || (!query.initial && !query.nextSyncToken)) {
    throw new Error('Please provide one of `initial` or `nextSyncToken` parameters for syncing')
  }

  if (query && query.content_type && !query.type) {
    query.type = 'Entry'
  } else if (query && query.content_type && query.type && query.type !== 'Entry') {
    throw new Error('When using the `content_type` filter your `type` parameter cannot be different from `Entry`.')
  }

  if (query.nextSyncToken) {
    query.sync_token = query.nextSyncToken
    delete query.initial
    delete query.nextSyncToken
  }

  return getSyncPage(http, [], query)
  .then(response => {
    // clones response.items used in includes because we don't want these to be mutated
    if (resolveLinks) {
      mixinLinkGetters(response.items, cloneDeep(mapResponseItems(response.items)))
    }
    // maps response items again after getters are attached
    const mappedResponseItems = mapResponseItems(response.items)
    mappedResponseItems.nextSyncToken = response.nextSyncToken
    return Object.freeze(mappedResponseItems)
  }, error => {
    throw error.data
  })
}

function mapResponseItems (items: ResponseItems): Object {
  return {
    entries: filter(items, ['sys.type', 'Entry']),
    assets: filter(items, ['sys.type', 'Asset']),
    deletedEntries: filter(items, ['sys.type', 'DeletedEntry']),
    deletedAssets: filter(items, ['sys.type', 'DeletedAsset'])
  }
}

/**
 * @private
 * If the response contains a nextPageUrl, extracts the sync token to get the
 * next page and calls itself again with that token.
 * Otherwise, if the response contains a nextSyncUrl, extracts the sync token
 * and returns it.
 * On each call of this function, any retrieved items are collected in the
 * supplied items array, which gets returned in the end
 */
function getSyncPage (http: Object, items: ResponseItems, query: Object): Promise<{items: ResponseItems, nextSyncToken: string}> {
  return http.get('sync', createRequestConfig({query: query}))
  .then(response => {
    const data = response.data
    items = items.concat(data.items)
    if (data.nextPageUrl) {
      delete query.initial
      query.sync_token = getToken(data.nextPageUrl)
      return getSyncPage(http, items, query)
    } else if (data.nextSyncUrl) {
      return {
        items: items,
        nextSyncToken: getToken(data.nextSyncUrl)
      }
    }
  })
}

function getToken (url: string): string {
  const urlParts = url.split('?')
  return urlParts.length > 0 ? urlParts[1].replace('sync_token=', '') : ''
}
