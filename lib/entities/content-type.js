import {typeCheck} from '../type-check'
import {cloneDeep} from 'lodash/lang'
import Sys from './sys'
import mixinToPlainObject from '../mixins/to-plain-object'

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
const ContentType = `{
  sys: ${Sys},
  name: String,
  description: String,
  displayField: String,
  fields: [
    {
      id: String,
      name: String,
      type: String,
      localized: Boolean,
      required: Boolean
    }
  ]
}`

/**
 * @private
 * @param {Object} data - Raw content type data
 * @return {ContentType} Wrapped content type data
 */
export function wrapContentType (data) {
  typeCheck(ContentType, data)
  return Object.freeze(mixinToPlainObject(cloneDeep(data)))
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
const ContentTypeCollection = `{
  total: Number,
  skip: Number,
  limit: Number,
  items: [${ContentType}]
}`

/**
 * @private
 * @param {Object} data - Raw content type collection data
 * @return {ContentTypeCollection} Wrapped content type collection data
 */
export function wrapContentTypeCollection (data) {
  typeCheck(ContentTypeCollection, data)
  return Object.freeze(mixinToPlainObject(cloneDeep(data)))
}
