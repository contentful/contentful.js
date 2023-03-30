import { Locale } from './locale'
import { BaseSys } from './sys'

/**
 * @category Entity
 */
export interface SpaceSys extends BaseSys {
  type: 'Space'
}

/**
 * @category Entity
 */
export interface Space {
  sys: SpaceSys
  name: string
  locales: Array<Omit<Locale, 'sys'>>
}
