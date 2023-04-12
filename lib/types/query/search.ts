import { EntryFields, EntryFieldTypes } from '../entry'
import { ConditionalFixedQueries, FieldsType } from './util'

type SupportedTypes =
  | EntryFields.Text
  | EntryFields.RichText
  | EntryFields.Symbol
  | EntryFields.Symbol[]
  | undefined

type SupportedEntryFieldTypes =
  | EntryFieldTypes.Text
  | EntryFieldTypes.RichText
  | EntryFieldTypes.Symbol
  | EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  | undefined

/**
 * match - full text search in provided fields
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/full-text-search | Documentation}
 * @internal
 */
export type FullTextSearchFilters<
  Fields extends FieldsType,
  Prefix extends string
> = ConditionalFixedQueries<Fields, SupportedTypes, string, Prefix, '[match]'>

/**
 * match - full text search in provided fields of an entry
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/full-text-search | Documentation}
 * @internal
 */
export type EntryFieldsFullTextSearchFilters<
  Fields extends FieldsType,
  Prefix extends string
> = ConditionalFixedQueries<Fields, SupportedEntryFieldTypes, string, Prefix, '[match]'>
