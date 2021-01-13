import { SpaceLink, EnvironmentLink } from './link'

export interface BaseSys {
  type: string
  id: string
}

export interface EntitySys extends BaseSys {
  createdAt: string
  updatedAt: string
  revision: number
  space: { sys: SpaceLink }
  environment: { sys: EnvironmentLink }
  locale?: string
}
