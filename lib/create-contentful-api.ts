/**
 * Contentful Delivery API Client. Contains methods which allow access to the
 * different kinds of entities present in Contentful (Entries, Assets, etc).
 */

import { AxiosError } from 'axios'
import { AxiosInstance, createRequestConfig, errorHandler } from 'contentful-sdk-core'
import { GetGlobalOptions } from './create-global-options'
import pagedSync from './paged-sync'
import {
  Asset,
  AssetCollection,
  AssetFields,
  AssetKey,
  AssetQueries,
  ContentType,
  ContentTypeCollection,
  EntriesQueries,
  EntryCollection,
  EntryWithoutLinkResolution,
  EntryCollectionWithoutLinkResolution,
  LocaleCollection,
  LocaleCode,
  EntryWithAllLocalesAndWithoutLinkResolution,
  EntryCollectionWithAllLocalesAndWithoutLinkResolution,
  EntryWithLinkResolution,
  EntryCollectionWithLinkResolution,
  EntryWithAllLocalesAndWithLinkResolution,
  EntryCollectionWithAllLocalesAndWithLinkResolution,
  Space,
  SyncCollection,
  Tag,
  TagCollection,
} from './types'
import { EntryQueries } from './types/query/query'
import { FieldsType } from './types/query/util'
import normalizeSelect from './utils/normalize-select'
import resolveCircular from './utils/resolve-circular'
import validateTimestamp from './utils/validate-timestamp'
import {
  ChainOptions,
  isClientWithAllLocalesAndWithLinkResolution,
  isClientWithAllLocalesAndWithoutLinkResolution,
  isClientWithLinkResolution,
  isClientWithoutLinkResolution,
} from './utils/client-helpers'

const ASSET_KEY_MAX_LIFETIME = 48 * 60 * 60

export interface ClientWithLinkResolution extends BaseClient {
  getEntry<Fields extends FieldsType>(
    id: string,
    query?: EntriesQueries<Fields>
  ): Promise<EntryWithLinkResolution<Fields>>
  getEntries<Fields extends FieldsType>(
    query?: EntriesQueries<Fields>
  ): Promise<EntryCollectionWithLinkResolution<Fields>>
  // TODO: think about using collection generic as response type:
  // ): Promise<Collection<EntryWithLinkResolution<Fields>>>
}
export interface ClientWithoutLinkResolution extends BaseClient {
  getEntry<Fields extends FieldsType>(
    id: string,
    query?: EntryQueries
  ): Promise<EntryWithoutLinkResolution<Fields>>
  getEntries<Fields extends FieldsType>(
    query?: EntriesQueries<Fields>
  ): Promise<EntryCollectionWithoutLinkResolution<Fields>>
}
export interface ClientWithAllLocalesAndWithLinkResolution
  extends Omit<BaseClient, 'getEntries' | 'getEntry'> {
  getEntry<Fields extends FieldsType = FieldsType, Locales extends LocaleCode = any>(
    id: string,
    query?: EntryQueries
  ): Promise<EntryWithAllLocalesAndWithLinkResolution<Fields, Locales>>
  getEntries<Fields extends FieldsType, Locales extends LocaleCode = string>(
    query?: EntriesQueries<Fields>
  ): Promise<EntryCollectionWithAllLocalesAndWithLinkResolution<Fields, Locales>>
}
export interface ClientWithAllLocalesAndWithoutLinkResolution
  extends Omit<BaseClient, 'getEntries' | 'getEntry'> {
  getEntry<Fields extends FieldsType, Locales extends LocaleCode = any>(
    id: string,
    query?: EntryQueries
  ): Promise<EntryWithAllLocalesAndWithoutLinkResolution<Fields, Locales>>
  getEntries<Fields extends FieldsType, Locales extends LocaleCode = string>(
    query?: EntriesQueries<Fields>
  ): Promise<EntryCollectionWithAllLocalesAndWithoutLinkResolution<Fields, Locales>>
}

export type DefaultClient = ClientWithLinkResolution

export interface BaseClient {
  version: string

  /**
   * Gets an Asset
   * @category API
   * @example
   * ```javascript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const asset = await client.getAsset('<asset_id>')
   * console.log(asset)
   * ```
   */
  getAsset(id: string): Promise<Asset>

  /**
   * Gets a collection of Assets
   * @category API
   * @example
   * ```javascript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const response = await client.getAssets()
   * console.log(response.items)
   * ```
   */
  getAssets(query?: AssetQueries<AssetFields>): Promise<AssetCollection>

  /**
   * Gets a Content Type
   * @category API
   * @example
   * ```javascript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const contentType = await client.getContentType('<content_type_id>')
   * console.log(contentType)
   * ```
   */
  getContentType(id: string): Promise<ContentType>

  /**
   * Gets a collection of Content Types
   * @category API
   * @example
   * ```javascript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const response = await client.getContentTypes()
   * console.log(response.items)
   * ```
   */
  // TODO: Reconfirm that getContentTypes doesn't take query param
  getContentTypes(): Promise<ContentTypeCollection>

  /**
   * Gets a collection of Entries
   * @category API
   * @example
   * ```javascript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const response = await client.getEntries()
   * .console.log(response.items)
   * ```
   */
  getEntries<Fields extends FieldsType>(
    query?: EntriesQueries<Fields>
  ): Promise<EntryCollectionWithLinkResolution<Fields>>

  /**
   * Gets an Entry
   * @category API
   * @example
   * ```javascript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const entry = await client.getEntry('<entry_id>')
   * console.log(entry)
   * ```
   */
  getEntry<Fields extends FieldsType>(
    id: string,
    query?: EntryQueries
  ): Promise<EntryWithLinkResolution<Fields>>

  /**
   * Gets the Space which the client is currently configured to use
   * @category API
   * @example
   * ```javascript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   * // returns the space object with the above <space-id>
   * const space = await client.getSpace()
   * console.log(space)
   * ```
   */
  getSpace(): Promise<Space>

  /**
   * Gets a collection of Locales
   * @category API
   * @example
   * ```javascript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const response = await client.getLocales()
   * console.log(response.items)
   * ```
   */

  getLocales(): Promise<LocaleCollection>

  /**
   * Parse raw json data into collection of entry objects. Link resolution depends on global configuration.
   * @category API
   * @example
   * ```javascript
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
   * ```
   */
  // TODO: type properly
  parseEntries<T>(raw: any): EntryCollection<T>

  /**
   * Synchronizes either all the content or only new content since last sync
   * See <a href="https://www.contentful.com/developers/docs/concepts/sync/">Synchronization</a> for more information.
   * <strong> Important note: </strong> The the sync api endpoint does not support include or link resolution.
   * However contentful.js is doing link resolution client side if you only make an initial sync.
   * For the delta sync (using nextSyncToken) it is not possible since the sdk wont have access to all the data to make such an operation.
   * @category API
   * @example
   * ```javascript
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
   * ```
   */
  sync(query: any): Promise<SyncCollection>

  /**
   * Gets a Tag
   * @category API
   * @example
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const tag = await client.getTag('<asset_id>')
   * console.log(tag)
   */
  getTag(id: string): Promise<Tag>

  /**
   * Gets a collection of Tags
   * @category API
   * @example
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const response = await client.getTags()
   * console.log(response.items)
   */
  // TODO type query
  getTags(query?: any): Promise<TagCollection>

  /**
   * Creates an asset key for signing asset URLs (Embargoed Assets)
   * @category API
   * @example
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const assetKey = await client.getAssetKey(<UNIX timestamp>)
   * console.log(assetKey)
   */
  createAssetKey(expiresAt: number): Promise<AssetKey>
}

export interface CreateContentfulApiParams {
  http: AxiosInstance
  getGlobalOptions: GetGlobalOptions
}

export type ContentfulClientApi = {
  withAllLocales: {
    withoutLinkResolution: ClientWithAllLocalesAndWithoutLinkResolution
  } & ClientWithAllLocalesAndWithLinkResolution
  withoutLinkResolution: {
    withAllLocales: ClientWithAllLocalesAndWithoutLinkResolution
  } & ClientWithoutLinkResolution
} & DefaultClient

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

export default function createContentfulApi<OptionType>(
  { http, getGlobalOptions }: CreateContentfulApiParams,
  options?: OptionType
): DefaultClient {
  const notFoundError = (id = 'unknown') => {
    return new NotFoundError(id, getGlobalOptions().environment, getGlobalOptions().space)
  }

  type Context = 'space' | 'environment'

  interface GetConfig {
    context: Context
    path: string
    config?: any
  }

  interface PostConfig extends GetConfig {
    data?: any
  }

  const getBaseUrl = (context: Context) => {
    let baseUrl =
      context === 'space' ? getGlobalOptions().spaceBaseUrl : getGlobalOptions().environmentBaseUrl

    if (!baseUrl) {
      throw new Error('Please define baseUrl for ' + context)
    }

    if (!baseUrl.endsWith('/')) {
      baseUrl += '/'
    }

    return baseUrl
  }

  async function get<T>({ context, path, config }: GetConfig): Promise<T> {
    const baseUrl = getBaseUrl(context)

    try {
      const response = await http.get(baseUrl + path, config)
      return response.data
    } catch (error) {
      errorHandler(error as AxiosError)
    }
  }

  async function post<T>({ context, path, data, config }: PostConfig): Promise<T> {
    const baseUrl = getBaseUrl(context)
    try {
      const response = await http.post(baseUrl + path, data, config)
      return response.data
    } catch (error) {
      errorHandler(error as AxiosError)
    }
  }

  async function getSpace(): Promise<Space> {
    return get<Space>({ context: 'space', path: '' })
  }

  async function getContentType(id: string): Promise<ContentType> {
    return get<ContentType>({
      context: 'environment',
      path: `content_types/${id}`,
    })
  }

  async function getContentTypes(): Promise<ContentTypeCollection> {
    return get<ContentTypeCollection>({
      context: 'environment',
      path: 'content_types',
      config: createRequestConfig({ query: {} }),
    })
  }

  async function getEntry<Fields>(id: string, query: EntriesQueries<Fields> = {}) {
    return makeGetEntry<Fields>(id, query, options) as unknown
  }

  async function getEntries<Fields>(query: EntriesQueries<Fields> = {}) {
    return makeGetEntries<Fields>(query, options) as unknown
  }

  // TODO Decide how we want to deal with defaults

  const getEntryDefault = getEntryWithLinkResolution

  const getEntriesDefault = getEntriesWithLinkResolution

  async function getEntryWithLinkResolution<Fields>(
    id: string,
    query: EntryQueries = {}
  ): Promise<EntryWithLinkResolution<Fields>> {
    return internalGetEntry<EntryWithLinkResolution<Fields>>(id, query, true)
  }

  async function getEntriesWithLinkResolution<Fields>(
    query: EntriesQueries<Fields> = {}
  ): Promise<EntryCollectionWithLinkResolution<Fields>> {
    return internalGetEntries<EntryCollectionWithLinkResolution<Fields>>(query, true)
  }

  async function getEntryWithAllLocalesAndWithLinkResolution<
    Fields,
    SpaceLocales extends LocaleCode = any
  >(
    id: string,
    query: EntryQueries = {}
  ): Promise<EntryWithAllLocalesAndWithLinkResolution<Fields, SpaceLocales>> {
    return internalGetEntry<EntryWithAllLocalesAndWithLinkResolution<Fields, SpaceLocales>>(
      id,
      { ...query, locale: '*' },
      true
    )
  }

  async function getEntriesWithAllLocalesAndWithLinkResolution<
    Fields,
    Locales extends LocaleCode = any
  >(
    query: EntriesQueries<Fields> = {}
  ): Promise<EntryCollectionWithAllLocalesAndWithLinkResolution<Fields, Locales>> {
    return internalGetEntries<EntryCollectionWithAllLocalesAndWithLinkResolution<Fields, Locales>>(
      { ...query, locale: '*' },
      true
    )
  }

  async function getEntryWithoutLinkResolution<Fields>(
    id: string,
    query: EntryQueries = {}
  ): Promise<EntryWithoutLinkResolution<Fields>> {
    return internalGetEntry<EntryWithoutLinkResolution<Fields>>(id, query, false)
  }

  async function getEntriesWithoutLinkResolution<Fields>(
    query: EntriesQueries<Fields> = {}
  ): Promise<EntryCollectionWithoutLinkResolution<Fields>> {
    return internalGetEntries<EntryCollectionWithoutLinkResolution<Fields>>(query, false)
  }

  async function getEntryWithAllLocalesAndWithoutLinkResolution<
    Fields,
    Locales extends LocaleCode = any
  >(
    id: string,
    query: EntryQueries = {}
  ): Promise<EntryWithAllLocalesAndWithoutLinkResolution<Fields, Locales>> {
    return internalGetEntry<EntryWithAllLocalesAndWithoutLinkResolution<Fields, Locales>>(
      id,
      { ...query, locale: '*' },
      false
    )
  }

  async function getEntriesWithAllLocalesAndWithoutLinkResolution<
    Fields,
    Locales extends LocaleCode = any
  >(
    query: EntriesQueries<Fields> = {}
  ): Promise<EntryCollectionWithAllLocalesAndWithoutLinkResolution<Fields, Locales>> {
    return internalGetEntries<
      EntryCollectionWithAllLocalesAndWithoutLinkResolution<Fields, Locales>
    >({ ...query, locale: '*' }, false)
  }

  async function makeGetEntry<Fields>(
    id: string,
    query,
    options: ChainOptions = {
      withoutLinkResolution: false,
      withAllLocales: false,
    }
  ) {
    if (isClientWithAllLocalesAndWithoutLinkResolution(options)) {
      return getEntryWithAllLocalesAndWithoutLinkResolution<Fields>(id, query)
    }
    if (isClientWithAllLocalesAndWithLinkResolution(options)) {
      return getEntryWithAllLocalesAndWithLinkResolution<Fields>(id, query)
    }
    if (isClientWithoutLinkResolution(options)) {
      return getEntryWithoutLinkResolution<Fields>(id, query)
    }
    if (isClientWithLinkResolution(options)) {
      return getEntryWithLinkResolution<Fields>(id, query)
    }
    return getEntryDefault<Fields>(id, query)
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
      errorHandler(error as AxiosError)
    }
  }

  async function makeGetEntries<Fields>(
    query,
    options: ChainOptions = {
      withoutLinkResolution: false,
      withAllLocales: false,
    }
  ) {
    if (isClientWithAllLocalesAndWithoutLinkResolution(options)) {
      return getEntriesWithAllLocalesAndWithoutLinkResolution<Fields>(query)
    }
    if (isClientWithAllLocalesAndWithLinkResolution(options)) {
      return getEntriesWithAllLocalesAndWithLinkResolution<Fields>(query)
    }
    if (isClientWithoutLinkResolution(options)) {
      return getEntriesWithoutLinkResolution<Fields>(query)
    }
    if (isClientWithLinkResolution(options)) {
      return getEntriesWithLinkResolution<Fields>(query)
    }
    return getEntriesDefault<Fields>(query)
  }

  async function internalGetEntries<RType>(
    query: Record<string, any>,
    resolveLinks = false
  ): Promise<RType> {
    const { removeUnresolved } = getGlobalOptions()
    try {
      const entries = await get({
        context: 'environment',
        path: 'entries',
        config: createRequestConfig({ query: normalizeSelect(query) }),
      })
      return resolveCircular(entries, { resolveLinks, removeUnresolved }) as RType
    } catch (error) {
      errorHandler(error as AxiosError)
    }
  }

  async function getAsset(id: string, query = {}): Promise<Asset> {
    return get<Asset>({
      context: 'environment',
      path: `assets/${id}`,
      config: createRequestConfig({ query: normalizeSelect(query) }),
    })
  }

  async function getAssets(query = {}): Promise<AssetCollection> {
    return get<AssetCollection>({
      context: 'environment',
      path: 'assets',
      config: createRequestConfig({ query: normalizeSelect(query) }),
    })
  }

  async function getTag(id: string): Promise<Tag> {
    return get<Tag>({
      context: 'environment',
      path: `tags/${id}`,
    })
  }

  async function getTags(query = {}): Promise<TagCollection> {
    return get<TagCollection>({
      context: 'environment',
      path: 'tags',
      config: createRequestConfig({ query: normalizeSelect(query) }),
    })
  }

  async function createAssetKey(expiresAt: number): Promise<AssetKey> {
    try {
      const now = Math.floor(Date.now() / 1000)
      const currentMaxLifetime = now + ASSET_KEY_MAX_LIFETIME
      validateTimestamp('expiresAt', expiresAt, { maximum: currentMaxLifetime, now })
    } catch (error) {
      errorHandler(error as AxiosError)
    }

    return post<AssetKey>({
      context: 'environment',
      path: 'asset_keys',
      data: { expiresAt },
    })
  }
  async function getLocales(query = {}): Promise<LocaleCollection> {
    return get<LocaleCollection>({
      context: 'environment',
      path: 'locales',
      config: createRequestConfig({ query: normalizeSelect(query) }),
    })
  }

  async function sync(query = {}, options = { paginate: true }) {
    const { resolveLinks, removeUnresolved } = getGlobalOptions(query)
    switchToEnvironment(http)
    return pagedSync(http, query, { resolveLinks, removeUnresolved, ...options })
  }

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

  return <DefaultClient>{
    version: __VERSION__,

    getSpace,

    getContentType,
    getContentTypes,

    getAsset,
    getAssets,

    getTag,
    getTags,

    getLocales,
    parseEntries,
    sync,

    getEntry,
    getEntries,

    createAssetKey,
  }
}
