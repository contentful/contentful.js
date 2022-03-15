import { Document as RichTextDocument } from '@contentful/rich-text-types'
import { Asset } from './asset'
import { ContentfulCollection } from './collection'
import { ContentTypeLink, EntryLink } from './link'
import { LocaleCode } from './locale'
import { Metadata } from './metadata'
import { FieldsType } from './query/util'
import { EntitySys } from './sys'

export interface EntrySys extends EntitySys {
  contentType: { sys: ContentTypeLink }
}

export declare namespace EntryFields {
  type Symbol = string
  type Text = string
  type Integer = number
  type Number = number
  type Date = `${number}-${number}-${number}T${number}:${number}:${number}Z`
  type Boolean = boolean

  type Location = {
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
  metadata: Metadata
  fields: T
}

interface EntryWithAllLocalesAndWithoutLinkResolution<
  Fields extends FieldsType,
  Locales extends LocaleCode
> {
  sys: EntrySys
  metadata: Metadata
  fields: {
    [FieldName in keyof Fields]: {
      [LocaleName in Locales]?: Fields[FieldName] extends EntryFields.Link<any>
        ? EntryLink
        : Fields[FieldName] extends EntryFields.Link<any>[]
        ? EntryLink[]
        : Fields[FieldName]
    }
  }
}

type EntryWithLinkResolutionAndWithUnresolvableLinks<Fields extends FieldsType> = {
  sys: EntrySys
  metadata: Metadata
  fields: {
    [FieldName in keyof Fields]: Fields[FieldName] extends EntryFields.Link<infer LinkedEntryFields>
      ? EntryWithLinkResolutionAndWithUnresolvableLinks<LinkedEntryFields> | EntryLink
      : Fields[FieldName] extends EntryFields.Link<infer LinkedEntryFields>[]
      ? (EntryWithLinkResolutionAndWithUnresolvableLinks<LinkedEntryFields> | EntryLink)[]
      : Fields[FieldName]
  }
}

type EntryWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<
  Fields extends FieldsType,
  Locales extends LocaleCode
> = {
  sys: EntrySys
  metadata: Metadata
  fields: {
    [FieldName in keyof Fields]: {
      [LocaleName in Locales]?: Fields[FieldName] extends EntryFields.Link<infer LinkedEntryFields>
        ?
            | EntryWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<
                LinkedEntryFields,
                Locales
              >
            | undefined
        : Fields[FieldName] extends Array<EntryFields.Link<infer LinkedEntryFields>>
        ?
            | EntryWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<
                LinkedEntryFields,
                Locales
              >[]
            | undefined
        : Fields[FieldName]
    }
  }
}

type EntryWithLinkResolutionAndWithoutUnresolvableLinks<Fields extends FieldsType> = {
  sys: EntrySys
  metadata: Metadata
  fields: {
    [FieldName in keyof Fields]: Fields[FieldName] extends EntryFields.Link<infer LinkedEntryFields>
      ? EntryWithLinkResolutionAndWithoutUnresolvableLinks<LinkedEntryFields> | undefined
      : Fields[FieldName] extends EntryFields.Link<infer LinkedEntryFields>[]
      ? EntryWithLinkResolutionAndWithoutUnresolvableLinks<LinkedEntryFields>[] | undefined
      : Fields[FieldName]
  }
}

type EntryWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<
  Fields extends FieldsType,
  Locales extends LocaleCode
> = {
  sys: EntrySys
  metadata: Metadata
  fields: {
    [FieldName in keyof Fields]: {
      [LocaleName in Locales]?: Fields[FieldName] extends EntryFields.Link<infer LinkedEntryFields>
        ?
            | EntryWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<
                LinkedEntryFields,
                Locales
              >
            | undefined
        : Fields[FieldName] extends EntryFields.Link<infer LinkedEntryFields>[]
        ?
            | EntryWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<
                LinkedEntryFields,
                Locales
              >[]
            | undefined
        : Fields[FieldName]
    }
  }
}

export interface AbstractEntryCollection<TEntry> extends ContentfulCollection<TEntry> {
  errors?: Array<any>
  includes?: {
    Entry?: any[]
    Asset?: any[]
  }
}

export type EntryCollection<T> = AbstractEntryCollection<Entry<T>>

type EntryWithoutLinkResolution<T> = Entry<T>

type EntryCollectionWithoutLinkResolution<T> = EntryCollection<T>

type EntryCollectionWithLinkResolutionAndWithUnresolvableLinks<T> = AbstractEntryCollection<
  EntryWithLinkResolutionAndWithUnresolvableLinks<T>
>

type EntryCollectionWithAllLocalesAndWithoutLinkResolution<
  Fields,
  Locales extends LocaleCode
> = AbstractEntryCollection<EntryWithAllLocalesAndWithoutLinkResolution<Fields, Locales>>

type EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<
  Fields,
  Locales extends LocaleCode
> = AbstractEntryCollection<
  EntryWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<Fields, Locales>
>

type EntryCollectionWithLinkResolutionAndWithoutUnresolvableLinks<Fields> = AbstractEntryCollection<
  EntryWithLinkResolutionAndWithoutUnresolvableLinks<Fields>
>

type EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<
  Fields,
  Locales extends LocaleCode
> = AbstractEntryCollection<
  EntryWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<Fields, Locales>
>

/**
 * @desc EntryR - Entry Response Type, according to client chain.
 */
export namespace EntryR {
  export namespace WithAllLocales {
    export namespace WithLinkResolution {
      export type WithUnresolvableLinks<
        Fields,
        Locale extends string
      > = EntryWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<Fields, Locale>
      export type WithoutUnresolvableLinks<
        Fields,
        Locale extends string
      > = EntryWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<Fields, Locale>
    }
    export type WithoutLinkResolution<
      Fields,
      Locale extends string
    > = EntryWithAllLocalesAndWithoutLinkResolution<Fields, Locale>
  }
  export namespace WithLinkResolution {
    export type WithUnresolvableLinks<Fields> =
      EntryWithLinkResolutionAndWithUnresolvableLinks<Fields>
    export type WithoutUnresolvableLinks<Fields> =
      EntryWithLinkResolutionAndWithoutUnresolvableLinks<Fields>
  }

  export type WithoutLinkResolution<T> = EntryWithoutLinkResolution<T>
}

/**
 * @desc EntryCollectionR - Entry Collection Response Type, according to client chain.
 */
export namespace EntryCollectionR {
  export namespace WithAllLocales {
    export namespace WithLinkResolution {
      export type WithUnresolvableLinks<
        Fields,
        Locale extends string
      > = EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<Fields, Locale>
      export type WithoutUnresolvableLinks<
        Fields,
        Locale extends string
      > = EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<
        Fields,
        Locale
      >
    }
    export type WithoutLinkResolution<
      Fields,
      Locale extends string
    > = EntryCollectionWithAllLocalesAndWithoutLinkResolution<Fields, Locale>
  }
  export namespace WithLinkResolution {
    export type WithUnresolvableLinks<Fields> =
      EntryCollectionWithLinkResolutionAndWithUnresolvableLinks<Fields>
    export type WithoutUnresolvableLinks<Fields> =
      EntryCollectionWithLinkResolutionAndWithoutUnresolvableLinks<Fields>
  }

  export type WithoutLinkResolution<T> = EntryCollectionWithoutLinkResolution<T>
}
