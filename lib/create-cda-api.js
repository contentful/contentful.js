/* @flow */

/**
 * Space type
 */
type Space = {
  sys: Object,
  name: string,
  locales: Array<Object>
}

type ContentType = {
  sys: Object,
  name: string,
  description: string,
  displayField: string,
  fields: Array<Object>
}

type ContentTypeCollection = {
  total: number,
  skip: number,
  limit: number,
  items: Array<ContentType>
}

type Entry = {
  sys: Object,
  fields: Object
}

type DeletedEntry = Entry

type EntryCollection = {
  total: number,
  skip: number,
  limit: number,
  items: Array<Entry>
}

type Asset = {
  sys: Object,
  fields: Object
}

type DeletedAsset = Asset

type AssetCollection = {
  total: number,
  skip: number,
  limit: number,
  items: Array<Asset>
}

type SyncCollection = {
  total: number,
  skip: number,
  limit: number,
  items: Array<Entry|Asset|DeletedEntry|DeletedAsset>
}

export type ContentfulClient = {
  getSpace: (id: string) => Promise,
  getContentType: (id: string) => Promise,
  getContentTypes: (query: Object) => Promise,
  getEntry: (id: string) => Promise,
  getEntries: (query: Object) => Promise,
  getAsset: (id: string) => Promise,
  getAssets: (query: Object) => Promise,
  sync: (query: Object) => Promise
}

function successHandler (response: Object) {
  return response.data
}

function errorHandler (error: Object) {
  throw error.data
}

function createRequestConfig ({query}: {query?: Object}) {
  const config = {}
  if (query) {
    config.params = query
  }
  return config
}

export default function createCdaApi (http: Object, shouldLinksResolve?: boolean): ContentfulClient {
  /**
   * Get a space by id
   */
  function getSpace (id: string): Promise<Space> {
    return http.get('')
    .then(successHandler, errorHandler)
  }

  /**
   * Get a Content Type by id
   */
  function getContentType (id: string): Promise<ContentType> {
    return http.get('content_types/' + id)
    .then(successHandler, errorHandler)
  }

  /**
   * Get all paginated Content Types or filter them with a query
   */
  function getContentTypes (query?: Object): Promise<ContentTypeCollection> {
    return http.get('content_types', createRequestConfig({query: query}))
    .then(successHandler, errorHandler)
  }

  /**
   * Get an Entry by id
   */
  function getEntry (id: string): Promise<Entry> {
    return http.get('entries/' + id)
    .then(successHandler, errorHandler)
  }

  /**
   * Get all Entries or filter them with a query
   */
  function getEntries (query?: Object): Promise<EntryCollection> {
    return http.get('entries', createRequestConfig({query: query}))
    .then(successHandler, errorHandler)
    .then(data => {
      data.items = shouldLinksResolve ? resolveLinks(data.items) : data.items
      return data
    })
  }

  /**
   * Get an Asset by id
   */
  function getAsset (id: string): Promise<Asset> {
    return http.get('assets/' + id)
    .then(successHandler, errorHandler)
  }

  /**
   * Get all Assets or filter them with a query
   */
  function getAssets (query?: Object): Promise<AssetCollection> {
    return http.get('assets', createRequestConfig({query: query}))
    .then(successHandler, errorHandler)
  }

  /**
   * Synchronize all the existing content (Entries and Assets) from a space,
   * from an initial state, or alternatively, synchronize only what content has
   * changed based on an existing sync token.
   */
  function sync (query: Object): Promise<SyncCollection> {
    return http.get('sync')
    .then(successHandler, errorHandler)
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
