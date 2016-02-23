/* @flow */

/**
 * Contentful CDA API
 * @namespace CDAClient
 */

/**
 * @namespace Entities
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

import type {Space} from './entities/space'
import {wrapSpace} from './entities/space'
import type {ContentType, ContentTypeCollection} from './entities/content-type'
import {wrapContentType, wrapContentTypeCollection} from './entities/content-type'
import type {Entry, EntryCollection} from './entities/entry'
import {wrapEntry, wrapEntryCollection} from './entities/entry'
import type {Asset, AssetCollection} from './entities/asset'
import {wrapAsset, wrapAssetCollection} from './entities/asset'
import type {SyncCollection} from './sync'
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
export type ContentfulClient = {
  getSpace: (id: string) => Promise<Space>,
  getContentType: (id: string) => Promise<ContentType>,
  getContentTypes: (query?: Object) => Promise<ContentTypeCollection>,
  getEntry: (id: string) => Promise<Entry>,
  getEntries: (query?: Object) => Promise<EntryCollection>,
  getAsset: (id: string) => Promise<Asset>,
  getAssets: (query?: Object) => Promise<AssetCollection>,
  sync: (query: Object) => Promise<SyncCollection>
}
function errorHandler (error: Object) {
  if (error.data) {
    throw error.data
  }
  throw error
}

/**
 * @private
 * Link resolution can be turned off for the methods that use it, or it can
 * be turned off globally. The local setting overrides the global setting.
 */
function shouldLinksResolve (query: Object, globalSetting: boolean): boolean {
  return !!('resolveLinks' in query ? query.resolveLinks : globalSetting)
}

export default function createCdaApi (http: Object, resolveLinksGlobalSetting: boolean): ContentfulClient {
  function getSpace (id: string): Promise<Space> {
    return http.get('')
    .then(response => wrapSpace(response.data), errorHandler)
  }

  /**
   * Gets a Content Type
   * @memberof CDAClient
   * @param  {string} id
   * @return {Promise<Entities.ContentType>} Promise for a Content Type
   */
  function getContentType (id: string): Promise<ContentType> {
    return http.get('content_types/' + id)
    .then(response => wrapContentType(response.data), errorHandler)
  }

  /**
   * Gets a collection of Content Types
   * @memberof CDAClient
   * @param  {Entities.Query} query
   * @return {Promise<Entities.ContentTypeCollection>} Promise for a collection of Content Types
   */
  function getContentTypes (query?: Object = {}): Promise<ContentTypeCollection> {
    return http.get('content_types', createRequestConfig({query: query}))
    .then(response => wrapContentTypeCollection(response.data), errorHandler)
  }

  /**
   * Gets an Entry
   * @memberof CDAClient
   * @param  {string} id
   * @return {Promise<Entities.Entry>} Promise for an Entry
   */
  function getEntry (id: string): Promise<Entry> {
    return http.get('entries/' + id)
    .then(response => wrapEntry(response.data), errorHandler)
  }

  /**
   * Gets a collection of Entries
   * @memberof CDAClient
   * @param  {Object=} query - Object with search parameters. Check <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters">Search Parameters</a> for more details.
   * @param  {boolean=} query.resolveLinks - When true, links to other Entries or Assets are resolved. Default: true.
   * @return {Promise<Entities.EntryCollection>} Promise for a collection of Entries
   */
  function getEntries (query?: Object = {}): Promise<EntryCollection> {
    const resolveLinks = shouldLinksResolve(query, resolveLinksGlobalSetting)
    return http.get('entries', createRequestConfig({query: query}))
    .then(response => wrapEntryCollection(response.data, resolveLinks), errorHandler)
  }

  /**
   * Gets an Asset
   * @memberof CDAClient
   * @param  {string} id
   * @return {Promise<Entities.Asset>} Promise for an Asset
   */
  function getAsset (id: string): Promise<Asset> {
    return http.get('assets/' + id)
    .then(response => wrapAsset(response.data), errorHandler)
  }

  /**
   * Gets a collection of Assets
   * @memberof CDAClient
   * @param  {Object=} query - Object with search parameters. Check <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters">Search Parameters</a> for more details.
   * @return {Promise<Entities.AssetCollection>} Promise for a collection of Assets
   */
  function getAssets (query?: Object = {}): Promise<AssetCollection> {
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
   */
  function sync (query?: Object = {}): Promise<SyncCollection> {
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
