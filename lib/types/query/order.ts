import { FieldsType } from './util'
import { EntryFields, EntrySys } from '../entry'
import { AssetSys } from '../asset'
import { ConditionalPick } from 'type-fest'
import { TagSys } from '../tag'

type SupportedTypes =
  | EntryFields.Symbol
  | EntryFields.Integer
  | EntryFields.Number
  | EntryFields.Date
  | EntryFields.Boolean
  | undefined

type SupportedLinkTypes = EntryFields.AssetLink | EntryFields.EntryLink<any> | undefined

export type OrderFilterPaths<Fields extends FieldsType, Prefix extends string> =
  | `${Prefix}.${keyof ConditionalPick<Fields, SupportedTypes> & string}`
  | `-${Prefix}.${keyof ConditionalPick<Fields, SupportedTypes> & string}`

/**
 * @desc order for entries
 * @see [documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/order}
 */
export type EntryOrderFilterWithFields<Fields extends FieldsType> = {
  order?: (
    | OrderFilterPaths<Fields, 'fields'>
    | `fields.${keyof ConditionalPick<Fields, SupportedLinkTypes> & string}.sys.id`
    | `-fields.${keyof ConditionalPick<Fields, SupportedLinkTypes> & string}.sys.id`
    | OrderFilterPaths<EntrySys, 'sys'>
    | 'sys.contentType.sys.id'
    | '-sys.contentType.sys.id'
  )[]
}

/**
 * @desc order for entries
 * @see [documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/order}
 */
export type EntryOrderFilter = {
  order?: (
    | OrderFilterPaths<EntrySys, 'sys'>
    | 'sys.contentType.sys.id'
    | '-sys.contentType.sys.id'
  )[]
}

/**
 * @desc order for assets
 * @see [documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/order}
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
 * @desc order for tags
 * @see [documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/order}
 */
export type TagOrderFilter = {
  order?: (OrderFilterPaths<TagSys, 'sys'> | 'name' | '-name')[]
}
