export interface Link<T extends string> {
  type: 'Link'
  linkType: T
  id: string
}

export type SpaceLink = Link<'Space'>
export type ContentTypeLink = Link<'ContentType'>
export type EnvironmentLink = Link<'Environment'>
