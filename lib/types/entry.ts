import { Document as RichTextDocument } from '@contentful/rich-text-types'
import { Asset } from './asset'
import { ContentfulCollection } from './collection'
import { AssetLink, ContentTypeLink, EntryLink } from './link'
import { LocaleCode } from './locale'
import { Metadata } from './metadata'
import { FieldsType } from './query/util'
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

  type EntryLink<Fields extends FieldsType> = Entry<Fields>
  type AssetLink = Asset
  type Link<Fields extends FieldsType> = AssetLink | EntryLink<Fields>
  type Array<Item extends EntryFields.Symbol | AssetLink | EntryLink<FieldsType>> = Item[]
  type Object<Data extends JsonObject | JsonArray | null = JsonObject | JsonArray | null> = Data
  type RichText = RichTextDocument
}

export type EntryField<Fields extends FieldsType> =
  | EntryFields.Symbol
  | EntryFields.Text
  | EntryFields.Integer
  | EntryFields.Number
  | EntryFields.Date
  | EntryFields.Boolean
  | EntryFields.Location
  | EntryFields.RichText
  | EntryFields.Object
  | EntryFields.EntryLink<Fields>
  | EntryFields.AssetLink
  | EntryFields.Array<EntryFields.Symbol>
  | EntryFields.Array<EntryFields.AssetLink>
  | EntryFields.Array<EntryFields.EntryLink<Fields>>

export type BaseEntry = {
  sys: EntrySys
  metadata: Metadata
}

type ResolvedLink<
  Field extends EntryField<FieldsType>,
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = Field extends EntryFields.EntryLink<infer LinkedFields>
  ? ChainModifiers extends Modifiers
    ? Entry<LinkedFields, Modifiers, Locales> | EntryLink | undefined
    : 'WITHOUT_LINK_RESOLUTION' extends Modifiers
    ? EntryLink
    : 'WITHOUT_UNRESOLVABLE_LINKS' extends Modifiers
    ? Entry<LinkedFields, Modifiers, Locales> | undefined
    : Entry<LinkedFields, Modifiers, Locales> | EntryLink
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
  Field extends EntryField<FieldsType>,
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = Field extends EntryFields.Array<infer Item>
  ? Array<ResolvedLink<Item, Modifiers, Locales>>
  : ResolvedLink<Field, Modifiers, Locales>

export type Entry<
  Fields extends FieldsType = FieldsType,
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = BaseEntry & {
  fields: ChainModifiers extends Modifiers
    ?
        | {
            [FieldName in keyof Fields]: {
              [LocaleName in Locales]?: ResolvedField<Fields[FieldName], Modifiers, Locales>
            }
          }
        | {
            [FieldName in keyof Fields]: ResolvedField<Fields[FieldName], Modifiers, Locales>
          }
    : 'WITH_ALL_LOCALES' extends Modifiers
    ? {
        [FieldName in keyof Fields]: {
          [LocaleName in Locales]?: ResolvedField<Fields[FieldName], Modifiers, Locales>
        }
      }
    : {
        [FieldName in keyof Fields]: ResolvedField<Fields[FieldName], Modifiers, Locales>
      }
}

export type EntryWithContentTypeId<EntryType extends Entry, id> = EntryType & { sys: { contentType: { sys: id } } }

export type EntryCollection<
  Fields extends FieldsType = FieldsType,
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = ContentfulCollection<Entry<Fields, Modifiers, Locales>> & {
  errors?: Array<any>
  includes?: {
    Entry?: any[]
    Asset?: any[]
  }
}
