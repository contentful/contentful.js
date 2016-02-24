/* @flow */
/**
 * See <a href="https://www.contentful.com/developers/docs/concepts/sync/">Synchronization</a> for more information.
 * @namespace Sync
 */
import {filter} from 'lodash/collection'
import {cloneDeep} from 'lodash/lang'
import type {Entry, DeletedEntry} from './entities/entry'
import type {Asset, DeletedAsset} from './entities/asset'
import type {ResponseItems} from './responses'
import createRequestConfig from './create-request-config'
import mixinLinkGetters from './mixins/link-getters'

/**
 * @memberof Sync
 * @typedef SyncCollection
 * @prop {Array<Entities.Entry>} entries - All existing entries on first sync. New and updated entries on subsequent syncs.
 * @prop {Array<Entities.Asset>} assets - All existing assets on first sync. New and updated assets on subsequent syncs.
 * @prop {Array<Sync.DeletedEntry>} deletedEntries - List of deleted Entries since last sync
 * @prop {Array<Sync.DeletedAsset>} deletedAssets - List of deleted Assets since last sync
 * @prop {string} nextSyncToken - Token to be sent to the next sync call
 */
export type SyncCollection = {
  entries: Array<Entry>,
  assets: Array<Asset>,
  deletedEntries: Array<DeletedEntry>,
  deletedAssets: Array<DeletedAsset>,
  nextSyncToken: string
}

/**
 * Deleted Entries are the same as Entries, but only appear on the sync API.
 * @memberof Sync
 * @typedef DeletedEntry
 * @type Entities.Entry
 */

/**
 * Deleted Assets are the same as Assets, but only appear on the sync API.
 * @memberof Sync
 * @typedef DeletedAsset
 * @type Entities.Asset
 */

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
      mixinLinkGetters(response.items, mapIncludeItems(cloneDeep(response.items)))
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
 * Creates an object similar to the one retrieved on `includes` from the `entries`
 * endpoint, for usage with the link getters mixin
 */
function mapIncludeItems (items: ResponseItems): Object {
  return {
    Entry: filter(items, ['sys.type', 'Entry']),
    Asset: filter(items, ['sys.type', 'Asset'])
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
