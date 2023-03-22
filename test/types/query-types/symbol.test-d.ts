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

expectAssignable<EqualityFilter<{ testField: EntryFields.Symbol }, 'fields'>>({})
expectType<Required<EqualityFilter<{ testField: EntryFields.Symbol }, 'fields'>>>({
  'fields.testField': mocks.stringValue,
})

expectAssignable<InequalityFilter<{ testField: EntryFields.Symbol }, 'fields'>>({})
expectType<Required<InequalityFilter<{ testField: EntryFields.Symbol }, 'fields'>>>({
  'fields.testField[ne]': mocks.stringValue,
})

expectAssignable<ExistenceFilter<{ testField: EntryFields.Symbol }, 'fields'>>({})
expectType<Required<ExistenceFilter<{ testField: EntryFields.Symbol }, 'fields'>>>({
  'fields.testField[exists]': mocks.booleanValue,
})

expectAssignable<Required<LocationSearchFilters<{ testField: EntryFields.Symbol }, 'fields'>>>({})

expectAssignable<Required<RangeFilters<{ testField: EntryFields.Symbol }, 'fields'>>>({})

expectAssignable<FullTextSearchFilters<{ testField: EntryFields.Symbol }, 'fields'>>({})
expectType<Required<FullTextSearchFilters<{ testField: EntryFields.Symbol }, 'fields'>>>({
  'fields.testField[match]': mocks.stringValue,
})

expectAssignable<EntryOrderFilterWithFields<{ testField: EntryFields.Symbol }>>({})
expectAssignable<Required<EntryOrderFilterWithFields<{ testField: EntryFields.Symbol }>>>({
  order: ['fields.testField', '-fields.testField'],
})

expectAssignable<EntrySelectFilterWithFields<{ testField: EntryFields.Symbol }>>({})
expectAssignable<Required<EntrySelectFilterWithFields<{ testField: EntryFields.Symbol }>>>({
  select: ['fields.testField'],
})

expectAssignable<SubsetFilters<{ testField: EntryFields.Symbol }, 'fields'>>({})
expectType<Required<SubsetFilters<{ testField: EntryFields.Symbol }, 'fields'>>>({
  'fields.testField[in]': mocks.stringArrayValue,
  'fields.testField[nin]': mocks.stringArrayValue,
})
