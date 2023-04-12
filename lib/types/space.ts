import { Locale } from './locale'
import { BaseSys } from './sys'

/**
 * System managed metadata for spaces
 * @category Entity
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/common-resource-attributes | CDA documentation on common attributes}
 */
export interface SpaceSys extends BaseSys {
  type: 'Space'
}

/**
 * Properties of a space
 * @category Entity
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/spaces | CDA documentation on Spaces}
 */
export interface Space {
  sys: SpaceSys
  name: string
  locales: Array<Omit<Locale, 'sys'>>
}
