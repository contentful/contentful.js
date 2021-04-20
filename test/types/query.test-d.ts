import { expectAssignable, expectNotType, expectType } from 'tsd'
import { Asset, EntryFields, EntryQueries } from '../../lib'
import { EqualityQueries, InequalityQueries } from '../../lib/types/query/equality'
import { ExistenceQueries } from '../../lib/types/query/existence'
import { LocationSearchFilters } from '../../lib/types/query/location'
import { RangeFilters } from '../../lib/types/query/range'
import { FullTextSearchFilters } from '../../lib/types/query/search'
import { SubsetFilters } from '../../lib/types/query/subset'

/*
type Fields = {
  number: EntryFields.Number
  name: EntryFields.Link<Entry<{ myField: EntryFields.Integer }>>
  collection: EntryFields.Array<EntryFields.Text>
  date: EntryFields.Date
  location: EntryFields.Location
  nested: Entry<{ subField: EntryFields.Text }>
}
 */

function query<Fields>(query: EntryQueries<Fields>) {
  return query
}

function queryEquality<Fields>(query: EqualityQueries<Fields, 'fields'>) {
  return query
}

function queryInEquality<Fields>(query: InequalityQueries<Fields, 'fields'>) {
  return query
}

function queryExistence<Fields>(query: ExistenceQueries<Fields, 'fields'>) {
  return query
}

function queryLocation<Fields>(query: LocationSearchFilters<Fields, 'fields'>) {
  return query
}

function queryMatch<Fields>(query: FullTextSearchFilters<Fields, 'fields'>) {
  return query
}

function queryRange<Fields>(query: RangeFilters<Fields, 'fields'>) {
  return query
}

function querySubSet<Fields>(query: SubsetFilters<Fields, 'fields'>) {
  return query
}

/**
 * Equality
 */
expectType<EqualityQueries<{ testField: EntryFields.Number }, 'fields'>>({
  'fields.testField': 1
})
expectType<EqualityQueries<{ testField: EntryFields.Integer }, 'fields'>>({
  'fields.testField': 1
})
expectType<EqualityQueries<{ testField: EntryFields.Symbol }, 'fields'>>({
  'fields.testField': 'a'
})
expectType<EqualityQueries<{ testField: EntryFields.Text }, 'fields'>>({
  'fields.testField': 'a'
})
expectType<EqualityQueries<{ testField: EntryFields.Object }, 'fields'>>({
  'fields.testField': {}
})
expectType<EqualityQueries<{ testField: EntryFields.Date }, 'fields'>>({
  'fields.testField': '1-1-1T00:00:00Z'
})
expectType<EqualityQueries<{ testField: EntryFields.Boolean }, 'fields'>>({
  'fields.testField': true
})
expectAssignable<EqualityQueries<{ testField: EntryFields.Array }, 'fields'>>({
  'fields.testField': ['abc']
})
// expectAssignable<EqualityQueries<{ testField: EntryFields.Array<Asset> }, 'fields'>>({ 'fields.testField': Asset[] })
// expectNotType<EqualityQueries<{ testField: EntryFields.RichText }, 'fields'>>({ 'fields.testField': 'a' })
expectNotType<EqualityQueries<{ testField: EntryFields.Location }, 'fields'>>({
  'fields.testField': 'a'
})
// ???
// expectType<{ 'fields.testField'?: string }>(queryEquality<{ testField: EntryFields.Link<any> }>({}))

/*
 * InEquality
 */
expectType<InequalityQueries<{ testField: EntryFields.Number }, 'fields'>>({
  'fields.testField[ne]': 1
})
expectType<InequalityQueries<{ testField: EntryFields.Integer }, 'fields'>>({
  'fields.testField[ne]': 1
})
expectType<InequalityQueries<{ testField: EntryFields.Symbol }, 'fields'>>({ 
  'fields.testField[ne]': 'a'
})
expectType<InequalityQueries<{ testField: EntryFields.Text }, 'fields'>>({ 
  'fields.testField[ne]': 'a'
})
// expectType<InequalityQueries<{ testField: EntryFields.Object }, 'fields'>>({
//   'fields.testField[ne]': any
// })
expectType<InequalityQueries<{ testField: EntryFields.Date }, 'fields'>>({
  'fields.testField[ne]': '1-1-1T00:00:00Z'
})
expectType<InequalityQueries<{ testField: EntryFields.Boolean }, 'fields'>>({
  'fields.testField[ne]': true
})
expectNotType<InequalityQueries<{ testField: EntryFields.RichText }, 'fields'>>({ 
  'fields.testField[ne]': 'a'
})
expectNotType<InequalityQueries<{ testField: EntryFields.Location }, 'fields'>>({ 
  'fields.testField[ne]': 'a'
})
expectAssignable<InequalityQueries<{ testField: EntryFields.Array }, 'fields'>>({
  'fields.testField[ne]': ['a']
})
// expectAssignable<InequalityQueries<{ testField: EntryFields.Array<A, 'fields'sset> }>>({ 
//   'fields.testField[ne]'?: Asset[]
// })
// ???
// expectType<{ 'fields.testField'?: string }>(queryEquality<{ testField: EntryFields.Link<any> }>({}))

/*
 * Existence
 */
expectType<{ 'fields.testField[exists]'?: boolean }>(
  queryExistence<{ testField: EntryFields.Number }>({})
)
expectType<{ 'fields.testField[exists]'?: boolean }>(
  queryExistence<{ testField: EntryFields.Integer }>({})
)
expectType<{ 'fields.testField[exists]'?: boolean }>(
  queryExistence<{ testField: EntryFields.Symbol }>({})
)
expectType<{ 'fields.testField[exists]'?: boolean }>(
  queryExistence<{ testField: EntryFields.Text }>({})
)
expectType<{ 'fields.testField[exists]'?: boolean }>(
  queryExistence<{ testField: EntryFields.Object }>({})
)
expectType<{ 'fields.testField[exists]'?: boolean }>(
  queryExistence<{ testField: EntryFields.Date }>({})
)
expectType<{ 'fields.testField[exists]'?: boolean }>(
  queryExistence<{ testField: EntryFields.Boolean }>({})
)
expectType<{ 'fields.testField[exists]'?: boolean }>(
  queryExistence<{ testField: EntryFields.RichText }>({})
)
expectType<{ 'fields.testField[exists]'?: boolean }>(
  queryExistence<{ testField: EntryFields.Location }>({})
)
expectNotType<{ 'fields.testField[exists]'?: boolean }>(
  queryExistence<{ testField: EntryFields.Array }>({})
)
expectNotType<{ 'fields.testField[exists]'?: boolean }>(
  queryExistence<{ testField: EntryFields.Array<Asset> }>({})
)
expectNotType<{ 'fields.testField[exists]'?: boolean }>(
  queryExistence<{ testField: EntryFields.Link<any> }>({})
)

/*
 * Location
 */

type Within = [number, number, number] | [number, number, number, number]
expectAssignable<LocationSearchFilters<{
    testField: EntryFields.Location;
}, "fields">>(
  {
    'fields.testField[near]': [1, 1],
    'fields.testField[within]': [1, 1, 1]
  }
)

// expectAssignable<{ 'fields.testField[within]'?: Within }>(
//   queryLocation<{ testField: EntryFields.Location }>({})
// )

type foo = LocationSearchFilters<{
    testField: EntryFields.Number;
}, "fields">

expectAssignable<LocationSearchFilters<{
    testField: EntryFields.Number;
}, "fields">>(
  {
    'fields.testField[near]': [1, 1],
  }
)
expectNotType<{ 'fields.testField[near]'?: [number, number] }>(
  queryLocation<{ testField: EntryFields.Integer }>({})
)
expectNotType<{ 'fields.testField[near]'?: [number, number] }>(
  queryLocation<{ testField: EntryFields.Symbol }>({})
)
expectNotType<{ 'fields.testField[near]'?: [number, number] }>(
  queryLocation<{ testField: EntryFields.Text }>({})
)
expectNotType<{ 'fields.testField[near]'?: [number, number] }>(
  queryLocation<{ testField: EntryFields.Object }>({})
)
expectNotType<{ 'fields.testField[near]'?: [number, number] }>(
  queryLocation<{ testField: EntryFields.Date }>({})
)
expectNotType<{ 'fields.testField[near]'?: [number, number] }>(
  queryLocation<{ testField: EntryFields.Boolean }>({})
)
expectNotType<{ 'fields.testField[near]'?: [number, number] }>(
  queryLocation<{ testField: EntryFields.Array }>({})
)
expectNotType<{ 'fields.testField[near]'?: [number, number] }>(
  queryLocation<{ testField: EntryFields.Array<Asset> }>({})
)
expectNotType<{ 'fields.testField[near]'?: [number, number] }>(
  queryLocation<{ testField: EntryFields.RichText }>({})
)
expectNotType<{ 'fields.testField[near]'?: [number, number] }>(
  queryLocation<{ testField: EntryFields.Link<any> }>({})
)

/*
 * Search (full-text)
 */
expectType<{ 'fields.testField[match]'?: string }>(
  queryMatch<{ testField: EntryFields.Symbol }>({})
)
expectType<{ 'fields.testField[match]'?: string }>(queryMatch<{ testField: EntryFields.Text }>({}))
expectType<{ 'fields.testField[match]'?: string }>(
  queryMatch<{ testField: EntryFields.RichText }>({})
)
expectType<{ 'fields.testField[match]'?: string }>(
  queryMatch<{ testField: EntryFields.Object }>({})
)
expectType<{ 'fields.testField[match]'?: string }>(queryMatch<{ testField: EntryFields.Date }>({}))
expectType<{ 'fields.testField[match]'?: string }>(
  queryMatch<{ testField: EntryFields.Number }>({})
)
expectType<{ 'fields.testField[match]'?: string }>(
  queryMatch<{ testField: EntryFields.Integer }>({})
)
expectType<{ 'fields.testField[match]'?: string }>(
  queryMatch<{ testField: EntryFields.Boolean }>({})
)
expectType<{ 'fields.testField[match]'?: string }>(
  queryMatch<{ testField: EntryFields.Location }>({})
)
expectNotType<{ 'fields.testField[match]'?: string }>(
  queryMatch<{ testField: EntryFields.Array }>({})
)
expectNotType<{ 'fields.testField[match]'?: string }>(
  queryMatch<{ testField: EntryFields.Array<Asset> }>({})
)
expectNotType<{ 'fields.testField[match]'?: string }>(
  queryMatch<{ testField: EntryFields.Link<any> }>({})
)

/*
 * Range
 */
expectAssignable<{ 'fields.testField[lt]'?: EntryFields.Date }>(
  queryRange<{ testField: EntryFields.Date }>({})
)
expectAssignable<{ 'fields.testField[lt]'?: number }>(
  queryRange<{ testField: EntryFields.Number }>({})
)
expectAssignable<{ 'fields.testField[lt]'?: number }>(
  queryRange<{ testField: EntryFields.Integer }>({})
)
expectNotType<{ 'fields.testField[nt]'?: EntryFields.Symbol }>(
  queryRange<{ testField: EntryFields.Symbol }>({})
)
expectNotType<{ 'fields.testField[nt]'?: EntryFields.Text }>(
  queryRange<{ testField: EntryFields.Text }>({})
)
expectNotType<{ 'fields.testField[nt]'?: EntryFields.RichText }>(
  queryRange<{ testField: EntryFields.RichText }>({})
)
expectNotType<{ 'fields.testField[nt]'?: EntryFields.Object }>(
  queryRange<{ testField: EntryFields.Object }>({})
)
expectNotType<{ 'fields.testField[nt]'?: EntryFields.Boolean }>(
  queryRange<{ testField: EntryFields.Boolean }>({})
)
expectNotType<{ 'fields.testField[nt]'?: EntryFields.Location }>(
  queryRange<{ testField: EntryFields.Location }>({})
)
expectNotType<{ 'fields.testField[nt]'?: EntryFields.Array }>(
  queryRange<{ testField: EntryFields.Array }>({})
)
expectNotType<{ 'fields.testField[nt]'?: EntryFields.Array<Asset> }>(
  queryRange<{ testField: EntryFields.Array<Asset> }>({})
)
expectNotType<{ 'fields.testField[nt]'?: EntryFields.Link<any> }>(
  queryRange<{ testField: EntryFields.Link<any> }>({})
)

/*
 * Inclusion
 */
expectAssignable<{ 'fields.testField[in]'?: string }>(
  querySubSet<{ testField: EntryFields.Symbol }>({})
)
expectAssignable<{ 'fields.testField[in]'?: string }>(
  querySubSet<{ testField: EntryFields.Text }>({})
)
expectAssignable<{ 'fields.testField[in]'?: string }>(
  querySubSet<{ testField: EntryFields.RichText }>({})
)
expectAssignable<{ 'fields.testField[in]'?: string }>(
  querySubSet<{ testField: EntryFields.Object }>({})
)
expectAssignable<{ 'fields.testField[in]'?: string }>(
  querySubSet<{ testField: EntryFields.Date }>({})
)
expectAssignable<{ 'fields.testField[in]'?: number }>(
  querySubSet<{ testField: EntryFields.Number }>({})
)
expectAssignable<{ 'fields.testField[in]'?: number }>(
  querySubSet<{ testField: EntryFields.Integer }>({})
)
expectAssignable<{ 'fields.testField[in]'?: boolean }>(
  querySubSet<{ testField: EntryFields.Boolean }>({})
)
expectNotType<{ 'fields.testField[in]'?: string }>(
  querySubSet<{ testField: EntryFields.Location }>({})
)
expectNotType<{ 'fields.testField[in]'?: string }>(
  querySubSet<{ testField: EntryFields.Array }>({})
)
expectNotType<{ 'fields.testField[in]'?: string }>(
  querySubSet<{ testField: EntryFields.Array<Asset> }>({})
)
expectNotType<{ 'fields.testField[in]'?: string }>(
  querySubSet<{ testField: EntryFields.Link<any> }>({})
)

/*
 * Inclusion
 */
expectAssignable<{ 'fields.testField[nin]'?: string }>(
  querySubSet<{ testField: EntryFields.Symbol }>({})
)
expectAssignable<{ 'fields.testField[nin]'?: string }>(
  querySubSet<{ testField: EntryFields.Text }>({})
)
expectAssignable<{ 'fields.testField[nin]'?: string }>(
  querySubSet<{ testField: EntryFields.RichText }>({})
)
expectAssignable<{ 'fields.testField[nin]'?: string }>(
  querySubSet<{ testField: EntryFields.Object }>({})
)
expectAssignable<{ 'fields.testField[nin]'?: string }>(
  querySubSet<{ testField: EntryFields.Date }>({})
)
expectAssignable<{ 'fields.testField[nin]'?: number }>(
  querySubSet<{ testField: EntryFields.Number }>({})
)
expectAssignable<{ 'fields.testField[nin]'?: number }>(
  querySubSet<{ testField: EntryFields.Integer }>({})
)
expectAssignable<{ 'fields.testField[nin]'?: boolean }>(
  querySubSet<{ testField: EntryFields.Boolean }>({})
)
expectNotType<{ 'fields.testField[nin]'?: string }>(
  querySubSet<{ testField: EntryFields.Location }>({})
)
expectNotType<{ 'fields.testField[nin]'?: string }>(
  querySubSet<{ testField: EntryFields.Array }>({})
)
expectNotType<{ 'fields.testField[nin]'?: string }>(
  querySubSet<{ testField: EntryFields.Array<Asset> }>({})
)
expectNotType<{ 'fields.testField[nin]'?: string }>(
  querySubSet<{ testField: EntryFields.Link<any> }>({})
)

expectAssignable<{
  'fields.number'?: number
  'fields.number[exists]'?: boolean
  'fields.number[gt]'?: number
  'fields.number[gte]'?: number
  'fields.number[in]'?: number
  'fields.number[lt]'?: number
  'fields.number[lte]'?: number
  'fields.number[ne]'?: number
  'fields.number[nin]'?: number
}>(query<{ number: EntryFields.Number }>({}))
