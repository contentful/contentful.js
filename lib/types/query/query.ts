import { EntrySys } from '../entry'
import { EqualityQueries, InequalityQueries } from './equality'
import { ExistenceQueries } from './existence'
import { FullTextSearchFilters } from './fts'
import { LocationSearchFilters } from './location'
import { RangeFilters } from './range'
import { SelectQueries } from './select'
import { SubsetFilters } from './subset'
import { FieldsType } from './util'

type FixedPagedOptions = {
  skip?: number
  limit?: number
}

type FixedQueryOptions = {
  include?: number
  locale?: string
  query?: string
}

export type SysQueries<Sys> = ExistenceQueries<Sys, 'sys'> &
  EqualityQueries<Sys, 'sys'> &
  InequalityQueries<Sys, 'sys'> &
  SubsetFilters<Sys, 'sys'> &
  RangeFilters<Sys, 'sys'> &
  SelectQueries<Sys, 'sys'>

export type EntryFieldsQueries<Fields extends FieldsType = FieldsType> = ExistenceQueries<
  Fields,
  'fields'
> &
  EqualityQueries<Fields, 'fields'> &
  InequalityQueries<Fields, 'fields'> &
  SubsetFilters<Fields, 'fields'> &
  RangeFilters<Fields, 'fields'> &
  FullTextSearchFilters<Fields, 'fields'> &
  LocationSearchFilters<Fields, 'fields'> &
  SelectQueries<Fields, 'fields'>

export type EntryQueries<Fields extends FieldsType = FieldsType> = EntryFieldsQueries<Fields> &
  SysQueries<EntrySys> &
  FixedQueryOptions &
  FixedPagedOptions &
  Record<string, any>
