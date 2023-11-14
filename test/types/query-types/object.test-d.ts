import { expectAssignable, expectNotAssignable, expectType } from 'tsd'
import {
  EntryFieldTypes,
  EntryFieldsEqualityFilter,
  EntryFieldsInequalityFilter,
  EntryFieldsExistenceFilter,
  LocationSearchFilters,
  EntryFieldsRangeFilters,
  EntryFieldsFullTextSearchFilters,
  EntrySelectFilterWithFields,
  EntryFieldsSubsetFilters,
  EntryOrderFilterWithFields,
  EntryFieldsSetFilter,
} from '../../../lib'

// @ts-ignore
import * as mocks from '../mocks'

expectAssignable<Required<EntryFieldsSetFilter<{ testField: EntryFieldTypes.Object }, 'fields'>>>(
  {},
)

expectAssignable<
  Required<EntryFieldsEqualityFilter<{ testField: EntryFieldTypes.Object }, 'fields'>>
>({})

expectAssignable<
  Required<EntryFieldsInequalityFilter<{ testField: EntryFieldTypes.Object }, 'fields'>>
>({})

expectAssignable<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.Object }, 'fields'>>({})
expectType<Required<EntryFieldsExistenceFilter<{ testField?: EntryFieldTypes.Object }, 'fields'>>>({
  'fields.testField[exists]': mocks.booleanValue,
})

expectAssignable<Required<LocationSearchFilters<{ testField: EntryFieldTypes.Object }, 'fields'>>>(
  {},
)

expectAssignable<
  Required<EntryFieldsRangeFilters<{ testField: EntryFieldTypes.Object }, 'fields'>>
>({})

expectAssignable<
  Required<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.Object }, 'fields'>>
>({})

expectNotAssignable<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Object }>>({
  order: ['fields.testField'],
})

expectAssignable<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.Object }>>({})
expectAssignable<Required<EntrySelectFilterWithFields<{ testField?: EntryFieldTypes.Object }>>>({
  select: ['fields.testField'],
})

expectAssignable<
  Required<EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.Object }, 'fields'>>
>({})
