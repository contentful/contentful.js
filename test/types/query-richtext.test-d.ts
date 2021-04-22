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

expectNotAssignable<EqualityQueries<{ testField: EntryFields.RichText }, 'fields'>>({
  'fields.testField': stringValue
})
expectNotAssignable<InequalityQueries<{ testField: EntryFields.RichText }, 'fields'>>({
  'fields.testField[ne]': stringValue
})
expectAssignable<ExistenceQueries<{ testField: EntryFields.RichText }, 'fields'>>(
  { 'fields.testField[exists]': booleanValue }
)
expectNotAssignable<LocationSearchFilters<{
  testField: EntryFields.RichText;
}, 'fields'>>(
  {
    'fields.testField[near]': stringValue,
    'fields.testField[within]': [0, 0, 0]
  }
)
expectNotAssignable<RangeFilters<{ testField: EntryFields.RichText }, 'fields'>>(
  {
    'fields.testField[lt]': stringValue,
    'fields.testField[lte]': stringValue,
    'fields.testField[gt]': stringValue,
    'fields.testField[gte]': stringValue
  }
)
expectAssignable<FullTextSearchFilters<{ testField: EntryFields.RichText }, 'fields'>>(
  { 'fields.testField[match]': stringValue }
)
expectAssignable<SelectQueries<{ testField: EntryFields.RichText }, 'fields'>>(
  {
    'select': ['fields.testField']
  }
)
expectNotAssignable<SubsetFilters<{ testField: EntryFields.RichText }, 'fields'>>(
  {
    'fields.testField[in]': stringValue,
    'fields.testField[nin]': stringValue
  }
)
