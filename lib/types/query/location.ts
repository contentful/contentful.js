import { ConditionalPick } from 'type-fest'
import { EntryFields } from '../entry'

type Types = EntryFields.Location

type ProximitySearchFilterInput = [number, number]
type BoundingBoxSearchFilterInput = [number, number, number, number]
type BoundingCircleSearchFilterInput = [number, number, number]

type NonEmpty<T> = T extends Record<string, never> ? never : T

type BaseLocationQueries<
  Fields,
  SupportedTypes,
  ValueType,
  Prefix extends string,
  QueryFilter extends string = ''
> = NonEmpty<NonNullable<
  {
    [FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string &
      FieldName}[${QueryFilter}]`]?: ValueType
  }
>>

/**
 * @desc near - location proximity search
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/location-proximity-search}
 */
export type ProximitySearchFilters<Fields, Prefix extends string> = BaseLocationQueries<
  Fields,
  Types,
  ProximitySearchFilterInput,
  Prefix,
  'near'
>

/**
 * @desc within - location in a bounding rectangle
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/locations-in-a-bounding-object}
 */
type BoundingBoxSearchFilters<Fields, Prefix extends string> = BaseLocationQueries<
  Fields,
  Types,
  BoundingBoxSearchFilterInput,
  Prefix,
  'within'
>
/**
 * @desc within - location in a bounding circle
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/locations-in-a-bounding-object}
 */
type BoundingCircleSearchFilters<Fields, Prefix extends string> = BaseLocationQueries<
  Fields,
  Types,
  BoundingCircleSearchFilterInput,
  Prefix,
  'within'
>

/**
 * @desc location search
 * @see [proximity]{@link ProximitySearchFilters}
 * @see [bounding rectangle]{@link BoundingBoxSearchFilters}
 * @see [bounding circle]{@link BoundingCircleSearchFilters}
 */
export type LocationSearchFilters<Fields, Prefix extends string> =
  | ProximitySearchFilters<Fields, Prefix>
  | BoundingBoxSearchFilters<Fields, Prefix>
  | BoundingCircleSearchFilters<Fields, Prefix>
