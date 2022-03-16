import type { ContentfulCollection } from './collection'
import type { BaseSys } from './sys'

export type LocaleCode = string

export interface LocaleSys extends BaseSys {
  type: 'Locale'
  version: number
}

/**
 * @category Entities
 */
export interface Locale {
  code: string
  name: string
  default: boolean
  fallbackCode: string | null
  sys: LocaleSys
}

export type LocaleCollection = ContentfulCollection<Locale>
