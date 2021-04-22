import { expectAssignable, expectNotAssignable } from 'tsd'
import { EntryFields } from '../../lib'
import { EqualityQueries, InequalityQueries } from '../../lib/types/query/equality'
import { ExistenceQueries } from '../../lib/types/query/existence'
import { LocationSearchFilters } from '../../lib/types/query/location'
import { RangeFilters } from '../../lib/types/query/range'
import { FullTextSearchFilters } from '../../lib/types/query/search'
import { SelectQueries } from '../../lib/types/query/select'
import { SubsetFilters } from '../../lib/types/query/subset'

const numberValue = 1
const stringValue = ''
const booleanValue = true

expectAssignable<EqualityQueries<{ testField: EntryFields.Integer }, 'fields'>>({
  'fields.testField': numberValue
})
expectAssignable<InequalityQueries<{ testField: EntryFields.Integer }, 'fields'>>({
  'fields.testField[ne]': numberValue
})
expectAssignable<ExistenceQueries<{ testField: EntryFields.Integer }, 'fields'>>(
  { 'fields.testField[exists]': booleanValue }
)
expectNotAssignable<LocationSearchFilters<{
  testField: EntryFields.Integer;
}, 'fields'>>(
  {
    'fields.testField[near]': numberValue,
    'fields.testField[within]': [0, 0, 0]
  }
)
expectAssignable<RangeFilters<{ testField: EntryFields.Integer }, 'fields'>>(
  {
    'fields.testField[lt]': numberValue,
    'fields.testField[lte]': numberValue,
    'fields.testField[gt]': numberValue,
    'fields.testField[gte]': numberValue
  }
)
expectAssignable<FullTextSearchFilters<{ testField: EntryFields.Integer }, 'fields'>>(
  { 'fields.testField[match]': stringValue }
)
expectAssignable<SelectQueries<{ testField: EntryFields.Integer }, 'fields'>>(
  {
    'select': ['fields.testField']
  }
)
expectAssignable<SubsetFilters<{ testField: EntryFields.Integer }, 'fields'>>(
  {
    'fields.testField[in]': numberValue,
    'fields.testField[nin]': numberValue
  }
)
