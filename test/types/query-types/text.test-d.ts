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

expectAssignable<EqualityFilter<{ testField: EntryFields.Text }, 'fields'>>({})
expectType<Required<EqualityFilter<{ testField: EntryFields.Text }, 'fields'>>>({
  'fields.testField': mocks.stringValue,
})

expectAssignable<InequalityFilter<{ testField: EntryFields.Text }, 'fields'>>({})
expectType<Required<InequalityFilter<{ testField: EntryFields.Text }, 'fields'>>>({
  'fields.testField[ne]': mocks.stringValue,
})

expectAssignable<ExistenceFilter<{ testField: EntryFields.Text }, 'fields'>>({})
expectType<Required<ExistenceFilter<{ testField: EntryFields.Text }, 'fields'>>>({
  'fields.testField[exists]': mocks.booleanValue,
})

expectAssignable<Required<LocationSearchFilters<{ testField: EntryFields.Text }, 'fields'>>>({})

expectAssignable<Required<RangeFilters<{ testField: EntryFields.Text }, 'fields'>>>({})

expectAssignable<FullTextSearchFilters<{ testField: EntryFields.Text }, 'fields'>>({})
expectType<Required<FullTextSearchFilters<{ testField: EntryFields.Text }, 'fields'>>>({
  'fields.testField[match]': mocks.stringValue,
})

expectAssignable<EntrySelectFilterWithFields<{ testField: EntryFields.Text }>>({})
expectAssignable<Required<EntrySelectFilterWithFields<{ testField: EntryFields.Text }>>>({
  select: ['fields.testField'],
})

expectAssignable<SubsetFilters<{ testField: EntryFields.Text }, 'fields'>>({})
expectType<Required<SubsetFilters<{ testField: EntryFields.Text }, 'fields'>>>({
  'fields.testField[in]': mocks.stringArrayValue,
  'fields.testField[nin]': mocks.stringArrayValue,
})
