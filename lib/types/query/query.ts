import { EntrySys } from "../entry"
import { EqualityQueries, InequalityQueries } from "./equality"
import { ExistenceQueries } from "./existence"
import { FullTextSearchFilters } from "./fts"
import { LocationSearchFilters } from "./location"
import { RangeFilters } from "./range"
import { SubsetFilters } from "./subset"

type FixedPagedOptions = {
  skip?: number
  limit?: number
}

type FixedQueryOptions = {
  include?: number
  select?: string | string[]
  locale?: string
  query?: string
}


export type SysQueries<Sys> = 
  ExistenceQueries<Sys, 'sys'> &
  EqualityQueries<Sys, 'sys'> &
  InequalityQueries<Sys, 'sys'> &

  SubsetFilters<Sys, 'sys'> &

  RangeFilters<Sys, 'sys'>


export type EntryFieldsQueries<Fields extends Record<string, any> = Record<string, any>> =
  ExistenceQueries<Fields, 'fields'> &
  EqualityQueries<Fields, 'fields'> &
  InequalityQueries<Fields, 'fields'> &

  SubsetFilters<Fields, 'fields'> &

  RangeFilters<Fields, 'fields'> &

  FullTextSearchFilters<Fields, 'fields'> & 

  LocationSearchFilters<Fields, 'fields'> 

export type EntryQueries<Fields extends Record<string, any> = Record<string, any>> =
  EntryFieldsQueries<Fields> &
  SysQueries<EntrySys> &
  FixedQueryOptions &
  FixedPagedOptions &
  Record<string, any>

// export function query<Fields>(query: EntryQueries<Fields>): void {
// }

// type Fields = {
//     name: string,
//     collection: number[]
//     dateField: EntryFields.Date
//     center: EntryFields.Location
// }

// query<Fields>({
//   'fields.center[within]': [1,2]
// })

// const Entry: Fields = {
//   dateField: 
// }
