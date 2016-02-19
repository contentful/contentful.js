/* @flow */

import {cloneDeep} from 'lodash/lang'
import type {Sys} from './sys'
import mixinToPlainObject from '../mixins/to-plain-object'

type FieldDefinition = {
  id: string,
  name: string,
  type: string,
  localized: boolean,
  required: boolean
}

type ContentTypeResponse = {
  sys: Sys,
  name: string,
  description: string,
  displayField: string,
  fields: Array<FieldDefinition>
}

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
export type ContentType = {
  sys: Sys,
  name: string,
  description: string,
  displayField: string,
  fields: Array<FieldDefinition>,
  toPlainObject: () => Object
}

type ContentTypeCollectionResponse = {
  total: number,
  skip: number,
  limit: number,
  items: Array<ContentTypeResponse>
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
export type ContentTypeCollection = {
  total: number,
  skip: number,
  limit: number,
  items: Array<ContentType>,
  toPlainObject: () => Object
}

export function wrapContentType (data: ContentTypeResponse): ContentType {
  return Object.freeze(mixinToPlainObject(cloneDeep(data)))
}

export function wrapContentTypeCollection (data: ContentTypeCollectionResponse): ContentTypeCollection {
  return Object.freeze(mixinToPlainObject(cloneDeep(data)))
}
