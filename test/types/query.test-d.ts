import { expectAssignable, expectNotAssignable } from 'tsd'
import { Asset, EntryFields, EntryQueries } from '../../lib'
import { EqualityQueries, InequalityQueries } from '../../lib/types/query/equality'
import { ExistenceQueries } from '../../lib/types/query/existence'
import {
  BoundingBoxSearchFilterInput,
  BoundingCircleSearchFilterInput,
  LocationSearchFilters,
  ProximitySearchFilterInput
} from '../../lib/types/query/location'
import { EntryFieldsQueries } from '../../lib/types/query/query'
import { RangeFilters } from '../../lib/types/query/range'
import { FullTextSearchFilters } from '../../lib/types/query/search'
import { SelectQueries } from '../../lib/types/query/select'
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

expectNotAssignable<LocationSearchFilters<{
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

expectNotAssignable<RangeFilters<{ testField: EntryFields.Symbol }, 'fields'>>(
  { 'fields.testField[lt]': stringValue }
)

expectNotAssignable<RangeFilters<{ testField: EntryFields.Symbol }, 'fields'>>(
  { 'fields.testField[lt]': stringValue }
)

expectAssignable<RangeFilters<{ testField: EntryFields.Integer }, 'fields'>>(
  { 'fields.testField[lt]': numberValue }
)

expectNotAssignable<RangeFilters<{ testField: EntryFields.Text }, 'fields'>>(
  { 'fields.testField[lt]': stringValue }
)

expectNotAssignable<RangeFilters<{ testField: EntryFields.Object }, 'fields'>>(
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
expectAssignable<SubsetFilters<{ testField: EntryFields.Integer }, 'fields'>>(
  {
    'fields.testField[in]': numberValue,
    'fields.testField[nin]': numberValue
  }
)

expectAssignable<SubsetFilters<{ testField: EntryFields.Number }, 'fields'>>(
  {
    'fields.testField[in]': numberValue,
    'fields.testField[nin]': numberValue
  }
)

expectAssignable<SubsetFilters<{ testField: EntryFields.Text }, 'fields'>>(
  {
    'fields.testField[in]': stringValue,
    'fields.testField[nin]': stringValue
  }
)

expectAssignable<SubsetFilters<{ testField: EntryFields.Boolean }, 'fields'>>(
  {
    'fields.testField[in]': booleanValue,
    'fields.testField[nin]': booleanValue
  }
)

expectAssignable<SubsetFilters<{ testField: EntryFields.Symbol }, 'fields'>>(
  {
    'fields.testField[in]': stringValue,
    'fields.testField[nin]': stringValue
  }
)

expectAssignable<SubsetFilters<{ testField: EntryFields.Date }, 'fields'>>(
  {
    'fields.testField[in]': dateValue,
    'fields.testField[nin]': dateValue
  }
)

expectNotAssignable<SubsetFilters<{ testField: EntryFields.RichText }, 'fields'>>(
  {
    'fields.testField[in]': stringValue,
    'fields.testField[nin]': stringValue
  }
)

expectNotAssignable<SubsetFilters<{ testField: EntryFields.Location }, 'fields'>>(
  {
    'fields.testField[in]': nearLocationValue,
    'fields.testField[nin]': withinBoxLocationValue
  }
)

expectNotAssignable<SubsetFilters<{ testField: EntryFields.Object }, 'fields'>>(
  {
    'fields.testField[in]': objectValue,
    'fields.testField[nin]': objectValue
  }
)

expectNotAssignable<SubsetFilters<{ testField: EntryFields.Link<unknown> }, 'fields'>>(
  {
    'fields.testField[in]': objectValue,
    'fields.testField[nin]': objectValue
  }
)

/*
 * Select
 */
expectAssignable<SelectQueries<{ testField: EntryFields.Integer }, 'fields'>>(
  {
    'select': ['fields.stringField']
  }
)

expectNotAssignable<SelectQueries<{ testField: EntryFields.Integer }, 'fields'>>(
  {
    'select': ['fields.stringFieldUnknown']
  }
)

/*
 * EntryFields
 */
expectAssignable<EntryFieldsQueries<{ stringField: EntryFields.Text }>>(
  {
    'select': ['fields.stringField'],
    'fields.stringField[exists]': booleanValue,
    'fields.stringField': stringValue,
    'fields.stringField[ne]': stringValue,
    'fields.stringField[in]': stringValue,
    'fields.stringField[nin]': stringValue,
    'fields.stringField[match]': stringValue
  }
)

expectAssignable<EntryFieldsQueries<{ numberField: EntryFields.Number }>>(
  {
    'select': ['fields.stringField'],
    'fields.numberField[exists]': booleanValue,
    'fields.numberField': numberValue,
    'fields.numberField[ne]': numberValue,
    'fields.numberField[in]': numberValue,
    'fields.numberField[nin]': numberValue,
    'fields.numberField[match]': stringValue
  }
)

/*
 * Entry
 */
expectAssignable<EntryQueries<{ stringField: EntryFields.Text }>>(
  {
    'fields.stringField[exists]': booleanValue,
    'select': ['fields.stringField']
  }
)
