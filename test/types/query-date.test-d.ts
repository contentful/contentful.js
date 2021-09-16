import { expectAssignable, expectNotAssignable } from 'tsd'
import { EntryFields } from '../../lib'
import { EqualityFilter, InequalityFilter } from '../../lib/types/query/equality'
import { ExistenceFilter } from '../../lib/types/query/existence'
import { LocationSearchFilters } from '../../lib/types/query/location'
import { RangeFilters } from '../../lib/types/query/range'
import { FullTextSearchFilters } from '../../lib/types/query/search'
import { SelectFilter } from '../../lib/types/query/select'
import { SubsetFilters } from '../../lib/types/query/subset'

export const dateValue: EntryFields.Date = '2018-05-03T09:18:16.329Z'
const stringValue = ''
const booleanValue = true

expectAssignable<EqualityFilter<{ testField: EntryFields.Date }, 'fields'>>({
  'fields.testField': dateValue,
})
expectAssignable<InequalityFilter<{ testField: EntryFields.Date }, 'fields'>>({
  'fields.testField[ne]': dateValue,
})
expectAssignable<ExistenceFilter<{ testField: EntryFields.Date }, 'fields'>>({
  'fields.testField[exists]': booleanValue,
})
expectNotAssignable<
  LocationSearchFilters<
    {
      testField: EntryFields.Date
    },
    'fields'
  >
>({
  'fields.testField[near]': dateValue,
  'fields.testField[within]': [0, 0, 0],
})
expectAssignable<RangeFilters<{ testField: EntryFields.Date }, 'fields'>>({
  'fields.testField[lt]': dateValue,
  'fields.testField[lte]': dateValue,
  'fields.testField[gt]': dateValue,
  'fields.testField[gte]': dateValue,
})
expectAssignable<FullTextSearchFilters<{ testField: EntryFields.Date }, 'fields'>>({
  'fields.testField[match]': stringValue,
})
expectAssignable<FullTextSearchFilters<{ testField: EntryFields.Date }, 'fields'>>({
  'fields.testField[match]': dateValue,
})
expectAssignable<SelectFilter<{ testField: EntryFields.Date }, 'fields'>>({
  select: ['fields.testField'],
})
expectAssignable<SubsetFilters<{ testField: EntryFields.Date }, 'fields'>>({
  'fields.testField[in]': dateValue,
  'fields.testField[nin]': dateValue,
})
