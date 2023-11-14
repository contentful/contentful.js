import { EntryFields, EntryFieldType, EntryFieldTypes } from '../entry'
import { ConditionalQueries, EntryFieldsConditionalQueries, EntrySkeletonType } from './util'

type SupportedTypes =
  | EntryFields.Symbol
  | EntryFields.Symbol[]
  | EntryFields.Text
  | EntryFields.Integer
  | EntryFields.Number
  | EntryFields.Date
  | EntryFields.Boolean
  | undefined

type SupportedEntryFieldTypes =
  | EntryFieldTypes.Symbol
  | EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  | EntryFieldTypes.Text
  | EntryFieldTypes.Integer
  | EntryFieldTypes.Number
  | EntryFieldTypes.Date
  | EntryFieldTypes.Boolean
  | undefined

/**
 * Equality filters in provided fields - search for exact matches
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/equality-operator | Documentation}
 * @internal
 */
export type EqualityFilter<Fields, Prefix extends string> = ConditionalQueries<
  Fields,
  SupportedTypes,
  Prefix,
  ''
>

/**
 * Equality filters in provided fields of an entry - search for exact matches
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/equality-operator | Documentation}
 * @internal
 */
export type EntryFieldsEqualityFilter<
  Fields extends Record<string, EntryFieldType<EntrySkeletonType>>,
  Prefix extends string,
> = EntryFieldsConditionalQueries<Fields, SupportedEntryFieldTypes, Prefix, ''>

/**
 * Inequality filters in provided fields - exclude matching items
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/inequality-operator | Documentation}
 * @internal
 */
export type InequalityFilter<Fields, Prefix extends string> = ConditionalQueries<
  Fields,
  SupportedTypes,
  Prefix,
  '[ne]'
>

/**
 * Inequality filters in provided fields of an entry - exclude matching items
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/inequality-operator | Documentation}
 * @internal
 */
export type EntryFieldsInequalityFilter<
  Fields extends Record<string, EntryFieldType<EntrySkeletonType>>,
  Prefix extends string,
> = EntryFieldsConditionalQueries<Fields, SupportedEntryFieldTypes, Prefix, '[ne]'>
