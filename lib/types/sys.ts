import { EntryFields } from './entry'
import { SpaceLink, EnvironmentLink } from './link'

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
  contentSourceMaps?: ContentSourceMaps
  contentSourceMapsLookup?: ContentSourceMapsLookup
}

export type ContentSourceMaps = {
  sys: {
    type: 'ContentSourceMaps'
  }
  mappings: Record<
    string,
    {
      source: {
        fieldType: number
        editorInterface: number
      }
    }
  >
}

export type ContentSourceMapsLookup = {
  sys: {
    type: 'ContentSourceMapsLookup'
  }
  fieldType: string[]
  editorInterface: {
    [key: string]: string
  }[]
}
