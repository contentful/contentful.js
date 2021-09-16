export type LinkType = 'Space' | 'ContentType' | 'Environment'

export interface Link<T extends LinkType> {
  type: 'Link'
  linkType: T
  id: string
}

export type SpaceLink = Link<'Space'>
export type ContentTypeLink = Link<'ContentType'>
export type EnvironmentLink = Link<'Environment'>
