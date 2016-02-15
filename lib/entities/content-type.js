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
 * ContentType type
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
 * ContentTypeCollection type
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
