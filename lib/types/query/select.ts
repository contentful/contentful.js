import { FieldsType } from './util'
import { EntrySys } from '../entry'
import { AssetSys } from '../asset'

export type SelectFilterPaths<
  Fields extends FieldsType,
  Prefix extends string
> = `${Prefix}.${keyof Fields & string}`

/**
 * @desc select for entries
 * @see [documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/select-operator}
 */
export type EntrySelectFilter<Fields extends FieldsType> =
  | {
      select?: ('sys' | 'fields' | SelectFilterPaths<EntrySys, 'sys'>)[]
    }
  | {
      content_type: string
      select?: (
        | 'sys'
        | 'fields'
        | SelectFilterPaths<EntrySys, 'sys'>
        | SelectFilterPaths<Fields, 'fields'>
      )[]
    }

/**
 * @desc select for assets
 * @see [documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/select-operator}
 */
export type AssetSelectFilter<Fields extends FieldsType> = {
  select?: (
    | 'sys'
    | SelectFilterPaths<AssetSys, 'sys'>
    | 'fields'
    | SelectFilterPaths<Fields, 'fields'>
  )[]
}
