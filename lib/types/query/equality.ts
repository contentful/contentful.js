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
 * @desc equality - search for exact matches
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/equality-operator}
 */
export type EqualityFilter<Fields, Prefix extends string> = ConditionalQueries<
  Fields,
  SupportedTypes,
  Prefix,
  ''
>

/**
 * @desc equality - search for exact matches
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/equality-operator}
 */
export type EntryFieldsEqualityFilter<
  Fields extends Record<string, EntryFieldType<EntrySkeletonType>>,
  Prefix extends string
> = EntryFieldsConditionalQueries<Fields, SupportedEntryFieldTypes, Prefix, ''>

/**
 * @desc inequality - exclude matching items
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/inequality-operator}
 */
export type InequalityFilter<Fields, Prefix extends string> = ConditionalQueries<
  Fields,
  SupportedTypes,
  Prefix,
  '[ne]'
>

/**
 * @desc inequality - exclude matching items
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/inequality-operator}
 */
export type EntryFieldsInequalityFilter<
  Fields extends Record<string, EntryFieldType<EntrySkeletonType>>,
  Prefix extends string
> = EntryFieldsConditionalQueries<Fields, SupportedEntryFieldTypes, Prefix, '[ne]'>
