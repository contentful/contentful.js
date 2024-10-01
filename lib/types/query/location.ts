import { ConditionalPick } from 'type-fest'
import { EntryFieldTypes } from '../entry.js'

type Types = EntryFieldTypes.Location | undefined

export type ProximitySearchFilterInput = [number, number]
export type BoundingBoxSearchFilterInput = [number, number, number, number]
export type BoundingCircleSearchFilterInput = [number, number, number]

type BaseLocationFilter<
  Fields,
  SupportedTypes,
  ValueType,
  Prefix extends string,
  QueryFilter extends string = '',
> = NonNullable<{
  [FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string &
    FieldName}[${QueryFilter}]`]?: ValueType
}>

/**
 * near - location proximity search in provided fields
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/location-proximity-search | Documentation}
 * @internal
 */
export type ProximitySearchFilter<Fields, Prefix extends string> = BaseLocationFilter<
  Fields,
  Types,
  ProximitySearchFilterInput,
  Prefix,
  'near'
>

/**
 * within - location in a bounding object in provided fields
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/locations-in-a-bounding-object | Documentation}
 * @internal
 */
export type BoundingObjectSearchFilter<Fields, Prefix extends string> = BaseLocationFilter<
  Fields,
  Types,
  BoundingCircleSearchFilterInput | BoundingBoxSearchFilterInput,
  Prefix,
  'within'
>

/**
 * Location search
 * @see {@link ProximitySearchFilter}
 * @see {@link BoundingObjectSearchFilter}
 * @internal
 */
export type LocationSearchFilters<Fields, Prefix extends string> = ProximitySearchFilter<
  Fields,
  Prefix
> &
  BoundingObjectSearchFilter<Fields, Prefix>
