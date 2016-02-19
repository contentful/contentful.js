/* @flow */
import {cloneDeep} from 'lodash/lang'
import type {Sys} from './sys'
import type {Field} from './field'
import mixinToPlainObject from '../mixins/to-plain-object'

type AssetResponse = {
  sys: Sys & {
    locale: string
  },
  fields: { [key: string]: Field }
}

/**
 * @memberof Entities
 * @typedef Asset
 * @prop {Entities.Sys} sys - Standard system metadata with additional entry specific properties
 * @prop {string=} sys.locale - If present, indicates the locale which this asset uses
 * @prop {Object} fields - Object with content for each field
 * @prop {string} fields.title - Title for this asset
 * @prop {string} fields.description - Description for this asset
 * @prop {Object} fields.file - File object for this asset
 * @prop {Object} fields.file.fileName - Name for the file
 * @prop {string} fields.file.contentType - Mime type for the file
 * @prop {string} fields.file.url - Url where the file is available at.
 * @prop {Object} fields.file.details - Details for the file, depending on file type (example: image size in bytes, etc)
 * @prop {function(): Object} toPlainObject() - Returns this Asset as a plain JS object
 */
export type Asset = {
  sys: Sys & {
    locale: string
  },
  fields: { [key: string]: Field },
  toPlainObject: () => Object
}

export type DeletedAsset = Asset

type AssetCollectionResponse = {
  total: number,
  skip: number,
  limit: number,
  items: Array<AssetResponse>
}

/**
 * @memberof Entities
 * @typedef AssetCollection
 * @prop {number} total
 * @prop {number} skip
 * @prop {number} limit
 * @prop {Array<Entities.Asset>} items
 * @prop {function(): Object} toPlainObject() - Returns this Asset collection as a plain JS object
 */
export type AssetCollection = {
  total: number,
  skip: number,
  limit: number,
  items: Array<Asset>,
  toPlainObject: () => Object
}

export function wrapAsset (data: AssetResponse): Asset {
  return Object.freeze(mixinToPlainObject(cloneDeep(data)))
}

export function wrapAssetCollection (data: AssetCollectionResponse): AssetCollection {
  return Object.freeze(mixinToPlainObject(cloneDeep(data)))
}
