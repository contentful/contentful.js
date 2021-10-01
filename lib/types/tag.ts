import { ContentfulCollection } from './collection'
import { EntryFields } from './entry'
import { EnvironmentLink, SpaceLink, UserLink } from './link'
import { BaseSys } from './sys'

export interface TagSys extends BaseSys {
  type: 'Tag'
  createdAt: EntryFields.Date
  updatedAt: EntryFields.Date
  version: number
  visibility: 'public'
  createdBy: { sys: UserLink }
  updatedBy: { sys: UserLink }
  space: { sys: SpaceLink }
  environment: { sys: EnvironmentLink }
}

export type Tag = {
  name: string
  sys: TagSys
}

export type TagCollection = ContentfulCollection<Tag>
