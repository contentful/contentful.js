/**
 * Contentful Delivery API Client. Contains methods which allow access to the
 * different kinds of entities present in Contentful (Entries, Assets, etc).
 */

import { encodeCPAResponse } from '@contentful/content-source-maps'
import type { AxiosInstance } from 'contentful-sdk-core'
import { createRequestConfig, errorHandler } from 'contentful-sdk-core'
import type { CreateClientParams } from './contentful.js'
import type { GetGlobalOptions } from './create-global-options.js'
import pagedSync from './paged-sync.js'
import type {
  Asset,
  AssetCollection,
  AssetKey,
  ContentfulClientApi,
  ContentType,
  ContentTypeCollection,
  LocaleCollection,
  Space,
  Tag,
  TagCollection,
  EntryCollection,
  SyncQuery,
  SyncOptions,
  EntrySkeletonType,
  LocaleCode,
} from './types/index.js'
import normalizeSearchParameters from './utils/normalize-search-parameters.js'
import normalizeSelect from './utils/normalize-select.js'
import resolveCircular from './utils/resolve-circular.js'
import getQuerySelectionSet from './utils/query-selection-set.js'
import validateTimestamp from './utils/validate-timestamp.js'
import type { ChainOptions, ModifiersFromOptions } from './utils/client-helpers.js'
import {
  checkIncludeContentSourceMapsParamIsAllowed,
  validateLocaleParam,
  validateRemoveUnresolvedParam,
  validateResolveLinksParam,
} from './utils/validate-params.js'
import validateSearchParameters from './utils/validate-search-parameters.js'

const ASSET_KEY_MAX_LIFETIME = 48 * 60 * 60

export interface CreateContentfulApiParams {
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

export default function createContentfulApi<OptionType extends ChainOptions>(
  { http, getGlobalOptions }: CreateContentfulApiParams,
  options?: OptionType,
): ContentfulClientApi<undefined> {
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

  function maybeEnableSourceMaps(query: Record<string, any> = {}): Record<string, any> {
    const params = http.httpClientParams as CreateClientParams
    const includeContentSourceMaps =
      params?.includeContentSourceMaps ?? params?.alphaFeatures?.includeContentSourceMaps

    const host = params?.host

    const areAllowed = checkIncludeContentSourceMapsParamIsAllowed(host, includeContentSourceMaps)

    if (areAllowed) {
      query.includeContentSourceMaps = true

      // Ensure that content source maps and required attributes are selected
      if (query.select) {
        const selection = getQuerySelectionSet(query)

        selection.add('sys')

        query.select = Array.from(selection).join(',')
      }
    }

    return query
  }

  function maybeEncodeCPAResponse(data: any, config: Record<string, any>): any {
    const includeContentSourceMaps = config?.params?.includeContentSourceMaps as boolean

    if (includeContentSourceMaps) {
      return encodeCPAResponse(data)
    }

    return data
  }

  async function get<T>({ context, path, config }: GetConfig): Promise<T> {
    const baseUrl = getBaseUrl(context)

    try {
      const response = await http.get(baseUrl + path, config)
      return maybeEncodeCPAResponse(response.data, config)
    } catch (error) {
      errorHandler(error)
    }
  }

  async function post<T>({ context, path, data, config }: PostConfig): Promise<T> {
    const baseUrl = getBaseUrl(context)
    try {
      const response = await http.post(baseUrl + path, data, config)
      return response.data
    } catch (error) {
      errorHandler(error)
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

  async function getEntry(id, query = {}) {
    return makeGetEntry(id, query, options)
  }

  async function getEntries(query = {}) {
    return makeGetEntries(query, options)
  }

  async function makeGetEntry<EntrySkeleton extends EntrySkeletonType>(
    id: string,
    query,
    options: ChainOptions = {
      withAllLocales: false,
      withoutLinkResolution: false,
      withoutUnresolvableLinks: false,
    },
  ) {
    const { withAllLocales } = options

    validateLocaleParam(query, withAllLocales as boolean)
    validateResolveLinksParam(query)
    validateRemoveUnresolvedParam(query)
    validateSearchParameters(query)

    return internalGetEntry<EntrySkeleton, any, Extract<ChainOptions, typeof options>>(
      id,
      withAllLocales ? { ...query, locale: '*' } : query,
      options,
    )
  }

  async function internalGetEntry<
    EntrySkeleton extends EntrySkeletonType,
    Locales extends LocaleCode,
    Options extends ChainOptions,
  >(id: string, query, options: Options) {
    if (!id) {
      throw notFoundError(id)
    }
    try {
      const response = await internalGetEntries<EntrySkeletonType<EntrySkeleton>, Locales, Options>(
        { 'sys.id': id, ...maybeEnableSourceMaps(query) },
        options,
      )
      if (response.items.length > 0) {
        return response.items[0]
      } else {
        throw notFoundError(id)
      }
    } catch (error) {
      errorHandler(error)
    }
  }

  async function makeGetEntries<EntrySkeleton extends EntrySkeletonType>(
    query,
    options: ChainOptions = {
      withAllLocales: false,
      withoutLinkResolution: false,
      withoutUnresolvableLinks: false,
    },
  ) {
    const { withAllLocales } = options

    validateLocaleParam(query, withAllLocales)
    validateResolveLinksParam(query)
    validateRemoveUnresolvedParam(query)
    validateSearchParameters(query)

    return internalGetEntries<EntrySkeleton, any, Extract<ChainOptions, typeof options>>(
      withAllLocales
        ? {
            ...query,
            locale: '*',
          }
        : query,
      options,
    )
  }

  async function internalGetEntries<
    EntrySkeleton extends EntrySkeletonType,
    Locales extends LocaleCode,
    Options extends ChainOptions,
  >(
    query: Record<string, any>,
    options: Options,
  ): Promise<EntryCollection<EntrySkeleton, ModifiersFromOptions<Options>, Locales>> {
    const { withoutLinkResolution, withoutUnresolvableLinks } = options

    try {
      const entries = await get({
        context: 'environment',
        path: 'entries',
        config: createRequestConfig({
          query: maybeEnableSourceMaps(normalizeSearchParameters(normalizeSelect(query))),
        }),
      })

      return resolveCircular(entries, {
        resolveLinks: !withoutLinkResolution,
        removeUnresolved: withoutUnresolvableLinks ?? false,
      })
    } catch (error) {
      errorHandler(error)
    }
  }

  async function getAsset(id: string, query: Record<string, any> = {}): Promise<Asset> {
    return makeGetAsset(id, query, options)
  }

  async function getAssets(query: Record<string, any> = {}): Promise<AssetCollection> {
    return makeGetAssets(query, options)
  }

  async function makeGetAssets(
    query: Record<string, any>,
    options: ChainOptions = {
      withAllLocales: false,
      withoutLinkResolution: false,
      withoutUnresolvableLinks: false,
    },
  ) {
    const { withAllLocales } = options

    validateLocaleParam(query, withAllLocales)
    validateSearchParameters(query)

    const localeSpecificQuery = withAllLocales ? { ...query, locale: '*' } : query

    return internalGetAssets<any, Extract<ChainOptions, typeof options>>(localeSpecificQuery)
  }

  async function internalGetAsset<Locales extends LocaleCode, Options extends ChainOptions>(
    id: string,
    query: Record<string, any>,
  ): Promise<Asset<ModifiersFromOptions<Options>, Locales>> {
    try {
      return get({
        context: 'environment',
        path: `assets/${id}`,
        config: createRequestConfig({ query: maybeEnableSourceMaps(normalizeSelect(query)) }),
      })
    } catch (error) {
      errorHandler(error)
    }
  }

  async function makeGetAsset(
    id: string,
    query: Record<string, any>,
    options: ChainOptions = {
      withAllLocales: false,
      withoutLinkResolution: false,
      withoutUnresolvableLinks: false,
    },
  ) {
    const { withAllLocales } = options

    validateLocaleParam(query, withAllLocales)
    validateSearchParameters(query)

    const localeSpecificQuery = withAllLocales ? { ...query, locale: '*' } : query

    return internalGetAsset<any, Extract<ChainOptions, typeof options>>(id, localeSpecificQuery)
  }

  async function internalGetAssets<Locales extends LocaleCode, Options extends ChainOptions>(
    query: Record<string, any>,
  ): Promise<AssetCollection<ModifiersFromOptions<Options>, Locales>> {
    try {
      return get({
        context: 'environment',
        path: 'assets',
        config: createRequestConfig({
          query: maybeEnableSourceMaps(normalizeSearchParameters(normalizeSelect(query))),
        }),
      })
    } catch (error) {
      errorHandler(error)
    }
  }

  async function getTag(id: string): Promise<Tag> {
    return get<Tag>({
      context: 'environment',
      path: `tags/${id}`,
    })
  }

  async function getTags(query = {}): Promise<TagCollection> {
    validateSearchParameters(query)

    return get<TagCollection>({
      context: 'environment',
      path: 'tags',
      config: createRequestConfig({ query: normalizeSearchParameters(normalizeSelect(query)) }),
    })
  }

  async function createAssetKey(expiresAt: number): Promise<AssetKey> {
    try {
      const now = Math.floor(Date.now() / 1000)
      const currentMaxLifetime = now + ASSET_KEY_MAX_LIFETIME
      validateTimestamp('expiresAt', expiresAt, { maximum: currentMaxLifetime, now })
    } catch (error) {
      errorHandler(error)
    }

    return post<AssetKey>({
      context: 'environment',
      path: 'asset_keys',
      data: { expiresAt },
    })
  }

  async function getLocales(query = {}): Promise<LocaleCollection> {
    validateSearchParameters(query)

    return get<LocaleCollection>({
      context: 'environment',
      path: 'locales',
      config: createRequestConfig({ query: normalizeSelect(query) }),
    })
  }

  async function sync<EntrySkeleton extends EntrySkeletonType = EntrySkeletonType>(
    query: SyncQuery,
    syncOptions: SyncOptions = { paginate: true },
  ) {
    return makePagedSync<EntrySkeleton>(query, syncOptions, options)
  }

  async function makePagedSync<EntrySkeleton extends EntrySkeletonType = EntrySkeletonType>(
    query: SyncQuery,
    syncOptions: SyncOptions,
    options: ChainOptions = {
      withAllLocales: false,
      withoutLinkResolution: false,
      withoutUnresolvableLinks: false,
    },
  ) {
    validateResolveLinksParam(query)
    validateRemoveUnresolvedParam(query)

    const combinedOptions = {
      ...syncOptions,
      ...options,
    }
    switchToEnvironment(http)
    return pagedSync<EntrySkeleton, any, Extract<ChainOptions, typeof options>>(
      http,
      query,
      combinedOptions,
    )
  }

  function parseEntries<EntrySkeleton extends EntrySkeletonType = EntrySkeletonType>(data) {
    return makeParseEntries<EntrySkeleton>(data, options)
  }

  function makeParseEntries<EntrySkeleton extends EntrySkeletonType>(
    data,
    options: ChainOptions = {
      withAllLocales: false,
      withoutLinkResolution: false,
      withoutUnresolvableLinks: false,
    },
  ) {
    return internalParseEntries<EntrySkeleton, any, Extract<ChainOptions, typeof options>>(
      data,
      options,
    )
  }

  function internalParseEntries<
    EntrySkeleton extends EntrySkeletonType,
    Locales extends LocaleCode,
    Options extends ChainOptions,
  >(
    data: unknown,
    options: Options,
  ): EntryCollection<EntrySkeleton, ModifiersFromOptions<Options>, Locales> {
    const { withoutLinkResolution, withoutUnresolvableLinks } = options

    return resolveCircular(data, {
      resolveLinks: !withoutLinkResolution,
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
  } as unknown as ContentfulClientApi<undefined>
}
