/* @flow */
import type {Sys} from './sys'
import type {Field} from './field'

/**
 * Asset type
 */
export type Asset = {
  sys: Sys & {
    locale: string
  },
  fields: { [key: string]: Field }
}

/**
 * DeletedAsset type
 */
export type DeletedAsset = Asset

/**
 * AssetCollection type
 */
export type AssetCollection = {
  total: number,
  skip: number,
  limit: number,
  items: Array<Asset>
}
