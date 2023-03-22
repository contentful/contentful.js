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

expectAssignable<Required<SetFilter<{ testField: EntryFields.Boolean }, 'fields'>>>({})

expectAssignable<EqualityFilter<{ testField: EntryFields.Boolean }, 'fields'>>({})
expectType<Required<EqualityFilter<{ testField: EntryFields.Boolean }, 'fields'>>>({
  'fields.testField': mocks.booleanValue,
})

expectAssignable<InequalityFilter<{ testField: EntryFields.Boolean }, 'fields'>>({})
expectType<Required<InequalityFilter<{ testField: EntryFields.Boolean }, 'fields'>>>({
  'fields.testField[ne]': mocks.booleanValue,
})

expectAssignable<ExistenceFilter<{ testField: EntryFields.Boolean }, 'fields'>>({})
expectType<Required<ExistenceFilter<{ testField: EntryFields.Boolean }, 'fields'>>>({
  'fields.testField[exists]': mocks.booleanValue,
})

expectAssignable<Required<LocationSearchFilters<{ testField: EntryFields.Boolean }, 'fields'>>>({})

expectAssignable<Required<RangeFilters<{ testField: EntryFields.Boolean }, 'fields'>>>({})

expectAssignable<Required<FullTextSearchFilters<{ testField: EntryFields.Boolean }, 'fields'>>>({})

expectAssignable<EntryOrderFilterWithFields<{ testField: EntryFields.Boolean }>>({})
expectAssignable<Required<EntryOrderFilterWithFields<{ testField: EntryFields.Boolean }>>>({
  order: ['fields.testField', '-fields.testField'],
})

expectAssignable<EntrySelectFilterWithFields<{ testField: EntryFields.Boolean }>>({})
expectAssignable<Required<EntrySelectFilterWithFields<{ testField: EntryFields.Boolean }>>>({
  select: ['fields.testField'],
})

expectAssignable<SubsetFilters<{ testField: EntryFields.Boolean }, 'fields'>>({})
expectType<Required<SubsetFilters<{ testField: EntryFields.Boolean }, 'fields'>>>({
  'fields.testField[in]': mocks.booleanArrayValue,
  'fields.testField[nin]': mocks.booleanArrayValue,
})
