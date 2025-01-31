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

test('location', async () => {
  expectTypeOf<Required<EntryFieldsSetFilter<{ testField: EntryFieldTypes.Location }, 'fields'>>>(
    {},
  )

  expectTypeOf<
    Required<EntryFieldsEqualityFilter<{ testField: EntryFieldTypes.Location }, 'fields'>>
  >({})

  expectTypeOf<
    Required<EntryFieldsInequalityFilter<{ testField: EntryFieldTypes.Location }, 'fields'>>
  >({})

  expectTypeOf<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.Location }, 'fields'>>({})
  expectTypeOf<
    Required<EntryFieldsExistenceFilter<{ testField?: EntryFieldTypes.Location }, 'fields'>>
  >({
    'fields.testField[exists]': mocks.booleanValue,
  })

  expectTypeOf<LocationSearchFilters<{ testField: EntryFieldTypes.Location }, 'fields'>>({})
  expectTypeOf<Required<LocationSearchFilters<{ testField?: EntryFieldTypes.Location }, 'fields'>>>(
    {
      'fields.testField[near]': mocks.nearLocationValue,
      'fields.testField[within]': mocks.withinCircleLocationValue,
    },
  )
  expectTypeOf<Required<LocationSearchFilters<{ testField: EntryFieldTypes.Location }, 'fields'>>>({
    'fields.testField[near]': mocks.nearLocationValue,
    'fields.testField[within]': mocks.withinBoxLocationValue,
  })
  expectTypeOf(mocks.withinCircleLocationValue).not.toEqualTypeOf<
    LocationSearchFilters<
      { testField: EntryFieldTypes.Location },
      'fields'
    >['fields.testField[near]']
  >()
  expectTypeOf(mocks.withinBoxLocationValue).not.toEqualTypeOf<
    LocationSearchFilters<
      { testField: EntryFieldTypes.Location },
      'fields'
    >['fields.testField[near]']
  >()
  expectTypeOf(mocks.nearLocationValue).not.toEqualTypeOf<
    LocationSearchFilters<
      { testField: EntryFieldTypes.Location },
      'fields'
    >['fields.testField[within]']
  >()

  expectTypeOf<
    Required<EntryFieldsRangeFilters<{ testField: EntryFieldTypes.Location }, 'fields'>>
  >({})

  expectTypeOf<
    Required<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.Location }, 'fields'>>
  >({})

  expectTypeOf<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Number }>>({})
  expectTypeOf<Required<EntryOrderFilterWithFields<{ testField?: EntryFieldTypes.Location }>>>({
    order: ['fields.testField', '-fields.testField'],
  })

  expectTypeOf<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.Location }>>({})
  expectTypeOf<Required<EntrySelectFilterWithFields<{ testField?: EntryFieldTypes.Location }>>>({
    select: ['fields.testField'],
  })

  expectTypeOf<
    Required<EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.Location }, 'fields'>>
  >({})
})