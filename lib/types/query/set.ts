import { EntryFieldType, EntryFieldTypes } from '..'
import { EntryFieldsConditionalListQueries } from './util'

type SupportedTypes =
  | EntryFieldTypes.Symbol
  | EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  | EntryFieldTypes.Text
  | undefined

/**
 * @desc match multiple values
 * @see [documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/array-with-multiple-values}
 */
export type EntryFieldsSetFilter<
  Fields extends Record<string, EntryFieldType<any>>,
  Prefix extends string
> = EntryFieldsConditionalListQueries<Fields, SupportedTypes, Prefix, `[all]`>
