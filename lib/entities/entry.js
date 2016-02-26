import {cloneDeep} from 'lodash/lang'
import mixinToPlainObject from '../mixins/to-plain-object'
import mixinLinkGetters from '../mixins/link-getters'

/**
 * @memberof Entities
 * @typedef Entry
 * @prop {Entities.Sys} sys - Standard system metadata with additional entry specific properties
 * @prop {Entities.Link} sys.contentType - Content Type used by this Entry
 * @prop {string=} sys.locale - If present, indicates the locale which this entry uses
 * @prop {Object<EntryFields.Field>} fields - Object with content for each field
 * @prop {function(): Object} toPlainObject() - Returns this Entry as a plain JS object
 */

/**
 * @private
 * @param {Object} data - Raw entry data
 * @return {Entry} Wrapped entry data
 */
export function wrapEntry (data) {
  return Object.freeze(mixinToPlainObject(cloneDeep(data)))
}

/**
 * @memberof Entities
 * @typedef EntryCollection
 * @prop {number} total
 * @prop {number} skip
 * @prop {number} limit
 * @prop {Array<Entities.Entry>} items
 * @prop {function(): Object} toPlainObject() - Returns this Entry collection as a plain JS object
 */

/**
 * Data is also mixed in with link getters if links exist and includes were requested
 * @private
 * @param {Object} data - Raw entry collection data
 * @return {EntryCollection} Wrapped entry collection data
 */
export function wrapEntryCollection (data, resolveLinks) {
  const wrappedData = mixinToPlainObject(cloneDeep(data))
  if (wrappedData.includes && resolveLinks) {
    mixinLinkGetters(wrappedData.items, wrappedData.includes)
  }
  return Object.freeze(wrappedData)
}
