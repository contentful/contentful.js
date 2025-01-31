import { expectTypeOf, test } from "vitest";
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

test('number', async () => {
  expectTypeOf<Required<EntryFieldsSetFilter<{ testField: EntryFieldTypes.Number }, 'fields'>>>({})

  expectTypeOf<EntryFieldsEqualityFilter<{ testField: EntryFieldTypes.Number }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsEqualityFilter<{ testField?: EntryFieldTypes.Number }, 'fields'>>
  >({
    'fields.testField': mocks.numberValue,
  })

  expectTypeOf<EntryFieldsInequalityFilter<{ testField: EntryFieldTypes.Number }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsInequalityFilter<{ testField?: EntryFieldTypes.Number }, 'fields'>>
  >({
    'fields.testField[ne]': mocks.numberValue,
  })

  expectTypeOf<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.Number }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsExistenceFilter<{ testField?: EntryFieldTypes.Number }, 'fields'>>
  >({
    'fields.testField[exists]': mocks.booleanValue,
  })

  expectTypeOf<Required<LocationSearchFilters<{ testField: EntryFieldTypes.Number }, 'fields'>>>({})

  expectTypeOf<EntryFieldsRangeFilters<{ testField: EntryFieldTypes.Number }, 'fields'>>({})
  expectTypeOf<Required<EntryFieldsRangeFilters<{ testField?: EntryFieldTypes.Number }, 'fields'>>>(
    {
      'fields.testField[lt]': mocks.numberValue,
      'fields.testField[lte]': mocks.numberValue,
      'fields.testField[gt]': mocks.numberValue,
      'fields.testField[gte]': mocks.numberValue,
    },
  )

  expectTypeOf<
    Required<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.Number }, 'fields'>>
  >({})

  expectTypeOf<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Number }>>({})
  expectTypeOf<Required<EntryOrderFilterWithFields<{ testField?: EntryFieldTypes.Number }>>>({
    order: ['fields.testField', '-fields.testField'],
  })

  expectTypeOf<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.Number }>>({})
  expectTypeOf<Required<EntrySelectFilterWithFields<{ testField?: EntryFieldTypes.Number }>>>({
    select: ['fields.testField'],
  })

  expectTypeOf<EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.Number }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsSubsetFilters<{ testField?: EntryFieldTypes.Number }, 'fields'>>
  >({
    'fields.testField[in]': mocks.numberArrayValue,
    'fields.testField[nin]': mocks.numberArrayValue,
  })
})