/* @flow */

/**
 * ContentType type
 */
export type ContentType = {
  sys: Object,
  name: string,
  description: string,
  displayField: string,
  fields: Array<Object>
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
