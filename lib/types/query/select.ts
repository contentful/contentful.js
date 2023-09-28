import { FieldsType } from './util'
import { EntrySys } from '../entry'
import { AssetSys } from '../asset'
import { Metadata } from '../metadata'

export type SelectFilterPaths<
  Fields extends FieldsType,
  Prefix extends string
> = `${Prefix}.${keyof Fields & string}`

/**
 * Select fields from provided fields in an entry
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/select-operator | Documentation}
 * @internal
 */
export type EntrySelectFilterWithFields<Fields extends FieldsType> = {
  select?: (
    | 'sys'
    | 'fields'
    | 'metadata'
    | SelectFilterPaths<EntrySys, 'sys'>
    | SelectFilterPaths<Fields, 'fields'>
    | SelectFilterPaths<Metadata, 'metadata'>
  )[]
}

/**
 * Select fields in an entry
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/select-operator | Documentation}
 * @internal
 */
export type EntrySelectFilter = {
  select?: (
    | 'sys'
    | 'fields'
    | 'metadata'
    | SelectFilterPaths<EntrySys, 'sys'>
    | SelectFilterPaths<Metadata, 'metadata'>
  )[]
}

/**
 * Select fields in an asset
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/select-operator | Documentation}
 * @internal
 */
export type AssetSelectFilter<Fields extends FieldsType> = {
  select?: (
    | 'sys'
    | SelectFilterPaths<AssetSys, 'sys'>
    | 'fields'
    | SelectFilterPaths<Fields, 'fields'>
    | 'metadata'
    | SelectFilterPaths<Metadata, 'metadata'>
  )[]
}
