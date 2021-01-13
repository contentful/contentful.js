import { ConditionalPick } from 'type-fest'
import { EntryFields } from "../entry"

// In the future figure out how to really exclude the `Date` type
type SupportedTypes = EntryFields.Location
type BaseOrArrayType<T> = T extends Array<infer U> ? U : T

type ProximitySearchFilterInput = [number, number]
type BoundingBoxSearchFilterInput = [number, number, number, number]
type BoundingCircleSearchFilterInput = [number, number, number]

type ProximitySearchFilters<Fields, Prefix extends string> = {
 [FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string & FieldName}[near]`]?:
      BaseOrArrayType<Fields[FieldName]> extends EntryFields.Location
        ? ProximitySearchFilterInput
      : never
}

type BoundingBoxSearchFilters<Fields, Prefix extends string> = {
[FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string & FieldName}[within]`]?:
      BaseOrArrayType<Fields[FieldName]> extends EntryFields.Location
        ? BoundingBoxSearchFilterInput
      : never
}

type BoundingCircleSearchFilters<Fields, Prefix extends string> = {
[FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string & FieldName}[within]`]?:
      BaseOrArrayType<Fields[FieldName]> extends EntryFields.Location
        ? BoundingCircleSearchFilterInput
      : never
}

export type LocationSearchFilters<Fields, Prefix extends string> = 
  ProximitySearchFilters<Fields, Prefix> | BoundingBoxSearchFilters<Fields, Prefix> | BoundingCircleSearchFilters<Fields, Prefix>
