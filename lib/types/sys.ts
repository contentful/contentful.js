import type { ContentSourceMapsLookup, CPAContentSourceMaps } from '@contentful/content-source-maps'
import type { EntryFields } from './entry.js'
import type { EnvironmentLink, SpaceLink } from './link.js'

/**
 * Definition of common part of system managed metadata
 */
export interface BaseSys {
  type: string
  id: string
}

/**
 * System managed metadata for entities
 * @category Entity
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/common-resource-attributes | CDA documentation on common attributes}
 */
export interface EntitySys extends BaseSys {
  createdAt: EntryFields.Date
  updatedAt: EntryFields.Date
  revision: number
  space: { sys: SpaceLink }
  environment: { sys: EnvironmentLink }
  locale?: string
  contentSourceMaps?: CPAContentSourceMaps
  contentSourceMapsLookup?: ContentSourceMapsLookup
  publishedVersion: number
}
