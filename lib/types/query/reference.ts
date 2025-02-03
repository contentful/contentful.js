import type { EntryFieldTypes } from '../entry.js'
import type { ConditionalPick } from 'type-fest'

type SupportedTypes =
  | EntryFieldTypes.Array<EntryFieldTypes.EntryLink<any>>
  | EntryFieldTypes.EntryLink<any>
  | undefined

/**
 * Search on references in provided fields
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/search-on-references | Documentation}
 * @internal
 */
export type ReferenceSearchFilters<Fields, Prefix extends string> = {
  [FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string &
    FieldName}.${string}`]?: any
}
