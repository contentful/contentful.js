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
 * @desc match - full text search
 * @see [documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/full-text-search}
 */
export type FullTextSearchFilters<
  Fields extends FieldsType,
  Prefix extends string
> = ConditionalFixedQueries<Fields, SupportedTypes, string, Prefix, '[match]'>

/**
 * @desc match - full text search
 * @see [documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/full-text-search}
 */
export type EntryFieldsFullTextSearchFilters<
  Fields extends FieldsType,
  Prefix extends string
> = ConditionalFixedQueries<Fields, SupportedEntryFieldTypes, string, Prefix, '[match]'>
