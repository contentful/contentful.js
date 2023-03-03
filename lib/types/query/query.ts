import { AssetMimeType, AssetSys } from '../asset'
import { EntrySys } from '../entry'
import { EqualityFilter, InequalityFilter } from './equality'
import { ExistenceFilter } from './existence'
import { LocationSearchFilters } from './location'
import { RangeFilters } from './range'
import { FullTextSearchFilters } from './search'
import { AssetSelectFilter, EntrySelectFilter } from './select'
import { SubsetFilters } from './subset'
import { FieldsType } from './util'

type FixedPagedOptions = {
  skip?: number
  limit?: number
}

type FixedQueryOptions = {
  include?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  locale?: string
  query?: string
}

export type SysQueries<Sys extends FieldsType> = ExistenceFilter<Sys, 'sys'> &
  EqualityFilter<Sys, 'sys'> &
  InequalityFilter<Sys, 'sys'> &
  SubsetFilters<Sys, 'sys'> &
  RangeFilters<Sys, 'sys'>

export type EntryFieldsQueries<Fields extends FieldsType = FieldsType> =
  | EntrySelectFilter<Fields>
  | ExistenceFilter<Fields, 'fields'>
  | (EqualityFilter<Fields, 'fields'> & InequalityFilter<Fields, 'fields'>)
  | FullTextSearchFilters<Fields, 'fields'>
  | SubsetFilters<Fields, 'fields'>
  | LocationSearchFilters<Fields, 'fields'>
  | RangeFilters<Fields, 'fields'>

// TODO: create-contentful-api complained about non-optional fields when initialized with {}
export type EntriesQueries<Fields extends FieldsType = FieldsType> = EntryFieldsQueries<Fields> &
  SysQueries<Pick<EntrySys, 'createdAt' | 'updatedAt' | 'revision' | 'id' | 'type'>> &
  FixedQueryOptions &
  FixedPagedOptions & { content_type?: string } & {
    resolveLinks?: never
  } & { order?: string }

export type EntryQueries = Omit<FixedQueryOptions, 'query'>

export type AssetFieldsQueries<Fields extends FieldsType = FieldsType> =
  | (ExistenceFilter<Fields, 'fields'> &
      EqualityFilter<Fields, 'fields'> &
      InequalityFilter<Fields, 'fields'> &
      FullTextSearchFilters<Fields, 'fields'> &
      AssetSelectFilter<Fields>)
  | RangeFilters<Fields, 'fields'>
  | SubsetFilters<Fields, 'fields'>

export type AssetQueries<Fields extends FieldsType = FieldsType> = AssetFieldsQueries<Fields> &
  SysQueries<Pick<AssetSys, 'createdAt' | 'updatedAt' | 'revision' | 'id' | 'type'>> &
  FixedQueryOptions &
  FixedPagedOptions & { mimetype_group?: AssetMimeType } & { order?: string }
