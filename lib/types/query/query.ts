import { AssetMimeType, AssetSys } from '../asset'
import { EntrySys } from '../entry'
import { EqualityFilter, InequalityFilter } from './equality'
import { ExistenceFilter } from './existence'
import { LocationSearchFilters } from './location'
import { RangeFilters } from './range'
import { FullTextSearchFilters } from './search'
import { AssetSelectFilter, EntrySelectFilter, EntrySelectFilterWithFields } from './select'
import { SubsetFilters } from './subset'
import { ConditionalFixedQueries, ConditionalListQueries, FieldsType } from './util'
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
  | ExistenceFilter<Fields, 'fields'>
  | EqualityFilter<Fields, 'fields'>
  | InequalityFilter<Fields, 'fields'>
  | FullTextSearchFilters<Fields, 'fields'>
  | SubsetFilters<Fields, 'fields'>
  | LocationSearchFilters<Fields, 'fields'>
  | RangeFilters<Fields, 'fields'>
  | ReferenceSearchFilters<Fields, 'fields'>

export type EntriesQueries<Fields extends FieldsType> =
  | (EntryFieldsQueries<Fields> & { content_type: string })
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

export type AssetQueries<Fields extends FieldsType> = AssetFieldsQueries<Fields> &
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
