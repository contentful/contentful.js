import { ContentfulCollection } from './collection'
import { BaseSys } from './sys'

export interface LocaleSys extends BaseSys {
  type: 'Locale'
  version: number
}

export interface Locale {
  code: string
  name: string
  default: boolean
  fallbackCode: string | null
  sys: LocaleSys
}

export type LocaleCollection = ContentfulCollection<Locale>
