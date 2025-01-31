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

test('symbol-array', async () => {
  expectTypeOf<
    EntryFieldsSetFilter<{ testField: EntryFieldTypes.Array<EntryFieldTypes.Symbol> }, 'fields'>
  >({})
  expectTypeOf<
    Required<
      EntryFieldsSetFilter<{ testField?: EntryFieldTypes.Array<EntryFieldTypes.Symbol> }, 'fields'>
    >
  >({
    'fields.testField[all]': mocks.stringArrayValue,
  })

  expectTypeOf<
    EntryFieldsEqualityFilter<
      { testField: EntryFieldTypes.Array<EntryFieldTypes.Symbol> },
      'fields'
    >
  >({})
  expectTypeOf<
    Required<
      EntryFieldsEqualityFilter<
        { testField?: EntryFieldTypes.Array<EntryFieldTypes.Symbol> },
        'fields'
      >
    >
  >({
    'fields.testField': mocks.stringValue,
  })

  expectTypeOf<
    EntryFieldsInequalityFilter<
      { testField: EntryFieldTypes.Array<EntryFieldTypes.Symbol> },
      'fields'
    >
  >({})
  expectTypeOf<
    Required<
      EntryFieldsInequalityFilter<
        { testField?: EntryFieldTypes.Array<EntryFieldTypes.Symbol> },
        'fields'
      >
    >
  >({
    'fields.testField[ne]': mocks.stringValue,
  })

  expectTypeOf<
    EntryFieldsExistenceFilter<
      { testField: EntryFieldTypes.Array<EntryFieldTypes.Symbol> },
      'fields'
    >
  >({})
  expectTypeOf<
    Required<
      EntryFieldsExistenceFilter<
        { testField?: EntryFieldTypes.Array<EntryFieldTypes.Symbol> },
        'fields'
      >
    >
  >({
    'fields.testField[exists]': mocks.booleanValue,
  })

  expectTypeOf<
    Required<
      LocationSearchFilters<{ testField: EntryFieldTypes.Array<EntryFieldTypes.Symbol> }, 'fields'>
    >
  >({})

  expectTypeOf<
    Required<
      EntryFieldsRangeFilters<
        { testField: EntryFieldTypes.Array<EntryFieldTypes.Symbol> },
        'fields'
      >
    >
  >({})

  expectTypeOf<
    EntryFieldsFullTextSearchFilters<
      { testField: EntryFieldTypes.Array<EntryFieldTypes.Symbol> },
      'fields'
    >
  >({})
  expectTypeOf<
    Required<
      EntryFieldsFullTextSearchFilters<
        { testField?: EntryFieldTypes.Array<EntryFieldTypes.Symbol> },
        'fields'
      >
    >
  >({
    'fields.testField[match]': mocks.stringValue,
  })

  expectTypeOf({
    order: ['fields.testField'],
  }).not.toEqualTypeOf<
    Required<
      EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Array<EntryFieldTypes.Symbol> }>
    >
  >()

  expectTypeOf<
    EntrySelectFilterWithFields<{ testField: EntryFieldTypes.Array<EntryFieldTypes.Symbol> }>
  >({})
  expectTypeOf<
    Required<
      EntrySelectFilterWithFields<{ testField: EntryFieldTypes.Array<EntryFieldTypes.Symbol> }>
    >
  >({
    select: ['fields.testField'],
  })

  expectTypeOf<
    EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.Array<EntryFieldTypes.Symbol> }, 'fields'>
  >({})
  expectTypeOf<
    Required<
      EntryFieldsSubsetFilters<
        { testField?: EntryFieldTypes.Array<EntryFieldTypes.Symbol> },
        'fields'
      >
    >
  >({
    'fields.testField[in]': mocks.stringArrayValue,
    'fields.testField[nin]': mocks.stringArrayValue,
  })
})