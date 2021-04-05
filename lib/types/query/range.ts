import { ConditionalPick } from 'type-fest'
import { Asset } from '../asset'
import { Entry, EntryFields } from '../entry'
import { BaseOrArrayType } from './util'

type RangeFilterTypes = 'lt' | 'lte' | 'gt' | 'gte'

type SupportedTypes = EntryFields.Date | EntryFields.Number | EntryFields.Integer

/**
 * @desc Range operators are available that you can apply to date and number fields
 * {string} lt: Less than.
 * {string} lte: Less than or equal to.
 * {string} gt: Greater than.
 * {string} gte: Greater than or equal to.
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/select-operator}
 */
export type RangeFilters<Fields, Prefix extends string> = NonNullable<
  {
    [FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string &
      FieldName}[${RangeFilterTypes}]`]?: BaseOrArrayType<Fields[FieldName]> extends SupportedTypes
      ? BaseOrArrayType<Fields[FieldName]>
      : never
  }
>
