/**
 * See <a href="https://www.contentful.com/developers/docs/concepts/sync/">Synchronization</a> for more information.
 * @namespace Sync
 */
import {createRequestConfig, freezeSys, toPlainObject} from 'contentful-sdk-core'
import resolveResponse from 'contentful-resolve-response'
import mixinStringifySafe from './mixins/stringify-safe'
import { AxiosInstance } from '@contentful/axios';
import { EntryJSON, AssetJSON, SyncCollectionResponse, SyncCollectionJSON, SyncOptions, SyncQuery, SyncCollection } from './interfaces';

/**
 * @memberof Sync
 * @typedef SyncCollection
 * @prop {Array<Entities.Entry>} entries - All existing entries on first sync. New and updated entries on subsequent syncs.
 * @prop {Array<Entities.Asset>} assets - All existing assets on first sync. New and updated assets on subsequent syncs.
 * @prop {Array<Sync.DeletedEntry>} deletedEntries - List of deleted Entries since last sync
 * @prop {Array<Sync.DeletedAsset>} deletedAssets - List of deleted Assets since last sync
 * @prop {string} nextSyncToken - Token to be sent to the next sync call
 * @prop {function(): Object} toPlainObject() - Returns this Sync collection as a plain JS object
 * @prop {function(?function=, space=): Object} stringifySafe(replacer,space) - Stringifies the Sync collection, accounting for circular references. Circular references will be replaced with just a Link object, with a <code>circular</code> property set to <code>true</code>. See <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify">MDN</a> and <a href="https://www.npmjs.com/package/json-stringify-safe">json-stringify-safe</a> for more details on the arguments this method can take.
 */

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
 * This module retrieves all the available pages for a sync operation
 * @private
 * @param {Object} http - HTTP client
 * @param {Object} query - Query object
 * @param {Object} options - Sync options object
 * @param {boolean} [options.resolveLinks = true] - If links should be resolved
 * @param {boolean} [options.removeUnresolved = false] - If unresolvable links should get removed
 * @param {boolean} [options.paginate = true] - If further sync pages should automatically be crawled
 * @return {Promise<SyncCollection>}
 */


export default function pagedSync<T>(http: AxiosInstance, query: Partial<SyncQuery>, options: Partial<SyncOptions> = {}) : Promise<SyncCollection<T>> {
  if (!query || (!query.initial && !query.nextSyncToken && !query.nextPageToken)) {
    throw new Error('Please provide one of `initial`, `nextSyncToken` or `nextPageToken` parameters for syncing')
  }

  if (query && query.content_type && !query.type) {
    query.type = 'Entry'
  } else if (query && query.content_type && query.type && query.type !== 'Entry') {
    throw new Error('When using the `content_type` filter your `type` parameter cannot be different from `Entry`.')
  }

  const defaultOptions: SyncOptions = { resolveLinks: true, removeUnresolved: false, paginate: true }
  const { resolveLinks, removeUnresolved, paginate } = {
    ...defaultOptions,
    ...options
  }

  const syncOptions = {
    paginate
  }

  return getSyncPage<T>(http, [], query, syncOptions)
    .then((response) => {
      // clones response.items used in includes because we don't want these to be mutated
      if (resolveLinks) {
        response.items = resolveResponse<EntryJSON<T> | AssetJSON>(response, {removeUnresolved, itemEntryPoints: ['fields']})
      }
      // maps response items again after getters are attached
      const mappedResponseItems = mapResponseItems<T>(response.items)

      if (response.nextSyncToken) {
        mappedResponseItems.nextSyncToken = response.nextSyncToken
      }

      if (response.nextPageToken) {
        mappedResponseItems.nextPageToken = response.nextPageToken
      }

      return freezeSys(mixinStringifySafe(toPlainObject(mappedResponseItems)))
    }, (error: any) => {
      throw error
    })
}



/**
 * @private
 * @param {Array<Entities.Entry|Entities.Array|Sync.DeletedEntry|Sync.DeletedAsset>} items
 * @return {Object} Entities mapped to an object for each entity type
 */
function mapResponseItems<T> (items: Array<EntryJSON<T> | AssetJSON>): SyncCollectionJSON<T> {
  return {
    entries: items.filter((item) => item.sys.type === 'Entry') as EntryJSON<T>[],
    assets: items.filter((item) => item.sys.type === 'Asset') as AssetJSON[],
    deletedEntries: items.filter((item) => item.sys.type === 'DeletedEntry') as EntryJSON<T>[],
    deletedAssets: items.filter((item) => item.sys.type === 'DeletedAsset') as AssetJSON[]
  }
}

/**
 * If the response contains a nextPageUrl, extracts the sync token to get the
 * next page and calls itself again with that token.
 * Otherwise, if the response contains a nextSyncUrl, extracts the sync token
 * and returns it.
 * On each call of this function, any retrieved items are collected in the
 * supplied items array, which gets returned in the end
 * @private
 * @param {Object} http
 * @param {Array<Entities.Entry|Entities.Array|Sync.DeletedEntry|Sync.DeletedAsset>} items
 * @param {Object} query
 * @param {Object} options - Sync page options object
 * @param {boolean} [options.paginate = true] - If further sync pages should automatically be crawled
 * @return {Promise<{items: Array, nextSyncToken: string}>}
 */
function getSyncPage<T> (http: AxiosInstance, items: Array<EntryJSON<T> | AssetJSON>, query: SyncQuery, { paginate }: { paginate: boolean}) : Promise<SyncCollectionResponse<T>> {
  if (query.nextSyncToken) {
    query.sync_token = query.nextSyncToken
    delete query.nextSyncToken
  }

  if (query.nextPageToken) {
    query.sync_token = query.nextPageToken
    delete query.nextPageToken
  }

  if (query.sync_token) {
    delete query.initial
    delete query.type
    delete query.content_type
  }

  const t = http.get<SyncCollectionResponse<T>>('sync', createRequestConfig({query: query}))
    .then((response) => {
      const data = response.data
      items = items.concat(data.items)
      if (data.nextPageUrl) {
        if (paginate) {
          delete query.initial
          query.sync_token = getToken(data.nextPageUrl)
          return getSyncPage<T>(http, items, query, { paginate })
        }
        return {
          items: items,
          nextPageToken: getToken(data.nextPageUrl)
        }
      } else if (data.nextSyncUrl) {
        return {
          items: items,
          nextSyncToken: getToken(data.nextSyncUrl)
        }
      }
      return errorHandler('NotImplemented Exception');
    }).catch((error: any) => {
      return errorHandler(error);
    }) 

  return t;
}

function errorHandler(error?: any): never {
  throw error;
}

/**
 * Extracts token out of an url
 * @private
 */
function getToken (url: string): string {
  const urlParts = url.split('?')
  return urlParts.length > 0 ? urlParts[1].replace('sync_token=', '') : ''
}
