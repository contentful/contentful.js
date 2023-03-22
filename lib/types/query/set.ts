import { EntryFields } from '..'
import { ConditionalListQueries } from './util'

type SupportedTypes = EntryFields.Symbol | EntryFields.Symbol[] | EntryFields.Text | undefined

/**
 * @desc match multiple values
 * @see [documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/array-with-multiple-values}
 */
export type SetFilter<Fields, Prefix extends string> = ConditionalListQueries<
  Fields,
  SupportedTypes,
  Prefix,
  `[all]`
>
