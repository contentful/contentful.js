import { EntryFields, EntryFieldType, EntryFieldTypes } from '../entry'
import { ConditionalQueries, EntryFieldsConditionalQueries, EntrySkeletonType } from './util'

type RangeFilterTypes = 'lt' | 'lte' | 'gt' | 'gte'

type SupportedTypes = EntryFields.Date | EntryFields.Number | EntryFields.Integer | undefined

type SupportedEntryFieldTypes =
  | EntryFieldTypes.Date
  | EntryFieldTypes.Number
  | EntryFieldTypes.Integer
  | undefined

/**
 * @desc Range operators are available that you can apply to date and number fields
 * {string} lt: Less than.
 * {string} lte: Less than or equal to.
 * {string} gt: Greater than.
 * {string} gte: Greater than or equal to.
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/select-operator}
 */
export type RangeFilters<Fields, Prefix extends string> = ConditionalQueries<
  Fields,
  SupportedTypes,
  Prefix,
  `[${RangeFilterTypes}]`
>

/**
 * @desc Range operators are available that you can apply to date and number fields
 * {string} lt: Less than.
 * {string} lte: Less than or equal to.
 * {string} gt: Greater than.
 * {string} gte: Greater than or equal to.
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/select-operator}
 */
export type EntryFieldsRangeFilters<
  Fields extends Record<string, EntryFieldType<EntrySkeletonType>>,
  Prefix extends string
> = EntryFieldsConditionalQueries<Fields, SupportedEntryFieldTypes, Prefix, `[${RangeFilterTypes}]`>
