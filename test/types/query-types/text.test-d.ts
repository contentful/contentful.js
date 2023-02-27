import { expectAssignable, expectNotAssignable } from 'tsd'
import { EntryFields } from '../../../lib'
import { EqualityFilter, InequalityFilter } from '../../../lib/types/query/equality'
import { ExistenceFilter } from '../../../lib/types/query/existence'
import { LocationSearchFilters } from '../../../lib/types/query/location'
import { RangeFilters } from '../../../lib/types/query/range'
import { FullTextSearchFilters } from '../../../lib/types/query/search'
import { SelectFilter } from '../../../lib/types/query/select'
import { SubsetFilters } from '../../../lib/types/query/subset'

const stringValue = ''
const booleanValue = true

expectAssignable<EqualityFilter<{ testField: EntryFields.Text }, 'fields'>>({
  'fields.testField': stringValue,
})
expectAssignable<InequalityFilter<{ testField: EntryFields.Text }, 'fields'>>({
  'fields.testField[ne]': stringValue,
})
expectAssignable<ExistenceFilter<{ testField: EntryFields.Text }, 'fields'>>({
  'fields.testField[exists]': booleanValue,
})
expectNotAssignable<
  LocationSearchFilters<
    {
      testField: EntryFields.Text
    },
    'fields'
  >
>({
  'fields.testField[near]': stringValue,
  'fields.testField[within]': [0, 0, 0],
})
expectNotAssignable<RangeFilters<{ testField: EntryFields.Text }, 'fields'>>({
  'fields.testField[lt]': stringValue,
  'fields.testField[lte]': stringValue,
  'fields.testField[gt]': stringValue,
  'fields.testField[gte]': stringValue,
})
expectAssignable<FullTextSearchFilters<{ testField: EntryFields.Text }, 'fields'>>({
  'fields.testField[match]': stringValue,
})
expectAssignable<SelectFilter<{ testField: EntryFields.Text }, 'fields'>>({
  select: ['fields.testField'],
})
expectAssignable<SubsetFilters<{ testField: EntryFields.Text }, 'fields'>>({
  'fields.testField[in]': stringValue,
  'fields.testField[nin]': stringValue,
})
