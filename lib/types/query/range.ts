import { ConditionalPick } from 'type-fest'
import { EntryFields } from '../entry'
import { BaseOrArrayType } from './util'

type SubsetFilterTypes = 'lt' | 'lte' | 'gt' | 'gte'

type SupportedTypes = EntryFields.Number | EntryFields.Integer | EntryFields.Date

/**
 * @desc Range operators are available that you can apply to date and number fields
 * {string} lt: Less than.
 * {string} lte: Less than or equal to.
 * {string} gt: Greater than.
 * {string} gte: Greater than or equal to.
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/select-operator}
 */
export type RangeFilters<Fields, Prefix extends string> = {
  [FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string &
    FieldName}[${SubsetFilterTypes}]`]?: BaseOrArrayType<Fields[FieldName]> extends number
    ? number
    : BaseOrArrayType<Fields[FieldName]> extends EntryFields.Date
    ? EntryFields.Date
    : never
}
