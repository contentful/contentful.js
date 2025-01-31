import { test, expectTypeOf } from "vitest";
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

test('object', () => {

expectTypeOf<Required<EntryFieldsSetFilter<{ testField: EntryFieldTypes.Object }, 'fields'>>>({})

expectTypeOf<Required<EntryFieldsEqualityFilter<{ testField: EntryFieldTypes.Object }, 'fields'>>>({})

expectTypeOf<Required<EntryFieldsInequalityFilter<{ testField: EntryFieldTypes.Object }, 'fields'>>>({})

expectTypeOf<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.Object }, 'fields'>>({})
expectTypeOf<Required<EntryFieldsExistenceFilter<{ testField?: EntryFieldTypes.Object }, 'fields'>>>({
  'fields.testField[exists]': mocks.booleanValue,
})

expectTypeOf<Required<LocationSearchFilters<{ testField: EntryFieldTypes.Object }, 'fields'>>>({})

expectTypeOf<Required<EntryFieldsRangeFilters<{ testField: EntryFieldTypes.Object }, 'fields'>>>({})

expectTypeOf<Required<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.Object }, 'fields'>>>({})

expectTypeOf({
  order: ['fields.testField'],
}).not.toEqualTypeOf<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Object }>>()

expectTypeOf<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.Object }>>({})
expectTypeOf<Required<EntrySelectFilterWithFields<{ testField?: EntryFieldTypes.Object }>>>({
  select: ['fields.testField'],
})

expectTypeOf<Required<EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.Object }, 'fields'>>>({})
})