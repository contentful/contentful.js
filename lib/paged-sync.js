/**
 * See <a href="https://www.contentful.com/developers/docs/concepts/sync/">Synchronization</a> for more information.
 * @namespace Sync
 */
import {createRequestConfig, freezeSys, toPlainObject} from 'contentful-sdk-core'
import resolve from 'contentful-resolve-response'
import mixinStringifySafe from './mixins/stringify-safe'

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
 * @param {boolean} resolveLinks - If links should be resolved
 * @return {Promise<SyncCollection>}
 */
export default function pagedSync (http, query, resolveLinks) {
  if (!query || (!query.initial && !query.nextSyncToken)) {
    throw new Error('Please provide one of `initial` or `nextSyncToken` parameters for syncing')
  }

  if (query && query.content_type && !query.type) {
    query.type = 'Entry'
  } else if (query && query.content_type && query.type && query.type !== 'Entry') {
    throw new Error('When using the `content_type` filter your `type` parameter cannot be different from `Entry`.')
  }

  return getSyncPage(http, [], query)
    .then((response) => {
      // clones response.items used in includes because we don't want these to be mutated
      if (resolveLinks) {
        response.items = resolve(response)
      }
      // maps response items again after getters are attached
      const mappedResponseItems = mapResponseItems(response.items)
      mappedResponseItems.nextSyncToken = response.nextSyncToken
      return freezeSys(mixinStringifySafe(toPlainObject(mappedResponseItems)))
    }, (error) => {
      throw error
    })
}

/**
 * @private
 * @param {Array<Entities.Entry|Entities.Array|Sync.DeletedEntry|Sync.DeletedAsset>} items
 * @return {Object} Entities mapped to an object for each entity type
 */
function mapResponseItems (items) {
  return {
    entries: items.filter((item) => item.sys.type === 'Entry'),
    assets: items.filter((item) => item.sys.type === 'Asset'),
    deletedEntries: items.filter((item) => item.sys.type === 'DeletedEntry'),
    deletedAssets: items.filter((item) => item.sys.type === 'DeletedAsset')
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
 * @return {Promise<{items: Array, nextSyncToken: string}>}
 */
function getSyncPage (http, items, query) {
  if (query.nextSyncToken) {
    query.sync_token = query.nextSyncToken
    delete query.nextSyncToken
  }

  if (query.sync_token) {
    delete query.initial
    delete query.type
    delete query.content_type
  }

  return http.get('sync', createRequestConfig({query: query}))
    .then((response) => {
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

/**
 * Extracts token out of an url
 * @private
 */
function getToken (url) {
  const urlParts = url.split('?')
  return urlParts.length > 0 ? urlParts[1].replace('sync_token=', '') : ''
}
