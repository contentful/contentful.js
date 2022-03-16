import type { AssetMimeType, AssetSys } from '../asset'
import type { EntryFields, EntrySys } from '../entry'
import type { EqualityFilter, InequalityFilter } from './equality'
import type { ExistenceFilter } from './existence'
import type { LocationSearchFilters } from './location'
import type { RangeFilters } from './range'
import type { FullTextSearchFilters } from './search'
import type { SelectFilter } from './select'
import type { SubsetFilters } from './subset'
import type { FieldsType } from './util'

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
  | (ExistenceFilter<Fields, 'fields'> &
      EqualityFilter<Fields, 'fields'> &
      InequalityFilter<Fields, 'fields'> &
      FullTextSearchFilters<Fields, 'fields'> &
      SelectFilter<Fields, 'fields'>)
  | SubsetFilters<Fields, 'fields'>
  | LocationSearchFilters<Fields, 'fields'>
  | RangeFilters<Fields, 'fields'>

// TODO: create-contentful-api complained about non-optional fields when initialized with {}
export type EntriesQueries<Fields extends FieldsType = FieldsType> = Partial<
  EntryFieldsQueries<Fields> &
   // SysQueries<Pick<EntrySys, 'createdAt' | 'updatedAt' | 'revision' | 'id' | 'type'>> &
    FixedQueryOptions &
    FixedPagedOptions & { content_type?: string } & Record<string, any> & {
      resolveLinks?: never
    }
>

export type EntryQueries = Omit<FixedQueryOptions, 'query'>

export type AssetFieldsQueries<Fields extends FieldsType = FieldsType> =
  | (ExistenceFilter<Fields, 'fields'> &
      EqualityFilter<Fields, 'fields'> &
      InequalityFilter<Fields, 'fields'> &
      FullTextSearchFilters<Fields, 'fields'> &
      SelectFilter<Fields, 'fields'>)
  | RangeFilters<Fields, 'fields'>
  | SubsetFilters<Fields, 'fields'>

export type AssetQueries<Fields extends FieldsType = FieldsType> = Partial<
  AssetFieldsQueries<Fields> &
    SysQueries<Pick<AssetSys, 'createdAt' | 'updatedAt' | 'revision' | 'id' | 'type'>> &
    FixedQueryOptions &
    FixedPagedOptions & { mimetype_group?: AssetMimeType } & Record<string, any>
>

const test = <T>(query:EntriesQueries<T>) => query

const q = test<{aField: EntryFields.Text, }>({})
console.log(q)
