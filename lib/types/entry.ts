import { Document as RichTextDocument } from '@contentful/rich-text-types'
import { Asset } from './asset'
import { ContentfulCollection } from './collection'
import { ContentTypeLink, EntryLink } from './link'
import { LocaleCode } from './locale'
import { Metadata } from './metadata'
import { FieldsType } from './query/util'
import { EntitySys } from './sys'
import { ChainModifiers, ChainOption, ChainOptions } from '../utils/client-helpers'

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
    lat: number
    lon: number
  }

  type Link<T extends FieldsType> = Asset | GenericEntry<T>
  type Array<T extends FieldsType = any> = symbol[] | GenericEntry<T>[] | Asset[]
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

type BaseEntry = {
  sys: EntrySys
  metadata: Metadata
}

/**
 * @category Entities
 */
export type GenericEntry<Fields extends FieldsType> = BaseEntry & {
  fields: Fields
}

/**
 * @category Entities
 * @deprecated
 */
export type Entry<Fields extends FieldsType> = GenericEntry<Fields>

export type ResolvedField<
  Fields extends FieldsType,
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = any
> = Fields extends EntryFields.Link<infer LinkedFields>
  ? 'WITHOUT_LINK_RESOLUTION' extends Modifiers
    ? EntryLink
    :
        | NewEntry<LinkedFields, Modifiers, Locales>
        | ('WITHOUT_UNRESOLVABLE_LINKS' extends Modifiers ? undefined : EntryLink)
  : Fields extends EntryFields.Link<infer LinkedFields>[]
  ? 'WITHOUT_LINK_RESOLUTION' extends Modifiers
    ? EntryLink[]
    : 'WITHOUT_UNRESOLVABLE_LINKS' extends Modifiers
    ? (NewEntry<LinkedFields, Modifiers, Locales> | undefined)[]
    : (NewEntry<LinkedFields, Modifiers, Locales> | EntryLink)[]
  : Fields

// TODO: rename after renaming generic Entry type
export type NewEntry<
  Fields extends FieldsType,
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = any
> = BaseEntry & {
  fields: 'WITH_ALL_LOCALES' extends Modifiers
    ? {
        [FieldName in keyof Fields]: {
          [LocaleName in Locales]?: ResolvedField<Fields[FieldName], Modifiers, Locales>
        }
      }
    : {
        [FieldName in keyof Fields]: ResolvedField<Fields[FieldName], Modifiers, Locales>
      }
}

export type EntryWithoutLinkResolution<Fields extends FieldsType> = NewEntry<
  Fields,
  'WITHOUT_LINK_RESOLUTION',
  LocaleCode
>

export type EntryWithAllLocalesAndWithoutLinkResolution<
  Fields extends FieldsType,
  Locales extends LocaleCode
> = NewEntry<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', Locales>

export type EntryWithLinkResolutionAndWithUnresolvableLinks<Fields extends FieldsType> = NewEntry<
  Fields,
  undefined,
  LocaleCode
>

export type EntryWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<
  Fields extends FieldsType,
  Locales extends LocaleCode
> = NewEntry<Fields, 'WITH_ALL_LOCALES', Locales>

export type EntryWithLinkResolutionAndWithoutUnresolvableLinks<Fields extends FieldsType> =
  NewEntry<Fields, 'WITHOUT_UNRESOLVABLE_LINKS', LocaleCode>

export type EntryWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<
  Fields extends FieldsType,
  Locales extends LocaleCode
> = NewEntry<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', Locales>

export interface AbstractEntryCollection<TEntry> extends ContentfulCollection<TEntry> {
  errors?: Array<any>
  includes?: {
    Entry?: any[]
    Asset?: any[]
  }
}

export type GenericEntryCollection<Fields extends FieldsType> = AbstractEntryCollection<
  GenericEntry<Fields>
>

/**
 * @deprecated
 */
export type EntryCollection<Fields extends FieldsType> = GenericEntryCollection<Fields>

export type EntryCollectionWithoutLinkResolution<Fields extends FieldsType> =
  AbstractEntryCollection<NewEntry<Fields, 'WITHOUT_LINK_RESOLUTION'>>

export type EntryCollectionWithLinkResolutionAndWithUnresolvableLinks<Fields extends FieldsType> =
  AbstractEntryCollection<NewEntry<Fields, undefined>>

export type EntryCollectionWithAllLocalesAndWithoutLinkResolution<
  Fields extends FieldsType,
  Locales extends LocaleCode
> = AbstractEntryCollection<
  NewEntry<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', Locales>
>

export type EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks<
  Fields extends FieldsType,
  Locales extends LocaleCode
> = AbstractEntryCollection<NewEntry<Fields, 'WITH_ALL_LOCALES', Locales>>

export type EntryCollectionWithLinkResolutionAndWithoutUnresolvableLinks<
  Fields extends FieldsType
> = AbstractEntryCollection<NewEntry<Fields, 'WITHOUT_UNRESOLVABLE_LINKS'>>

export type EntryCollectionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks<
  Fields extends FieldsType,
  Locales extends LocaleCode
> = AbstractEntryCollection<
  NewEntry<Fields, 'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', Locales>
>

export type ConfiguredEntry<
  Fields extends FieldsType,
  Locales extends LocaleCode,
  Options extends ChainOptions
> = Options extends ChainOption<infer Modifiers> ? NewEntry<Fields, Modifiers, Locales> : never

export type ConfiguredEntryCollection<
  Fields extends FieldsType,
  Locales extends LocaleCode,
  Options extends ChainOptions
> = AbstractEntryCollection<ConfiguredEntry<Fields, Locales, Options>>
