import { Asset } from './asset'
import { ContentfulCollection } from './collection'
import { EntitySys } from './sys'
import { Document as RichTextDocument } from '@contentful/rich-text-types'
import { ContentTypeLink } from './link'

export interface EntrySys extends EntitySys {
  contentType: { sys: ContentTypeLink }
}

/**
 * Types of fields found in an Entry
 */
export declare namespace EntryFields {
  type Symbol = string
  type Text = string
  type Integer = number
  type Number = number
  type Date = `${number}-${number}-${number}T${number}:${number}:${number}Z`
  type Boolean = boolean

  interface Location {
    lat: string
    lon: string
  }

  type Link<T> = Asset | Entry<T>
  type Array<T = any> = symbol[] | Entry<T>[] | Asset[]
  type Object<T extends Record<string, any> = Record<string, unknown>> = T
  type RichText = RichTextDocument
}

export type BasicEntryField =
  | EntryFields.Symbol
  | EntryFields.Text
  | EntryFields.Integer
  | EntryFields.Number
  | EntryFields.Date
  | EntryFields.Boolean
  | EntryFields.Location
  | EntryFields.RichText

export interface Entry<T> {
  sys: EntrySys
  fields: T
}

export interface EntryCollection<T> extends ContentfulCollection<Entry<T>> {
  errors?: Array<any>
  includes?: any
}
