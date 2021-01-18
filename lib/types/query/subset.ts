import { ConditionalPick } from 'type-fest'
import { BasicEntryField, EntryFields } from '..'

// All is probably only legit for array fields
type SubsetFilterTypes = 'in' | 'nin' | 'all'
type SupportedTypes = Exclude<BasicEntryField, EntryFields.Location>

export type SubsetFilters<Fields, Prefix extends string> = {
  [FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string &
    FieldName}[${SubsetFilterTypes}]`]?: Fields[FieldName] extends Array<any>
    ? Fields[FieldName]
    : Array<Fields[FieldName]>
}
