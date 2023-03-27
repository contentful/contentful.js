import { expectAssignable, expectType } from 'tsd'
import { EntryFieldTypes } from '../../../lib'
import {
  EntryFieldsEqualityFilter,
  EntryFieldsInequalityFilter,
} from '../../../lib/types/query/equality'
import { EntryFieldsExistenceFilter } from '../../../lib/types/query/existence'
import { LocationSearchFilters } from '../../../lib/types/query/location'
import { EntryFieldsRangeFilters } from '../../../lib/types/query/range'
import { EntryFieldsFullTextSearchFilters } from '../../../lib/types/query/search'
import { EntrySelectFilterWithFields } from '../../../lib/types/query/select'
import { EntryFieldsSubsetFilters } from '../../../lib/types/query/subset'
// @ts-ignore
import * as mocks from '../mocks'
import { EntryOrderFilterWithFields } from '../../../lib/types/query/order'
import { EntryFieldsSetFilter } from '../../../lib/types/query/set'

expectAssignable<EntryFieldsSetFilter<{ testField: EntryFieldTypes.Symbol }, 'fields'>>({})
expectType<Required<EntryFieldsSetFilter<{ testField: EntryFieldTypes.Symbol }, 'fields'>>>({
  'fields.testField[all]': mocks.stringArrayValue,
})

expectAssignable<EntryFieldsEqualityFilter<{ testField: EntryFieldTypes.Symbol }, 'fields'>>({})
expectType<Required<EntryFieldsEqualityFilter<{ testField: EntryFieldTypes.Symbol }, 'fields'>>>({
  'fields.testField': mocks.stringValue,
})

expectAssignable<EntryFieldsInequalityFilter<{ testField: EntryFieldTypes.Symbol }, 'fields'>>({})
expectType<Required<EntryFieldsInequalityFilter<{ testField: EntryFieldTypes.Symbol }, 'fields'>>>({
  'fields.testField[ne]': mocks.stringValue,
})

expectAssignable<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.Symbol }, 'fields'>>({})
expectType<Required<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.Symbol }, 'fields'>>>({
  'fields.testField[exists]': mocks.booleanValue,
})

expectAssignable<Required<LocationSearchFilters<{ testField: EntryFieldTypes.Symbol }, 'fields'>>>(
  {}
)

expectAssignable<
  Required<EntryFieldsRangeFilters<{ testField: EntryFieldTypes.Symbol }, 'fields'>>
>({})

expectAssignable<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.Symbol }, 'fields'>>(
  {}
)
expectType<
  Required<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.Symbol }, 'fields'>>
>({
  'fields.testField[match]': mocks.stringValue,
})

expectAssignable<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Symbol }>>({})
expectAssignable<Required<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Symbol }>>>({
  order: ['fields.testField', '-fields.testField'],
})

expectAssignable<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.Symbol }>>({})
expectAssignable<Required<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.Symbol }>>>({
  select: ['fields.testField'],
})

expectAssignable<EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.Symbol }, 'fields'>>({})
expectType<Required<EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.Symbol }, 'fields'>>>({
  'fields.testField[in]': mocks.stringArrayValue,
  'fields.testField[nin]': mocks.stringArrayValue,
})
