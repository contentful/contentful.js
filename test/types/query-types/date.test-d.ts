import { expectTypeOf, test } from 'vitest'
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

test('date', async () => {
  expectTypeOf<Required<EntryFieldsSetFilter<{ testField: EntryFieldTypes.Date }, 'fields'>>>({})

  expectTypeOf<EntryFieldsEqualityFilter<{ testField: EntryFieldTypes.Date }, 'fields'>>({})
  expectTypeOf<Required<EntryFieldsEqualityFilter<{ testField?: EntryFieldTypes.Date }, 'fields'>>>(
    {
      'fields.testField': mocks.dateValue,
    },
  )

  expectTypeOf<EntryFieldsInequalityFilter<{ testField: EntryFieldTypes.Date }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsInequalityFilter<{ testField?: EntryFieldTypes.Date }, 'fields'>>
  >({
    'fields.testField[ne]': mocks.dateValue,
  })

  expectTypeOf<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.Date }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsExistenceFilter<{ testField?: EntryFieldTypes.Date }, 'fields'>>
  >({
    'fields.testField[exists]': mocks.booleanValue,
  })

  expectTypeOf<Required<LocationSearchFilters<{ testField: EntryFieldTypes.Date }, 'fields'>>>({})

  expectTypeOf<EntryFieldsRangeFilters<{ testField: EntryFieldTypes.Date }, 'fields'>>({})
  expectTypeOf<Required<EntryFieldsRangeFilters<{ testField?: EntryFieldTypes.Date }, 'fields'>>>({
    'fields.testField[lt]': mocks.dateValue,
    'fields.testField[lte]': mocks.dateValue,
    'fields.testField[gt]': mocks.dateValue,
    'fields.testField[gte]': mocks.dateValue,
  })

  expectTypeOf<
    Required<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.Date }, 'fields'>>
  >({})

  expectTypeOf<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Date }>>({})
  expectTypeOf<Required<EntryOrderFilterWithFields<{ testField?: EntryFieldTypes.Date }>>>({
    order: ['fields.testField', '-fields.testField'],
  })

  expectTypeOf<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.Date }>>({})
  expectTypeOf<Required<EntrySelectFilterWithFields<{ testField?: EntryFieldTypes.Date }>>>({
    select: ['fields.testField'],
  })

  expectTypeOf<EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.Date }, 'fields'>>({})
  expectTypeOf<Required<EntryFieldsSubsetFilters<{ testField?: EntryFieldTypes.Date }, 'fields'>>>({
    'fields.testField[in]': mocks.dateArrayValue,
    'fields.testField[nin]': mocks.dateArrayValue,
  })
})
