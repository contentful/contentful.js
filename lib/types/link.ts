import { ResourceLink } from './resource-link'

/**
 * @category Link
 */
export type LinkType = 'Space' | 'ContentType' | 'Environment' | 'Entry' | 'Tag' | 'User' | 'Asset'

/**
 * Link definition of a specific link type
 * @category Link
 */
export interface Link<T extends LinkType> {
  type: 'Link'
  linkType: T
  id: string
}

/**
 * Unresolved link field of a specific link type
 * @category Link
 */
export type UnresolvedLink<T extends LinkType> = { sys: Link<T> }

/**
 * Space link type
 * @category Entity
 */
export type SpaceLink = Link<'Space'>

/**
 * Content type link type
 * @category ContentType
 */
export type ContentTypeLink = Link<'ContentType'>

/**
 * Environment link type
 * @category Entity
 */
export type EnvironmentLink = Link<'Environment'>

/**
 * Asset link type
 * @category Asset
 */
export type AssetLink = Link<'Asset'>

/**
 * Entry link type
 * @category Entry
 */
export type EntryLink = Link<'Entry'> | ResourceLink

/**
 * Tag link type
 * @category Tag
 */
export type TagLink = Link<'Tag'>

/**
 * User link type
 * @category Entity
 */
export type UserLink = Link<'User'>
