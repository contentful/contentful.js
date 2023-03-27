import { EntryField, EntryFieldType } from '../entry'
import { ConditionalFixedQueries, FieldsType, EntrySkeletonType } from './util'
import { AssetDetails, AssetFile } from '../asset'

/**
 * @name exists
 * @desc check for existence
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/existence}
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
 * @name exists
 * @desc check for existence
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/existence}
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
