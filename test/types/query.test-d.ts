import { expectAssignable, expectNotAssignable } from 'tsd'
import { Asset, EntryFields } from '../../lib'
import { EqualityQueries, InequalityQueries } from '../../lib/types/query/equality'
import { ExistenceQueries } from '../../lib/types/query/existence'
import {
  BoundingBoxSearchFilterInput,
  BoundingCircleSearchFilterInput,
  LocationSearchFilters,
  ProximitySearchFilterInput
} from '../../lib/types/query/location'
import { RangeFilters } from '../../lib/types/query/range'
import { FullTextSearchFilters } from '../../lib/types/query/search'
import { SubsetFilters } from '../../lib/types/query/subset'

const stringValue = ''
const numberValue = 123
const objectValue = {}
const emptyArrayValue = []
const booleanValue = true
const dateValue: EntryFields.Date = '2018-05-03T09:18:16.329Z'

const nearLocationValue: ProximitySearchFilterInput = [1, 0]
const withinCircleLocationValue: BoundingCircleSearchFilterInput = [1, 0, 2]
const withinBoxLocationValue: BoundingBoxSearchFilterInput = [1, 0, 2, 1]

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

/**
 * Equality
 */
expectAssignable<EqualityQueries<{ testField: EntryFields.Number }, 'fields'>>({
  'fields.testField': numberValue
})

expectAssignable<EqualityQueries<{ testField: EntryFields.Integer }, 'fields'>>({
  'fields.testField': numberValue
})

expectAssignable<EqualityQueries<{ testField: EntryFields.Symbol }, 'fields'>>({
  'fields.testField': stringValue
})

expectAssignable<EqualityQueries<{ testField: EntryFields.Text }, 'fields'>>({
  'fields.testField': stringValue
})

expectAssignable<EqualityQueries<{ testField: EntryFields.Object }, 'fields'>>({
  'fields.testField': objectValue
})

expectAssignable<EqualityQueries<{ testField: EntryFields.Date }, 'fields'>>({
  'fields.testField': dateValue
})

expectAssignable<EqualityQueries<{ testField: EntryFields.Boolean }, 'fields'>>({
  'fields.testField': booleanValue
})

expectAssignable<EqualityQueries<{ testField: EntryFields.Array }, 'fields'>>({
  'fields.testField': emptyArrayValue
})

expectNotAssignable<EqualityQueries<{ testField: EntryFields.Location }, 'fields'>>({
  'fields.testField': stringValue
})

/*
 * InEquality
 */

expectAssignable<InequalityQueries<{ testField: EntryFields.Number }, 'fields'>>({
  'fields.testField[ne]': numberValue
})

expectAssignable<InequalityQueries<{ testField: EntryFields.Integer }, 'fields'>>({
  'fields.testField[ne]': numberValue
})

expectAssignable<InequalityQueries<{ testField: EntryFields.Symbol }, 'fields'>>({
  'fields.testField[ne]': stringValue
})

expectAssignable<InequalityQueries<{ testField: EntryFields.Text }, 'fields'>>({
  'fields.testField[ne]': stringValue
})

expectAssignable<InequalityQueries<{ testField: EntryFields.Object }, 'fields'>>({
  // How would you use Inequality query for object type?
  // 'fields.testField[ne]': stringValue
})

expectAssignable<InequalityQueries<{ testField: EntryFields.Date }, 'fields'>>({
  'fields.testField[ne]': dateValue
})

expectAssignable<InequalityQueries<{ testField: EntryFields.Boolean }, 'fields'>>({
  'fields.testField[ne]': booleanValue
})

expectNotAssignable<InequalityQueries<{ testField: EntryFields.RichText }, 'fields'>>({
  'fields.testField[ne]': stringValue
})

expectNotAssignable<InequalityQueries<{ testField: EntryFields.Location }, 'fields'>>({
  'fields.testField[ne]': stringValue
})

/*
 * Existence
 */

expectAssignable<ExistenceQueries<{ testField: EntryFields.Number }, 'fields'>>(
  { 'fields.testField[exists]': booleanValue }
)
expectAssignable<ExistenceQueries<{ testField: EntryFields.Integer }, 'fields'>>(
  { 'fields.testField[exists]': booleanValue }
)
expectAssignable<ExistenceQueries<{ testField: EntryFields.Symbol }, 'fields'>>(
  { 'fields.testField[exists]': booleanValue }
)

expectAssignable<ExistenceQueries<{ testField: EntryFields.Text }, 'fields'>>(
  { 'fields.testField[exists]': booleanValue }
)

expectAssignable<ExistenceQueries<{ testField: EntryFields.Object }, 'fields'>>(
  { 'fields.testField[exists]': booleanValue }
)

expectAssignable<ExistenceQueries<{ testField: EntryFields.Date }, 'fields'>>(
  { 'fields.testField[exists]': booleanValue }
)

expectAssignable<ExistenceQueries<{ testField: EntryFields.Boolean }, 'fields'>>(
  { 'fields.testField[exists]': booleanValue }
)

expectAssignable<ExistenceQueries<{ testField: EntryFields.RichText }, 'fields'>>(
  { 'fields.testField[exists]': booleanValue }
)

expectAssignable<ExistenceQueries<{ testField: EntryFields.Location }, 'fields'>>(
  { 'fields.testField[exists]': booleanValue }
)

expectAssignable<ExistenceQueries<{ testField: EntryFields.Array }, 'fields'>>(
  { 'fields.testField[exists]': booleanValue }
)

expectAssignable<ExistenceQueries<{ testField: EntryFields.Array<Asset> }, 'fields'>>(
  { 'fields.testField[exists]': booleanValue }
)

expectAssignable<ExistenceQueries<{ testField: EntryFields.Link<any> }, 'fields'>>(
  { 'fields.testField[exists]': booleanValue }
)

/*
 * Location
 */
expectAssignable<LocationSearchFilters<{
  testField: EntryFields.Location;
}, 'fields'>>(
  {
    'fields.testField[near]': nearLocationValue
  }
)

expectAssignable<LocationSearchFilters<{
  testField: EntryFields.Location;
}, 'fields'>>(
  {
    'fields.testField[within]': withinCircleLocationValue
  }
)

expectAssignable<LocationSearchFilters<{
  testField: EntryFields.Location;
}, 'fields'>>(
  {
    'fields.testField[within]': withinBoxLocationValue
  }
)

expectNotAssignable<LocationSearchFilters<{
  testField: EntryFields.Number;
}, 'fields'>>(
  {
    'fields.testField[near]': nearLocationValue
  }
)

expectNotAssignable<LocationSearchFilters<{
  testField: EntryFields.Integer;
}, 'fields'>>(
  {
    'fields.testField[near]': nearLocationValue
  }
)

expectNotAssignable<LocationSearchFilters<{
  testField: EntryFields.Text;
}, 'fields'>>(
  {
    'fields.testField[near]': nearLocationValue
  }
)

expectNotAssignable<LocationSearchFilters<{
  testField: EntryFields.Symbol;
}, 'fields'>>(
  {
    'fields.testField[near]': nearLocationValue
  }
)

// `object` some what matches EntryFields.Location
expectAssignable<LocationSearchFilters<{
  testField: EntryFields.Object;
}, 'fields'>>(
  {
    'fields.testField[near]': nearLocationValue
  }
)

expectNotAssignable<LocationSearchFilters<{
  testField: EntryFields.Date;
}, 'fields'>>(
  {
    'fields.testField[near]': nearLocationValue
  }
)

expectNotAssignable<LocationSearchFilters<{
  testField: EntryFields.Boolean;
}, 'fields'>>(
  {
    'fields.testField[near]': nearLocationValue
  }
)

expectNotAssignable<LocationSearchFilters<{
  testField: EntryFields.RichText;
}, 'fields'>>(
  {
    'fields.testField[near]': nearLocationValue
  }
)

/*
 * Search (full-text)
 */
expectAssignable<FullTextSearchFilters<{ testField: EntryFields.Symbol }, 'fields'>>(
  { 'fields.testField[match]': stringValue }
)

expectAssignable<FullTextSearchFilters<{ testField: EntryFields.Text }, 'fields'>>(
  { 'fields.testField[match]': stringValue }
)

expectAssignable<FullTextSearchFilters<{ testField: EntryFields.RichText }, 'fields'>>(
  { 'fields.testField[match]': stringValue }
)

expectAssignable<FullTextSearchFilters<{ testField: EntryFields.Object }, 'fields'>>(
  { 'fields.testField[match]': stringValue }
)

expectAssignable<FullTextSearchFilters<{ testField: EntryFields.Number }, 'fields'>>(
  { 'fields.testField[match]': stringValue }
)

expectAssignable<FullTextSearchFilters<{ testField: EntryFields.Integer }, 'fields'>>(
  { 'fields.testField[match]': stringValue }
)

expectAssignable<FullTextSearchFilters<{ testField: EntryFields.Boolean }, 'fields'>>(
  { 'fields.testField[match]': stringValue }
)

expectAssignable<FullTextSearchFilters<{ testField: EntryFields.Location }, 'fields'>>(
  { 'fields.testField[match]': stringValue }
)

expectAssignable<FullTextSearchFilters<{ testField: EntryFields.Array }, 'fields'>>(
  { 'fields.testField[match]': stringValue }
)

/*
 * Range
 */
expectAssignable<RangeFilters<{ testField: EntryFields.Date }, 'fields'>>(
  {
    'fields.testField[lt]': dateValue,
    'fields.testField[gte]': dateValue
  }
)

expectAssignable<RangeFilters<{ testField: EntryFields.Number }, 'fields'>>(
  {
    'fields.testField[lt]': numberValue,
    'fields.testField[gte]': numberValue
  }
)

expectAssignable<RangeFilters<{ testField: EntryFields.Integer }, 'fields'>>(
  {
    'fields.testField[lt]': numberValue,
    'fields.testField[gte]': numberValue
  }
)

expectAssignable<RangeFilters<{ testField: EntryFields.Symbol }, 'fields'>>(
  { 'fields.testField[lt]': numberValue }
)

expectAssignable<RangeFilters<{ testField: EntryFields.Symbol }, 'fields'>>(
  { 'fields.testField[lt]': stringValue }
)

expectAssignable<RangeFilters<{ testField: EntryFields.Integer }, 'fields'>>(
  { 'fields.testField[lt]': numberValue }
)

expectAssignable<RangeFilters<{ testField: EntryFields.Text }, 'fields'>>(
  { 'fields.testField[lt]': stringValue }
)

expectAssignable<RangeFilters<{ testField: EntryFields.Object }, 'fields'>>(
  { 'fields.testField[lt]': objectValue }
)

expectNotAssignable<RangeFilters<{ testField: EntryFields.Boolean }, 'fields'>>(
  { 'fields.testField[lt]': booleanValue }
)

expectNotAssignable<RangeFilters<{ testField: EntryFields.Location }, 'fields'>>(
  { 'fields.testField[lt]': nearLocationValue }
)

/*
 * Inclusion
 */

expectAssignable<SubsetFilters<{ testField: EntryFields.Text }, 'fields'>>(
  {
    'fields.testField[in]': stringValue,
    'fields.testField[nin]': stringValue
  }
)

/*
 * Inclusion
 */

/*
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
*/
