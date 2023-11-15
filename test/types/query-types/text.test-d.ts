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

expectAssignable<EntryFieldsSetFilter<{ testField: EntryFieldTypes.Text }, 'fields'>>({})
expectType<Required<EntryFieldsSetFilter<{ testField?: EntryFieldTypes.Text }, 'fields'>>>({
  'fields.testField[all]': mocks.stringArrayValue,
})

expectAssignable<EntryFieldsEqualityFilter<{ testField: EntryFieldTypes.Text }, 'fields'>>({})
expectType<Required<EntryFieldsEqualityFilter<{ testField?: EntryFieldTypes.Text }, 'fields'>>>({
  'fields.testField': mocks.stringValue,
})

expectAssignable<EntryFieldsInequalityFilter<{ testField: EntryFieldTypes.Text }, 'fields'>>({})
expectType<Required<EntryFieldsInequalityFilter<{ testField?: EntryFieldTypes.Text }, 'fields'>>>({
  'fields.testField[ne]': mocks.stringValue,
})

expectAssignable<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.Text }, 'fields'>>({})
expectType<Required<EntryFieldsExistenceFilter<{ testField?: EntryFieldTypes.Text }, 'fields'>>>({
  'fields.testField[exists]': mocks.booleanValue,
})

expectAssignable<Required<LocationSearchFilters<{ testField: EntryFieldTypes.Text }, 'fields'>>>({})

expectAssignable<Required<EntryFieldsRangeFilters<{ testField: EntryFieldTypes.Text }, 'fields'>>>(
  {},
)

expectAssignable<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.Text }, 'fields'>>(
  {},
)
expectType<
  Required<EntryFieldsFullTextSearchFilters<{ testField?: EntryFieldTypes.Text }, 'fields'>>
>({
  'fields.testField[match]': mocks.stringValue,
})

expectAssignable<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Text }>>({})
expectNotAssignable<EntryOrderFilterWithFields<{ testField?: EntryFieldTypes.Text }>>({
  order: ['fields.testField', '-fields.testField'],
})

expectAssignable<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.Text }>>({})
expectAssignable<Required<EntrySelectFilterWithFields<{ testField?: EntryFieldTypes.Text }>>>({
  select: ['fields.testField'],
})

expectAssignable<EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.Text }, 'fields'>>({})
expectType<Required<EntryFieldsSubsetFilters<{ testField?: EntryFieldTypes.Text }, 'fields'>>>({
  'fields.testField[in]': mocks.stringArrayValue,
  'fields.testField[nin]': mocks.stringArrayValue,
})
