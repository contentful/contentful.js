/* @flow */
import {cloneDeep} from 'lodash/lang'
import type {Sys} from './sys'
import type {Link} from './link'
import type {Field} from './field'
import type {Asset} from './asset'
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
 * Entry type
 */
export type Entry = {
  sys: Sys & {
    contentType: Link,
    locale: string
  },
  fields: { [key: string]: Field },
  toPlainObject: () => Object
}

/**
 * DeletedEntry type
 */
export type DeletedEntry = Entry

export type IncludesCollection = {
  Asset?: Array<Asset>,
  Entry?: Array<Entry>
}

type EntryCollectionResponse = {
  total: number,
  skip: number,
  limit: number,
  items: Array<EntryResponse>,
  includes?: IncludesCollection
}

/**
 * EntryCollection type
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
  const wrappedData = mixinToPlainObject(cloneDeep(data))
  return wrappedData
}

export function wrapEntryCollection (data: EntryCollectionResponse): EntryCollection {
  const wrappedData = mixinToPlainObject(cloneDeep(data))
  if (wrappedData.includes) {
    mixinLinkGetters(wrappedData)
  }
  return wrappedData
}
