import { expectAssignable, expectType } from 'tsd'
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
} from '../../../lib/'

// @ts-ignore
import * as mocks from '../mocks'

expectAssignable<Required<EntryFieldsSetFilter<{ testField: EntryFieldTypes.Boolean }, 'fields'>>>(
  {},
)

expectAssignable<EntryFieldsEqualityFilter<{ testField: EntryFieldTypes.Boolean }, 'fields'>>({})
expectType<Required<EntryFieldsEqualityFilter<{ testField?: EntryFieldTypes.Boolean }, 'fields'>>>({
  'fields.testField': mocks.booleanValue,
})

expectAssignable<EntryFieldsInequalityFilter<{ testField: EntryFieldTypes.Boolean }, 'fields'>>({})
expectType<
  Required<EntryFieldsInequalityFilter<{ testField?: EntryFieldTypes.Boolean }, 'fields'>>
>({
  'fields.testField[ne]': mocks.booleanValue,
})

expectAssignable<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.Boolean }, 'fields'>>({})
expectType<Required<EntryFieldsExistenceFilter<{ testField?: EntryFieldTypes.Boolean }, 'fields'>>>(
  {
    'fields.testField[exists]': mocks.booleanValue,
  },
)

expectAssignable<Required<LocationSearchFilters<{ testField: EntryFieldTypes.Boolean }, 'fields'>>>(
  {},
)

expectAssignable<
  Required<EntryFieldsRangeFilters<{ testField: EntryFieldTypes.Boolean }, 'fields'>>
>({})

expectAssignable<
  Required<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.Boolean }, 'fields'>>
>({})

expectAssignable<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Boolean }>>({})
expectAssignable<Required<EntryOrderFilterWithFields<{ testField?: EntryFieldTypes.Boolean }>>>({
  order: ['fields.testField', '-fields.testField'],
})

expectAssignable<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.Boolean }>>({})
expectAssignable<Required<EntrySelectFilterWithFields<{ testField?: EntryFieldTypes.Boolean }>>>({
  select: ['fields.testField'],
})

expectAssignable<EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.Boolean }, 'fields'>>({})
expectType<Required<EntryFieldsSubsetFilters<{ testField?: EntryFieldTypes.Boolean }, 'fields'>>>({
  'fields.testField[in]': mocks.booleanArrayValue,
  'fields.testField[nin]': mocks.booleanArrayValue,
})
