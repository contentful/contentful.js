import { ContentfulCollection } from './collection.js'
import { BaseSys } from './sys.js'

/**
 * @category Entity
 */
export type LocaleCode = string

/**
 * System managed metadata for locale
 * @category Entity
 */
export interface LocaleSys extends BaseSys {
  type: 'Locale'
  version: number
}

/**
 * Properties of a single locale definition
 * @category Entity
 */
export interface Locale {
  code: string
  name: string
  default: boolean
  fallbackCode: string | null
  sys: LocaleSys
}

/**
 * Collection of locales
 * @category Entity
 */
export type LocaleCollection = ContentfulCollection<Locale>
