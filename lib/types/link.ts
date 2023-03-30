import { ResourceLink } from './resource-link'

/**
 * @category Link
 */
export type LinkType = 'Space' | 'ContentType' | 'Environment' | 'Entry' | 'Tag' | 'User' | 'Asset'

/**
 * @category Link
 */
export interface Link<T extends LinkType> {
  type: 'Link'
  linkType: T
  id: string
}

/**
 * @category Entity
 */
export type SpaceLink = Link<'Space'>

/**
 * @category ContentType
 */
export type ContentTypeLink = Link<'ContentType'>

/**
 * @category Entity
 */
export type EnvironmentLink = Link<'Environment'>

/**
 * @category Asset
 */
export type AssetLink = Link<'Asset'>

/**
 * @category Entry
 */
export type EntryLink = Link<'Entry'> | ResourceLink

/**
 * @category Tag
 */
export type TagLink = Link<'Tag'>

/**
 * @category Entity
 */
export type UserLink = Link<'User'>
