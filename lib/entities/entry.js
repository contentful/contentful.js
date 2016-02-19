/* @flow */
import {cloneDeep} from 'lodash/lang'
import type {Sys} from './sys'
import type {Link} from './link'
import type {Field} from './field'
import type {IncludesCollection} from '../responses'
import mixinToPlainObject from '../mixins/to-plain-object'
import mixinLinkGetters from '../mixins/link-getters'

type EntryResponse = {
  sys: Sys & {
    contentType: Link,
    locale: string
  },
  fields: { [key: string]: Field }
}

/**
 * @namespace Fields
 */

/**
 * @memberof Fields
 * @typedef Symbol
 * @type string
 */

/**
 * @memberof Fields
 * @typedef Text
 * @type string
 */

/**
 * @memberof Fields
 * @typedef Integer
 * @type number
 */

/**
 * @memberof Fields
 * @typedef Number
 * @type number
 */

/**
 * @memberof Fields
 * @typedef Date
 * @type string
 */

/**
 * @memberof Fields
 * @typedef Boolean
 * @type boolean
 */

/**
 * @memberof Fields
 * @typedef Location
 * @prop {string} lat - latitude
 * @prop {string} lon - longitude
 */

/**
 * @memberof Fields
 * @typedef Field
 * @type Fields.Symbol | Fields.Text | Fields.Integer | Fields.Number | Fields.Date | Fields.Boolean | Fields.Location | Entities.Link | Array<Fields.Symbol|Entities.Link> | Object
 */

/**
 * @memberof Entities
 * @typedef Entry
 * @prop {Entities.Sys} sys - Standard system metadata with additional entry specific properties
 * @prop {Entities.Link} sys.contentType - Content Type used by this Entry
 * @prop {string=} sys.locale - If present, indicates the locale which this entry uses
 * @prop {Object<Fields.Field>} fields - Object with content for each field
 * @prop {function(): Object} toPlainObject() - Returns this Entry as a plain JS object
 */
export type Entry = {
  sys: Sys & {
    contentType: Link,
    locale: string
  },
  fields: { [key: string]: Field },
  toPlainObject: () => Object
}

export type DeletedEntry = Entry

type EntryCollectionResponse = {
  total: number,
  skip: number,
  limit: number,
  items: Array<EntryResponse>,
  includes?: IncludesCollection
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
export type EntryCollection = {
  total: number,
  skip: number,
  limit: number,
  items: Array<Entry>,
  includes?: IncludesCollection,
  toPlainObject: () => Object
}

export function wrapEntry (data: EntryResponse): Entry {
  return Object.freeze(mixinToPlainObject(cloneDeep(data)))
}

export function wrapEntryCollection (data: EntryCollectionResponse, resolveLinks: boolean): EntryCollection {
  const wrappedData = mixinToPlainObject(cloneDeep(data))
  if (wrappedData.includes && resolveLinks) {
    mixinLinkGetters(wrappedData.items, wrappedData.includes)
  }
  return Object.freeze(wrappedData)
}
