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

expectAssignable<Required<EntryFieldsSetFilter<{ testField: EntryFieldTypes.RichText }, 'fields'>>>(
  {},
)

expectAssignable<
  Required<EntryFieldsEqualityFilter<{ testField: EntryFieldTypes.RichText }, 'fields'>>
>({})

expectAssignable<
  Required<EntryFieldsInequalityFilter<{ testField: EntryFieldTypes.RichText }, 'fields'>>
>({})

expectAssignable<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.RichText }, 'fields'>>({})
expectType<
  Required<EntryFieldsExistenceFilter<{ testField?: EntryFieldTypes.RichText }, 'fields'>>
>({
  'fields.testField[exists]': mocks.booleanValue,
})

expectAssignable<
  Required<LocationSearchFilters<{ testField: EntryFieldTypes.RichText }, 'fields'>>
>({})

expectType<Required<EntryFieldsRangeFilters<{ testField: EntryFieldTypes.RichText }, 'fields'>>>({})

expectAssignable<
  EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.RichText }, 'fields'>
>({})
expectType<
  Required<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.RichText }, 'fields'>>
>({
  'fields.testField[match]': mocks.stringValue,
})

expectNotAssignable<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Object }>>({
  order: ['fields.testField'],
})

expectAssignable<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.RichText }>>({})
expectAssignable<Required<EntrySelectFilterWithFields<{ testField?: EntryFieldTypes.RichText }>>>({
  select: ['fields.testField'],
})

expectAssignable<
  Required<EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.RichText }, 'fields'>>
>({})
