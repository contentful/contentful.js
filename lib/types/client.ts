import type { ContentType, ContentTypeCollection } from './content-type.js'
import type { Space } from './space.js'
import type { LocaleCode, LocaleCollection } from './locale.js'
import type {
  AssetQueries,
  AssetsQueries,
  AssetsQueriesCursor,
  ConceptAncestorsDescendantsQueries,
  ConceptSchemesQueries,
  ConceptsQueries,
  EntriesQueries,
  EntriesQueriesCursor,
  EntryQueries,
  EntrySkeletonType,
  TagQueries,
} from './query/index.js'
import type { SyncCollection, SyncOptions, SyncQuery } from './sync.js'
import type { Tag, TagCollection } from './tag.js'
import type { AssetKey } from './asset-key.js'
import type { Entry, EntryCollection, EntryCursorPaginatedCollection } from './entry.js'
import type {
  Asset,
  AssetCollection,
  AssetCursorPaginatedCollection,
  AssetFields,
} from './asset.js'
import type { Concept, ConceptCollection } from './concept.js'
import type { ConceptScheme, ConceptSchemeCollection } from './concept-scheme.js'

/**
 * Client chain modifiers used in all types that depend on the client configuration.
 * @category Client
 * @internal
 */
export type ChainModifiers =
  | 'WITH_ALL_LOCALES'
  | 'WITHOUT_LINK_RESOLUTION'
  | 'WITHOUT_UNRESOLVABLE_LINKS'
  | undefined

/**
 * Adds a modifier to a list of client chain modifiers.
 * @category Client
 * @internal
 */
export type AddChainModifier<
  Modifiers extends ChainModifiers,
  AddedModifier extends Exclude<ChainModifiers, undefined>,
> = undefined extends Modifiers ? AddedModifier : Modifiers | AddedModifier

/**
 * Contentful Delivery API Client. Contains methods which allow access to the different kinds of entities present in Contentful (Entries, Assets, etc).
 * @category Client
 * @typeParam Modifiers - The chain modifiers used to configure the client. They’re set automatically when using the client chain modifiers.
 */
export interface ContentfulClientApi<Modifiers extends ChainModifiers> {
  /**
   * Fetches a content type
   * @param id - The content type’s ID
   * @returns Promise for a content type
   * @example
   * ```typescript
   * import * as contentful from 'contentful'
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
   * Fetches a collection of content types
   * @returns Promise for a collection of content types
   * @example
   * ```typescript
   * import * as contentful from 'contentful'
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
   * Fetches the space which the client is currently configured to use
   * @returns Promise for the space
   * @example
   * ```typescript
   * import * as contentful from 'contentful'
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const space = await client.getSpace()
   * console.log(space)
   * ```
   */
  getSpace(): Promise<Space>

  /**
   * Fetches a collection of locales
   * @returns Promise for a collection of locales
   * @example
   * ```typescript
   * import * as contentful from 'contentful'
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
   * Synchronizes either all the content or only new content since last sync.
   * <strong> Important note: </strong> The Sync API endpoint does not support include or link resolution.
   * However, contentful.js can do link resolution on the client side for the initial sync.
   * For the delta sync (using nextSyncToken) link resolution is not possible since the sdk won’t have access to all linked entities.
   * @param query - Query object
   * @param query.initial - Optional, unless first sync call
   * @param query.limit - Optional, sets the page size for the number of retrieved entries
   * @param query.nextSyncToken - Optional, used in subsequent sync calls
   * @param query.nextPageToken - Optional, used in subsequent sync calls
   * @param query.type - Optional, query for specific entities
   * @param query.content_type - Query for specific content types; optional,
   * unless `query.type` is defined as `Entry`
   * @param syncOptions
   * @param syncOptions.paginate - Configures the client to call the sync API recursively,
   * collecting all items from responses into one collection
   * @typeParam EntrySkeleton - Shape of entity fields used to calculate dynamic keys
   * @typeParam Modifiers - The chain modifiers used to configure the client. They’re set automatically when using the client chain modifiers.
   * @typeParam Locales - If provided for a client using `allLocales` modifier, response type defines locale keys for entity field values.
   * @see {@link https://www.contentful.com/developers/docs/concepts/sync/ | Documentation}
   * @see {@link https://www.contentful.com/developers/docs/javascript/tutorials/using-the-sync-api-with-js/ | Tutorial for using sync API}
   * @example
   * ```typescript
   * import * as contentful from 'contentful'
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
    Locales extends LocaleCode = LocaleCode,
  >(
    query: SyncQuery,
    syncOptions?: SyncOptions,
  ): Promise<SyncCollection<EntrySkeleton, Modifiers, Locales>>

  /**
   * Fetches a tag
   * @param id - The tag’s ID
   * @returns Promise for a tag
   * @example
   * ```typescript
   * import * as contentful from 'contentful'
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const tag = await client.getTag('<asset_id>')
   * console.log(tag)
   * ```
   */
  getTag(id: string): Promise<Tag>

  /**
   * Gets a collection of Tags
   * @returns Promise for a collection of tags
   * @example
   * ```typescript
   * import * as contentful from 'contentful'
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const response = await client.getTags()
   * console.log(response.items)
   * ```
   */
  getTags(query?: TagQueries): Promise<TagCollection>

  /**
   * Fetches a Concept
   * @param id - The concept’s ID
   * @returns Promise for a concept
   * @example
   * ```typescript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const concept = await client.getConcept('<concept_id>')
   * console.log(concept)
   * ```
   */
  getConcept<Locales extends LocaleCode>(id: string): Promise<Concept<Locales>>

  /**
   * Fetches a Concept Ancestors traversing the concept hierarchy by depth
   * @param id - The concept’s ID
   * @returns Promise for a concept
   * @example
   * ```typescript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const concept = await client.getConceptAncestors('<concept_id>', { depth: 5, order: 'sys.updatedAt' })
   * console.log(concept)
   * ```
   */
  getConceptAncestors<Locales extends LocaleCode>(
    id: string,
    query?: ConceptAncestorsDescendantsQueries,
  ): Promise<ConceptCollection<Locales>>

  /**
   * Fetches a Concept Descendants traversing the concept hierarchy by depth
   * @param id - The concept’s ID
   * @returns Promise for a concept
   * @example
   * ```typescript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const concept = await client.getConceptDescendants('<concept_id>', { depth: 5, order: 'sys.updatedAt' })
   * console.log(concept)
   * ```
   */
  getConceptDescendants<Locale extends LocaleCode>(
    id: string,
    query?: ConceptAncestorsDescendantsQueries,
  ): Promise<ConceptCollection<Locale>>

  /**
   * Fetches a collection of Concepts
   * @param query - Object with search parameters
   * @returns Promise for a collection of Concepts
   * @example
   * ```typescript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const response = await client.getConcepts()
   * console.log(response.items)
   * ```
   */
  getConcepts<Locales extends LocaleCode = 'en-US'>(
    query?: ConceptsQueries,
  ): Promise<ConceptCollection<Locales>>

  /**
   * Fetches a Concept Scheme
   * @param id - The concept scheme's ID
   * @returns Promise for a concept scheme
   * @example
   * ```typescript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const conceptScheme = await client.getConceptScheme('<concept_id>')
   * console.log(conceptScheme)
   * ```
   */
  getConceptScheme<Locales extends LocaleCode = 'en-US'>(
    id: string,
  ): Promise<ConceptScheme<Locales>>

  /**
   * Fetches a collection of Concept Schemes
   * @param query - Object with search parameters
   * @returns Promise for a collection of Concept Schemes
   * @example
   * ```typescript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const response = await client.getConceptSchemes()
   * console.log(response.items)
   * ```
   */
  getConceptSchemes<Locales extends LocaleCode = 'en-US'>(
    query?: ConceptSchemesQueries,
  ): Promise<ConceptSchemeCollection<Locales>>

  /**
   * Creates an asset key for signing asset URLs (Embargoed Assets)
   * @returns Promise for an asset key
   * @example
   * ```typescript
   * import * as contentful from 'contentful'
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const assetKey = await client.getAssetKey(<UNIX timestamp>)
   * console.log(assetKey)
   * ```
   */
  createAssetKey(expiresAt: number): Promise<AssetKey>

  /**
   * Fetches an entry
   * @param id - The entry’s ID
   * @param query - Object with search parameters. In this method it's only used for `locale` when querying.
   * @returns Promise for an entry
   * @typeParam EntrySkeleton - Shape of entry fields used to calculate dynamic keys
   * @typeParam Locales - If provided for a client using `allLocales` modifier, response type defines locale keys for entry field values.
   * @example
   * ```typescript
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
  getEntry<
    EntrySkeleton extends EntrySkeletonType = EntrySkeletonType,
    Locales extends LocaleCode = LocaleCode,
  >(
    id: string,
    query?: EntryQueries<Modifiers>,
  ): Promise<Entry<EntrySkeleton, Modifiers, Locales>>

  /**
   * Fetches a collection of Entries
   * @param query - Object with search parameters
   * @returns Promise for a collection of Entries
   * @typeParam EntrySkeleton - Shape of entry fields used to calculate dynamic keys
   * @typeParam Locales - If provided for a client using `allLocales` modifier, response type defines locale keys for entry field values.
   * @see {@link https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/#retrieving-entries-with-search-parameters | JS SDK tutorial}
   * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters | REST API reference}
   * @example
   * ```typescript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const response = await client.getEntries()
   * console.log(response.items)
   * ```
   */
  getEntries<
    EntrySkeleton extends EntrySkeletonType = EntrySkeletonType,
    Locales extends LocaleCode = LocaleCode,
  >(
    query?: EntriesQueries<EntrySkeleton, Modifiers>,
  ): Promise<EntryCollection<EntrySkeleton, Modifiers, Locales>>

  /**
   * Fetches a cursor paginated collection of Entries
   * @param pagination - Object with cursor pagination options
   * @param query - Object with search parameters
   * @returns Promise for a cursor paginated collection of Entries
   * @typeParam EntrySkeleton - Shape of entry fields used to calculate dynamic keys
   * @typeParam Locales - If provided for a client using `allLocales` modifier, response type defines locale keys for entry field values.
   * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/cursor-pagination | REST API cursor pagination reference}
   * @see {@link https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/#retrieving-entries-with-search-parameters | JS SDK tutorial}
   * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters | REST API reference}
   * @example
   * ```typescript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const response = await client.getEntriesCursor()
   * console.log(response.items)
   * ```
   */
  getEntriesCursor<
    EntrySkeleton extends EntrySkeletonType = EntrySkeletonType,
    Locales extends LocaleCode = LocaleCode,
  >(
    query?: EntriesQueriesCursor<EntrySkeleton, Modifiers>,
  ): Promise<EntryCursorPaginatedCollection<EntrySkeleton, Modifiers, Locales>>

  /**
   * Parse raw json data into a collection of entries. objects.Links will be resolved also
   * @param data - json data
   * @typeParam EntrySkeleton - Shape of entry fields used to calculate dynamic keys
   * @typeParam Locales - If provided for a client using `allLocales` modifier, response type defines locale keys for entry field values.
   * @example
   * ```typescript
   * const data = {items: [
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
   * const parsedData = client.parseEntries(data);
   * console.log( parsedData.items[0].fields.foo ); // foo
   * ```
   */
  parseEntries<
    EntrySkeleton extends EntrySkeletonType = EntrySkeletonType,
    Locales extends LocaleCode = LocaleCode,
  >(
    data: EntryCollection<
      EntrySkeleton,
      AddChainModifier<Modifiers, 'WITHOUT_LINK_RESOLUTION'>,
      Locales
    >,
  ): EntryCollection<EntrySkeleton, Modifiers, Locales>

  /**
   * Fetches an asset
   * @param id
   * @param query - Object with search parameters. In this method it's only useful for `locale`.
   * @returns Promise for an asset
   * @typeParam Locales - If provided for a client using `allLocales` modifier, response type defines locale keys for asset field values.
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
    query?: AssetQueries<Modifiers>,
  ): Promise<Asset<Modifiers, Locales>>

  /**
   * Fetches a collection of assets
   * @param query - Object with search parameters
   * @see {@link https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/#retrieving-entries-with-search-parameters | JS SDK tutorial}
   * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters | REST API reference}
   * @returns Promise for a collection of Assets
   * @typeParam Locales - If provided for a client using `allLocales` modifier, response type defines locale keys for asset field values.
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
    query?: AssetsQueries<AssetFields, Modifiers>,
  ): Promise<AssetCollection<Modifiers, Locales>>

  /**
   * Fetches a cursor paginated collection of assets
   * @param pagination - Object with cursor pagination options
   * @param query - Object with search parameters
   * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/cursor-pagination | REST API cursor pagination reference}
   * @see {@link https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/#retrieving-entries-with-search-parameters | JS SDK tutorial}
   * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters | REST API reference}
   * @returns Promise for a cursor paginated collection of Assets
   * @typeParam Locales - If provided for a client using `allLocales` modifier, response type defines locale keys for asset field values.
   * @example
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const response = await client.getAssetsCursor()
   * console.log(response.items)
   */
  getAssetsCursor<Locales extends LocaleCode = LocaleCode>(
    query?: AssetsQueriesCursor<AssetFields, Modifiers>,
  ): Promise<AssetCursorPaginatedCollection<Modifiers, Locales>>

  /**
   * A client that will fetch assets and entries with all locales. Only available if not already enabled.
   */
  withAllLocales: 'WITH_ALL_LOCALES' extends Modifiers
    ? never
    : ContentfulClientApi<AddChainModifier<Modifiers, 'WITH_ALL_LOCALES'>>

  /**
   * A client that will not resolve links in entries. Only available if not already disabled.
   */
  withoutLinkResolution: 'WITHOUT_LINK_RESOLUTION' extends Modifiers
    ? never
    : 'WITHOUT_UNRESOLVABLE_LINKS' extends Modifiers
      ? never
      : ContentfulClientApi<AddChainModifier<Modifiers, 'WITHOUT_LINK_RESOLUTION'>>

  /**
   * A client that will remove unresolvable links from entries. Only available if not already disabled.
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
