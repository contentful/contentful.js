/**
 * Contentful CDA API
 * @namespace CDAClient
 */

/**
 * @namespace Entities
 */

import {wrapSpace} from './entities/space'
import {wrapContentType, wrapContentTypeCollection} from './entities/content-type'
import {wrapEntry, wrapEntryCollection} from './entities/entry'
import {wrapAsset, wrapAssetCollection} from './entities/asset'
import pagedSync from './sync'
import createRequestConfig from './create-request-config'

/**
 * @memberof CDAClient
 * @typedef {Object} ClientAPI
 * @prop {function} getSpace
 * @prop {function} getContentType
 * @prop {function} getContentTypes
 * @prop {function} getEntry
 * @prop {function} getEntries
 * @prop {function} getAsset
 * @prop {function} getAssets
 * @prop {function} sync
 */
function errorHandler (error) {
  if (error.data) {
    throw error.data
  }
  throw error
}

/**
 * Link resolution can be turned off for the methods that use it, or it can
 * be turned off globally. The local setting overrides the global setting.
 * @private
 * @param {Object} query - regular query object used for collection endpoints
 * @param {boolean} globalSetting - Global library setting for link resolution
 */
function shouldLinksResolve (query, globalSetting) {
  return !!('resolveLinks' in query ? query.resolveLinks : globalSetting)
}

/**
 * Creates CDA API object
 * @private
 * @param {Object} http - HTTP client instance
 * @param {boolean} resolveLinksGlobalSetting - Global library setting for link resolution
 * @return {ClientAPI}
 */
export default function createCdaApi (http, resolveLinksGlobalSetting) {
  /**
   * Gets the Space which the client is currently configured to use
   * @memberof CDAClient
   * @return {Promise<Entities.Space>} Promise for a Space
   * @example
   * client.getSpace()
   * .then(space => console.log(space))
   */
  function getSpace () {
    return http.get('')
    .then(response => wrapSpace(response.data), errorHandler)
  }

  /**
   * Gets a Content Type
   * @memberof CDAClient
   * @param  {string} id
   * @return {Promise<Entities.ContentType>} Promise for a Content Type
   * @example
   * client.getContentType('contentTypeId')
   * .then(contentType => console.log(contentType))
   */
  function getContentType (id) {
    return http.get('content_types/' + id)
    .then(response => wrapContentType(response.data), errorHandler)
  }

  /**
   * Gets a collection of Content Types
   * @memberof CDAClient
   * @param  {Entities.Query=} query - Query object
   * @return {Promise<Entities.ContentTypeCollection>} Promise for a collection of Content Types
   * @example
   * client.getContentTypes()
   * .then(contentTypes => console.log(contentTypes.items))
   */
  function getContentTypes (query = {}) {
    return http.get('content_types', createRequestConfig({query: query}))
    .then(response => wrapContentTypeCollection(response.data), errorHandler)
  }

  /**
   * Gets an Entry
   * @memberof CDAClient
   * @param  {string} id
   * @return {Promise<Entities.Entry>} Promise for an Entry
   * @example
   * client.getEntry('entryId')
   * .then(entry => console.log(entry))
   */
  function getEntry (id) {
    return http.get('entries/' + id)
    .then(response => wrapEntry(response.data), errorHandler)
  }

  /**
   * Gets a collection of Entries
   * @memberof CDAClient
   * @param  {Object=} query - Object with search parameters. Check <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters">Search Parameters</a> for more details.
   * @param  {boolean=} query.resolveLinks - When true, links to other Entries or Assets are resolved. Default: true.
   * @return {Promise<Entities.EntryCollection>} Promise for a collection of Entries
   * @example
   * client.getEntries({content_type: 'contentTypeId'})
   * .then(entries => console.log(entries.items))
   */
  function getEntries (query = {}) {
    const resolveLinks = shouldLinksResolve(query, resolveLinksGlobalSetting)
    return http.get('entries', createRequestConfig({query: query}))
    .then(response => wrapEntryCollection(response.data, resolveLinks), errorHandler)
  }

  /**
   * Gets an Asset
   * @memberof CDAClient
   * @param  {string} id
   * @return {Promise<Entities.Asset>} Promise for an Asset
   * @example
   * client.getAsset('assetId')
   * .then(asset => console.log(asset))
   */
  function getAsset (id) {
    return http.get('assets/' + id)
    .then(response => wrapAsset(response.data), errorHandler)
  }

  /**
   * Gets a collection of Assets
   * @memberof CDAClient
   * @param  {Object=} query - Object with search parameters. Check <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters">Search Parameters</a> for more details.
   * @return {Promise<Entities.AssetCollection>} Promise for a collection of Assets
   * @example
   * client.getAssets()
   * .then(assets => console.log(assets.items))
   */
  function getAssets (query = {}) {
    return http.get('assets', createRequestConfig({query: query}))
    .then(response => wrapAssetCollection(response.data), errorHandler)
  }

  /**
   * Synchronizes either all the content or only new content since last sync
   * See <a href="https://www.contentful.com/developers/docs/concepts/sync/">Synchronization</a> for more information.
   * @memberof CDAClient
   * @param  {Object} query - Query object for the sync call. One of initial or nextSyncToken always needs to be specified, but not both.
   * @param  {boolean?} query.initial - Indicates if this is the first sync. Use it if you don't have a sync token.
   * @param  {string?} query.nextSyncToken - The token you got the last time you used this method. Ensures you only get changed content.
   * @param  {string=} query.type - Filter by this type (Entry or Asset)
   * @param  {string=} query.content_type - Filter by this content type id
   * @param  {boolean=} query.resolveLinks - When true, links to other Entries or Assets are resolved. Default: true.
   * @return {Promise<Sync.SyncCollection>} Promise for the collection resulting of a sync operation
   * @example
   * client.sync()
   * .then(response => console.log(response.entries, response.assets, response.nextSyncToken))
   */
  function sync (query = {}) {
    const resolveLinks = shouldLinksResolve(query, resolveLinksGlobalSetting)
    return pagedSync(http, query, resolveLinks)
  }

  return {
    getSpace: getSpace,
    getContentType: getContentType,
    getContentTypes: getContentTypes,
    getEntry: getEntry,
    getEntries: getEntries,
    getAsset: getAsset,
    getAssets: getAssets,
    sync: sync
  }
}

/**
 * System metadata. See <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/common-resource-attributes">Common Resource Attributes</a> for more details.
 * @memberof Entities
 * @typedef Sys
 * @prop {string} type
 * @prop {string} id
 * @prop {Entities.Link} space
 * @prop {string} createdAt
 * @prop {string} updatedAt
 * @prop {number} revision
 */

/**
 * Link to another entity. See <a href="https://www.contentful.com/developers/docs/concepts/links/">Links</a> for more details.
 * @memberof Entities
 * @typedef Link
 * @prop {string} type - type of this entity. Always link.
 * @prop {string} id
 * @prop {string} linkType - type of this link. If defined, either Entry or Asset
 */

/**
 * @namespace EntryFields
 */

/**
 * @memberof EntryFields
 * @typedef Symbol
 * @type string
 */

/**
 * @memberof EntryFields
 * @typedef Text
 * @type string
 */

/**
 * @memberof EntryFields
 * @typedef Integer
 * @type number
 */

/**
 * @memberof EntryFields
 * @typedef Number
 * @type number
 */

/**
 * @memberof EntryFields
 * @typedef Date
 * @type string
 */

/**
 * @memberof EntryFields
 * @typedef Boolean
 * @type boolean
 */

/**
 * @memberof EntryFields
 * @typedef Location
 * @prop {string} lat - latitude
 * @prop {string} lon - longitude
 */

/**
 * A Field in an Entry can have one of the following types that can be defined in Contentful. See <a href="https://www.contentful.com/developers/docs/references/field-type/">Field Types</a> for more details.
 * @memberof Entities
 * @typedef Field
 * @type EntryFields.Symbol | EntryFields.Text | EntryFields.Integer | EntryFields.Number | EntryFields.Date | EntryFields.Boolean | EntryFields.Location | Entities.Link | Array<EntryFields.Symbol|Entities.Link> | Object
 */
