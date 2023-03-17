import { Document as RichTextDocument } from '@contentful/rich-text-types'
import { Asset } from './asset'
import { ContentfulCollection } from './collection'
import { AssetLink, ContentTypeLink, EntryLink } from './link'
import { LocaleCode } from './locale'
import { Metadata } from './metadata'
import { FieldsWithContentTypeIdType } from './query/util'
import { EntitySys } from './sys'
import { ChainModifiers } from '../utils/client-helpers'
import { JsonArray, JsonObject } from 'type-fest'

export interface EntrySys extends EntitySys {
  contentType: { sys: ContentTypeLink }
  type: 'Entry'
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

  type EntryLink<FieldsWithContentTypeId extends FieldsWithContentTypeIdType> =
    Entry<FieldsWithContentTypeId>
  type AssetLink = Asset
  type Link<FieldsWithContentTypeId extends FieldsWithContentTypeIdType> =
    | AssetLink
    | EntryLink<FieldsWithContentTypeId>
  type Array<Item extends EntryFields.Symbol | AssetLink | EntryLink<FieldsWithContentTypeIdType>> =
    Item[]
  type Object<Data extends JsonObject | JsonArray | null = JsonObject | JsonArray | null> = Data
  type RichText = RichTextDocument
}

export type EntryField<FieldsWithContentTypeId extends FieldsWithContentTypeIdType> =
  | EntryFields.Symbol
  | EntryFields.Text
  | EntryFields.Integer
  | EntryFields.Number
  | EntryFields.Date
  | EntryFields.Boolean
  | EntryFields.Location
  | EntryFields.RichText
  | EntryFields.Object
  | EntryFields.EntryLink<FieldsWithContentTypeId>
  | EntryFields.AssetLink
  | EntryFields.Array<EntryFields.Symbol>
  | EntryFields.Array<EntryFields.AssetLink>
  | EntryFields.Array<EntryFields.EntryLink<FieldsWithContentTypeId>>

export type BaseEntry = {
  sys: EntrySys
  metadata: Metadata
}

type ResolvedLink<
  Field extends EntryField<FieldsWithContentTypeIdType>,
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = Field extends EntryFields.EntryLink<infer LinkedFieldsWithContentTypeId>
  ? ChainModifiers extends Modifiers
    ? Entry<LinkedFieldsWithContentTypeId, Modifiers, Locales> | EntryLink | undefined
    : 'WITHOUT_LINK_RESOLUTION' extends Modifiers
    ? EntryLink
    : 'WITHOUT_UNRESOLVABLE_LINKS' extends Modifiers
    ? Entry<LinkedFieldsWithContentTypeId, Modifiers, Locales> | undefined
    : Entry<LinkedFieldsWithContentTypeId, Modifiers, Locales> | EntryLink
  : Field extends EntryFields.AssetLink
  ? ChainModifiers extends Modifiers
    ? Asset | AssetLink | undefined
    : 'WITHOUT_LINK_RESOLUTION' extends Modifiers
    ? AssetLink
    : 'WITHOUT_UNRESOLVABLE_LINKS' extends Modifiers
    ? Asset | undefined
    : Asset | AssetLink
  : Field

export type ResolvedField<
  Field extends EntryField<FieldsWithContentTypeIdType>,
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = Field extends EntryFields.Array<infer Item>
  ? Array<ResolvedLink<Item, Modifiers, Locales>>
  : ResolvedLink<Field, Modifiers, Locales>

export type Entry<
  FieldsWithContentTypeId extends FieldsWithContentTypeIdType = FieldsWithContentTypeIdType,
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = BaseEntry & {
  sys: { contentType: { sys: { id: FieldsWithContentTypeId['contentTypeId'] } } }
  fields: ChainModifiers extends Modifiers
    ?
        | {
            [FieldName in keyof FieldsWithContentTypeId['fields']]: {
              [LocaleName in Locales]?: ResolvedField<
                FieldsWithContentTypeId['fields'][FieldName],
                Modifiers,
                Locales
              >
            }
          }
        | {
            [FieldName in keyof FieldsWithContentTypeId['fields']]: ResolvedField<
              FieldsWithContentTypeId['fields'][FieldName],
              Modifiers,
              Locales
            >
          }
    : 'WITH_ALL_LOCALES' extends Modifiers
    ? {
        [FieldName in keyof FieldsWithContentTypeId['fields']]: {
          [LocaleName in Locales]?: ResolvedField<
            FieldsWithContentTypeId['fields'][FieldName],
            Modifiers,
            Locales
          >
        }
      }
    : {
        [FieldName in keyof FieldsWithContentTypeId['fields']]: ResolvedField<
          FieldsWithContentTypeId['fields'][FieldName],
          Modifiers,
          Locales
        >
      }
}

export type EntryCollection<
  FieldsWithContentTypeId extends FieldsWithContentTypeIdType,
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = ContentfulCollection<Entry<FieldsWithContentTypeId, Modifiers, Locales>> & {
  errors?: Array<any>
  includes?: {
    Entry?: any[]
    Asset?: any[]
  }
}
