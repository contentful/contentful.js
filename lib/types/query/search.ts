import { ConditionalPick } from 'type-fest'
import { BasicEntryField } from '../entry'

type FilterType = 'match'

// TODO: should Boolean field type be excluded? and should the value be always of type string?
type SupportedTypes = BasicEntryField
/**
 * @desc match - full text search
 * @see [documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/full-text-search}
 */
export type FullTextSearchFilters<Fields, Prefix extends string> = NonNullable<
  {
    [FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string &
      FieldName}[${FilterType}]`]?: string
  }
>
