import { EntitySys } from './sys'
import { ContentfulCollection } from './collection'
import { UserLink } from './link'

/**
 * @category Tag
 */
export interface TagSys extends Omit<EntitySys, 'locale' | 'revision'> {
  type: 'Tag'
  version: number
  visibility: 'public'
  createdBy: { sys: UserLink }
  updatedBy: { sys: UserLink }
}

/**
 * @category Tag
 */
export type Tag = {
  name: string
  sys: TagSys
}

/**
 * @category Tag
 */
export type TagCollection = ContentfulCollection<Tag>
