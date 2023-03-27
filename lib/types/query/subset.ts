import { EntryFields, EntryFieldType, EntryFieldTypes } from '..'
import { ConditionalListQueries, EntryFieldsConditionalListQueries } from './util'

type SubsetFilterTypes = 'in' | 'nin'

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
 * @desc inclusion & exclusion
 * @see [inclusion documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/inclusion}
 * @see [exclusion documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/exclusion}
 */
export type SubsetFilters<Fields, Prefix extends string> = ConditionalListQueries<
  Fields,
  SupportedTypes,
  Prefix,
  `[${SubsetFilterTypes}]`
>

/**
 * @desc inclusion & exclusion
 * @see [inclusion documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/inclusion}
 * @see [exclusion documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/exclusion}
 */
export type EntryFieldsSubsetFilters<
  Fields extends Record<string, EntryFieldType<any>>,
  Prefix extends string
> = EntryFieldsConditionalListQueries<
  Fields,
  SupportedEntryFieldTypes,
  Prefix,
  `[${SubsetFilterTypes}]`
>
