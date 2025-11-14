import type { Document as RichTextDocument } from '@contentful/rich-text-types'
import type { Asset } from './asset.js'
import type { ContentfulCollection, CursorPaginatedCollection } from './collection.js'
import type { ContentTypeLink, UnresolvedLink } from './link.js'
import type { LocaleCode } from './locale.js'
import type { Metadata } from './metadata.js'
import type { EntrySkeletonType } from './query/index.js'
import type { EntitySys } from './sys.js'
import type { JsonArray, JsonObject } from 'type-fest'
import type { ResourceLink } from './resource-link.js'
import type { ChainModifiers } from './client.js'

/**
 * System managed metadata for entries
 * @category Entry
 */
export interface EntrySys extends EntitySys {
  contentType: { sys: ContentTypeLink }
  type: 'Entry'
}

/**
 * Definition of abstract entry field types with additional type properties
 * Introduced to properly distinguish all fields to create consistent query types
 * @category Entry
 */
export declare namespace EntryFieldTypes {
  type Symbol<Values extends string = string> = { type: 'Symbol'; values: Values }
  type Text<Values extends string = string> = { type: 'Text'; values: Values }
  type Integer<Values extends number = number> = { type: 'Integer'; values: Values }
  type Number<Values extends number = number> = { type: 'Number'; values: Values }
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
  type ExternalResourceLink = {
    type: 'ExternalResourceLink'
  }
  type AssetLink = { type: 'AssetLink' }
  type Array<
    Item extends
      | EntryFieldTypes.Symbol
      | EntryFieldTypes.AssetLink
      | EntryFieldTypes.EntryLink<EntrySkeletonType>
      | EntryFieldTypes.EntryResourceLink<EntrySkeletonType>
      | EntryFieldTypes.ExternalResourceLink,
  > = { type: 'Array'; item: Item }
  type Object<Data extends JsonObject | JsonArray | null = JsonObject | JsonArray | null> = {
    type: 'Object'
    data: Data
  }
}

/**
 * Definition of entry fields
 * @category Entry
 */
export declare namespace EntryFields {
  type Symbol<Values extends string = string> = Values
  type Text<Values extends string = string> = Values
  type Integer<Values extends number = number> = Values
  type Number<Values extends number = number> = Values
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
 * All possible values for entry field types with additional type properties
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
  | EntryFieldTypes.ExternalResourceLink
  | EntryFieldTypes.AssetLink
  | EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  | EntryFieldTypes.Array<EntryFieldTypes.AssetLink>
  | EntryFieldTypes.Array<EntryFieldTypes.EntryLink<EntrySkeleton>>
  | EntryFieldTypes.Array<
      EntryFieldTypes.EntryResourceLink<EntrySkeleton> | EntryFieldTypes.ExternalResourceLink
    >

/**
 * All possible values for entry field types
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
 * Mapping between abstract entry field types with additional type information
 * and entry field types
 * @category Entry
 */
export type BaseFieldMap<Field extends EntryFieldType<EntrySkeletonType>> =
  Field extends EntryFieldTypes.Symbol<infer Values>
    ? EntryFields.Symbol<Values>
    : Field extends EntryFieldTypes.Text<infer Values>
      ? EntryFields.Text<Values>
      : Field extends EntryFieldTypes.Integer<infer Values>
        ? EntryFields.Integer<Values>
        : Field extends EntryFieldTypes.Number<infer Values>
          ? EntryFields.Number<Values>
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

/**
 * A single resolved link to another entry in the same space
 * If the current client configuration includes `withoutLinkResolution` chain option,
 * the returned type will not resolve linked entities, but keep them as objects
 * If the current client configuration includes `withoutUnresolvableLinks` chain option,
 * the returned type will not include non-resolvable linked entities
 * @category Entry
 * @typeParam Modifiers - The chain modifiers used to configure the client. They’re set automatically when using the client chain modifiers.
 * @typeParam Locales - If provided for a client using `allLocales` modifier, response type defines locale keys for entry field values.
 * @typeParam LinkedEntry - Shape of the linked entry used to calculate dynamic keys
 * @internal
 */
export type ResolvedEntryLink<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
  LinkedEntry extends EntrySkeletonType,
> = ChainModifiers extends Modifiers
  ? Entry<LinkedEntry, Modifiers, Locales> | UnresolvedLink<'Entry'> | undefined
  : 'WITHOUT_LINK_RESOLUTION' extends Modifiers
    ? UnresolvedLink<'Entry'>
    : 'WITHOUT_UNRESOLVABLE_LINKS' extends Modifiers
      ? Entry<LinkedEntry, Modifiers, Locales> | undefined
      : Entry<LinkedEntry, Modifiers, Locales> | UnresolvedLink<'Entry'>

/**
 * A single resolved reference link to another entry in a different space
 * If the current client configuration includes `withoutLinkResolution` chain option,
 * the returned type will not resolve linked entities, but keep them as objects
 * If the current client configuration includes `withoutUnresolvableLinks` chain option,
 * the returned type will not include non-resolvable linked entities
 * @category Entry
 * @typeParam Modifiers - The chain modifiers used to configure the client. They’re set automatically when using the client chain modifiers.
 * @typeParam Locales - If provided for a client using `allLocales` modifier, response type defines locale keys for entry field values.
 * @typeParam LinkedEntry - Shape of the linked entry used to calculate dynamic keys
 * @internal
 */
export type ResolvedEntryResourceLink<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
  LinkedEntry extends EntrySkeletonType,
> = ChainModifiers extends Modifiers
  ? Entry<LinkedEntry, Modifiers, Locales> | { sys: ResourceLink } | undefined
  : 'WITHOUT_LINK_RESOLUTION' extends Modifiers
    ? { sys: ResourceLink }
    : 'WITHOUT_UNRESOLVABLE_LINKS' extends Modifiers
      ? Entry<LinkedEntry, Modifiers, Locales> | undefined
      : Entry<LinkedEntry, Modifiers, Locales> | { sys: ResourceLink }

/**
 * A single resolved link to another asset
 * If the current client configuration includes `withoutLinkResolution` chain option,
 * the returned type will not resolve linked entities, but keep them as objects
 * If the current client configuration includes `withoutUnresolvableLinks` chain option,
 * the returned type will not include non-resolvable linked entities
 * @category Entry
 * @typeParam Modifiers - The chain modifiers used to configure the client. They’re set automatically when using the client chain modifiers.
 * @internal
 */
export type ResolvedAssetLink<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
> = ChainModifiers extends Modifiers
  ? Asset<Modifiers, Locales> | UnresolvedLink<'Asset'> | undefined
  : 'WITHOUT_LINK_RESOLUTION' extends Modifiers
    ? UnresolvedLink<'Asset'>
    : 'WITHOUT_UNRESOLVABLE_LINKS' extends Modifiers
      ? Asset<Modifiers, Locales> | undefined
      : Asset<Modifiers, Locales> | UnresolvedLink<'Asset'>

/**
 * A single resolved link to another resource
 * @category Entry
 * @typeParam Field - Shape of an entry used to calculate dynamic keys
 * @typeParam Modifiers - The chain modifiers used to configure the client. They’re set automatically when using the client chain modifiers.
 * @typeParam Locales - If provided for a client using `allLocales` modifier, response type defines locale keys for entry field values.
 * @internal
 */
export type ResolvedLink<
  Field extends EntryFieldType<EntrySkeletonType>,
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> =
  Field extends EntryFieldTypes.EntryLink<infer LinkedEntry>
    ? ResolvedEntryLink<Modifiers, Locales, LinkedEntry>
    : Field extends EntryFieldTypes.EntryResourceLink<infer LinkedEntry>
      ? ResolvedEntryResourceLink<Modifiers, Locales, LinkedEntry>
      : Field extends EntryFieldTypes.ExternalResourceLink
        ? { sys: ResourceLink<string> }
        : Field extends EntryFieldTypes.AssetLink
          ? ResolvedAssetLink<Modifiers, Locales>
          : BaseFieldMap<Field>

/**
 * A collection or single resolved link to another resource
 * @category Entry
 * @typeParam Field - Shape of an entry used to calculate dynamic keys
 * @typeParam Modifiers - The chain modifiers used to configure the client. They’re set automatically when using the client chain modifiers.
 * @typeParam Locales - If provided for a client using `allLocales` modifier, response type defines locale keys for entry field values.
 * @see {@link https://www.contentful.com/developers/docs/concepts/links/ | Documentation}
 */
export type ResolvedField<
  Field extends EntryFieldType<EntrySkeletonType>,
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> =
  Field extends EntryFieldTypes.Array<infer Item>
    ? Array<ResolvedLink<Item, Modifiers, Locales>>
    : ResolvedLink<Field, Modifiers, Locales>

/**
 * Entry represents anything defined as a Content Type in a space
 * @category Entry
 * @typeParam EntrySkeleton - Shape of entry fields used to calculate dynamic keys
 * @typeParam Modifiers - The chain modifiers used to configure the client. They’re set automatically when using the client chain modifiers.
 * @typeParam Locales - If provided for a client using `allLocales` modifier, response type defines locale keys for entry field values.
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/entries | Documentation}
 */
export type Entry<
  EntrySkeleton extends EntrySkeletonType = EntrySkeletonType,
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
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
 * A collection of entries
 * @category Entry
 * @typeParam EntrySkeleton - Shape of entry fields used to calculate dynamic keys
 * @typeParam Modifiers - The chain modifiers used to configure the client. They’re set automatically when using the client chain modifiers.
 * @typeParam Locales - If provided for a client using `allLocales` modifier, response type defines locale keys for entry field values.
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/entries | Documentation}
 */
export type EntryCollection<
  EntrySkeleton extends EntrySkeletonType,
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = ContentfulCollection<Entry<EntrySkeleton, Modifiers, Locales>> & {
  errors?: Array<any>
  includes?: {
    Entry?: Entry<EntrySkeletonType, Modifiers, Locales>[]
    Asset?: Asset<Modifiers, Locales>[]
  }
}

/**
 * A cursor paginated collection of entries
 * @category Entry
 * @typeParam EntrySkeleton - Shape of entry fields used to calculate dynamic keys
 * @typeParam Modifiers - The chain modifiers used to configure the client. They’re set automatically when using the client chain modifiers.
 * @typeParam Locales - If provided for a client using `allLocales` modifier, response type defines locale keys for entry field values.
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/entries | Documentation}
 */
export type EntryCursorPaginatedCollection<
  EntrySkeleton extends EntrySkeletonType,
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = CursorPaginatedCollection<Entry<EntrySkeleton, Modifiers, Locales>> & {
  errors?: Array<any>
  includes?: {
    Entry?: Entry<EntrySkeletonType, Modifiers, Locales>[]
    Asset?: Asset<Modifiers, Locales>[]
  }
}
