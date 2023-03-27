import { expectAssignable, expectType } from 'tsd'
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
import { EntryFieldTypes } from '../../../lib'

expectAssignable<Required<EntryFieldsSetFilter<{ testField: EntryFieldTypes.Date }, 'fields'>>>({})

expectAssignable<EntryFieldsEqualityFilter<{ testField: EntryFieldTypes.Date }, 'fields'>>({})
expectType<Required<EntryFieldsEqualityFilter<{ testField: EntryFieldTypes.Date }, 'fields'>>>({
  'fields.testField': mocks.dateValue,
})

expectAssignable<EntryFieldsInequalityFilter<{ testField: EntryFieldTypes.Date }, 'fields'>>({})
expectType<Required<EntryFieldsInequalityFilter<{ testField: EntryFieldTypes.Date }, 'fields'>>>({
  'fields.testField[ne]': mocks.dateValue,
})

expectAssignable<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.Date }, 'fields'>>({})
expectType<Required<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.Date }, 'fields'>>>({
  'fields.testField[exists]': mocks.booleanValue,
})

expectAssignable<Required<LocationSearchFilters<{ testField: EntryFieldTypes.Date }, 'fields'>>>({})

expectAssignable<EntryFieldsRangeFilters<{ testField: EntryFieldTypes.Date }, 'fields'>>({})
expectType<Required<EntryFieldsRangeFilters<{ testField: EntryFieldTypes.Date }, 'fields'>>>({
  'fields.testField[lt]': mocks.dateValue,
  'fields.testField[lte]': mocks.dateValue,
  'fields.testField[gt]': mocks.dateValue,
  'fields.testField[gte]': mocks.dateValue,
})

expectAssignable<
  Required<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.Date }, 'fields'>>
>({})

expectAssignable<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Date }>>({})
expectAssignable<Required<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Date }>>>({
  order: ['fields.testField', '-fields.testField'],
})

expectAssignable<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.Date }>>({})
expectAssignable<Required<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.Date }>>>({
  select: ['fields.testField'],
})

expectAssignable<EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.Date }, 'fields'>>({})
expectType<Required<EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.Date }, 'fields'>>>({
  'fields.testField[in]': mocks.dateArrayValue,
  'fields.testField[nin]': mocks.dateArrayValue,
})
