import { EntrySkeletonType, FieldsType } from './util'
import { EntryFields, EntryFieldType, EntryFieldTypes, EntrySys } from '../entry'
import { AssetSys } from '../asset'
import { ConditionalPick } from 'type-fest'
import { TagSys } from '../tag'

type SupportedTypes =
  | EntryFields.Symbol
  | EntryFields.Integer
  | EntryFields.Number
  | EntryFields.Date
  | EntryFields.Boolean
  | EntryFields.Location
  | undefined

type SupportedEntryFieldTypes =
  | EntryFieldTypes.Symbol
  | EntryFieldTypes.Integer
  | EntryFieldTypes.Number
  | EntryFieldTypes.Date
  | EntryFieldTypes.Boolean
  | EntryFieldTypes.Location
  | undefined

type SupportedLinkTypes = EntryFieldTypes.AssetLink | EntryFieldTypes.EntryLink<any> | undefined

type OrderFilterPaths<Fields extends FieldsType, Prefix extends string> =
  | `${Prefix}.${keyof ConditionalPick<Fields, SupportedTypes> & string}`
  | `-${Prefix}.${keyof ConditionalPick<Fields, SupportedTypes> & string}`

/**
 * Order for provided fields in an entry
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/order | Documentation}
 * @internal
 */
export type EntryOrderFilterWithFields<
  Fields extends Record<string, EntryFieldType<EntrySkeletonType>>
> = {
  order?: (
    | `fields.${keyof ConditionalPick<Fields, SupportedEntryFieldTypes> & string}`
    | `-fields.${keyof ConditionalPick<Fields, SupportedEntryFieldTypes> & string}`
    | `fields.${keyof ConditionalPick<Fields, SupportedLinkTypes> & string}.sys.id`
    | `-fields.${keyof ConditionalPick<Fields, SupportedLinkTypes> & string}.sys.id`
    | OrderFilterPaths<EntrySys, 'sys'>
    | 'sys.contentType.sys.id'
    | '-sys.contentType.sys.id'
  )[]
}

/**
 * Order in an entry
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/order | Documentation}
 * @internal
 */
export type EntryOrderFilter = {
  order?: (
    | OrderFilterPaths<EntrySys, 'sys'>
    | 'sys.contentType.sys.id'
    | '-sys.contentType.sys.id'
  )[]
}

/**
 * Order in an asset
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/order | Documentation}
 * @internal
 */
export type AssetOrderFilter = {
  order?: (
    | OrderFilterPaths<AssetSys, 'sys'>
    | 'fields.file.contentType'
    | '-fields.file.contentType'
    | 'fields.file.fileName'
    | '-fields.file.fileName'
    | 'fields.file.url'
    | '-fields.file.url'
    | 'fields.file.details.size'
    | '-fields.file.details.size'
  )[]
}

/**
 * Order in a tag
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/order | Documentation}
 * @internal
 */
export type TagOrderFilter = {
  order?: (OrderFilterPaths<TagSys, 'sys'> | 'name' | '-name')[]
}
