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
 * Asset type
 */
export type Asset = {
  sys: Sys & {
    locale: string
  },
  fields: { [key: string]: Field },
  toPlainObject: () => Object
}

/**
 * DeletedAsset type
 */
export type DeletedAsset = Asset

type AssetCollectionResponse = {
  total: number,
  skip: number,
  limit: number,
  items: Array<AssetResponse>
}
/**
 * AssetCollection type
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
