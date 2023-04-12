import { expectAssignable, expectType } from 'tsd'
import {
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
  EntryFieldTypes,
} from '../../../lib'

// @ts-ignore
import * as mocks from '../mocks'

expectAssignable<Required<EntryFieldsSetFilter<{ testField: EntryFieldTypes.Integer }, 'fields'>>>(
  {}
)

expectAssignable<EntryFieldsEqualityFilter<{ testField: EntryFieldTypes.Integer }, 'fields'>>({})
expectType<Required<EntryFieldsEqualityFilter<{ testField?: EntryFieldTypes.Integer }, 'fields'>>>({
  'fields.testField': mocks.numberValue,
})

expectAssignable<EntryFieldsInequalityFilter<{ testField: EntryFieldTypes.Integer }, 'fields'>>({})
expectType<
  Required<EntryFieldsInequalityFilter<{ testField?: EntryFieldTypes.Integer }, 'fields'>>
>({
  'fields.testField[ne]': mocks.numberValue,
})

expectAssignable<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.Integer }, 'fields'>>({})
expectType<Required<EntryFieldsExistenceFilter<{ testField?: EntryFieldTypes.Integer }, 'fields'>>>(
  {
    'fields.testField[exists]': mocks.booleanValue,
  }
)

expectAssignable<Required<LocationSearchFilters<{ testField: EntryFieldTypes.Integer }, 'fields'>>>(
  {}
)

expectAssignable<EntryFieldsRangeFilters<{ testField: EntryFieldTypes.Integer }, 'fields'>>({})
expectType<Required<EntryFieldsRangeFilters<{ testField?: EntryFieldTypes.Integer }, 'fields'>>>({
  'fields.testField[lt]': mocks.numberValue,
  'fields.testField[lte]': mocks.numberValue,
  'fields.testField[gt]': mocks.numberValue,
  'fields.testField[gte]': mocks.numberValue,
})

expectAssignable<
  Required<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.Integer }, 'fields'>>
>({})

expectAssignable<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Integer }>>({})
expectAssignable<Required<EntryOrderFilterWithFields<{ testField?: EntryFieldTypes.Integer }>>>({
  order: ['fields.testField', '-fields.testField'],
})

expectAssignable<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.Integer }>>({})
expectAssignable<Required<EntrySelectFilterWithFields<{ testField?: EntryFieldTypes.Integer }>>>({
  select: ['fields.testField'],
})

expectAssignable<EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.Integer }, 'fields'>>({})
expectType<Required<EntryFieldsSubsetFilters<{ testField?: EntryFieldTypes.Integer }, 'fields'>>>({
  'fields.testField[in]': mocks.numberArrayValue,
  'fields.testField[nin]': mocks.numberArrayValue,
})
