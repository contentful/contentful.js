import { expectAssignable, expectNotAssignable, expectType } from 'tsd'
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

expectAssignable<Required<EqualityFilter<{ testField: EntryFields.Location }, 'fields'>>>({})

expectAssignable<Required<InequalityFilter<{ testField: EntryFields.Location }, 'fields'>>>({})

expectAssignable<ExistenceFilter<{ testField: EntryFields.Location }, 'fields'>>({})
expectType<Required<ExistenceFilter<{ testField: EntryFields.Location }, 'fields'>>>({
  'fields.testField[exists]': mocks.booleanValue,
})

expectAssignable<LocationSearchFilters<{ testField: EntryFields.Location }, 'fields'>>({})
expectAssignable<Required<LocationSearchFilters<{ testField: EntryFields.Location }, 'fields'>>>({
  'fields.testField[near]': mocks.nearLocationValue,
  'fields.testField[within]': mocks.withinCircleLocationValue,
})
expectAssignable<Required<LocationSearchFilters<{ testField: EntryFields.Location }, 'fields'>>>({
  'fields.testField[near]': mocks.nearLocationValue,
  'fields.testField[within]': mocks.withinBoxLocationValue,
})
expectNotAssignable<
  LocationSearchFilters<{ testField: EntryFields.Location }, 'fields'>['fields.testField[near]']
>(mocks.withinCircleLocationValue)
expectNotAssignable<
  LocationSearchFilters<{ testField: EntryFields.Location }, 'fields'>['fields.testField[near]']
>(mocks.withinBoxLocationValue)
expectNotAssignable<
  LocationSearchFilters<{ testField: EntryFields.Location }, 'fields'>['fields.testField[within]']
>(mocks.nearLocationValue)

expectAssignable<Required<RangeFilters<{ testField: EntryFields.Location }, 'fields'>>>({})

expectAssignable<Required<FullTextSearchFilters<{ testField: EntryFields.Location }, 'fields'>>>({})

expectNotAssignable<Required<EntryOrderFilterWithFields<{ testField: EntryFields.Location }>>>({
  order: ['fields.testField'],
})

expectAssignable<EntrySelectFilterWithFields<{ testField: EntryFields.Location }>>({})
expectAssignable<Required<EntrySelectFilterWithFields<{ testField: EntryFields.Location }>>>({
  select: ['fields.testField'],
})

expectAssignable<Required<SubsetFilters<{ testField: EntryFields.Location }, 'fields'>>>({})
