import { EntryFields } from '../entry'
import { ConditionalFixedQueries, NonEmpty } from './util'

type SupportedTypes = EntryFields.Text | EntryFields.RichText | EntryFields.Symbol | undefined

/**
 * @desc match - full text search
 * @see [documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/full-text-search}
 */
export type FullTextSearchFilters<Fields, Prefix extends string> = NonEmpty<
  ConditionalFixedQueries<Fields, SupportedTypes, string, Prefix, '[match]'>
>
