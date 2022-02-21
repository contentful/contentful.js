import { Document as RichTextDocument } from '@contentful/rich-text-types'
import { Asset } from './asset'
import { ContentfulCollection } from './collection'
import { ContentTypeLink } from './link'
import { LocaleCode } from './locale'
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
  | EntryFields.Object

/**
 * @category Entities
 */
export interface Entry<T> {
  sys: EntrySys
  fields: T
  metadata: Metadata
}

// TODO use EntryLink from link.ts instead
// TODO remove generic
interface EntryLink<T> {
  sys: {
    type: 'Link'
    linkType: 'Entry'
    id: string
  }
}

// TODO check if this type is properly named.
// This looks like it is with link resolution, not without
// without would mean that EntryLink is returned for all linked entries
// TYPE SHOULD BE: localized, all linked entries are EntryLink objects
export interface EntryWithAllLocalesAndWithoutLinkResolution<
  Fields extends FieldsType,
  Locales extends LocaleCode
> {
  sys: EntrySys
  fields: {
    [FieldName in keyof Fields]: {
      [LocaleName in Locales]?: Fields[FieldName]
    }
  }
  metadata: Metadata
}

// TODO check if this type is properly named.
// Return type should include resolved entries and (if unresolvable), EntryLink types
// TYPE SHOULD BE: all linked entries are EITHER resolved entries OR EntryLink objects
export type EntryWithLinkResolutionAndWithUnresolvableLinks<Fields extends FieldsType> = {
  sys: EntrySys
  fields: {
    [FieldName in keyof Fields]: Fields[FieldName] extends
      | EntryLink<infer LinkedEntryFields>
      | undefined
      ? EntryWithLinkResolutionAndWithUnresolvableLinks<LinkedEntryFields>
      : Fields[FieldName] extends Array<EntryLink<infer LinkedEntryFields>> | undefined
      ? Array<EntryWithLinkResolutionAndWithUnresolvableLinks<LinkedEntryFields>>
      : Fields[FieldName]
  }
  metadata: Metadata
}

// TYPE SHOULD BE: localized, all linked entries are EITHER resolved entries OR EntryLink objects
export type EntryWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<
  Fields extends FieldsType,
  Locales extends LocaleCode
> = {
  sys: EntrySys
  fields: {
    [FieldName in keyof Fields]: {
      [LocaleName in Locales]?: Fields[FieldName] extends
        | EntryLink<infer LinkedEntryFields>
        | undefined
        ? EntryWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<
            LinkedEntryFields,
            Locales
          >
        : Fields[FieldName] extends Array<EntryLink<infer LinkedEntryFields>> | undefined
        ? Array<
            EntryWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<
              LinkedEntryFields,
              Locales
            >
          >
        : Fields[FieldName]
    }
  }
  metadata: Metadata
}
// TODO: the two below entry types' return shape still need to be defined,
// assigning them some other Entry types now just to ease implementation, but they're wrong.

// TODO define return shape
// linked entries will be resolved. there will be no case where EntryLink is returned
// (because links are either resolved or, if unresolvable, removed)
// TYPE SHOULD BE: all linked entries are resolved entries. NO EntryLink objects
export type EntryWithLinkResolutionAndWithoutUnresolvableLinks<Fields extends FieldsType> =
  EntryWithLinkResolutionAndWithUnresolvableLinks<Fields>

// TODO define return shape
// linked entries will be resolved. there will be no case where EntryLink is returned
// (because links are either resolved or, if unresolvable, removed)
// TYPE SHOULD BE: localized, all linked entries are resolved entries. NO EntryLink objects
export type EntryWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<
  Fields extends FieldsType,
  Locales extends LocaleCode
> = EntryWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<Fields, Locales>

export interface AbstractEntryCollection<TEntry> extends ContentfulCollection<TEntry> {
  errors?: Array<any>
  includes?: {
    Entry?: any[]
    Asset?: any[]
  }
}

export type EntryCollection<T> = AbstractEntryCollection<Entry<T>>

export type EntryWithoutLinkResolution<T> = Entry<T>

export type EntryCollectionWithoutLinkResolution<T> = EntryCollection<T>

export type EntryCollectionWithLinkResolutionAndWithUnresolvableLinks<T> = AbstractEntryCollection<
  EntryWithLinkResolutionAndWithUnresolvableLinks<T>
>

export type EntryCollectionWithAllLocalesAndWithoutLinkResolution<
  Fields,
  Locales extends LocaleCode
> = AbstractEntryCollection<EntryWithAllLocalesAndWithoutLinkResolution<Fields, Locales>>

export type EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<
  Fields,
  Locales extends LocaleCode
> = AbstractEntryCollection<
  EntryWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<Fields, Locales>
>

export type EntryCollectionWithLinkResolutionAndWithoutUnresolvableLinks<Fields> =
  AbstractEntryCollection<EntryWithLinkResolutionAndWithoutUnresolvableLinks<Fields>>

export type EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<
  Fields,
  Locales extends LocaleCode
> = AbstractEntryCollection<
  EntryWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<Fields, Locales>
>
