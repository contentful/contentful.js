import { ConditionalPick } from 'type-fest'
import { BasicEntryField, EntryFields } from '..'

type SubsetFilterTypes = 'in' | 'nin'
type SupportedTypes = Exclude<BasicEntryField, EntryFields.Location | EntryFields.RichText>

/**
 * @desc inclusion & exclusion
 * @see [inclusion documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/inclusion}
 * @see [exclusion documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/exclusion}
 * @example
 * // {'fields.myField', 'singleValue'}
 * // {'fields.myField', 'firstValue,secondValue'}
 */
export type SubsetFilters<Fields, Prefix extends string> = {
  [FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string &
    FieldName}[${SubsetFilterTypes}]`]?: Fields[FieldName]
}
