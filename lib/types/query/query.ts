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

export type SysQueries<Sys extends FieldsType> = ExistenceFilter<Sys, 'sys'> &
  EqualityFilter<Sys, 'sys'> &
  InequalityFilter<Sys, 'sys'> &
  SubsetFilters<Sys, 'sys'> &
  RangeFilters<Sys, 'sys'>

export type MetadataTagsQueries =
  | ConditionalFixedQueries<Pick<Metadata, 'tags'>, any, boolean, 'metadata', '[exists]'>
  | ConditionalListQueries<Pick<TagLink, 'id'>, any, 'metadata.tags.sys', '[all]'>
  | ConditionalListQueries<Pick<TagLink, 'id'>, any, 'metadata.tags.sys', '[in]'>

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

export type EntriesQueries<EntrySkeleton extends EntrySkeletonType> =
  | (EntryFieldsQueries<EntrySkeleton['fields']> &
      EntryContentTypeQuery<EntrySkeleton['contentTypeId']>)
  | (SysQueries<Pick<EntrySys, 'createdAt' | 'updatedAt' | 'revision' | 'id' | 'type'>> &
      MetadataTagsQueries &
      EntrySelectFilter &
      EntryOrderFilter &
      FixedQueryOptions &
      FixedPagedOptions &
      FixedLinkOptions)

export type EntryQueries = Omit<FixedQueryOptions, 'query'>

export type AssetFieldsQueries<Fields extends FieldsType> = ExistenceFilter<Fields, 'fields'> &
  EqualityFilter<Fields, 'fields'> &
  InequalityFilter<Fields, 'fields'> &
  FullTextSearchFilters<Fields, 'fields'> &
  AssetSelectFilter<Fields> &
  AssetOrderFilter &
  RangeFilters<Fields, 'fields'> &
  SubsetFilters<Fields, 'fields'>

export type AssetFieldsFileQueries = ExistenceFilter<AssetFile, 'fields.file'> &
  EqualityFilter<AssetFile, 'fields.file'> &
  InequalityFilter<AssetFile, 'fields.file'> &
  FullTextSearchFilters<AssetFile, 'fields.file'> &
  RangeFilters<AssetFile, 'fields.file'> &
  SubsetFilters<AssetFile, 'fields.file'>

export type AssetFieldsFileDetailsQueries = ExistenceFilter<
  Pick<AssetDetails, 'size'>,
  'fields.file.details'
> &
  EqualityFilter<Pick<AssetDetails, 'size'>, 'fields.file.details'> &
  InequalityFilter<Pick<AssetDetails, 'size'>, 'fields.file.details'> &
  RangeFilters<Pick<AssetDetails, 'size'>, 'fields.file.details'> &
  SubsetFilters<Pick<AssetDetails, 'size'>, 'fields.file.details'>

export type AssetQueries<Fields extends FieldsType> = AssetFieldsQueries<Fields> &
  AssetFieldsFileQueries &
  AssetFieldsFileDetailsQueries &
  SysQueries<Pick<AssetSys, 'createdAt' | 'updatedAt' | 'revision' | 'id' | 'type'>> &
  MetadataTagsQueries &
  FixedQueryOptions &
  FixedPagedOptions & { mimetype_group?: AssetMimeType }

export type TagNameFilters = {
  'name[exists]'?: boolean
  name?: string
  'name[ne]'?: string
  'name[match]'?: string
  'name[in]'?: string[]
  'name[nin]'?: string[]
}

export type TagQueries = TagNameFilters &
  SysQueries<Pick<TagSys, 'createdAt' | 'updatedAt' | 'visibility' | 'id' | 'type'>> &
  TagOrderFilter &
  FixedPagedOptions
