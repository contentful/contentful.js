import { EntitySys } from './sys'
import { ContentfulCollection } from './collection'
import { UserLink } from './link'

/**
 * System managed metadata for tags
 * @category Tag
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/common-resource-attributes | CDA documentation on common attributes}
 */
export interface TagSys extends Omit<EntitySys, 'locale' | 'revision'> {
  type: 'Tag'
  version: number
  visibility: 'public'
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
