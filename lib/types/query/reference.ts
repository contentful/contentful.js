import { EntryFields } from '../entry'
import { ConditionalPick } from 'type-fest'

type SupportedTypes = EntryFields.EntryLink<any>

/**
 * @desc search on references
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/search-on-references}
 */
export type ReferenceSearchFilters<Fields, Prefix extends string> = {
  [FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string &
    FieldName}.${string}`]?: any
}
