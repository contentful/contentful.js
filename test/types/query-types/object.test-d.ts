import { expectAssignable, expectNotAssignable, expectType } from 'tsd'
import { EntryFields } from '../../../lib'
import { EqualityFilter, InequalityFilter } from '../../../lib/types/query/equality'
import { ExistenceFilter } from '../../../lib/types/query/existence'
import { LocationSearchFilters } from '../../../lib/types/query/location'
import { RangeFilters } from '../../../lib/types/query/range'
import { FullTextSearchFilters } from '../../../lib/types/query/search'
import { EntrySelectFilterWithFields } from '../../../lib/types/query/select'
import { SubsetFilters } from '../../../lib/types/query/subset'
import { EntryOrderFilterWithFields } from '../../../lib/types/query/order'
import { SetFilter } from '../../../lib/types/query/set'
// @ts-ignore
import * as mocks from '../mocks'

expectAssignable<Required<SetFilter<{ testField: EntryFields.Object }, 'fields'>>>({})

expectAssignable<Required<EqualityFilter<{ testField: EntryFields.Object }, 'fields'>>>({})

expectAssignable<Required<InequalityFilter<{ testField: EntryFields.Object }, 'fields'>>>({})

expectAssignable<ExistenceFilter<{ testField: EntryFields.Object }, 'fields'>>({})
expectType<Required<ExistenceFilter<{ testField: EntryFields.Object }, 'fields'>>>({
  'fields.testField[exists]': mocks.booleanValue,
})

expectAssignable<Required<LocationSearchFilters<{ testField: EntryFields.Object }, 'fields'>>>({})

expectAssignable<Required<RangeFilters<{ testField: EntryFields.Object }, 'fields'>>>({})

expectAssignable<Required<FullTextSearchFilters<{ testField: EntryFields.Object }, 'fields'>>>({})

expectNotAssignable<EntryOrderFilterWithFields<{ testField: EntryFields.Object }>>({
  order: ['fields.testField'],
})

expectAssignable<EntrySelectFilterWithFields<{ testField: EntryFields.Object }>>({})
expectAssignable<Required<EntrySelectFilterWithFields<{ testField: EntryFields.Object }>>>({
  select: ['fields.testField'],
})

expectAssignable<Required<SubsetFilters<{ testField: EntryFields.Object }, 'fields'>>>({})
