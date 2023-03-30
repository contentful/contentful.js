import { AddChainModifier, ChainModifiers } from '../utils/client-helpers'
import { ContentType, ContentTypeCollection } from './content-type'
import { Space } from './space'
import { LocaleCode, LocaleCollection } from './locale'
import { AssetQueries, EntriesQueries, EntrySkeletonType, TagQueries } from './query'
import { SyncCollection, SyncQuery } from './sync'
import { Tag, TagCollection } from './tag'
import { AssetKey } from './asset-key'
import { EntryQueries, LocaleOption } from './query/query'
import { Entry, EntryCollection } from './entry'
import { Asset, AssetCollection, AssetFields } from './asset'

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
  sync<
    EntrySkeleton extends EntrySkeletonType = EntrySkeletonType,
    Modifiers extends ChainModifiers = ChainModifiers,
    Locales extends LocaleCode = LocaleCode
  >(
    query: SyncQuery
  ): Promise<SyncCollection<EntrySkeleton, Modifiers, Locales>>

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
  getTags(query?: TagQueries): Promise<TagCollection>

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

type ClientMethodsWithAllLocales<Modifiers extends ChainModifiers> = {
  getEntry<
    EntrySkeleton extends EntrySkeletonType = EntrySkeletonType,
    Locales extends LocaleCode = LocaleCode
  >(
    id: string,
    query?: EntryQueries
  ): Promise<Entry<EntrySkeleton, Modifiers, Locales>>

  getEntries<
    EntrySkeleton extends EntrySkeletonType = EntrySkeletonType,
    Locales extends LocaleCode = LocaleCode
  >(
    query?: EntriesQueries<EntrySkeleton>
  ): Promise<EntryCollection<EntrySkeleton, Modifiers, Locales>>

  parseEntries<
    EntrySkeleton extends EntrySkeletonType = EntrySkeletonType,
    Locales extends LocaleCode = LocaleCode
  >(
    data: EntryCollection<EntrySkeleton, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', Locales>
  ): EntryCollection<EntrySkeleton, Modifiers, Locales>

  getAsset<Locales extends LocaleCode = LocaleCode>(
    id: string
  ): Promise<Asset<'WITH_ALL_LOCALES', Locales>>

  getAssets<Locales extends LocaleCode = LocaleCode>(
    query?: AssetQueries<AssetFields>
  ): Promise<AssetCollection<'WITH_ALL_LOCALES', Locales>>
}

type ClientMethodsWithoutAllLocales<Modifiers extends ChainModifiers> = {
  withAllLocales: ContentfulClientApi<AddChainModifier<Modifiers, 'WITH_ALL_LOCALES'>>
  getEntry<EntrySkeleton extends EntrySkeletonType = EntrySkeletonType>(
    id: string,
    query?: EntryQueries & LocaleOption
  ): Promise<Entry<EntrySkeleton, Modifiers>>

  getEntries<EntrySkeleton extends EntrySkeletonType = EntrySkeletonType>(
    query?: EntriesQueries<EntrySkeleton> & LocaleOption
  ): Promise<EntryCollection<EntrySkeleton, Modifiers>>

  parseEntries<EntrySkeleton extends EntrySkeletonType = EntrySkeletonType>(
    data: EntryCollection<EntrySkeleton, 'WITHOUT_LINK_RESOLUTION'>
  ): EntryCollection<EntrySkeleton, Modifiers>

  getAsset(id: string, query?: LocaleOption): Promise<Asset<undefined>>

  getAssets(query?: AssetQueries<AssetFields> & LocaleOption): Promise<AssetCollection<undefined>>
}

/**
 * @category Client
 */
export type ContentfulClientApi<Modifiers extends ChainModifiers> = BaseClient &
  ('WITHOUT_LINK_RESOLUTION' extends Modifiers
    ? // eslint-disable-next-line @typescript-eslint/ban-types
      {}
    : 'WITHOUT_UNRESOLVABLE_LINKS' extends Modifiers
    ? // eslint-disable-next-line @typescript-eslint/ban-types
      {}
    : {
        withoutLinkResolution: ContentfulClientApi<
          AddChainModifier<Modifiers, 'WITHOUT_LINK_RESOLUTION'>
        >
        withoutUnresolvableLinks: ContentfulClientApi<
          AddChainModifier<Modifiers, 'WITHOUT_UNRESOLVABLE_LINKS'>
        >
      }) &
  ('WITH_ALL_LOCALES' extends Modifiers
    ? ClientMethodsWithAllLocales<Modifiers>
    : ClientMethodsWithoutAllLocales<Modifiers>)
