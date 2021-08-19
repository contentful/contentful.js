import copy from 'fast-copy'
import { toPlainObject, freezeSys } from 'contentful-sdk-core'

/**
 * @memberof Entities
 * @typedef AssetKey
 * @prop {string} policy - The asset key's policy
 * @prop {string} secret - The secret for creating a signing token
 * @prop {function(): Object} toPlainObject() - Returns this AssetKey as a plain JS object
 */

/**
 * @private
 * @param {Object} data - Raw asset key data
 * @return {Asset} Wrapped asset key data
 */
export function wrapAssetKey (data) {
  return freezeSys(toPlainObject(copy(data)))
}
