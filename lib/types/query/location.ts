import { ConditionalPick } from 'type-fest'
import { EntryFieldTypes } from '../entry'

type Types = EntryFieldTypes.Location | undefined

export type ProximitySearchFilterInput = [number, number]
export type BoundingBoxSearchFilterInput = [number, number, number, number]
export type BoundingCircleSearchFilterInput = [number, number, number]

type BaseLocationFilter<
  Fields,
  SupportedTypes,
  ValueType,
  Prefix extends string,
  QueryFilter extends string = ''
> = NonNullable<{
  [FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string &
    FieldName}[${QueryFilter}]`]?: ValueType
}>

/**
 * @desc near - location proximity search
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/location-proximity-search}
 */
export type ProximitySearchFilter<Fields, Prefix extends string> = BaseLocationFilter<
  Fields,
  Types,
  ProximitySearchFilterInput,
  Prefix,
  'near'
>

/**
 * @desc within - location in a bounding object
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/locations-in-a-bounding-object}
 */
type BoundingObjectSearchFilter<Fields, Prefix extends string> = BaseLocationFilter<
  Fields,
  Types,
  BoundingCircleSearchFilterInput | BoundingBoxSearchFilterInput,
  Prefix,
  'within'
>

/**
 * @desc location search
 * @see [proximity]{@link ProximitySearchFilter}
 * @see [bounding object]{@link BoundingObjectSearchFilter}
 */
export type LocationSearchFilters<Fields, Prefix extends string> = ProximitySearchFilter<
  Fields,
  Prefix
> &
  BoundingObjectSearchFilter<Fields, Prefix>
