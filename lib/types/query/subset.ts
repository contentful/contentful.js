import { EntryFields } from '..'
import { ConditionalListQueries } from './util'

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
