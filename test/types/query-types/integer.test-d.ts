import { expectTypeOf, test } from "vitest";
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

test('integer', async () => {
  expectTypeOf<Required<EntryFieldsSetFilter<{ testField: EntryFieldTypes.Integer }, 'fields'>>>({})

  expectTypeOf<EntryFieldsEqualityFilter<{ testField: EntryFieldTypes.Integer }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsEqualityFilter<{ testField?: EntryFieldTypes.Integer }, 'fields'>>
  >({
    'fields.testField': mocks.numberValue,
  })

  expectTypeOf<EntryFieldsInequalityFilter<{ testField: EntryFieldTypes.Integer }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsInequalityFilter<{ testField?: EntryFieldTypes.Integer }, 'fields'>>
  >({
    'fields.testField[ne]': mocks.numberValue,
  })

  expectTypeOf<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.Integer }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsExistenceFilter<{ testField?: EntryFieldTypes.Integer }, 'fields'>>
  >({
    'fields.testField[exists]': mocks.booleanValue,
  })

  expectTypeOf<Required<LocationSearchFilters<{ testField: EntryFieldTypes.Integer }, 'fields'>>>(
    {},
  )

  expectTypeOf<EntryFieldsRangeFilters<{ testField: EntryFieldTypes.Integer }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsRangeFilters<{ testField?: EntryFieldTypes.Integer }, 'fields'>>
  >({
    'fields.testField[lt]': mocks.numberValue,
    'fields.testField[lte]': mocks.numberValue,
    'fields.testField[gt]': mocks.numberValue,
    'fields.testField[gte]': mocks.numberValue,
  })

  expectTypeOf<
    Required<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.Integer }, 'fields'>>
  >({})

  expectTypeOf<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Integer }>>({})
  expectTypeOf<Required<EntryOrderFilterWithFields<{ testField?: EntryFieldTypes.Integer }>>>({
    order: ['fields.testField', '-fields.testField'],
  })

  expectTypeOf<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.Integer }>>({})
  expectTypeOf<Required<EntrySelectFilterWithFields<{ testField?: EntryFieldTypes.Integer }>>>({
    select: ['fields.testField'],
  })

  expectTypeOf<EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.Integer }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsSubsetFilters<{ testField?: EntryFieldTypes.Integer }, 'fields'>>
  >({
    'fields.testField[in]': mocks.numberArrayValue,
    'fields.testField[nin]': mocks.numberArrayValue,
  })
})