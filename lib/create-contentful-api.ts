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
  AssetCollectionWithAllLocales,
  AssetWithAllLocales,
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
  EntryWithLinkResolutionAndWithUnresolvableLinks,
  EntryCollectionWithLinkResolutionAndWithUnresolvableLinks,
  EntryWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks,
  EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks,
  EntryWithLinkResolutionAndWithoutUnresolvableLinks,
  EntryCollectionWithLinkResolutionAndWithoutUnresolvableLinks,
  EntryWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks,
  EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks,
  Space,
  SyncCollection,
  Tag,
  TagCollection,
  ConfiguredAssetCollection,
  ConfiguredAsset,
  GenericAssetCollection,
  GenericAsset,
  ConfiguredEntryCollection,
} from './types'
import { EntryQueries } from './types/query/query'
import { FieldsType } from './types/query/util'
import normalizeSelect from './utils/normalize-select'
import resolveCircular from './utils/resolve-circular'
import validateTimestamp from './utils/validate-timestamp'
import { ChainOptions } from './utils/client-helpers'
import { validateLocaleParam, validateResolveLinksParam } from './utils/validate-params'

const ASSET_KEY_MAX_LIFETIME = 48 * 60 * 60

export type ClientWithLinkResolutionAndWithUnresolvableLinks = BaseClient &
  BaseClientWithAssets & {
    withAllLocales: ClientWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks
    withoutLinkResolution: ClientWithoutLinkResolution
    withoutUnresolvableLinks: ClientWithLinkResolutionAndWithoutUnresolvableLinks

    getEntry<Fields extends FieldsType>(
      id: string,
      query?: EntryQueries
    ): Promise<EntryWithLinkResolutionAndWithUnresolvableLinks<Fields>>

    getEntries<Fields extends FieldsType>(
      query?: EntriesQueries<Fields>
    ): Promise<EntryCollectionWithLinkResolutionAndWithUnresolvableLinks<Fields>>

    // TODO: think about using collection generic as response type:
    // ): Promise<Collection<EntryWithLinkResolution<Fields>>>

    parseEntries<Fields extends FieldsType>(
      data: EntryCollection<Fields>
    ): Promise<EntryCollectionWithLinkResolutionAndWithUnresolvableLinks<Fields>>
  }

export type ClientWithoutLinkResolution = BaseClient &
  BaseClientWithAssets & {
    withAllLocales: ClientWithAllLocalesAndWithoutLinkResolution
    getEntry<Fields extends FieldsType>(
      id: string,
      query?: EntryQueries
    ): Promise<EntryWithoutLinkResolution<Fields>>

    getEntries<Fields extends FieldsType>(
      query?: EntriesQueries<Fields>
    ): Promise<EntryCollectionWithoutLinkResolution<Fields>>

    parseEntries<Fields extends FieldsType>(
      data: EntryCollection<Fields>
    ): Promise<EntryCollectionWithoutLinkResolution<Fields>>
  }

export type ClientWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks = BaseClient &
  BaseClientWithAssetsWithAllLocales & {
    withoutLinkResolution: ClientWithAllLocalesAndWithoutLinkResolution
    withoutUnresolvableLinks: ClientWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks
    getEntry<Fields extends FieldsType = FieldsType, Locales extends LocaleCode = LocaleCode>(
      id: string,
      query?: EntryQueries & { locale?: never }
    ): Promise<EntryWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<Fields, Locales>>

    getEntries<Fields extends FieldsType, Locales extends LocaleCode = LocaleCode>(
      query?: EntriesQueries<Fields> & { locale?: never }
    ): Promise<
      EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<Fields, Locales>
    >

    parseEntries<Fields extends FieldsType, Locales extends LocaleCode = LocaleCode>(
      data: EntryCollection<Fields>
    ): Promise<
      EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<Fields, Locales>
    >
  }

export type ClientWithAllLocalesAndWithoutLinkResolution = BaseClient &
  BaseClientWithAssetsWithAllLocales & {
    getEntry<Fields extends FieldsType, Locales extends LocaleCode = LocaleCode>(
      id: string,
      query?: EntryQueries & { locale?: never }
    ): Promise<EntryWithAllLocalesAndWithoutLinkResolution<Fields, Locales>>

    getEntries<Fields extends FieldsType, Locales extends LocaleCode = LocaleCode>(
      query?: EntriesQueries<Fields> & { locale?: never }
    ): Promise<EntryCollectionWithAllLocalesAndWithoutLinkResolution<Fields, Locales>>

    parseEntries<Fields extends FieldsType, Locales extends LocaleCode = LocaleCode>(
      data: EntryCollection<Fields>
    ): Promise<EntryCollectionWithAllLocalesAndWithoutLinkResolution<Fields, Locales>>
  }

export type ClientWithLinkResolutionAndWithoutUnresolvableLinks = BaseClient &
  BaseClientWithAssets & {
    withAllLocales: ClientWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks
    getEntry<Fields extends FieldsType>(
      id: string,
      query?: EntryQueries
    ): Promise<EntryWithLinkResolutionAndWithoutUnresolvableLinks<Fields>>

    getEntries<Fields extends FieldsType>(
      query?: EntriesQueries<Fields>
    ): Promise<EntryCollectionWithLinkResolutionAndWithoutUnresolvableLinks<Fields>>

    parseEntries<Fields extends FieldsType>(
      data: EntryCollection<Fields>
    ): Promise<EntryCollectionWithLinkResolutionAndWithoutUnresolvableLinks<Fields>>
  }

export type ClientWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks = BaseClient &
  BaseClientWithAssetsWithAllLocales & {
    getEntry<Fields extends FieldsType, Locales extends LocaleCode = any>(
      id: string,
      query?: EntryQueries & { locale?: never }
    ): Promise<EntryWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<Fields, Locales>>

    getEntries<Fields extends FieldsType, Locales extends LocaleCode = any>(
      query?: EntriesQueries<Fields> & { locale?: never }
    ): Promise<
      EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<Fields, Locales>
    >

    parseEntries<Fields extends FieldsType, Locales extends LocaleCode = LocaleCode>(
      data: EntryCollection<Fields>
    ): Promise<
      EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<Fields, Locales>
    >
  }

export type DefaultClient = ClientWithLinkResolutionAndWithUnresolvableLinks

interface BaseClient {
  version: string

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
  getContentTypes(query?: { query?: string }): Promise<ContentTypeCollection>

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

interface BaseClientWithAssets extends BaseClient {
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
  getAsset(id: string, query?: { locale?: string }): Promise<Asset>

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
}

interface BaseClientWithAssetsWithAllLocales extends BaseClient {
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
  getAsset<Locale extends LocaleCode>(
    id: string,
    query?: { locale?: string }
  ): Promise<AssetWithAllLocales<Locale>>

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
  getAssets<Locale extends LocaleCode>(
    query?: AssetQueries<AssetFields>
  ): Promise<AssetCollectionWithAllLocales<Locale>>
}

export interface CreateContentfulApiParams {
  http: AxiosInstance
  getGlobalOptions: GetGlobalOptions
}

export type ContentfulClientApi = DefaultClient

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

export default function createContentfulApi<OptionType extends ChainOptions>(
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

  async function getContentTypes(query: { query?: string } = {}): Promise<ContentTypeCollection> {
    return get<ContentTypeCollection>({
      context: 'environment',
      path: 'content_types',
      config: createRequestConfig({ query }),
    })
  }

  async function getEntry<Fields extends FieldsType>(id: string, query: EntryQueries = {}) {
    return makeGetEntry<Fields>(id, query, options)
  }

  async function getEntries<Fields extends FieldsType>(query: EntriesQueries<Fields> = {}) {
    return makeGetEntries<Fields>(query, options)
  }

  async function makeGetEntry<Fields extends FieldsType>(
    id: string,
    query,
    options: ChainOptions = {
      withAllLocales: false,
      withoutLinkResolution: false,
      withoutUnresolvableLinks: false,
    }
  ) {
    const { withAllLocales } = options

    validateLocaleParam(query, withAllLocales as boolean)
    validateResolveLinksParam(query)

    return internalGetEntry<Fields, any, Extract<ChainOptions, typeof options>>(
      id,
      withAllLocales ? { ...query, locale: '*' } : query,
      options
    )
  }

  async function internalGetEntry<
    Fields extends FieldsType,
    Locales extends LocaleCode,
    Options extends ChainOptions
  >(id: string, query, options: Options) {
    if (!id) {
      throw notFoundError(id)
    }
    try {
      const response = await internalGetEntries<Fields, Locales, Options>(
        { 'sys.id': id, ...query },
        options
      )
      if (response.items.length > 0) {
        return response.items[0]
      } else {
        throw notFoundError(id)
      }
    } catch (error) {
      errorHandler(error as AxiosError)
    }
  }

  async function makeGetEntries<Fields extends FieldsType>(
    query,
    options: ChainOptions = {
      withAllLocales: false,
      withoutLinkResolution: false,
      withoutUnresolvableLinks: false,
    }
  ) {
    const { withAllLocales } = options

    validateLocaleParam(query, withAllLocales)
    validateResolveLinksParam(query)

    return internalGetEntries<Fields, any, Extract<ChainOptions, typeof options>>( /// add a to do to the doc
      withAllLocales
        ? {
            ...query,
            locale: '*',
          }
        : query,
      options
    )
  }

  async function internalGetEntries<
    Fields extends FieldsType,
    Locales extends LocaleCode,
    Options extends ChainOptions
  >(
    query: Record<string, any>,
    options: Options
  ): Promise<ConfiguredEntryCollection<Fields, Locales, Options>> {
    const { withoutLinkResolution, withoutUnresolvableLinks } = options

    try {
      const entries = await get({
        context: 'environment',
        path: 'entries',
        config: createRequestConfig({ query: normalizeSelect(query) }),
      })

      // console.dir(entries, { depth: 10 })

      return resolveCircular(entries, {
        resolveLinks: !withoutLinkResolution ?? true,
        removeUnresolved: withoutUnresolvableLinks ?? false,
      })
    } catch (error) {
      errorHandler(error as AxiosError)
    }
  }

  async function getAsset(id: string, query: Record<string, any> = {}): Promise<GenericAsset<any>> {
    return makeGetAsset(id, query, options)
  }

  async function getAssets(query: Record<string, any> = {}): Promise<GenericAssetCollection<any>> {
    return makeGetAssets(query, options)
  }

  async function makeGetAssets(
    query: Record<string, any>,
    options: ChainOptions = {
      withAllLocales: false,
      withoutLinkResolution: false,
      withoutUnresolvableLinks: false,
    }
  ) {
    const { withAllLocales } = options

    validateLocaleParam(query, withAllLocales)

    const localeSpecificQuery = withAllLocales ? { ...query, locale: '*' } : query

    return internalGetAssets<any, Extract<ChainOptions, typeof options>>(localeSpecificQuery)
  }

  async function internalGetAsset<Locales extends LocaleCode, Options extends ChainOptions>(
    id: string,
    query: Record<string, any>
  ): Promise<ConfiguredAsset<Locales, Options>> {
    try {
      return get({
        context: 'environment',
        path: `assets/${id}`,
        config: createRequestConfig({ query: normalizeSelect(query) }),
      })
    } catch (error) {
      errorHandler(error as AxiosError)
    }
  }

  async function makeGetAsset(
    id: string,
    query: Record<string, any>,
    options: ChainOptions = {
      withAllLocales: false,
      withoutLinkResolution: false,
      withoutUnresolvableLinks: false,
    }
  ) {
    const { withAllLocales } = options

    validateLocaleParam(query, withAllLocales)

    const localeSpecificQuery = withAllLocales ? { ...query, locale: '*' } : query

    return internalGetAsset<any, Extract<ChainOptions, typeof options>>(id, localeSpecificQuery)
  }

  async function internalGetAssets<Locales extends LocaleCode, Options extends ChainOptions>(
    query: Record<string, any>
  ): Promise<ConfiguredAssetCollection<Locales, Options>> {
    try {
      return get({
        context: 'environment',
        path: 'assets',
        config: createRequestConfig({ query: normalizeSelect(query) }),
      })
    } catch (error) {
      errorHandler(error as AxiosError)
    }
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

  function parseEntries<Fields extends FieldsType = FieldsType>(data: EntryCollection<Fields>) {
    return makeParseEntries<Fields>(data, options)
  }

  async function makeParseEntries<Fields extends FieldsType>(
    data,
    options: ChainOptions = {
      withAllLocales: false,
      withoutLinkResolution: false,
      withoutUnresolvableLinks: false,
    }
  ) {
    console.log(options)
    const { withoutLinkResolution, withoutUnresolvableLinks } = options

    return internalParseEntries<Fields, any, Extract<ChainOptions, typeof options>>(data, options)
  }

  async function internalParseEntries<
    Fields extends FieldsType,
    Locales extends LocaleCode,
    Options extends ChainOptions
  >(data: unknown, options: Options): Promise<ConfiguredEntryCollection<Fields, Locales, Options>> {
    const { withoutLinkResolution, withoutUnresolvableLinks } = options

    return resolveCircular(data, {
      resolveLinks: !withoutLinkResolution ?? true,
      removeUnresolved: withoutUnresolvableLinks ?? false,
    })
  }

  /*
   * Switches BaseURL to use /environments path
   * */
  function switchToEnvironment(http: AxiosInstance): void {
    http.defaults.baseURL = getGlobalOptions().environmentBaseUrl
  }

  return {
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
  } as unknown as DefaultClient
}
