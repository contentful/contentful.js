import { BasicEntryField } from '../entry'
import { ConditionalFixedQueries, NonEmpty } from './util'

// TODO: should Boolean field type be excluded
type SupportedTypes = BasicEntryField
/**
 * @desc match - full text search
 * @see [documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/full-text-search}
 */
export type FullTextSearchFilters<Fields, Prefix extends string> = NonEmpty<
  ConditionalFixedQueries<Fields, SupportedTypes, string, Prefix, '[match]'>
>
