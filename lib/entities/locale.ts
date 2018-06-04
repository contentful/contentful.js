import { cloneDeep } from 'lodash'
import {toPlainObject, freezeSys} from 'contentful-sdk-core'
import { LocaleJSON, Locale, ContentfulCollectionResponse, ContentfulCollection } from '../interfaces';

/**
 * @memberof Entities
 * @typedef Locale
 * @prop {Entities.Sys} sys - Standard system metadata with additional entry specific properties
 * @prop {string} name - locale name (example: English)
 * @prop {string} code - locale code (example: en-US)
 * @prop {string} fallbackCode - the locale code to fallback to when there is not content for the current locale
 * @prop {boolean} default - If this is the default locale
 * @prop {boolean} optional - If the locale needs to be filled in on entries or not
 * @prop {function(): Object} toPlainObject() - Returns this Locale as a plain JS object
 */

/**
 * @memberof Entities
 * @typedef LocaleCollection
 * @prop {number} total
 * @prop {number} skip
 * @prop {number} limit
 * @prop {Array<Entities.Locale>} items
 * @prop {function(): Object} toPlainObject() - Returns this Locale collection as a plain JS object
 */

/**
 * @private
 * @param {Object} data - Raw locale collection data
 * @return {LocaleCollection} Wrapped locale collection data
 */
export function wrapLocaleCollection (data: ContentfulCollectionResponse<LocaleJSON>): ContentfulCollection<LocaleJSON> {
  return freezeSys(toPlainObject<ContentfulCollectionResponse<LocaleJSON>, ContentfulCollection<LocaleJSON>>(cloneDeep(data)))
}
