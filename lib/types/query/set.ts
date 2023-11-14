import { EntryFieldType, EntryFieldTypes } from '..'
import { EntryFieldsConditionalListQueries } from './util'

type SupportedTypes =
  | EntryFieldTypes.Symbol
  | EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  | EntryFieldTypes.Text
  | undefined

/**
 * Match multiple values in provided fields of an entry
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/array-with-multiple-values | Documentation}
 * @internal
 */
export type EntryFieldsSetFilter<
  Fields extends Record<string, EntryFieldType<any>>,
  Prefix extends string,
> = EntryFieldsConditionalListQueries<Fields, SupportedTypes, Prefix, `[all]`>
