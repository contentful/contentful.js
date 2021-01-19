import { ConditionalPick } from 'type-fest'
import { EntryFields } from '../entry'
import { BaseOrArrayType } from './util'

type FilterType = 'match'
// In the future figure out how to really exclude the `Date` type
type SupportedTypes = Exclude<
  EntryFields.Symbol | EntryFields.Text | EntryFields.RichText,
  EntryFields.Date
>
/**
 * @desc match - full text search
 * @see [documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/full-text-search}
 */
export type FullTextSearchFilters<Fields, Prefix extends string> = {
  [FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string &
    FieldName}[${FilterType}]`]?: BaseOrArrayType<Fields[FieldName]> extends EntryFields.Date
    ? never
    : BaseOrArrayType<Fields[FieldName]> extends SupportedTypes
    ? string
    : never
}
