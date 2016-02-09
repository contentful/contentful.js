/* @flow */

/**
 * Entry type
 */
export type Entry = {
  sys: Object,
  fields: Object
}

/**
 * DeletedEntry type
 */
export type DeletedEntry = Entry

/**
 * EntryCollection type
 */
export type EntryCollection = {
  total: number,
  skip: number,
  limit: number,
  items: Array<Entry>
}
