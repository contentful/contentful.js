/* @flow */

// To understand why axios is vendored, check SETUP.md
// import axios from '../vendor/axios'

type ClientParams = {
  space: string,
  accessToken: string,
  secure?: boolean,
  host?: string,
  resolveLinks?: boolean,
  agent?: Object
}

type ContentfulClient = {
  getSpace: Function,
  getContentType: Function,
  getContentTypes: Function,
  getEntry: Function,
  getEntries: Function,
  getAsset: Function,
  getAssets: Function,
  sync: Function
}

/**
 * The contentful client
 */
function createClient (params: ClientParams) : ContentfulClient {
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

/**
 * Get a space by id
 */
function getSpace (id: string): Promise {
  return Promise.resolve('empty')
}

/**
 * Get a Content Type by id
 */
function getContentType (id: string): Promise {
  return Promise.resolve('empty')
}

/**
 * Get all paginated Content Types or filter them with a query
 */
function getContentTypes (query?: Object): Promise {
  return Promise.resolve('empty')
}

/**
 * Get an Entry by id
 */
function getEntry (id: string): Promise {
  return Promise.resolve('empty')
}

/**
 * Get all Entries or filter them with a query
 */
function getEntries (query?: Object): Promise {
  return Promise.resolve('empty')
}

/**
 * Get an Asset by id
 */
function getAsset (id: string): Promise {
  return Promise.resolve('empty')
}

/**
 * Get all Assets or filter them with a query
 */
function getAssets (query?: Object): Promise {
  return Promise.resolve('empty')
}

/**
 * Synchronize all the existing content (Entries and Assets) from a space,
 * from an initial state, or alternatively, synchronize only what content has
 * changed based on an existing sync token.
 */
function sync (query: Object): Promise {
  return Promise.resolve('empty')
}

export default {
  createClient: createClient
}
