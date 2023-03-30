import { ContentfulCollection } from './collection'
import { BaseSys } from './sys'

/**
 * @category Entity
 */
export type LocaleCode = string

/**
 * @category Entity
 */
export interface LocaleSys extends BaseSys {
  type: 'Locale'
  version: number
}

/**
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
 * @category Entity
 */
export type LocaleCollection = ContentfulCollection<Locale>
