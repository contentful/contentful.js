import { ConditionalPick } from 'type-fest'
import { EntryFields } from '../entry'
import { BaseOrArrayType } from './util'

// In the future figure out how to really exclude the `Date` type
type Types = EntryFields.Location

type ProximitySearchFilterInput = [number, number]
type BoundingBoxSearchFilterInput = [number, number, number, number]
type BoundingCircleSearchFilterInput = [number, number, number]

type BaseLocationQueries<
  Fields,
  SupportedTypes,
  ValueType,
  Prefix extends string,
  QueryFilter extends string = ''
> = {
  [FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string &
    FieldName}${QueryFilter}`]?: BaseOrArrayType<Fields[FieldName]> extends SupportedTypes
    ? ValueType
    : never
}

type ProximitySearchFilters<Fields, Prefix extends string> = BaseLocationQueries<
  Fields,
  Types,
  ProximitySearchFilterInput,
  Prefix,
  '[near]'
>

type BoundingBoxSearchFilters<Fields, Prefix extends string> = BaseLocationQueries<
  Fields,
  Types,
  BoundingBoxSearchFilterInput,
  Prefix,
  '[within]'
>

type BoundingCircleSearchFilters<Fields, Prefix extends string> = BaseLocationQueries<
  Fields,
  Types,
  BoundingCircleSearchFilterInput,
  Prefix,
  '[within]'
>

export type LocationSearchFilters<Fields, Prefix extends string> =
  | ProximitySearchFilters<Fields, Prefix>
  | BoundingBoxSearchFilters<Fields, Prefix>
  | BoundingCircleSearchFilters<Fields, Prefix>
