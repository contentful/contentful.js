import copy from 'fast-copy'
import { toPlainObject, freezeSys } from 'contentful-sdk-core'

/**
 * @memberof Entities
 * @typedef ContentType
 * @prop {Entities.Sys} sys - System metadata
 * @prop {string} name
 * @prop {string} description
 * @prop {string} displayField - Field used as the main display field for Entries
 * @prop {string} Array<Field> - All the fields contained in this Content Type
 * @prop {function(): Object} toPlainObject() - Returns this Content Type as a plain JS object
 */

/**
 * @private
 * @param {Object} data - Raw content type data
 * @return {ContentType} Wrapped content type data
 */
export function wrapContentType (data) {
  return freezeSys(toPlainObject(copy(data)))
}

/**
 * @memberof Entities
 * @typedef ContentTypeCollection
 * @prop {number} total
 * @prop {number} skip
 * @prop {number} limit
 * @prop {Array<Entities.ContentType>} items
 * @prop {function(): Object} toPlainObject() - Returns this Content Type collection as a plain JS object
 */

/**
 * @private
 * @param {Object} data - Raw content type collection data
 * @return {ContentTypeCollection} Wrapped content type collection data
 */
export function wrapContentTypeCollection (data) {
  return freezeSys(toPlainObject(copy(data)))
}
