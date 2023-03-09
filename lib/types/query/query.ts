import { AssetMimeType, AssetSys } from '../asset'
import { EntrySys } from '../entry'
import { EqualityFilter, EqualityFilter2, InequalityFilter, InequalityFilter2 } from './equality'
import { ExistenceFilter, ExistenceFilter2 } from './existence'
import { LocationSearchFilters, LocationSearchFilters2 } from './location'
import { RangeFilters } from './range'
import { FullTextSearchFilters } from './search'
import { AssetSelectFilter, EntrySelectFilter, EntrySelectFilterWithFields } from './select'
import { SubsetFilters, SubsetFilters2 } from './subset'
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

export type EntryFieldsQueries<Fields extends FieldsType> =
  | EntrySelectFilterWithFields<Fields>
  | ExistenceFilter<Fields, 'fields'>
  | EqualityFilter<Fields, 'fields'>
  | InequalityFilter<Fields, 'fields'>
  | FullTextSearchFilters<Fields, 'fields'>
  | SubsetFilters<Fields, 'fields'>
  | LocationSearchFilters<Fields, 'fields'>
  | RangeFilters<Fields, 'fields'>

export type EntryFieldsQueries2<Fields extends FieldsType> = {
  fields: {
    [FieldName in keyof Fields]?: ExistenceFilter2 &
      EqualityFilter2<Fields[FieldName]> &
      InequalityFilter2<Fields[FieldName]> &
      SubsetFilters2<Fields[FieldName]> &
      LocationSearchFilters2<Fields[FieldName]>
  }
}

// TODO: create-contentful-api complained about non-optional fields when initialized with {}
export type EntriesQueries<Fields extends FieldsType> =
  | EntryFieldsQueries2<Fields>
  | (EntryFieldsQueries<Fields> & { content_type: string })
  | (SysQueries<Pick<EntrySys, 'createdAt' | 'updatedAt' | 'revision' | 'id' | 'type'>> &
      EntrySelectFilter &
      FixedQueryOptions &
      FixedPagedOptions & { order?: string })

export type EntryQueries = Omit<FixedQueryOptions, 'query'>

export type AssetFieldsQueries<Fields extends FieldsType> =
  | (ExistenceFilter<Fields, 'fields'> &
      EqualityFilter<Fields, 'fields'> &
      InequalityFilter<Fields, 'fields'> &
      FullTextSearchFilters<Fields, 'fields'> &
      AssetSelectFilter<Fields>)
  | RangeFilters<Fields, 'fields'>
  | SubsetFilters<Fields, 'fields'>

export type AssetQueries<Fields extends FieldsType> = AssetFieldsQueries<Fields> &
  SysQueries<Pick<AssetSys, 'createdAt' | 'updatedAt' | 'revision' | 'id' | 'type'>> &
  FixedQueryOptions &
  FixedPagedOptions & { mimetype_group?: AssetMimeType } & { order?: string }
