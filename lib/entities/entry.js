import {cloneDeep} from 'lodash/lang'
import {uniq} from 'lodash/array'
import mixinToPlainObject from '../mixins/to-plain-object'
import mixinLinkGetters from '../mixins/link-getters'
import mixinStringifySafe from '../mixins/stringify-safe'

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
 * @prop {function(?function=, space=): Object} stringifySafe(replacer,space) - Stringifies the entry collection, accounting for circular references. Circular references will be replaced with just a Link object, with a <code>circular</code> property set to <code>true</code>. See <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify">MDN</a> and <a href="https://www.npmjs.com/package/json-stringify-safe">json-stringify-safe</a> for more details on the arguments this method can take.
 */

/**
 * Data is also mixed in with link getters if links exist and includes were requested
 * @private
 * @param {Object} data - Raw entry collection data
 * @return {EntryCollection} Wrapped entry collection data
 */
export function wrapEntryCollection (data, resolveLinks) {
  const wrappedData = mixinStringifySafe(mixinToPlainObject(cloneDeep(data)))
  if (resolveLinks) {
    const includes = prepareIncludes(wrappedData.includes, wrappedData.items)
    mixinLinkGetters(wrappedData.items, includes)
  }
  return Object.freeze(wrappedData)
}

function prepareIncludes (includes = {}, items) {
  includes.Entry = includes.Entry || []
  includes.Entry = uniq(includes.Entry.concat(cloneDeep(items)))
  return includes
}
