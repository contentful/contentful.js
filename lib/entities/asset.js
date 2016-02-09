/* @flow */

/**
 * Asset type
 */
export type Asset = {
  sys: Object,
  fields: Object
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
