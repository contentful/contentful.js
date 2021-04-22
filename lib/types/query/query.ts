import { AssetSys } from '../asset'
import { EntrySys } from '../entry'
import { EqualityFilter, InequalityFilter } from './equality'
import { ExistenceFilter } from './existence'
import { LocationSearchFilters } from './location'
import { RangeFilters } from './range'
import { FullTextSearchFilters } from './search'
import { SelectFilter } from './select'
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

export type SysQueries<Sys> = ExistenceFilter<Sys, 'sys'> &
  EqualityFilter<Sys, 'sys'> &
  InequalityFilter<Sys, 'sys'> &
  SubsetFilters<Sys, 'sys'> &
  RangeFilters<Sys, 'sys'> &
  SelectFilter<Sys, 'sys'>

export type EntryFieldsQueries<Fields extends FieldsType = FieldsType> =
  (
    ExistenceFilter<Fields, 'fields'> &
    EqualityFilter<Fields, 'fields'> &
    InequalityFilter<Fields, 'fields'> &
    SubsetFilters<Fields, 'fields'> &
    FullTextSearchFilters<Fields, 'fields'> &
    SelectFilter<Fields, 'fields'>
    )
  | LocationSearchFilters<Fields, 'fields'>
  | RangeFilters<Fields, 'fields'>

// create-contentful-api complained about non optional fields when initialized with {}
export type EntryQueries<Fields extends FieldsType = FieldsType> = Partial<EntryFieldsQueries<Fields> &
  SysQueries<EntrySys> &
  FixedQueryOptions &
  FixedPagedOptions &
  Record<string, any>>

export type AssetFieldsQueries<Fields extends FieldsType = FieldsType> = Partial<ExistenceFilter<Fields, 'fields'> &
  EqualityFilter<Fields, 'fields'> &
  InequalityFilter<Fields, 'fields'> &
  SubsetFilters<Fields, 'fields'> &
  RangeFilters<Fields, 'fields'> &
  FullTextSearchFilters<Fields, 'fields'> &
  SelectFilter<Fields, 'fields'>>

export type AssetQueries<Fields extends FieldsType = FieldsType> = AssetFieldsQueries<Fields> &
  SysQueries<AssetSys> &
  FixedQueryOptions &
  FixedPagedOptions &
  Record<string, any>
