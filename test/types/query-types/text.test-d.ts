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

test('text', async () => {
  expectTypeOf<EntryFieldsSetFilter<{ testField: EntryFieldTypes.Text }, 'fields'>>({})
  expectTypeOf<Required<EntryFieldsSetFilter<{ testField?: EntryFieldTypes.Text }, 'fields'>>>({
    'fields.testField[all]': mocks.stringArrayValue,
  })

  expectTypeOf<EntryFieldsEqualityFilter<{ testField: EntryFieldTypes.Text }, 'fields'>>({})
  expectTypeOf<Required<EntryFieldsEqualityFilter<{ testField?: EntryFieldTypes.Text }, 'fields'>>>(
    {
      'fields.testField': mocks.stringValue,
    },
  )

  expectTypeOf<EntryFieldsInequalityFilter<{ testField: EntryFieldTypes.Text }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsInequalityFilter<{ testField?: EntryFieldTypes.Text }, 'fields'>>
  >({
    'fields.testField[ne]': mocks.stringValue,
  })

  expectTypeOf<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.Text }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsExistenceFilter<{ testField?: EntryFieldTypes.Text }, 'fields'>>
  >({
    'fields.testField[exists]': mocks.booleanValue,
  })

  expectTypeOf<Required<LocationSearchFilters<{ testField: EntryFieldTypes.Text }, 'fields'>>>({})

  expectTypeOf<Required<EntryFieldsRangeFilters<{ testField: EntryFieldTypes.Text }, 'fields'>>>({})

  expectTypeOf<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.Text }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsFullTextSearchFilters<{ testField?: EntryFieldTypes.Text }, 'fields'>>
  >({
    'fields.testField[match]': mocks.stringValue,
  })

  expectTypeOf<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Text }>>({})
  expectTypeOf({
    order: ['fields.testField', '-fields.testField'],
  }).not.toEqualTypeOf<EntryOrderFilterWithFields<{ testField?: EntryFieldTypes.Text }>>()

  expectTypeOf<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.Text }>>({})
  expectTypeOf<Required<EntrySelectFilterWithFields<{ testField?: EntryFieldTypes.Text }>>>({
    select: ['fields.testField'],
  })

  expectTypeOf<EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.Text }, 'fields'>>({})
  expectTypeOf<Required<EntryFieldsSubsetFilters<{ testField?: EntryFieldTypes.Text }, 'fields'>>>({
    'fields.testField[in]': mocks.stringArrayValue,
    'fields.testField[nin]': mocks.stringArrayValue,
  })
})
