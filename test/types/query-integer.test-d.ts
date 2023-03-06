import { expectAssignable, expectNotAssignable } from 'tsd'
import { EntryFields } from '../../lib'
import { EqualityFilter, InequalityFilter } from '../../lib/types/query/equality'
import { ExistenceFilter } from '../../lib/types/query/existence'
import { LocationSearchFilters } from '../../lib/types/query/location'
import { RangeFilters } from '../../lib/types/query/range'
import { EntrySelectFilter } from '../../lib/types/query/select'
import { SubsetFilters } from '../../lib/types/query/subset'

const numberValue = 1
const booleanValue = true

expectAssignable<EqualityFilter<{ testField: EntryFields.Integer }, 'fields'>>({
  'fields.testField': numberValue,
})
expectAssignable<InequalityFilter<{ testField: EntryFields.Integer }, 'fields'>>({
  'fields.testField[ne]': numberValue,
})
expectAssignable<ExistenceFilter<{ testField: EntryFields.Integer }, 'fields'>>({
  'fields.testField[exists]': booleanValue,
})
expectNotAssignable<
  LocationSearchFilters<
    {
      testField: EntryFields.Integer
    },
    'fields'
  >
>({
  'fields.testField[near]': numberValue,
  'fields.testField[within]': [0, 0, 0],
})
expectAssignable<RangeFilters<{ testField: EntryFields.Integer }, 'fields'>>({
  'fields.testField[lt]': numberValue,
  'fields.testField[lte]': numberValue,
  'fields.testField[gt]': numberValue,
  'fields.testField[gte]': numberValue,
})

// TODO: unskip this test
// expectNotAssignable<FullTextSearchFilters<{ testField: EntryFields.Integer }, 'fields'>>({
//   'fields.testField[match]': stringValue,
// })

expectAssignable<EntrySelectFilter<{ testField: EntryFields.Integer }>>({
  content_type: 'id',
  select: ['fields.testField'],
})
expectAssignable<SubsetFilters<{ testField: EntryFields.Integer }, 'fields'>>({
  'fields.testField[in]': numberValue,
  'fields.testField[nin]': numberValue,
})
