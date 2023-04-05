import { AssetDetails, AssetFile, AssetMimeType, AssetSys } from '../asset'
import { EntrySys } from '../entry'
import {
  EntryFieldsEqualityFilter,
  EntryFieldsInequalityFilter,
  EqualityFilter,
  InequalityFilter,
} from './equality'
import { EntryFieldsExistenceFilter, ExistenceFilter } from './existence'
import { LocationSearchFilters } from './location'
import { EntryFieldsRangeFilters, RangeFilters } from './range'
import { EntryFieldsFullTextSearchFilters, FullTextSearchFilters } from './search'
import { AssetSelectFilter, EntrySelectFilter, EntrySelectFilterWithFields } from './select'
import { EntryFieldsSubsetFilters, SubsetFilters } from './subset'
import {
  ConditionalFixedQueries,
  ConditionalListQueries,
  FieldsType,
  EntrySkeletonType,
} from './util'
import { ReferenceSearchFilters } from './reference'
import { TagSys } from '../sys'
import { Metadata } from '../metadata'
import { TagLink } from '../link'
import {
  AssetOrderFilter,
  EntryOrderFilter,
  EntryOrderFilterWithFields,
  TagOrderFilter,
} from './order'
import { EntryFieldsSetFilter } from './set'
import { ChainModifiers } from '../client'

type FixedPagedOptions = {
  skip?: number
  limit?: number
}

type FixedQueryOptions = {
  include?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  query?: string
}

type FixedLinkOptions = {
  links_to_asset?: string
  links_to_entry?: string
}

export type LocaleOption = {
  locale?: string
}

/**
 * All queries appliable to sys fields
 */
export type SysQueries<Sys extends FieldsType> = ExistenceFilter<Sys, 'sys'> &
  EqualityFilter<Sys, 'sys'> &
  InequalityFilter<Sys, 'sys'> &
  SubsetFilters<Sys, 'sys'> &
  RangeFilters<Sys, 'sys'>

/**
 * All queries appliable to metadata fields
 */
export type MetadataTagsQueries =
  | ConditionalFixedQueries<Pick<Metadata, 'tags'>, any, boolean, 'metadata', '[exists]'>
  | ConditionalListQueries<Pick<TagLink, 'id'>, any, 'metadata.tags.sys', '[all]'>
  | ConditionalListQueries<Pick<TagLink, 'id'>, any, 'metadata.tags.sys', '[in]'>

/**
 * All queries appliable to entry fields
 * @typeParam Fields - Shape of entry fields used to calculate dynamic keys
 */
export type EntryFieldsQueries<Fields extends FieldsType> =
  | EntrySelectFilterWithFields<Fields>
  | EntryOrderFilterWithFields<Fields>
  | EntryFieldsExistenceFilter<Fields, 'fields'>
  | EntryFieldsEqualityFilter<Fields, 'fields'>
  | EntryFieldsInequalityFilter<Fields, 'fields'>
  | EntryFieldsFullTextSearchFilters<Fields, 'fields'>
  | EntryFieldsSubsetFilters<Fields, 'fields'>
  | EntryFieldsSetFilter<Fields, 'fields'>
  | LocationSearchFilters<Fields, 'fields'>
  | EntryFieldsRangeFilters<Fields, 'fields'>
  | ReferenceSearchFilters<Fields, 'fields'>

export type EntryContentTypeQuery<T extends string> = {
  content_type: T
}

/**
 * Search parameters for entry collection methods
 * @typeParam EntrySkeleton - Shape of an entry used to calculate dynamic keys
 * @typeParam Modifiers - The chain modifiers used to configure the client. They’re set automatically when using the client chain modifiers.
 * @category Query
 */
export type EntriesQueries<
  EntrySkeleton extends EntrySkeletonType,
  Modifiers extends ChainModifiers
> =
  | (EntryFieldsQueries<EntrySkeleton['fields']> &
      EntryContentTypeQuery<EntrySkeleton['contentTypeId']>)
  | ((SysQueries<Pick<EntrySys, 'createdAt' | 'updatedAt' | 'revision' | 'id' | 'type'>> &
      MetadataTagsQueries &
      EntrySelectFilter &
      EntryOrderFilter &
      FixedQueryOptions &
      FixedPagedOptions &
      FixedLinkOptions) &
      // eslint-disable-next-line @typescript-eslint/ban-types
      ('WITH_ALL_LOCALES' extends Modifiers ? {} : LocaleOption))

/**
 * Search parameters for a single entry methods
 * @typeParam Modifiers - The chain modifiers used to configure the client. They’re set automatically when using the client chain modifiers.
 * @category Query
 */
export type EntryQueries<Modifiers extends ChainModifiers> = Omit<FixedQueryOptions, 'query'> &
  // eslint-disable-next-line @typescript-eslint/ban-types
  ('WITH_ALL_LOCALES' extends Modifiers ? {} : LocaleOption)

/**
 * All queries appliable to asset fields
 * @typeParam Fields - Shape of asset fields used to calculate dynamic keys
 * @category Query
 */
export type AssetFieldsQueries<Fields extends FieldsType> = ExistenceFilter<Fields, 'fields'> &
  EqualityFilter<Fields, 'fields'> &
  InequalityFilter<Fields, 'fields'> &
  FullTextSearchFilters<Fields, 'fields'> &
  AssetSelectFilter<Fields> &
  AssetOrderFilter &
  RangeFilters<Fields, 'fields'> &
  SubsetFilters<Fields, 'fields'>

/**
 * All queries appliable to asset file fields
 * @typeParam Fields - Shape of asset fields used to calculate dynamic keys
 * @category Query
 */
export type AssetFieldsFileQueries = ExistenceFilter<AssetFile, 'fields.file'> &
  EqualityFilter<AssetFile, 'fields.file'> &
  InequalityFilter<AssetFile, 'fields.file'> &
  FullTextSearchFilters<AssetFile, 'fields.file'> &
  RangeFilters<AssetFile, 'fields.file'> &
  SubsetFilters<AssetFile, 'fields.file'>

/**
 * All queries appliable to asset file details fields
 * @typeParam Fields - Shape of asset fields used to calculate dynamic keys
 * @category Query
 */
export type AssetFieldsFileDetailsQueries = ExistenceFilter<
  Pick<AssetDetails, 'size'>,
  'fields.file.details'
> &
  EqualityFilter<Pick<AssetDetails, 'size'>, 'fields.file.details'> &
  InequalityFilter<Pick<AssetDetails, 'size'>, 'fields.file.details'> &
  RangeFilters<Pick<AssetDetails, 'size'>, 'fields.file.details'> &
  SubsetFilters<Pick<AssetDetails, 'size'>, 'fields.file.details'>

/**
 * Search parameters for asset collection methods
 * @typeParam EntrySkeleton Shape of an asset used to calculate dynamic keys
 * @typeParam Modifiers The chain modifiers used to configure the client. They’re set automatically when using the client chain modifiers.
 * @category Query
 */
export type AssetsQueries<
  Fields extends FieldsType,
  Modifiers extends ChainModifiers
> = AssetFieldsQueries<Fields> &
  AssetFieldsFileQueries &
  AssetFieldsFileDetailsQueries &
  SysQueries<Pick<AssetSys, 'createdAt' | 'updatedAt' | 'revision' | 'id' | 'type'>> &
  MetadataTagsQueries &
  FixedQueryOptions &
  FixedPagedOptions & { mimetype_group?: AssetMimeType } & ('WITH_ALL_LOCALES' extends Modifiers
    ? // eslint-disable-next-line @typescript-eslint/ban-types
      {}
    : LocaleOption)

/**
 * Search parameters for a single asset methods
 * @typeParam Modifiers The chain modifiers used to configure the client. They’re set automatically when using the client chain modifiers.
 * @category Query
 */
export type AssetQueries<Modifiers extends ChainModifiers> = 'WITH_ALL_LOCALES' extends Modifiers
  ? never
  : LocaleOption

export type TagNameFilters = {
  'name[exists]'?: boolean
  name?: string
  'name[ne]'?: string
  'name[match]'?: string
  'name[in]'?: string[]
  'name[nin]'?: string[]
}

/**
 * Search parameters for a tag methods
 * @typeParam Modifiers The chain modifiers used to configure the client. They’re set automatically when using the client chain modifiers.
 * @category Query
 */
export type TagQueries = TagNameFilters &
  SysQueries<Pick<TagSys, 'createdAt' | 'updatedAt' | 'visibility' | 'id' | 'type'>> &
  TagOrderFilter &
  FixedPagedOptions
