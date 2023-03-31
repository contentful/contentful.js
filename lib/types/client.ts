import { ContentType, ContentTypeCollection } from './content-type'
import { Space } from './space'
import { LocaleCode, LocaleCollection } from './locale'
import { AssetsQueries, EntriesQueries, EntrySkeletonType, TagQueries } from './query'
import { SyncCollection, SyncQuery } from './sync'
import { Tag, TagCollection } from './tag'
import { AssetKey } from './asset-key'
import { AssetQueries, EntryQueries } from './query/query'
import { Entry, EntryCollection } from './entry'
import { Asset, AssetCollection, AssetFields } from './asset'

/**
 * Client chain modifiers used in all types that depend on the client configuration.
 * @category Client
 */
export type ChainModifiers =
  | 'WITH_ALL_LOCALES'
  | 'WITHOUT_LINK_RESOLUTION'
  | 'WITHOUT_UNRESOLVABLE_LINKS'
  | undefined

type AddChainModifier<
  Modifiers extends ChainModifiers,
  AddedModifiers extends Exclude<ChainModifiers, undefined>
> = undefined extends Modifiers ? AddedModifiers : Modifiers | AddedModifiers

/**
 * Contentful Delivery API Client. Contains methods which allow access to the different kinds of entities present in Contentful (Entries, Assets, etc).
 * @category Client
 * @typeParam Modifiers The chain modifiers used to configure the client.
 */
export type ContentfulClientApi<Modifiers extends ChainModifiers> = {
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

  /**
   * Gets an Entry
   * @param id - The entry’s ID
   * @param query - Object with search parameters. In this method it's only useful for `locale`.
   * @return Promise for an Entry
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
  getEntry<
    EntrySkeleton extends EntrySkeletonType = EntrySkeletonType,
    Locales extends LocaleCode = LocaleCode
  >(
    id: string,
    query?: EntryQueries<Modifiers>
  ): Promise<Entry<EntrySkeleton, Modifiers, Locales>>

  /**
   * Gets a collection of Entries
   * @param query - Object with search parameters. Check the <a href="https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/#retrieving-entries-with-search-parameters">JS SDK tutorial</a> and the <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters">REST API reference</a> for more details.
   * @return Promise for a collection of Entries
   * @example
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const response = await client.getEntries()
   * console.log(response.items)
   */
  getEntries<
    EntrySkeleton extends EntrySkeletonType = EntrySkeletonType,
    Locales extends LocaleCode = LocaleCode
  >(
    query?: EntriesQueries<EntrySkeleton, Modifiers>
  ): Promise<EntryCollection<EntrySkeleton, Modifiers, Locales>>

  /**
   * Parse raw json data into collection of entry objects.Links will be resolved also
   * @param data json data
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
  parseEntries<
    EntrySkeleton extends EntrySkeletonType = EntrySkeletonType,
    Locales extends LocaleCode = LocaleCode
  >(
    data: EntryCollection<
      EntrySkeleton,
      AddChainModifier<Modifiers, 'WITHOUT_LINK_RESOLUTION'>,
      Locales
    >
  ): EntryCollection<EntrySkeleton, Modifiers, Locales>

  /**
   * Gets an Asset
   * @param id
   * @param query - Object with search parameters. In this method it's only useful for `locale`.
   * @return Promise for an Asset
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
  getAsset<Locales extends LocaleCode = LocaleCode>(
    id: string,
    query?: AssetQueries<Modifiers>
  ): Promise<Asset<Modifiers, Locales>>

  /**
   * Gets a collection of Assets
   * @param query - Object with search parameters. Check the <a href="https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/#retrieving-entries-with-search-parameters">JS SDK tutorial</a> and the <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters">REST API reference</a> for more details.
   * @return Promise for a collection of Assets
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
  getAssets<Locales extends LocaleCode = LocaleCode>(
    query?: AssetsQueries<AssetFields, Modifiers>
  ): Promise<AssetCollection<Modifiers, Locales>>

  /**
   * A client that will fetch all locales. Only available if not already enabled.
   */
  withAllLocales: 'WITH_ALL_LOCALES' extends Modifiers
    ? never
    : ContentfulClientApi<AddChainModifier<Modifiers, 'WITH_ALL_LOCALES'>>

  /**
   * A client that will not resolve links. Only available if not already disabled.
   */
  withoutLinkResolution: 'WITHOUT_LINK_RESOLUTION' extends Modifiers
    ? never
    : 'WITHOUT_UNRESOLVABLE_LINKS' extends Modifiers
    ? never
    : ContentfulClientApi<AddChainModifier<Modifiers, 'WITHOUT_LINK_RESOLUTION'>>

  /**
   * A client that will remove unresolvable links. Only available if not already disabled.
   */
  withoutUnresolvableLinks: 'WITHOUT_LINK_RESOLUTION' extends Modifiers
    ? never
    : 'WITHOUT_UNRESOLVABLE_LINKS' extends Modifiers
    ? never
    : ContentfulClientApi<AddChainModifier<Modifiers, 'WITHOUT_UNRESOLVABLE_LINKS'>>

  /**
   * The current Contentful.js version
   */
  version: string
}
