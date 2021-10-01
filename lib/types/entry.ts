import { Document as RichTextDocument } from '@contentful/rich-text-types'
import { Asset } from './asset'
import { ContentfulCollection } from './collection'
import { ContentTypeLink } from './link'
import { LocaleValue } from './locale'
import { Metadata } from './metadata'
import { FieldsType } from './query/util'
import { EntitySys } from './sys'

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
  metadata: Metadata
}

// TODO use EntryLink from link.ts instead
interface EntryLink<T> {
  sys: {
    type: 'Link'
    linkType: 'Entry'
    id: string
  }
}

export interface LocalizedEntry<Fields extends FieldsType, Locale extends LocaleValue> {
  sys: EntrySys
  fields: {
    [FieldName in keyof Fields]: {
      [LocaleName in Locale]?: Fields[FieldName]
    }
  }
  metadata: Metadata
}

export type ResolvedEntry<Fields extends FieldsType> = {
  sys: EntrySys
  fields: {
    [FieldName in keyof Fields]: Fields[FieldName] extends
      | EntryLink<infer LinkedEntryFields>
      | undefined
      ? ResolvedEntry<LinkedEntryFields>
      : Fields[FieldName] extends Array<EntryLink<infer LinkedEntryFields>> | undefined
      ? Array<ResolvedEntry<LinkedEntryFields>>
      : Fields[FieldName]
  }
  metadata: Metadata
}

export type ResolvedLocalizedEntry<Fields extends FieldsType, Locales extends LocaleValue> = {
  sys: EntrySys
  fields: {
    [FieldName in keyof Fields]: {
      [LocaleName in Locales]?: Fields[FieldName] extends
        | EntryLink<infer LinkedEntryFields>
        | undefined
        ? ResolvedLocalizedEntry<LinkedEntryFields, Locales>
        : Fields[FieldName] extends Array<EntryLink<infer LinkedEntryFields>> | undefined
        ? Array<ResolvedLocalizedEntry<LinkedEntryFields, Locales>>
        : Fields[FieldName]
    }
  }
  metadata: Metadata
}

export interface AbstractEntryCollection<TEntry> extends ContentfulCollection<TEntry> {
  errors?: Array<any>
  includes?: {
    Entry?: any[]
    Asset?: any[]
  }
}

export type EntryCollection<T> = AbstractEntryCollection<Entry<T>>

export type ResolvedEntryCollection<T> = AbstractEntryCollection<ResolvedEntry<T>>

export type LocalizedEntryCollection<Fields, Locales extends LocaleValue> = AbstractEntryCollection<
  LocalizedEntry<Fields, Locales>
>

export type ResolvedLocalizedEntryCollection<
  Fields,
  Locales extends LocaleValue
> = AbstractEntryCollection<ResolvedLocalizedEntry<Fields, Locales>>
