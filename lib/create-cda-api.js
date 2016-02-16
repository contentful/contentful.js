/* @flow */

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
  throw error.data
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
  /**
   * Get a space by id
   */
  function getSpace (id: string): Promise<Space> {
    return http.get('')
    .then(response => wrapSpace(response.data), errorHandler)
  }

  /**
   * Get a Content Type by id
   */
  function getContentType (id: string): Promise<ContentType> {
    return http.get('content_types/' + id)
    .then(response => wrapContentType(response.data), errorHandler)
  }

  /**
   * Get all paginated Content Types or filter them with a query
   */
  function getContentTypes (query?: Object = {}): Promise<ContentTypeCollection> {
    return http.get('content_types', createRequestConfig({query: query}))
    .then(response => wrapContentTypeCollection(response.data), errorHandler)
  }

  /**
   * Get an Entry by id
   */
  function getEntry (id: string): Promise<Entry> {
    return http.get('entries/' + id)
    .then(response => wrapEntry(response.data), errorHandler)
  }

  /**
   * Get all Entries or filter them with a query
   */
  function getEntries (query?: Object = {}): Promise<EntryCollection> {
    const resolveLinks = shouldLinksResolve(query, resolveLinksGlobalSetting)
    return http.get('entries', createRequestConfig({query: query}))
    .then(response => wrapEntryCollection(response.data, resolveLinks), errorHandler)
  }

  /**
   * Get an Asset by id
   */
  function getAsset (id: string): Promise<Asset> {
    return http.get('assets/' + id)
    .then(response => wrapAsset(response.data), errorHandler)
  }

  /**
   * Get all Assets or filter them with a query
   */
  function getAssets (query?: Object = {}): Promise<AssetCollection> {
    return http.get('assets', createRequestConfig({query: query}))
    .then(response => wrapAssetCollection(response.data), errorHandler)
  }

  /**
   * Synchronize all the existing content (Entries and Assets) from a space,
   * from an initial state, or alternatively, synchronize only what content has
   * changed based on an existing sync token.
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
