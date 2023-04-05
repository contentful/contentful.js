import { EntryFields } from './entry'
import { SpaceLink, EnvironmentLink, UserLink } from './link'

/**
 * Definition of common part of system managed metadata
 */
export interface BaseSys {
  type: string
  id: string
}

/**
 * System managed metadata for entities
 * @category Entity
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/common-resource-attributes | CDA documentation on common attributes}
 */
export interface EntitySys extends BaseSys {
  createdAt: EntryFields.Date
  updatedAt: EntryFields.Date
  revision: number
  space: { sys: SpaceLink }
  environment: { sys: EnvironmentLink }
  locale?: string
}

/**
 * System managed metadata for tags
 * @category Tag
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/common-resource-attributes | CDA documentation on common attributes}
 */
export interface TagSys extends BaseSys {
  createdAt: EntryFields.Date
  updatedAt: EntryFields.Date
  version: number
  space: { sys: SpaceLink }
  environment: { sys: EnvironmentLink }
  createdBy: { sys: UserLink }
  updatedBy: { sys: UserLink }
  visibility: string
}
