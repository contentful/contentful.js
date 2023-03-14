import { EntryFields } from './entry'
import { SpaceLink, EnvironmentLink, UserLink } from './link'

export interface BaseSys {
  type: string
  id: string
}

export interface EntitySys extends BaseSys {
  createdAt: EntryFields.Date
  updatedAt: EntryFields.Date
  revision: number
  space: { sys: SpaceLink }
  environment: { sys: EnvironmentLink }
  locale?: string
}

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
