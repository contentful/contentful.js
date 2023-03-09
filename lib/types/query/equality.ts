import { EntryFields } from '../entry'
import { ConditionalQueries, NonEmpty } from './util'

type SupportedTypes =
  | EntryFields.Symbol
  | EntryFields.Text
  | EntryFields.Integer
  | EntryFields.Number
  | EntryFields.Date
  | EntryFields.Boolean
  | undefined
/**
 * @desc equality - search for exact matches
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/equality-operator}
 */
export type EqualityFilter<Fields, Prefix extends string> = NonEmpty<
  ConditionalQueries<Fields, SupportedTypes, Prefix, ''>
>

/**
 * @desc inequality - exclude matching items
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/inequality-operator}
 */
export type InequalityFilter<Fields, Prefix extends string> = NonEmpty<
  ConditionalQueries<Fields, SupportedTypes, Prefix, '[ne]'>
>

/**
 * @desc equality - search for exact matches
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/equality-operator}
 */
export type EqualityFilter2<Field> = Field extends SupportedTypes
  ? { ''?: Field }
  : // eslint-disable-next-line @typescript-eslint/ban-types
    {}

/**
 * @desc inequality - exclude matching items
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/inequality-operator}
 */
export type InequalityFilter2<Field> = Field extends SupportedTypes
  ? { '[ne]'?: Field }
  : // eslint-disable-next-line @typescript-eslint/ban-types
    {}

// TODO: it still includes 'Link' fields
