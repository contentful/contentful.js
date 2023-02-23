import { Document as RichTextDocument } from '@contentful/rich-text-types'
import { Asset } from './asset'
import { ContentfulCollection } from './collection'
import { AssetLink, ContentTypeLink, EntryLink } from './link'
import { LocaleCode } from './locale'
import { Metadata } from './metadata'
import { FieldsType } from './query/util'
import { EntitySys } from './sys'
import { ChainModifiers, ChainOption, ChainOptions } from '../utils/client-helpers'

export interface EntrySys extends EntitySys {
  contentType: { sys: ContentTypeLink }
  type: 'Entry'
}

type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

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

  type EntryLink<Fields extends FieldsType> = GenericEntry<Fields>
  type AssetLink = Asset
  type Link<Fields extends FieldsType> = AssetLink | EntryLink<Fields>
  type Array<Item extends EntryFields.Symbol | AssetLink | EntryLink<FieldsType>> = Item[]
  type Object<Data extends Json = Json> = Data
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

export type EntryField<Fields extends FieldsType> =
  | BasicEntryField
  | EntryFields.EntryLink<Fields>
  | EntryFields.AssetLink
  | EntryFields.Array<EntryFields.Symbol>
  | EntryFields.Array<EntryFields.AssetLink>
  | EntryFields.Array<EntryFields.EntryLink<Fields>>

type BaseEntry = {
  sys: EntrySys
  metadata: Metadata
}

type LocalizedFields<Fields extends FieldsType, Locales extends LocaleCode = LocaleCode> = {
  [key in keyof Fields]: { [locale in Locales]?: Fields[key] }
}

/**
 * @category Entities
 */
export type LocalizedGenericEntry<Fields extends FieldsType> = BaseEntry & {
  fields: LocalizedFields<Fields>
}

/**
 * @category Entities
 */
export type UnlocalizedGenericEntry<Fields extends FieldsType> = BaseEntry & {
  fields: Fields
}

/**
 * @category Entities
 */
export type GenericEntry<Fields extends FieldsType> =
  | LocalizedGenericEntry<Fields>
  | UnlocalizedGenericEntry<Fields>

/**
 * @category Entities
 * @deprecated
 */
export type Entry<Fields extends FieldsType> = GenericEntry<Fields>

type ResolvedLink<
  Field extends EntryField<FieldsType>,
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Field extends EntryFields.EntryLink<infer LinkedFields>
  ? 'WITHOUT_LINK_RESOLUTION' extends Modifiers
    ? EntryLink
    : 'WITHOUT_UNRESOLVABLE_LINKS' extends Modifiers
    ? NewEntry<LinkedFields, Modifiers, Locales> | undefined
    : NewEntry<LinkedFields, Modifiers, Locales> | EntryLink
  : Field extends EntryFields.AssetLink
  ? 'WITHOUT_LINK_RESOLUTION' extends Modifiers
    ? AssetLink
    : 'WITHOUT_UNRESOLVABLE_LINKS' extends Modifiers
    ? Asset | undefined
    : Asset | AssetLink
  : Field

export type ResolvedField<
  Field extends EntryField<FieldsType>,
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = Field extends EntryFields.Array<infer Item>
  ? Array<ResolvedLink<Item, Modifiers, Locales>>
  : ResolvedLink<Field, Modifiers, Locales>

// TODO: rename after renaming generic Entry type
export type NewEntry<
  Fields extends FieldsType,
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode
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
  'WITHOUT_LINK_RESOLUTION'
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

export type GenericEntryCollectionWithAllLocales<
  Fields extends FieldsType,
  Locales extends LocaleCode
> = AbstractEntryCollection<NewEntry<Fields, 'WITH_ALL_LOCALES', Locales>>

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
> = GenericEntryCollectionWithAllLocales<Fields, Locales>

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
