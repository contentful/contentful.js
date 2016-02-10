/* @flow */
import type {Sys} from './sys'
import type {Link} from './link'
import type {Field} from './field'
import type {Asset} from './asset'
import mixinToPlainObject from '../mixins/to-plain-object'
import mixinLinkGetters from '../mixins/link-getters'

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

export function wrapEntry (data: Entry): Entry {
  data = mixinToPlainObject(data)
  return data
}

export function wrapEntryCollection (data: EntryCollection): EntryCollection {
  if (data.includes) {
    mixinLinkGetters(data)
  }
  data = mixinToPlainObject(data)
  return data
}
