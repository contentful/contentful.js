import { EntitySys } from './sys.js'
import { ContentfulCollection } from './collection.js'
import { UserLink } from './link.js'

/**
 * System managed metadata for tags
 * @category Tag
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/common-resource-attributes | CDA documentation on common attributes}
 */
export interface TagSys extends Omit<EntitySys, 'locale' | 'revision'> {
  version: number
  visibility: string
  createdBy: { sys: UserLink }
  updatedBy: { sys: UserLink }
}

/**
 * Properties for a single content tag definition
 * @category Tag
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/content-tags | CDA documentation on Content Tags}
 */
export type Tag = {
  name: string
  sys: TagSys
}

/**
 * Collection of tags
 * @category Tag
 */
export type TagCollection = ContentfulCollection<Tag>
