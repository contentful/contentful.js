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
 * Range operators appliable to date and number fields
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/ranges | Documentation}
 * @internal
 */
export type RangeFilters<Fields, Prefix extends string> = ConditionalQueries<
  Fields,
  SupportedTypes,
  Prefix,
  `[${RangeFilterTypes}]`
>

/**
 * Range operators appliable to date and number fields in an entry
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/ranges | Documentation}
 * @internal
 */
export type EntryFieldsRangeFilters<
  Fields extends Record<string, EntryFieldType<EntrySkeletonType>>,
  Prefix extends string
> = EntryFieldsConditionalQueries<Fields, SupportedEntryFieldTypes, Prefix, `[${RangeFilterTypes}]`>
