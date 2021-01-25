import { BasicEntryField } from '../entry'
import { ConditionalFixedQueries } from './util'

/**
 * @name exists
 * @desc check for existence
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/existence}
 */
export type ExistenceQueries<Fields, Prefix extends string> = ConditionalFixedQueries<Fields,
  BasicEntryField,
  boolean,
  Prefix,
  '[exists]'>

// TODO: it still includes 'Link' fields

