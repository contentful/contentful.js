import { AssetMimeType, AssetSys } from '../asset'
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

export type SysQueries<Sys extends FieldsType> = ExistenceFilter<Sys, 'sys'> &
  EqualityFilter<Sys, 'sys'> &
  InequalityFilter<Sys, 'sys'> &
  SubsetFilters<Sys, 'sys'> &
  RangeFilters<Sys, 'sys'> &
  SelectFilter<Sys, 'sys'>

export type EntryFieldsQueries<Fields extends FieldsType = FieldsType> =
  | (ExistenceFilter<Fields, 'fields'> & SelectFilter<Fields, 'fields'>)
  | (EqualityFilter<Fields, 'fields'> & InequalityFilter<Fields, 'fields'>)
  | FullTextSearchFilters<Fields, 'fields'>
  | SubsetFilters<Fields, 'fields'>
  | LocationSearchFilters<Fields, 'fields'>
  | RangeFilters<Fields, 'fields'>

export type QueriesWithContentType<Fields extends FieldsType = FieldsType> =
  EntryFieldsQueries<Fields> & {
    content_type: string
  } & Record<string, any> // why is this necessary???

type QueriesWithoutContentType = Partial<
  SysQueries<Pick<EntrySys, 'createdAt' | 'updatedAt' | 'revision' | 'id' | 'type'>> &
    FixedQueryOptions &
    FixedPagedOptions & { content_type?: string } & { resolveLinks?: never }
  // & Record<string,any> // can this be removed?
>

// TODO: create-contentful-api complained about non-optional fields when initialized with {}
export type EntriesQueries<Fields extends FieldsType = FieldsType> =
  | QueriesWithContentType<Fields>
  | QueriesWithoutContentType

const example = {
  getEntries<Fields extends FieldsType>(_: EntriesQueries<Fields>) {
    return '{ entry }'
  },
}

example.getEntries({ select: 's' }) // fails, ok
example.getEntries({ select: 's', content_type: 'x' }) // ok

example.getEntries({ 'sys.revision[gt]': 4 }) // ok
example.getEntries({ 'sys.revision[gt]': 4, content_type: 'x' }) // ok

example.getEntries({ content_type: 'x' }) // ok

example.getEntries<{ x: 1 }>({ 'fields.x': 'x' }) // fails, ok
example.getEntries<{ x: 1 }>({ 'fields.x': 'x', content_type: 'x' }) // content_type hint is optional??
example.getEntries<{ x: 1 }>({ 'fields.x[exists]': 'x' }) // only exists and equality filters are present, there is no
// subset, fulltext, location or range!!

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
