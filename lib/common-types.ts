import { AxiosInstance } from 'contentful-sdk-core'
import { Document as RichTextDocument } from '@contentful/rich-text-types'

export type HttpClientInstance = AxiosInstance

export interface AssetDetails {
  size: number
  image?: {
    width: number
    height: number
  }
}

export interface AssetFile {
  url: string
  details: AssetDetails
  fileName: string
  contentType: string
}

export interface AssetFields {
  title: string
  description: string
  file: AssetFile
}

export interface Asset {
  sys: AssetSys
  fields: AssetFields
}

export interface ContentfulCollection<T> {
  total: number
  skip: number
  limit: number
  items: Array<T>
}

export type AssetCollection = ContentfulCollection<Asset>

export interface Entry<T> {
  sys: Sys
  fields: T
}

export interface EntryCollection<T> extends ContentfulCollection<Entry<T>> {
  errors?: Array<any>
  includes?: any
}

export interface ContentType {
  sys: ContentTypeSys
  name: string
  description: string
  displayField: string
  fields: Array<Field>
}

export declare type ContentTypeCollection = ContentfulCollection<ContentType>

export interface Locale {
  code: string
  name: string
  default: boolean
  fallbackCode: string | null
  sys: LocaleSys
}

export declare type LocaleCollection = ContentfulCollection<Locale>

export interface SyncCollection {
  entries: Array<Entry<any>>
  assets: Array<Asset>
  deletedEntries: Array<Entry<any>>
  deletedAssets: Array<Asset>
  nextSyncToken: string
}

interface BaseSys {
  type: string
  id: string
}

type EntitySys = {
  createdAt: string
  updatedAt: string
  revision?: number
  space?: { sys: SpaceLink }
  environment: { sys: EnvironmentLink }
  locale: string
} & BaseSys

export interface Sys extends EntitySys {
  contentType: { sys: ContentTypeLink }
}

export type AssetSys = EntitySys

export type SpaceSys = { type: 'Space' } & BaseSys

export type ContentTypeSys = {
  createdAt: string
  updatedAt: string
  revision?: number
  space?: { sys: SpaceLink }
  environment: { sys: EnvironmentLink }
} & BaseSys

export type LocaleSys = {
  type: 'Locale'
  version: number
} & BaseSys

interface Link<T extends string> {
  type: 'Link'
  linkType: T
  id: string
}

export type SpaceLink = Link<'Space'>
export type ContentTypeLink = Link<'ContentType'>
export type EnvironmentLink = Link<'Environment'>

export interface Field {
  disabled: boolean
  id: string
  linkType?: string
  localized: boolean
  name: string
  omitted: boolean
  required: boolean
  type: FieldType
  validations: FieldValidation[]
  items?: FieldItem
}

export declare type FieldType =
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

export interface FieldValidation {
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
    'entry-hyperlink'?: FieldValidation[]
    'embedded-entry-block'?: FieldValidation[]
    'embedded-entry-inline'?: FieldValidation[]
  }
  enabledNodeTypes?: string[]
}

export interface FieldItem {
  type: 'Link' | 'Symbol'
  validations: FieldValidation[]
  linkType?: 'Entry' | 'Asset'
}

/**
 * Types of fields found in an Entry
 */
export declare namespace EntryFields {
  type Symbol = string
  type Text = string
  type Integer = number
  type Number = number
  type Date = string
  type Boolean = boolean

  interface Location {
    lat: string
    lon: string
  }

  type Link<T> = Asset | Entry<T>
  type Array<T = any> = symbol[] | Entry<T>[] | Asset[]
  type Object<T = any> = T
  type RichText = RichTextDocument
}

export interface Space {
  sys: SpaceSys
  name: string
  locales: Array<string>
}
