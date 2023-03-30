import { Document as RichTextDocument } from '@contentful/rich-text-types'
import { Asset } from './asset'
import { ContentfulCollection } from './collection'
import { AssetLink, ContentTypeLink, Link } from './link'
import { LocaleCode } from './locale'
import { Metadata } from './metadata'
import { EntrySkeletonType } from './query'
import { EntitySys } from './sys'
import { ChainModifiers } from '../utils/client-helpers'
import { JsonArray, JsonObject } from 'type-fest'
import { ResourceLink } from './resource-link'

/**
 * @category Entry
 */
export interface EntrySys extends EntitySys {
  contentType: { sys: ContentTypeLink }
  type: 'Entry'
}

/**
 * @category Entry
 */
export declare namespace EntryFieldTypes {
  type Symbol = { type: 'Symbol' }
  type Text = { type: 'Text' }
  type Integer = { type: 'Integer' }
  type Number = { type: 'Number' }
  type Date = { type: 'Date' }
  type Boolean = { type: 'Boolean' }
  type Location = { type: 'Location' }
  type RichText = { type: 'RichText' }

  type EntryLink<EntrySkeleton extends EntrySkeletonType> = {
    type: 'EntryLink'
    entry: EntrySkeleton
  }
  type EntryResourceLink<EntrySkeleton extends EntrySkeletonType> = {
    type: 'EntryResourceLink'
    entry: EntrySkeleton
  }
  type AssetLink = { type: 'AssetLink' }
  type Array<
    Item extends
      | EntryFieldTypes.Symbol
      | EntryFieldTypes.AssetLink
      | EntryFieldTypes.EntryLink<EntrySkeletonType>
      | EntryFieldTypes.EntryResourceLink<EntrySkeletonType>
  > = { type: 'Array'; item: Item }
  type Object<Data extends JsonObject | JsonArray | null = JsonObject | JsonArray | null> = {
    type: 'Object'
    data: Data
  }
}

/**
 * @category Entry
 */
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

  type EntryLink<EntrySkeleton extends EntrySkeletonType> = Entry<EntrySkeleton>
  type AssetLink = Asset
  type Link<EntrySkeleton extends EntrySkeletonType> = AssetLink | EntryLink<EntrySkeleton>
  type Array<Item extends EntryFields.Symbol | AssetLink | EntryLink<EntrySkeletonType>> = Item[]
  type Object<Data extends JsonObject | JsonArray | null = JsonObject | JsonArray | null> = Data
  type RichText = RichTextDocument
}

/**
 * @category Entry
 */
export type EntryFieldType<EntrySkeleton extends EntrySkeletonType> =
  | EntryFieldTypes.Symbol
  | EntryFieldTypes.Text
  | EntryFieldTypes.Integer
  | EntryFieldTypes.Number
  | EntryFieldTypes.Date
  | EntryFieldTypes.Boolean
  | EntryFieldTypes.Location
  | EntryFieldTypes.RichText
  | EntryFieldTypes.Object
  | EntryFieldTypes.EntryLink<EntrySkeleton>
  | EntryFieldTypes.EntryResourceLink<EntrySkeleton>
  | EntryFieldTypes.AssetLink
  | EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  | EntryFieldTypes.Array<EntryFieldTypes.AssetLink>
  | EntryFieldTypes.Array<EntryFieldTypes.EntryLink<EntrySkeleton>>
  | EntryFieldTypes.Array<EntryFieldTypes.EntryResourceLink<EntrySkeleton>>

/**
 * @category Entry
 */
export type EntryField<EntrySkeleton extends EntrySkeletonType> =
  | EntryFields.Symbol
  | EntryFields.Text
  | EntryFields.Integer
  | EntryFields.Number
  | EntryFields.Date
  | EntryFields.Boolean
  | EntryFields.Location
  | EntryFields.RichText
  | EntryFields.Object
  | EntryFields.EntryLink<EntrySkeleton>
  | EntryFields.AssetLink
  | EntryFields.Array<EntryFields.Symbol>
  | EntryFields.Array<EntryFields.AssetLink>
  | EntryFields.Array<EntryFields.EntryLink<EntrySkeleton>>

/**
 * @category Entry
 */
export type BaseEntry = {
  sys: EntrySys
  metadata: Metadata
}

/**
 * @category Entry
 */
export type BaseFieldMap<Field extends EntryFieldType<EntrySkeletonType>> =
  Field extends EntryFieldTypes.Symbol
    ? EntryFields.Symbol
    : Field extends EntryFieldTypes.Text
    ? EntryFields.Text
    : Field extends EntryFieldTypes.Integer
    ? EntryFields.Integer
    : Field extends EntryFieldTypes.Number
    ? EntryFields.Number
    : Field extends EntryFieldTypes.Date
    ? EntryFields.Date
    : Field extends EntryFieldTypes.Boolean
    ? EntryFields.Boolean
    : Field extends EntryFieldTypes.Location
    ? EntryFields.Location
    : Field extends EntryFieldTypes.RichText
    ? EntryFields.RichText
    : Field extends EntryFieldTypes.Object<infer Data>
    ? EntryFields.Object<Data>
    : never

type ResolvedEntryLink<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
  LinkedEntry extends EntrySkeletonType
> = ChainModifiers extends Modifiers
  ? Entry<LinkedEntry, Modifiers, Locales> | { sys: Link<'Entry'> } | undefined
  : 'WITHOUT_LINK_RESOLUTION' extends Modifiers
  ? { sys: Link<'Entry'> }
  : 'WITHOUT_UNRESOLVABLE_LINKS' extends Modifiers
  ? Entry<LinkedEntry, Modifiers, Locales> | undefined
  : Entry<LinkedEntry, Modifiers, Locales> | { sys: Link<'Entry'> }

type ResolvedEntryResourceLink<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
  LinkedEntry extends EntrySkeletonType
> = ChainModifiers extends Modifiers
  ? Entry<LinkedEntry, Modifiers, Locales> | { sys: ResourceLink } | undefined
  : 'WITHOUT_LINK_RESOLUTION' extends Modifiers
  ? { sys: ResourceLink }
  : 'WITHOUT_UNRESOLVABLE_LINKS' extends Modifiers
  ? Entry<LinkedEntry, Modifiers, Locales> | undefined
  : Entry<LinkedEntry, Modifiers, Locales> | { sys: ResourceLink }

type ResolvedAssetLink<Modifiers extends ChainModifiers> = ChainModifiers extends Modifiers
  ? Asset | { sys: AssetLink } | undefined
  : 'WITHOUT_LINK_RESOLUTION' extends Modifiers
  ? { sys: AssetLink }
  : 'WITHOUT_UNRESOLVABLE_LINKS' extends Modifiers
  ? Asset | undefined
  : Asset | { sys: AssetLink }

type ResolvedLink<
  Field extends EntryFieldType<EntrySkeletonType>,
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = Field extends EntryFieldTypes.EntryLink<infer LinkedEntry>
  ? ResolvedEntryLink<Modifiers, Locales, LinkedEntry>
  : Field extends EntryFieldTypes.EntryResourceLink<infer LinkedEntry>
  ? ResolvedEntryResourceLink<Modifiers, Locales, LinkedEntry>
  : Field extends EntryFieldTypes.AssetLink
  ? ResolvedAssetLink<Modifiers>
  : BaseFieldMap<Field>

/**
 * @category Entry
 */
export type ResolvedField<
  Field extends EntryFieldType<EntrySkeletonType>,
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = Field extends EntryFieldTypes.Array<infer Item>
  ? Array<ResolvedLink<Item, Modifiers, Locales>>
  : ResolvedLink<Field, Modifiers, Locales>

/**
 * @category Entry
 */
export type Entry<
  EntrySkeleton extends EntrySkeletonType = EntrySkeletonType,
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = BaseEntry & {
  sys: { contentType: { sys: { id: EntrySkeleton['contentTypeId'] } } }
  fields: ChainModifiers extends Modifiers
    ?
        | {
            [FieldName in keyof EntrySkeleton['fields']]: {
              [LocaleName in Locales]?: ResolvedField<
                EntrySkeleton['fields'][FieldName],
                Modifiers,
                Locales
              >
            }
          }
        | {
            [FieldName in keyof EntrySkeleton['fields']]: ResolvedField<
              EntrySkeleton['fields'][FieldName],
              Modifiers,
              Locales
            >
          }
    : 'WITH_ALL_LOCALES' extends Modifiers
    ? {
        [FieldName in keyof EntrySkeleton['fields']]: {
          [LocaleName in Locales]?: ResolvedField<
            EntrySkeleton['fields'][FieldName],
            Modifiers,
            Locales
          >
        }
      }
    : {
        [FieldName in keyof EntrySkeleton['fields']]: ResolvedField<
          EntrySkeleton['fields'][FieldName],
          Modifiers,
          Locales
        >
      }
}

/**
 * @category Entry
 */
export type EntryCollection<
  EntrySkeleton extends EntrySkeletonType,
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = ContentfulCollection<Entry<EntrySkeleton, Modifiers, Locales>> & {
  errors?: Array<any>
  includes?: {
    Entry?: any[]
    Asset?: any[]
  }
}
