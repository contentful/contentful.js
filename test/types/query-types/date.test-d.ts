import { expectAssignable, expectType } from 'tsd'
import { EntryFields } from '../../../lib'
import { EqualityFilter, InequalityFilter } from '../../../lib/types/query/equality'
import { ExistenceFilter } from '../../../lib/types/query/existence'
import { LocationSearchFilters } from '../../../lib/types/query/location'
import { RangeFilters } from '../../../lib/types/query/range'
import { FullTextSearchFilters } from '../../../lib/types/query/search'
import { EntrySelectFilterWithFields } from '../../../lib/types/query/select'
import { SubsetFilters } from '../../../lib/types/query/subset'
// @ts-ignore
import * as mocks from '../mocks'
import { EntryOrderFilterWithFields } from '../../../lib/types/query/order'
import { SetFilter } from '../../../lib/types/query/set'

// we can’t tell dates from text fields so the [all] operator is included here
expectAssignable<SetFilter<{ testField: EntryFields.Symbol }, 'fields'>>({})
expectType<Required<SetFilter<{ testField: EntryFields.Symbol }, 'fields'>>>({
  'fields.testField[all]': mocks.stringArrayValue,
})

expectAssignable<EqualityFilter<{ testField: EntryFields.Date }, 'fields'>>({})
expectType<Required<EqualityFilter<{ testField: EntryFields.Date }, 'fields'>>>({
  'fields.testField': mocks.dateValue,
})

expectAssignable<InequalityFilter<{ testField: EntryFields.Date }, 'fields'>>({})
expectType<Required<InequalityFilter<{ testField: EntryFields.Date }, 'fields'>>>({
  'fields.testField[ne]': mocks.dateValue,
})

expectAssignable<ExistenceFilter<{ testField: EntryFields.Date }, 'fields'>>({})
expectType<Required<ExistenceFilter<{ testField: EntryFields.Date }, 'fields'>>>({
  'fields.testField[exists]': mocks.booleanValue,
})

expectAssignable<Required<LocationSearchFilters<{ testField: EntryFields.Date }, 'fields'>>>({})

expectAssignable<RangeFilters<{ testField: EntryFields.Date }, 'fields'>>({})
expectType<Required<RangeFilters<{ testField: EntryFields.Date }, 'fields'>>>({
  'fields.testField[lt]': mocks.dateValue,
  'fields.testField[lte]': mocks.dateValue,
  'fields.testField[gt]': mocks.dateValue,
  'fields.testField[gte]': mocks.dateValue,
})

expectAssignable<FullTextSearchFilters<{ testField: EntryFields.Date }, 'fields'>>({})
expectType<Required<FullTextSearchFilters<{ testField: EntryFields.Date }, 'fields'>>>({
  'fields.testField[match]': mocks.stringValue,
})

expectAssignable<EntryOrderFilterWithFields<{ testField: EntryFields.Date }>>({})
expectAssignable<Required<EntryOrderFilterWithFields<{ testField: EntryFields.Date }>>>({
  order: ['fields.testField', '-fields.testField'],
})

expectAssignable<EntrySelectFilterWithFields<{ testField: EntryFields.Date }>>({})
expectAssignable<Required<EntrySelectFilterWithFields<{ testField: EntryFields.Date }>>>({
  select: ['fields.testField'],
})

expectAssignable<SubsetFilters<{ testField: EntryFields.Date }, 'fields'>>({})
expectType<Required<SubsetFilters<{ testField: EntryFields.Date }, 'fields'>>>({
  'fields.testField[in]': mocks.dateArrayValue,
  'fields.testField[nin]': mocks.dateArrayValue,
})
