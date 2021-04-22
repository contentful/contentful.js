import { expectAssignable, expectNotAssignable } from 'tsd'
import { EntryFields } from '../../lib'
import { EqualityQueries, InequalityQueries } from '../../lib/types/query/equality'
import { ExistenceQueries } from '../../lib/types/query/existence'
import { LocationSearchFilters } from '../../lib/types/query/location'
import { RangeFilters } from '../../lib/types/query/range'
import { FullTextSearchFilters } from '../../lib/types/query/search'
import { SelectQueries } from '../../lib/types/query/select'
import { SubsetFilters } from '../../lib/types/query/subset'

const stringValue = ''
const booleanValue = true

expectAssignable<EqualityQueries<{ testField: EntryFields.Boolean }, 'fields'>>({
  'fields.testField': booleanValue
})
expectAssignable<InequalityQueries<{ testField: EntryFields.Boolean }, 'fields'>>({
  'fields.testField[ne]': booleanValue
})
expectAssignable<ExistenceQueries<{ testField: EntryFields.Boolean }, 'fields'>>(
  { 'fields.testField[exists]': booleanValue }
)
expectNotAssignable<LocationSearchFilters<{
  testField: EntryFields.Boolean;
}, 'fields'>>(
  {
    'fields.testField[near]': booleanValue,
    'fields.testField[within]': [0, 0, 0]
  }
)
expectNotAssignable<RangeFilters<{ testField: EntryFields.Boolean }, 'fields'>>(
  {
    'fields.testField[lt]': booleanValue,
    'fields.testField[lte]': booleanValue,
    'fields.testField[gt]': booleanValue,
    'fields.testField[gte]': booleanValue
  }
)
expectAssignable<FullTextSearchFilters<{ testField: EntryFields.Boolean }, 'fields'>>(
  { 'fields.testField[match]': stringValue }
)
expectAssignable<SelectQueries<{ testField: EntryFields.Boolean }, 'fields'>>(
  {
    'select': ['fields.testField']
  }
)
expectAssignable<SubsetFilters<{ testField: EntryFields.Boolean }, 'fields'>>(
  {
    'fields.testField[in]': booleanValue,
    'fields.testField[nin]': booleanValue
  }
)
