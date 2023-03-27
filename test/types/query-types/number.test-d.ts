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

expectAssignable<Required<EntryFieldsSetFilter<{ testField: EntryFieldTypes.Number }, 'fields'>>>(
  {}
)

expectAssignable<EntryFieldsEqualityFilter<{ testField: EntryFieldTypes.Number }, 'fields'>>({})
expectType<Required<EntryFieldsEqualityFilter<{ testField?: EntryFieldTypes.Number }, 'fields'>>>({
  'fields.testField': mocks.numberValue,
})

expectAssignable<EntryFieldsInequalityFilter<{ testField: EntryFieldTypes.Number }, 'fields'>>({})
expectType<Required<EntryFieldsInequalityFilter<{ testField?: EntryFieldTypes.Number }, 'fields'>>>(
  {
    'fields.testField[ne]': mocks.numberValue,
  }
)

expectAssignable<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.Number }, 'fields'>>({})
expectType<Required<EntryFieldsExistenceFilter<{ testField?: EntryFieldTypes.Number }, 'fields'>>>({
  'fields.testField[exists]': mocks.booleanValue,
})

expectType<Required<LocationSearchFilters<{ testField: EntryFieldTypes.Number }, 'fields'>>>({})

expectAssignable<EntryFieldsRangeFilters<{ testField: EntryFieldTypes.Number }, 'fields'>>({})
expectType<Required<EntryFieldsRangeFilters<{ testField?: EntryFieldTypes.Number }, 'fields'>>>({
  'fields.testField[lt]': mocks.numberValue,
  'fields.testField[lte]': mocks.numberValue,
  'fields.testField[gt]': mocks.numberValue,
  'fields.testField[gte]': mocks.numberValue,
})

expectAssignable<
  Required<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.Number }, 'fields'>>
>({})

expectAssignable<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Number }>>({})
expectAssignable<Required<EntryOrderFilterWithFields<{ testField?: EntryFieldTypes.Number }>>>({
  order: ['fields.testField', '-fields.testField'],
})

expectAssignable<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.Number }>>({})
expectAssignable<Required<EntrySelectFilterWithFields<{ testField?: EntryFieldTypes.Number }>>>({
  select: ['fields.testField'],
})

expectAssignable<EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.Number }, 'fields'>>({})
expectType<Required<EntryFieldsSubsetFilters<{ testField?: EntryFieldTypes.Number }, 'fields'>>>({
  'fields.testField[in]': mocks.numberArrayValue,
  'fields.testField[nin]': mocks.numberArrayValue,
})
