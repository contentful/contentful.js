/**
 * Contentful Delivery API Client. Contains methods which allow access to the
 * different kinds of entities present in Contentful (Entries, Assets, etc).
 * @namespace ContentfulClientAPI
 * @see Entities
 */

/**
 * The different kinds of top level entities you can find in Contentful
 * @namespace Entities
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

/**
 * Link to another entity. See <a href="https://www.contentful.com/developers/docs/concepts/links/">Links</a> for more details.
 * @memberof Entities
 * @typedef Link
 * @prop {string} type - type of this entity. Always link.
 * @prop {string} id
 * @prop {string} linkType - type of this link. If defined, either Entry or Asset
 */

/**
 * @memberof ContentfulClientAPI
 * @typedef {Object} ClientAPI
 * @prop {function} getSpace
 * @prop {function} getContentType
 * @prop {function} getContentTypes
 * @prop {function} getEntry
 * @prop {function} getEntries
 * @prop {function} getAsset
 * @prop {function} getAssets
 * @prop {function} parseEntries
 * @prop {function} sync
 */

import {createRequestConfig, ContentfulQuery} from 'contentful-sdk-core'
import entities from './entities'
import pagedSync from './paged-sync'
import { AxiosInstance } from '@contentful/axios';
import { GlobalOptionGetter } from './create-global-options';
import { ContentfulClientApi, AssetJSON, ContentfulCollectionResponse, EntryJSON, ContentTypeJSON, ContentType, ContentfulCollection, LocaleJSON, Entry, EntryCollection, SpaceJSON, Space, EntryContentfulCollectionResponse, EntryJSONCollection, SyncQuery, SyncOptions } from './interfaces';

/**
 * Creates API object with methods to access functionality from Contentful's
 * Delivery API
 * @private
 * @param {Object} params - API initialization params
 * @prop {Object} http - HTTP client instance
 * @prop {Object} entities - Object with wrapper methods for each kind of entity
 * @prop {Function} getGlobalOptions - Link resolver preconfigured with global setting
 * @return {ClientAPI}
 */
export default function createContentfulApi ({
  http, 
  getGlobalOptions
}: {
  http: AxiosInstance, 
  getGlobalOptions: GlobalOptionGetter
}) : ContentfulClientApi {
  const {wrapSpace} = entities.space
  const {wrapContentType, wrapContentTypeCollection} = entities.contentType
  const {wrapEntry, wrapEntryCollection} = entities.entry
  const {wrapAsset, wrapAssetCollection} = entities.asset
  const {wrapLocaleCollection} = entities.locale
  const notFoundError = (id) => {
    const error = new Error('The resource could not be found.')
    error.sys = {
      'type': 'Error',
      'id': 'NotFound'
    }
    error.details = {
      'type': 'Entry',
      'id': id,
      'environment': getGlobalOptions().environment,
      'space': getGlobalOptions().space
    }
    return error
  }

  function errorHandler (error: any): never {
    if (error.data) {
      throw error.data
    }
    throw error
  }

  /**
   * Gets the Space which the client is currently configured to use
   * @memberof ContentfulClientAPI
   * @return {Promise<Entities.Space>} Promise for a Space
   * @example
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   * // returns the space object with the above <space-id>
   * client.getSpace()
   * .then((space) => console.log(space))
   * .catch(console.error)
   */
  async function getSpace (): Promise<Space> {
    switchToSpace(http)

    try {
      const response = await http.get<SpaceJSON>('')
      return wrapSpace(response.data)
    } catch (error) {
      return errorHandler(error)
    }
  }

  /**
   * Gets a Content Type
  * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * client.getContentType('<content_type_id>')
   * .then((contentType) => console.log(contentType))
   * .catch(console.error)
   */
  async function getContentType (id: string) : Promise<ContentType>{
    switchToEnvironment(http)

    try {
      const response = await http.get<ContentTypeJSON>('content_types/' + id);

      return wrapContentType(response.data);
    } catch (error) {
      return errorHandler(error);
    }
  }

  /**
   * Gets a collection of Content Types
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * client.getContentTypes()
   * .then((response) => console.log(response.items))
   * .catch(console.error)
   */
  async function getContentTypes(query: ContentfulQuery = {}): Promise<ContentfulCollection<ContentTypeJSON>> {
    switchToEnvironment(http)

    try {
      const response = await http.get<ContentfulCollectionResponse<ContentTypeJSON>>('content_types', createRequestConfig({ query: query }));

      return wrapContentTypeCollection(response.data);
    } catch (error) {
      return errorHandler(error);
    }
  }

  /**
   * Gets an Entry
   * @memberof ContentfulClientAPI
   * @param  {string} id
   * @param  {Object=} query - Object with search parameters. In this method it's only useful for `locale`.
   * @return {Promise<Entities.Entry>} Promise for an Entry
   * @example
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * client.getEntry('<entry_id>')
   * .then((entry) => console.log(entry))
   * .catch(console.error)
   */

  async function getEntry<T> (id: string, query: ContentfulQuery = {}): Promise<Entry<T>> {

    switchToEnvironment(http)
    normalizeSelect(query)

    try {
      const response = await http.get<EntryJSON<T>>('entries/' + id, createRequestConfig({query: query}))
      return wrapEntry<T>(response.data)
    } catch (error) {
      return errorHandler(error)
    }
  }
  
  /**
   * Gets a collection of Entries
   * @memberof ContentfulClientAPI
   * @param  {Object=} query - Object with search parameters. Check the <a href="https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/#retrieving-entries-with-search-parameters">JS SDK tutorial</a> and the <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters">REST API reference</a> for more details.
   * @return {Promise<Entities.EntryCollection>} Promise for a collection of Entries
   * @example
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * client.getEntries()
   * .then((response) => console.log(response.items))
   * .catch(console.error)
   */
  async function getEntries<T> (query: ContentfulQuery = {}): Promise<EntryCollection<T> | EntryJSONCollection<T>> {
    // TODO: remove duplicate code maybe have a generic makeRequest<T> function?
    switchToEnvironment(http)
    normalizeSelect(query)
    const { resolveLinks, removeUnresolved } = getGlobalOptions(query)
    
    try {
      const response = await http.get<EntryContentfulCollectionResponse<T>>('entries', createRequestConfig({query: query}))
      return wrapEntryCollection<T>(response.data, { resolveLinks, removeUnresolved })
    } catch (error) {
      return errorHandler(error)
    }
  }
  /**
   * Gets an Asset
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * client.getAsset('<asset_id>')
   * .then((asset) => console.log(asset))
   * .catch(console.error)
   */
    async function getAsset (id:string, query: ContentfulQuery = {}) {
    switchToEnvironment(http)
    normalizeSelect(query)

    try{
      const response = await http.get<AssetJSON>('assets/' + id, createRequestConfig({query: query}));

      return wrapAsset(response.data)
    } catch (error) {
      return errorHandler(error);
    }
  }

  

  /**
   * Gets a collection of Assets
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * client.getAssets()
   * .then((response) => console.log(response.items))
   * .catch(console.error)
   */
  async function getAssets (query: ContentfulQuery = {}) {
    switchToEnvironment(http)
    normalizeSelect(query)

    try {
      const response = await http.get<ContentfulCollectionResponse<AssetJSON>>('assets', createRequestConfig({query: query}));
      return wrapAssetCollection(response.data);
    } catch (error) {
      return errorHandler(error);
    }
  }

  /**
   * Gets a collection of Locale
   * @memberof ContentfulClientAPI
   * @param  {Object=} query - Object with search parameters. Check the <a href="https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/#retrieving-entries-with-search-parameters">JS SDK tutorial</a> and the <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters">REST API reference</a> for more details.
   * @return {Promise<Entities.LocaleCollection>} Promise for a collection of Locale
   * @example
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * client.getLocales()
   * .then((response) => console.log(response.items))
   * .catch(console.error)
   */
  async function getLocales (query: ContentfulQuery = {}): Promise<ContentfulCollection<LocaleJSON>> {
    switchToEnvironment(http)

    try {
      const response = await http.get<ContentfulCollectionResponse<LocaleJSON>>('locales', createRequestConfig({query: query}));

      return wrapLocaleCollection(response.data);
    } catch (error) {
      return errorHandler(error);
    }
  }

  /**
   * Synchronizes either all the content or only new content since last sync
   * See <a href="https://www.contentful.com/developers/docs/concepts/sync/">Synchronization</a> for more information.
   * <strong> Important note: </strong> The the sync api endpoint does not support include or link resolution.
   * However contentful.js is doing link resolution client side if you only make an initial sync.
   * For the delta sync (using nextSyncToken) it is not possible since the sdk wont have access to all the data to make such an operation.
   * @memberof ContentfulClientAPI
   * @param  {Object} query - Query object for the sync call. One of initial or nextSyncToken always needs to be specified, but not both.
   * @param  {boolean?} query.initial - Indicates if this is the first sync. Use it if you don't have a sync token.
   * @param  {string?} query.nextSyncToken - The token you got the last time you used this method. Ensures you only get changed content.
   * @param  {string=} query.type - Filter by this type (all (default), Entry, Asset, Deletion, DeletedAsset or DeletedEntry)
   * @param  {string=} query.content_type - Filter by this content type id
   * @param  {boolean=} query.resolveLinks - When true, links to other Entries or Assets are resolved. Default: true.
   * @param  {Object} options
   * @param  {boolean=} [options.paginate = true] - Set to false to disable pagination
   * @return {Promise<Sync.SyncCollection>} Promise for the collection resulting of a sync operation
   * @example
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * client.sync({
   *   initial: true
   * })
   * .then((response) => console.log({
   *   entries: response.entries,
   *   assets: response.assets,
   *   nextSyncToken: response.nextSyncToken
   * }))
   * .catch(console.error)
   */
  function sync<T> (query: SyncQuery = {}, options: Partial<SyncOptions> = { paginate: true }) {
    const { resolveLinks, removeUnresolved } = getGlobalOptions(query)
    switchToEnvironment(http)
    return pagedSync<T>(http, query, { resolveLinks, removeUnresolved, ...options })
  }

  /**
  * Parse raw json data into collection of entry objects.Links will be resolved also
  * @memberof ContentfulClientAPI
  * @param {Object} raw json data
  * @example
  * let data = {items: [
  *    {
  *    sys: {type: 'Entry', locale: 'en-US'},
  *    fields: {
  *      animal: {sys: {type: 'Link', linkType: 'Animal', id: 'oink'}},
  *      anotheranimal: {sys: {type: 'Link', linkType: 'Animal', id: 'middle-parrot'}}
  *    }
  *  }
  * ],
  * includes: {
  *  Animal: [
  *    {
  *      sys: {type: 'Animal', id: 'oink', locale: 'en-US'},
  *      fields: {
  *        name: 'Pig',
  *        friend: {sys: {type: 'Link', linkType: 'Animal', id: 'groundhog'}}
  *      }
  *    }
  *   ]
  *  }
  * }
  * console.log( data.items[0].fields.foo ); // undefined
  * let parsedData = client.parseEntries(data);
  * console.log( parsedData.items[0].fields.foo ); // foo
  */
  function parseEntries<T> (data: EntryContentfulCollectionResponse<T>) {
    const { resolveLinks, removeUnresolved } = getGlobalOptions({})
    return wrapEntryCollection<T>(data, { resolveLinks, removeUnresolved })
  }
  /*
   * sdk relies heavily on sys metadata
   * so we cannot omit the sys property on sdk level
   * */
  function normalizeSelect (query: ContentfulQuery) {
    if (query.select && !/sys/i.test(query.select)) {
      query.select += ',sys'
    }
  }

  /*
   * Switches BaseURL to use /environments path
   * */
  function switchToEnvironment (http: AxiosInstance) {
    http.defaults.baseURL = getGlobalOptions().environmentBaseUrl
  }

  /*
   * Switches BaseURL to use /spaces path
   * */
  function switchToSpace (http: AxiosInstance) {
    http.defaults.baseURL = getGlobalOptions().spaceBaseUrl
  }

  return {
    getSpace: getSpace,
    getContentType: getContentType,
    getContentTypes: getContentTypes,
    getEntry: getEntry,
    getEntries: getEntries,
    getAsset: getAsset,
    getAssets: getAssets,
    getLocales: getLocales,
    parseEntries: parseEntries,
    sync: sync
  }
}
