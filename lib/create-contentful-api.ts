/**
 * Contentful Delivery API Client. Contains methods which allow access to the
 * different kinds of entities present in Contentful (Entries, Assets, etc).
 * @namespace ContentfulClientAPI
 * @see Entities
 */

import { AxiosInstance, createRequestConfig } from 'contentful-sdk-core'
import { GetGlobalOptions } from './create-global-options'
import pagedSync from './paged-sync'
import {
  Asset,
  AssetCollection,
  AssetFields,
  AssetQueries,
  ContentType,
  ContentTypeCollection,
  EntriesQueries,
  Entry,
  EntryCollection,
  LocaleCollection,
  LocaleValue,
  LocalizedEntry,
  LocalizedEntryCollection,
  ResolvedEntry,
  ResolvedEntryCollection,
  ResolvedLocalizedEntry,
  ResolvedLocalizedEntryCollection,
  Space,
  SyncCollection,
} from './types'
import { EntryQueries } from './types/query/query'
import { FieldsType } from './types/query/util'
import normalizeSelect from './utils/normalize-select'
import resolveCircular from './utils/resolve-circular'

export type UnresolvedClient = {
  getEntry<Fields extends FieldsType>(id: string, query?: EntryQueries): Promise<Entry<Fields>>
  getEntries<Fields extends FieldsType>(
    query?: EntriesQueries<Fields>
  ): Promise<EntryCollection<Fields>>
  localized: UnresolvedLocalizedClient
}

export type UnresolvedLocalizedClient = {
  getEntry<Fields extends FieldsType, Locale extends LocaleValue = any>(
    id: string,
    query?: EntryQueries,
    locale?: Locale
  ): Promise<LocalizedEntry<Fields, Locale>>
  getEntries<Fields extends FieldsType, Locale extends LocaleValue = any>(
    query?: EntriesQueries<Fields>,
    locale?: Locale
  ): Promise<LocalizedEntryCollection<Fields, Locale>>
}

export type LocalizedClient = {
  getEntry<Fields extends FieldsType, Locale extends LocaleValue = any>(
    id: string,
    query?: EntryQueries,
    locale?: Locale
  ): Promise<ResolvedLocalizedEntry<Fields, Locale>>
  getEntries<Fields extends FieldsType, Locale extends LocaleValue = any>(
    query?: EntriesQueries<Fields>,
    locale?: Locale
  ): Promise<ResolvedLocalizedEntryCollection<Fields, Locale>>
}

export type ContentfulClientApi = {
  version: string

  getAsset(id: string): Promise<Asset>

  getAssets(query?: AssetQueries<AssetFields>): Promise<AssetCollection>

  getContentType(id: string): Promise<ContentType>

  getContentTypes(): Promise<ContentTypeCollection>

  getSpace(): Promise<Space>

  getLocales(): Promise<LocaleCollection>

  parseEntries<T>(raw: any): EntryCollection<T>

  sync(query: any): Promise<SyncCollection>

  getEntry<Fields extends FieldsType>(
    id: string,
    query?: EntryQueries
  ): Promise<ResolvedEntry<Fields>>

  getEntries<Fields extends FieldsType>(
    query?: EntriesQueries<Fields>
  ): Promise<ResolvedEntryCollection<Fields>>

  unresolved: UnresolvedClient

  localized: LocalizedClient
}

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

interface CreateContentfulApiParams {
  http: AxiosInstance
  getGlobalOptions: GetGlobalOptions
}

class NotFoundError extends Error {
  public readonly sys: { id: string; type: string }
  public readonly details: { environment: string; id: string; type: string; space: any }

  constructor(id: string, environment: string, space: string) {
    super('The resource could not be found.')
    this.sys = {
      type: 'Error',
      id: 'NotFound',
    }
    this.details = {
      type: 'Entry',
      id,
      environment,
      space,
    }
  }
}

export default function createContentfulApi({
  http,
  getGlobalOptions,
}: CreateContentfulApiParams): ContentfulClientApi {
  const notFoundError = (id = 'unknown') => {
    return new NotFoundError(id, getGlobalOptions().environment, getGlobalOptions().space)
  }

  // eslint-disable-next-line no-undef
  function errorHandler(error): never {
    if (error.data) {
      throw error.data
    }

    if (error.response && error.response.data) {
      throw error.response.data
    }

    throw error
  }

  interface GetConfig {
    context: 'space' | 'environment'
    path: string
    config?: any
  }

  async function get<T>({ context, path, config }: GetConfig): Promise<T> {
    let baseUrl =
      context === 'space' ? getGlobalOptions().spaceBaseUrl : getGlobalOptions().environmentBaseUrl

    if (!baseUrl) {
      throw new Error('Please define baseUrl for ' + context)
    }

    if (!baseUrl.endsWith('/')) {
      baseUrl += '/'
    }

    try {
      const response = await http.get(baseUrl + path, config)
      return response.data
    } catch (error) {
      errorHandler(error)
    }
  }

  /**
   * Gets the Space which the client is currently configured to use
   * @memberof ContentfulClientAPI
   * @return {Promise<Space>} Promise for a Space
   * @example
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   * // returns the space object with the above <space-id>
   * const space = await client.getSpace()
   * console.log(space)
   */
  async function getSpace(): Promise<Space> {
    return get<Space>({ context: 'space', path: '' })
  }

  /**
   * Gets a Content Type
   * @memberof ContentfulClientAPI
   * @param  {string} id
   * @return {Promise<ContentType>} Promise for a Content Type
   * @example
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const contentType = await client.getContentType('<content_type_id>')
   * console.log(contentType)
   */
  async function getContentType(id: string): Promise<ContentType> {
    return get<ContentType>({
      context: 'environment',
      path: `content_types/${id}`,
    })
  }

  /**
   * Gets a collection of Content Types
   * @memberof ContentfulClientAPI
   * @param  {Object=} query - Object with search parameters. Check the <a href="https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/#retrieving-entries-with-search-parameters">JS SDK tutorial</a> and the <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters">REST API reference</a> for more details.
   * @return {Promise<ContentTypeCollection>} Promise for a collection of Content Types
   * @example
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const response = await client.getContentTypes()
   * console.log(response.items)
   */
  async function getContentTypes(): Promise<ContentTypeCollection> {
    return get<ContentTypeCollection>({
      context: 'environment',
      path: 'content_types',
      config: createRequestConfig({ query: {} }),
    })
  }

  /**
   * Gets an Entry
   * @memberof ContentfulClientAPI
   * @param  {string} id
   * @param  {Object=} query - Object with search parameters. In this method it's only useful for `locale`.
   * @return {Promise<Entry>} Promise for an Entry
   * @example
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const entry = await client.getEntry('<entry_id>')
   * console.log(entry)
   */

  async function getEntry<Fields>(
    id: string,
    query: EntryQueries = {}
  ): Promise<ResolvedEntry<Fields>> {
    return internalGetEntry<ResolvedEntry<Fields>>(id, query, true)
  }

  async function getEntries<Fields>(
    query: EntriesQueries<Fields> = {}
  ): Promise<ResolvedEntryCollection<Fields>> {
    return internalGetEntries<ResolvedEntryCollection<Fields>>(query, true)
  }

  async function getLocalizedEntry<Fields, Locale extends LocaleValue = any>(
    id: string,
    query: EntryQueries = {},
    locale: LocaleValue = '*'
  ): Promise<ResolvedLocalizedEntry<Fields, Locale>> {
    return internalGetEntry<ResolvedLocalizedEntry<Fields, Locale>>(id, { locale, ...query }, true)
  }

  async function getLocalizedEntries<Fields, Locale extends LocaleValue = any>(
    query: EntriesQueries<Fields> = {},
    locale: LocaleValue = '*'
  ): Promise<ResolvedLocalizedEntryCollection<Fields, Locale>> {
    return internalGetEntries<ResolvedLocalizedEntryCollection<Fields, Locale>>(
      { locale, ...query },
      true
    )
  }

  async function getUnresolvedEntry<Fields>(
    id: string,
    query: EntryQueries = {}
  ): Promise<Entry<Fields>> {
    return internalGetEntry<Entry<Fields>>(id, query, false)
  }

  async function getUnresolvedEntries<Fields>(
    query: EntriesQueries<Fields> = {}
  ): Promise<EntryCollection<Fields>> {
    return internalGetEntries<EntryCollection<Fields>>(query, false)
  }

  async function getUnresolvedLocalizedEntry<Fields, Locale extends LocaleValue = any>(
    id: string,
    query: EntryQueries = {},
    locale: LocaleValue = '*'
  ): Promise<LocalizedEntry<Fields, Locale>> {
    return internalGetEntry<LocalizedEntry<Fields, Locale>>(id, { locale, ...query }, false)
  }

  async function getUnresolvedLocalizedEntries<Fields, Locale extends LocaleValue = any>(
    query: EntriesQueries<Fields> = {},
    locale: LocaleValue = '*'
  ): Promise<LocalizedEntryCollection<Fields, Locale>> {
    return internalGetEntries<LocalizedEntryCollection<Fields, Locale>>({ locale, ...query }, false)
  }

  async function internalGetEntry<RValue>(
    id: string,
    query,
    resolveLinks: boolean
  ): Promise<RValue> {
    if (!id) {
      throw notFoundError(id)
    }
    try {
      const response = await internalGetEntries<{ items: RValue[] }>(
        { 'sys.id': id, ...query },
        resolveLinks
      )
      if (response.items.length > 0) {
        return response.items[0] as RValue
      } else {
        throw notFoundError(id)
      }
    } catch (error) {
      errorHandler(error)
    }
  }

  async function internalGetEntries<RType>(
    query: Record<string, any>,
    resolveLinks = false
  ): Promise<RType> {
    const { removeUnresolved } = getGlobalOptions({})
    try {
      const entries = await get({
        context: 'environment',
        path: 'entries',
        config: createRequestConfig({ query: normalizeSelect(query) }),
      })
      return resolveCircular(entries, { resolveLinks, removeUnresolved }) as RType
    } catch (error) {
      errorHandler(error)
    }
  }

  /**
   * Gets an Asset
   * @memberof ContentfulClientAPI
   * @param  {string} id
   * @param  {Object=} query - Object with search parameters. In this method it's only useful for `locale`.
   * @return {Promise<Entities.Asset>} Promise for an Asset
   * @example
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const asset = await client.getAsset('<asset_id>')
   * console.log(asset)
   */
  async function getAsset(id: string, query = {}): Promise<Asset> {
    return get<Asset>({
      context: 'environment',
      path: `assets/${id}`,
      config: createRequestConfig({ query: normalizeSelect(query) }),
    })
  }

  /**
   * Gets a collection of Assets
   * @memberof ContentfulClientAPI
   * @param  {Object=} query - Object with search parameters. Check the <a href="https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/#retrieving-entries-with-search-parameters">JS SDK tutorial</a> and the <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters">REST API reference</a> for more details.
   * @return {Promise<Entities.AssetCollection>} Promise for a collection of Assets
   * @example
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const response = await client.getAssets()
   * console.log(response.items)
   */
  async function getAssets(query = {}): Promise<AssetCollection> {
    return get<AssetCollection>({
      context: 'environment',
      path: 'assets',
      config: createRequestConfig({ query: normalizeSelect(query) }),
    })
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
   * const response = await client.getLocales()
   * console.log(response.items)
   */
  async function getLocales(query = {}): Promise<LocaleCollection> {
    return get<LocaleCollection>({
      context: 'environment',
      path: 'locales',
      config: createRequestConfig({ query: normalizeSelect(query) }),
    })
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
   * const response = await client.sync({
   *   initial: true
   * })
   * console.log({
   *   entries: response.entries,
   *   assets: response.assets,
   *   nextSyncToken: response.nextSyncToken
   * })
   */
  async function sync(query = {}, options = { paginate: true }) {
    const { resolveLinks, removeUnresolved } = getGlobalOptions(query)
    switchToEnvironment(http)
    return pagedSync(http, query, { resolveLinks, removeUnresolved, ...options })
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
  function parseEntries(data) {
    const { resolveLinks, removeUnresolved } = getGlobalOptions({})
    return resolveCircular(data, { resolveLinks, removeUnresolved })
  }

  /*
   * Switches BaseURL to use /environments path
   * */
  function switchToEnvironment(http: AxiosInstance): void {
    http.defaults.baseURL = getGlobalOptions().environmentBaseUrl
  }

  return <ContentfulClientApi>{
    // version: __VERSION__,
    version: 'test-0.0.0',
    getSpace: getSpace,
    getContentType: getContentType,
    getContentTypes: getContentTypes,

    getAsset: getAsset,
    getAssets: getAssets,

    getLocales: getLocales,
    parseEntries: parseEntries,
    sync: sync,

    getEntry: getEntry,
    getEntries: getEntries,

    localized: {
      getEntry: getLocalizedEntry,
      getEntries: getLocalizedEntries,
    },

    unresolved: {
      getEntry: getUnresolvedEntry,
      getEntries: getUnresolvedEntries,

      localized: {
        getEntry: getUnresolvedLocalizedEntry,
        getEntries: getUnresolvedLocalizedEntries,
      },
    },
  }
}
