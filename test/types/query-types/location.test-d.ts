import { expectAssignable, expectNotAssignable, expectType } from 'tsd'
import { EntryFieldTypes } from '../../../lib'
import {
  EntryFieldsEqualityFilter,
  EntryFieldsInequalityFilter,
} from '../../../lib/types/query/equality'
import { EntryFieldsExistenceFilter } from '../../../lib/types/query/existence'
import { LocationSearchFilters } from '../../../lib/types/query/location'
import { EntryFieldsRangeFilters } from '../../../lib/types/query/range'
import { EntryFieldsFullTextSearchFilters } from '../../../lib/types/query/search'
import { EntrySelectFilterWithFields } from '../../../lib/types/query/select'
import { EntryFieldsSubsetFilters } from '../../../lib/types/query/subset'
// @ts-ignore
import * as mocks from '../mocks'
import { EntryOrderFilterWithFields } from '../../../lib/types/query/order'
import { EntryFieldsSetFilter } from '../../../lib/types/query/set'

expectAssignable<Required<EntryFieldsSetFilter<{ testField: EntryFieldTypes.Location }, 'fields'>>>(
  {}
)

expectAssignable<
  Required<EntryFieldsEqualityFilter<{ testField: EntryFieldTypes.Location }, 'fields'>>
>({})

expectAssignable<
  Required<EntryFieldsInequalityFilter<{ testField: EntryFieldTypes.Location }, 'fields'>>
>({})

expectAssignable<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.Location }, 'fields'>>({})
expectType<Required<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.Location }, 'fields'>>>(
  {
    'fields.testField[exists]': mocks.booleanValue,
  }
)

expectAssignable<LocationSearchFilters<{ testField: EntryFieldTypes.Location }, 'fields'>>({})
expectAssignable<
  Required<LocationSearchFilters<{ testField: EntryFieldTypes.Location }, 'fields'>>
>({
  'fields.testField[near]': mocks.nearLocationValue,
  'fields.testField[within]': mocks.withinCircleLocationValue,
})
expectAssignable<
  Required<LocationSearchFilters<{ testField: EntryFieldTypes.Location }, 'fields'>>
>({
  'fields.testField[near]': mocks.nearLocationValue,
  'fields.testField[within]': mocks.withinBoxLocationValue,
})
expectNotAssignable<
  LocationSearchFilters<{ testField: EntryFieldTypes.Location }, 'fields'>['fields.testField[near]']
>(mocks.withinCircleLocationValue)
expectNotAssignable<
  LocationSearchFilters<{ testField: EntryFieldTypes.Location }, 'fields'>['fields.testField[near]']
>(mocks.withinBoxLocationValue)
expectNotAssignable<
  LocationSearchFilters<
    { testField: EntryFieldTypes.Location },
    'fields'
  >['fields.testField[within]']
>(mocks.nearLocationValue)

expectAssignable<
  Required<EntryFieldsRangeFilters<{ testField: EntryFieldTypes.Location }, 'fields'>>
>({})

expectAssignable<
  Required<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.Location }, 'fields'>>
>({})

expectAssignable<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Number }>>({})
expectAssignable<Required<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Location }>>>({
  order: ['fields.testField', '-fields.testField'],
})

expectAssignable<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.Location }>>({})
expectAssignable<Required<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.Location }>>>({
  select: ['fields.testField'],
})

expectAssignable<
  Required<EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.Location }, 'fields'>>
>({})
