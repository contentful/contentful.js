import { ContentfulCollection } from './collection'
import { EntryFields } from './entry'
import { SpaceLink, EnvironmentLink } from './link'
import { BaseSys } from './sys'

/**
 * System managed metadata for content type
 * @category ContentType
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/common-resource-attributes | CDA documentation on common attributes}
 */
export interface ContentTypeSys extends BaseSys {
  createdAt: EntryFields.Date
  updatedAt: EntryFields.Date
  revision: number
  space: { sys: SpaceLink }
  environment: { sys: EnvironmentLink }
}

/**
 * Definition of a content type field
 * @category ContentType
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/content-types/content-type | CDA documentation on Content Type}
 */
export interface ContentTypeField {
  disabled: boolean
  id: string
  linkType?: string
  localized: boolean
  name: string
  omitted: boolean
  required: boolean
  type: ContentTypeFieldType
  validations: ContentTypeFieldValidation[]
  items?: FieldItem
  allowedResources?: ContentTypeAllowedResources[]
}

interface ContentTypeAllowedResources {
  type: string
  source: string
  contentTypes: string[]
}

/**
 * @category ContentType
 */
export type ContentTypeFieldType =
  | 'Symbol'
  | 'Text'
  | 'Integer'
  | 'Number'
  | 'Date'
  | 'Boolean'
  | 'Location'
  | 'Link'
  | 'Array'
  | 'Object'
  | 'RichText'
  | 'ResourceLink'

/**
 * Definition of a single validation rule applied
 * to the related content type field
 * @category ContentType
 */
export interface ContentTypeFieldValidation {
  unique?: boolean
  size?: {
    min?: number
    max?: number
  }
  regexp?: {
    pattern: string
  }
  linkMimetypeGroup?: string[]
  in?: string[]
  linkContentType?: string[]
  message?: string
  nodes?: {
    'entry-hyperlink'?: ContentTypeFieldValidation[]
    'embedded-entry-block'?: ContentTypeFieldValidation[]
    'embedded-entry-inline'?: ContentTypeFieldValidation[]
  }
  enabledNodeTypes?: string[]
}

/**
 * @TODO
 * @category ContentType
 */
export interface FieldItem {
  type: 'Link' | 'Symbol' | 'ResourceLink'
  validations: ContentTypeFieldValidation[]
  linkType?: 'Entry' | 'Asset'
}

/**
 * Definition of a content type
 * @category ContentType
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/content-types | CDA documentation on Content Types}
 */
export interface ContentType {
  sys: ContentTypeSys
  name: string
  description: string
  displayField: string
  fields: Array<ContentTypeField>
}

/**
 * Collection of content types
 * @category ContentType
 */
export type ContentTypeCollection = ContentfulCollection<ContentType>
