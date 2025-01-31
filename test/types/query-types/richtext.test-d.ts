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

test('richtext', async () => {
  expectTypeOf<Required<EntryFieldsSetFilter<{ testField: EntryFieldTypes.RichText }, 'fields'>>>(
    {},
  )

  expectTypeOf<
    Required<EntryFieldsEqualityFilter<{ testField: EntryFieldTypes.RichText }, 'fields'>>
  >({})

  expectTypeOf<
    Required<EntryFieldsInequalityFilter<{ testField: EntryFieldTypes.RichText }, 'fields'>>
  >({})

  expectTypeOf<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.RichText }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsExistenceFilter<{ testField?: EntryFieldTypes.RichText }, 'fields'>>
  >({
    'fields.testField[exists]': mocks.booleanValue,
  })

  expectTypeOf<Required<LocationSearchFilters<{ testField: EntryFieldTypes.RichText }, 'fields'>>>(
    {},
  )

  expectTypeOf<
    Required<EntryFieldsRangeFilters<{ testField: EntryFieldTypes.RichText }, 'fields'>>
  >({})

  expectTypeOf<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.RichText }, 'fields'>>(
    {},
  )
  expectTypeOf<
    Required<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.RichText }, 'fields'>>
  >({
    'fields.testField[match]': mocks.stringValue,
  })

  expectTypeOf({
    order: ['fields.testField'],
  }).not.toEqualTypeOf<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Object }>>()

  expectTypeOf<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.RichText }>>({})
  expectTypeOf<Required<EntrySelectFilterWithFields<{ testField?: EntryFieldTypes.RichText }>>>({
    select: ['fields.testField'],
  })

  expectTypeOf<
    Required<EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.RichText }, 'fields'>>
  >({})
})