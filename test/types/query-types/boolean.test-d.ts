import { expectTypeOf, test } from 'vitest'
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

test('boolean', async () => {
  expectTypeOf<Required<EntryFieldsSetFilter<{ testField: EntryFieldTypes.Boolean }, 'fields'>>>({})

  expectTypeOf<EntryFieldsEqualityFilter<{ testField: EntryFieldTypes.Boolean }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsEqualityFilter<{ testField?: EntryFieldTypes.Boolean }, 'fields'>>
  >({
    'fields.testField': mocks.booleanValue,
  })

  expectTypeOf<EntryFieldsInequalityFilter<{ testField: EntryFieldTypes.Boolean }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsInequalityFilter<{ testField?: EntryFieldTypes.Boolean }, 'fields'>>
  >({
    'fields.testField[ne]': mocks.booleanValue,
  })

  expectTypeOf<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.Boolean }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsExistenceFilter<{ testField?: EntryFieldTypes.Boolean }, 'fields'>>
  >({
    'fields.testField[exists]': mocks.booleanValue,
  })

  expectTypeOf<Required<LocationSearchFilters<{ testField: EntryFieldTypes.Boolean }, 'fields'>>>(
    {},
  )

  expectTypeOf<Required<EntryFieldsRangeFilters<{ testField: EntryFieldTypes.Boolean }, 'fields'>>>(
    {},
  )

  expectTypeOf<
    Required<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.Boolean }, 'fields'>>
  >({})

  expectTypeOf<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Boolean }>>({})
  expectTypeOf<Required<EntryOrderFilterWithFields<{ testField?: EntryFieldTypes.Boolean }>>>({
    order: ['fields.testField', '-fields.testField'],
  })

  expectTypeOf<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.Boolean }>>({})
  expectTypeOf<Required<EntrySelectFilterWithFields<{ testField?: EntryFieldTypes.Boolean }>>>({
    select: ['fields.testField'],
  })

  expectTypeOf<EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.Boolean }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsSubsetFilters<{ testField?: EntryFieldTypes.Boolean }, 'fields'>>
  >({
    'fields.testField[in]': mocks.booleanArrayValue,
    'fields.testField[nin]': mocks.booleanArrayValue,
  })
})
