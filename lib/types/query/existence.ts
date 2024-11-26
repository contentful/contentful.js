import type { EntryField, EntryFieldType } from '../entry.js'
import type { ConditionalFixedQueries, FieldsType, EntrySkeletonType } from './util.js'
import type { AssetDetails, AssetFile } from '../asset.js'

/**
 * Check for existence of provided fields
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/existence | Documentation}
 * @internal
 */
export type ExistenceFilter<
  Fields extends FieldsType,
  Prefix extends string,
> = ConditionalFixedQueries<
  Fields,
  EntryField<EntrySkeletonType<Fields>> | AssetFile | AssetDetails | undefined,
  boolean,
  Prefix,
  '[exists]'
>

/**
 * Check for existence of provided fields in an entry
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/existence | Documentation}
 * @internal
 */
export type EntryFieldsExistenceFilter<
  Fields extends FieldsType,
  Prefix extends string,
> = ConditionalFixedQueries<
  Fields,
  EntryFieldType<EntrySkeletonType> | undefined,
  boolean,
  Prefix,
  '[exists]'
>
