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

import { createRequestConfig } from 'contentful-sdk-core'
import pagedSync from './paged-sync'
import normalizeSelect from './utils/normalize-select'
import {resolveCircular} from "./utils/resolve-circular";

export interface Asset {
    sys: Sys;
    fields: {
        title: string;
        description: string;
        file: {
            url: string;
            details: {
                size: number;
                image?: {
                    width: number;
                    height: number;
                };
            };
            fileName: string;
            contentType: string;
        };
    };
}

export interface ContentfulCollection<T> {
    total: number;
    skip: number;
    limit: number;
    items: Array<T>;
}

export type AssetCollection = ContentfulCollection<Asset>

export interface Entry<T> {
    sys: Sys;
    fields: T;
    update(): Promise<Entry<T>>;
}

export interface EntryCollection<T> extends ContentfulCollection<Entry<T>> {
    errors?: Array<any>;
    includes?: any;
    stringifySafe(replacer?: any, space?: any): string;
}

export interface ContentType {
    sys: Sys;
    name: string;
    description: string;
    displayField: string;
    fields: Array<Field>;
}

export type ContentTypeCollection = ContentfulCollection<ContentType>;

export interface Locale {
    code: string
    name: string
    default: boolean
    fallbackCode: string | null
    sys: {
        id: string
        type: 'Locale'
        version: number
    }
}

export type LocaleCollection = ContentfulCollection<Locale>;

export interface SyncCollection {
    entries: Array<Entry<any>>;
    assets: Array<Asset>;
    deletedEntries: Array<Entry<any>>;
    deletedAssets: Array<Asset>;
    nextSyncToken: string;
    stringifySafe(replacer?: any, space?: any): string;
}

export interface Sys {
    type: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    revision?: number;
    space?: {
        sys: SpaceLink;
    };
    contentType: {
        sys: ContentTypeLink;
    };
}

export interface SpaceLink {
    type: 'Link';
    linkType: 'Space';
    id: string;
}

export interface ContentTypeLink {
    type: 'Link';
    linkType: 'ContentType';
    id: string;
}

export interface Field {
    disabled: boolean;
    id: string;
    linkType?: string;
    localized: boolean;
    name: string;
    omitted: boolean;
    required: boolean;
    type: FieldType;
    validations: FieldValidation[];
    items?: FieldItem;
}

export type FieldType = 'Symbol' | 'Text' | 'Integer' | 'Number' | 'Date' | 'Boolean' | 'Location' | 'Link' | 'Array' | 'Object' | 'RichText';

export interface FieldValidation {
    unique?: boolean;
    size?: {
        min?: number;
        max?: number;
    };
    regexp?: {
        pattern: string;
    };
    linkMimetypeGroup?: string[];
    in?: string[];
    linkContentType?: string[];
    message?: string;
    nodes?: {
        'entry-hyperlink'?: FieldValidation[];
        'embedded-entry-block'?: FieldValidation[];
        'embedded-entry-inline'?: FieldValidation[];
    };
    enabledNodeTypes?: string[];
}

export interface FieldItem {
    type: 'Link' | 'Symbol';
    validations: FieldValidation[];
    linkType?: 'Entry' | 'Asset';
}


/**
 * Types of fields found in an Entry
 */
export namespace EntryFields {
    export type Symbol = string;
    export type Text = string;
    export type Integer = number;
    export type Number = number;
    export type Date = string;
    export type Boolean = boolean;
    export interface Location {
        lat: string;
        lon: string;
    }
    export type Link<T> = Asset | Entry<T>;
    export type Array<T = any> = Symbol[] | Entry<T>[] | Asset[];
    export type Object<T = any> = T;
    export interface RichText {
        data:{};
        content: RichTextContent[];
        nodeType: 'document';
    }
}

interface RichTextDataTarget {
    sys: {
        id: string;
        type: "Link";
        "linkType": 'Entry' | 'Asset';
    };
}

interface RichTextData {
    uri?: string;
    target?: RichTextDataTarget;
}

type RichTextNodeType = 'text' | 'heading-1' | 'heading-2' | 'heading-3' | 'heading-4' | 'heading-5'
    | 'heading-6' | 'paragraph' | 'hyperlink' | 'entry-hyperlink' | 'asset-hyperlink'
    | 'unordered-list' | 'ordered-list' | 'list-item' | 'blockquote' | 'hr' | 'embedded-entry-block'
    | 'embedded-entry-inline';

interface RichTextContent {
    data: RichTextData;
    content?: RichTextContent[]
    marks: {type: ('bold' | 'underline' | 'code' | 'italic')}[];
    value?: string;
    nodeType: RichTextNodeType;
}


export interface Space {
    sys: Sys;
    name: string;
    locales: Array<string>;
}

export interface ContentfulClientApi {
    getAsset(id: string, query?: any): Promise<Asset>;
    getAssets(query?: any): Promise<AssetCollection>;
    getContentType(id: string): Promise<ContentType>;
    getContentTypes(query?: any): Promise<ContentTypeCollection>;
    getEntries<T>(query?: any): Promise<EntryCollection<T>>;
    getEntry<T>(id: string, query?: any): Promise<Entry<T>>;
    getSpace(): Promise<Space>;
    getLocales(): Promise<LocaleCollection>;
    parseEntries<T>(raw: any): Promise<EntryCollection<T>>;
    sync(query: any): Promise<SyncCollection>;
}

interface GetConfig {
    context: "space" | "environment";
    path: any;
    config?: any;
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
export default function createContentfulApi ({ http, getGlobalOptions }): ContentfulClientApi {
  const notFoundError = (id) => {
    const error = new Error('The resource could not be found.')
    /*
      error.sys = {
      type: 'Error',
      id: 'NotFound'
    }
    error.details = {
      type: 'Entry',
      id: id,
      environment: getGlobalOptions().environment,
      space: getGlobalOptions().space
    }
    */
    return error
  }

  // eslint-disable-next-line no-undef
  function errorHandler (error): never {
    if (error.data) {
      throw error.data
    }

    if (error.response && error.response.data) {
      throw error.response.data
    }

    throw error
  }

  async function get<T> ({ context, path, config }: GetConfig) : Promise<T> {
    if (context === 'space') {
      switchToSpace(http)
    } else if (context === 'environment') {
      switchToEnvironment(http)
    } else {
      throw new Error('unknown context ')
    }
    try {
      const response = await http.get(path, config)
      return response.data
    } catch (error) {
      errorHandler(error)
    }
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
   * const space = await client.getSpace()
   * console.log(space)
   */
  async function getSpace ():Promise<Space> {
    return get<Space>({ context: 'space', path: '' })
  }

  /**
   * Gets a Content Type
   * @memberof ContentfulClientAPI
   * @param  {string} id
   * @return {Promise<Entities.ContentType>} Promise for a Content Type
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
  async function getContentType (id): Promise<ContentType> {
    return get<ContentType>({
      context: 'environment',
      path: `content_types/${id}`
    })
  }

  /**
   * Gets a collection of Content Types
   * @memberof ContentfulClientAPI
   * @param  {Object=} query - Object with search parameters. Check the <a href="https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/#retrieving-entries-with-search-parameters">JS SDK tutorial</a> and the <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters">REST API reference</a> for more details.
   * @return {Promise<Entities.ContentTypeCollection>} Promise for a collection of Content Types
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
  async function getContentTypes (query = {}):Promise<ContentTypeCollection> {
    return get<ContentTypeCollection>({
      context: 'environment',
      path: 'content_types',
      config: createRequestConfig({ query: query })
    })
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
   * const entry = await client.getEntry('<entry_id>')
   * console.log(entry)
   */
  async function getEntry <T> (id, query = {}):Promise<Entry<T>> {
    if (!id) {
      throw notFoundError(id)
    }
    try {
      const response = await this.getEntries({ 'sys.id': id, ...query })
      if (response.items.length > 0) {
        return response.items[0]
      } else {
        throw notFoundError(id)
      }
    } catch (error) {
      errorHandler(error)
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
   * const response = await client.getEntries()
   * .console.log(response.items)
   */
  async function getEntries <T> (query = {}):Promise<EntryCollection<T>> {
    const { resolveLinks, removeUnresolved } = getGlobalOptions(query)
    try {
      const entries = await get({
        context: 'environment',
        path: 'entries',
        config: createRequestConfig({ query: normalizeSelect(query) })
      })
      return resolveCircular(entries, { resolveLinks, removeUnresolved })
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
  async function getAsset (id, query = {}): Promise<Asset> {
    return get<Asset>({
      context: 'environment',
      path: `assets/${id}`,
      config: createRequestConfig({ query: normalizeSelect(query) })
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
  async function getAssets (query = {}): Promise<AssetCollection> {
    return get<AssetCollection>({
      context: 'environment',
      path: 'assets',
      config: createRequestConfig({ query: normalizeSelect(query) })
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
  async function getLocales (query = {}):Promise<LocaleCollection> {
    return get<LocaleCollection>({
      context: 'environment',
      path: 'locales',
      config: createRequestConfig({ query: normalizeSelect(query) })
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
  async function sync (query = {}, options = { paginate: true }) {
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
  function parseEntries (data) {
    const { resolveLinks, removeUnresolved } = getGlobalOptions({})
    return resolveCircular(data, { resolveLinks, removeUnresolved })
  }

  /*
   * Switches BaseURL to use /environments path
   * */
  function switchToEnvironment (http): void {
    http.defaults.baseURL = getGlobalOptions().environmentBaseUrl
  }

  /*
   * Switches BaseURL to use /spaces path
   * */
  function switchToSpace (http): void {
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
