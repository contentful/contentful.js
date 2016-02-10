/* @flow */
import type {Sys} from './sys'

type FieldDefinition = {
  id: string,
  name: string,
  type: string,
  localized: boolean,
  required: boolean
}

/**
 * ContentType type
 */
export type ContentType = {
  sys: Sys,
  name: string,
  description: string,
  displayField: string,
  fields: Array<FieldDefinition>
}

/**
 * ContentTypeCollection type
 */
export type ContentTypeCollection = {
  total: number,
  skip: number,
  limit: number,
  items: Array<ContentType>
}
