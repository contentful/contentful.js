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

test('symbol', async () => {
  expectTypeOf<EntryFieldsSetFilter<{ testField: EntryFieldTypes.Symbol }, 'fields'>>({})
  expectTypeOf<Required<EntryFieldsSetFilter<{ testField?: EntryFieldTypes.Symbol }, 'fields'>>>({
    'fields.testField[all]': mocks.stringArrayValue,
  })

  expectTypeOf<EntryFieldsEqualityFilter<{ testField: EntryFieldTypes.Symbol }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsEqualityFilter<{ testField?: EntryFieldTypes.Symbol }, 'fields'>>
  >({
    'fields.testField': mocks.stringValue,
  })

  expectTypeOf<EntryFieldsInequalityFilter<{ testField: EntryFieldTypes.Symbol }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsInequalityFilter<{ testField?: EntryFieldTypes.Symbol }, 'fields'>>
  >({
    'fields.testField[ne]': mocks.stringValue,
  })

  expectTypeOf<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.Symbol }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsExistenceFilter<{ testField?: EntryFieldTypes.Symbol }, 'fields'>>
  >({
    'fields.testField[exists]': mocks.booleanValue,
  })

  expectTypeOf<Required<LocationSearchFilters<{ testField: EntryFieldTypes.Symbol }, 'fields'>>>({})

  expectTypeOf<Required<EntryFieldsRangeFilters<{ testField: EntryFieldTypes.Symbol }, 'fields'>>>(
    {},
  )

  expectTypeOf<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.Symbol }, 'fields'>>(
    {},
  )
  expectTypeOf<
    Required<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.Symbol }, 'fields'>>
  >({
    'fields.testField[match]': mocks.stringValue,
  })

  expectTypeOf<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Symbol }>>({})
  expectTypeOf<Required<EntryOrderFilterWithFields<{ testField?: EntryFieldTypes.Symbol }>>>({
    order: ['fields.testField', '-fields.testField'],
  })

  expectTypeOf<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.Symbol }>>({})
  expectTypeOf<Required<EntrySelectFilterWithFields<{ testField?: EntryFieldTypes.Symbol }>>>({
    select: ['fields.testField'],
  })

  expectTypeOf<EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.Symbol }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsSubsetFilters<{ testField?: EntryFieldTypes.Symbol }, 'fields'>>
  >({
    'fields.testField[in]': mocks.stringArrayValue,
    'fields.testField[nin]': mocks.stringArrayValue,
  })
})