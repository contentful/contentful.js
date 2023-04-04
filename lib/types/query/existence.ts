import { EntryField, EntryFieldType } from '../entry'
import { ConditionalFixedQueries, FieldsType, EntrySkeletonType } from './util'
import { AssetDetails, AssetFile } from '../asset'

/**
 * Check for existence in provided fields
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/existence | Documentation}
 * @internal
 */
export type ExistenceFilter<
  Fields extends FieldsType,
  Prefix extends string
> = ConditionalFixedQueries<
  Fields,
  EntryField<EntrySkeletonType<Fields>> | AssetFile | AssetDetails | undefined,
  boolean,
  Prefix,
  '[exists]'
>

/**
 * Check for existence in provided fields of an entry
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/existence | Documentation}
 * @internal
 */
export type EntryFieldsExistenceFilter<
  Fields extends FieldsType,
  Prefix extends string
> = ConditionalFixedQueries<
  Fields,
  EntryFieldType<EntrySkeletonType> | undefined,
  boolean,
  Prefix,
  '[exists]'
>
