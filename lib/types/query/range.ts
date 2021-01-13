import { ConditionalPick } from 'type-fest'
import { EntryFields } from "../entry"

type SubsetFilterTypes = 'lt' | 'lte' | 'gt' | 'gte'

type SupportedTypes = number | EntryFields.Date
type BaseOrArrayType<T> = T extends Array<infer U> ? U : T

export type RangeFilters<Fields, Prefix extends string> = {
    [FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string & FieldName}[${SubsetFilterTypes}]`]?:
      BaseOrArrayType<Fields[FieldName]> extends number
        ? number
      : BaseOrArrayType<Fields[FieldName]> extends EntryFields.Date
        ? EntryFields.Date
      : never
}
