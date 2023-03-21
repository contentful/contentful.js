import { expectAssignable, expectType } from 'tsd'
import { EntryFields } from '../../../lib'
import { EqualityFilter, InequalityFilter } from '../../../lib/types/query/equality'
import { ExistenceFilter } from '../../../lib/types/query/existence'
import { LocationSearchFilters } from '../../../lib/types/query/location'
import { RangeFilters } from '../../../lib/types/query/range'
import { FullTextSearchFilters } from '../../../lib/types/query/search'
import { EntrySelectFilterWithFields } from '../../../lib/types/query/select'
import { SubsetFilters } from '../../../lib/types/query/subset'
// @ts-ignore
import * as mocks from '../mocks'
import { EntryOrderFilterWithFields } from '../../../lib/types/query/order'

expectAssignable<EqualityFilter<{ testField: EntryFields.Number }, 'fields'>>({})
expectType<Required<EqualityFilter<{ testField: EntryFields.Number }, 'fields'>>>({
  'fields.testField': mocks.numberValue,
})

expectAssignable<InequalityFilter<{ testField: EntryFields.Number }, 'fields'>>({})
expectType<Required<InequalityFilter<{ testField: EntryFields.Number }, 'fields'>>>({
  'fields.testField[ne]': mocks.numberValue,
})

expectAssignable<ExistenceFilter<{ testField: EntryFields.Number }, 'fields'>>({})
expectType<Required<ExistenceFilter<{ testField: EntryFields.Number }, 'fields'>>>({
  'fields.testField[exists]': mocks.booleanValue,
})

expectType<Required<LocationSearchFilters<{ testField: EntryFields.Number }, 'fields'>>>({})

expectAssignable<RangeFilters<{ testField: EntryFields.Number }, 'fields'>>({})
expectType<Required<RangeFilters<{ testField: EntryFields.Number }, 'fields'>>>({
  'fields.testField[lt]': mocks.numberValue,
  'fields.testField[lte]': mocks.numberValue,
  'fields.testField[gt]': mocks.numberValue,
  'fields.testField[gte]': mocks.numberValue,
})

expectAssignable<Required<FullTextSearchFilters<{ testField: EntryFields.Number }, 'fields'>>>({})

expectAssignable<EntryOrderFilterWithFields<{ testField: EntryFields.Number }>>({})
expectAssignable<Required<EntryOrderFilterWithFields<{ testField: EntryFields.Number }>>>({
  order: ['fields.testField', '-fields.testField'],
})

expectAssignable<EntrySelectFilterWithFields<{ testField: EntryFields.Number }>>({})
expectAssignable<Required<EntrySelectFilterWithFields<{ testField: EntryFields.Number }>>>({
  select: ['fields.testField'],
})

expectAssignable<SubsetFilters<{ testField: EntryFields.Number }, 'fields'>>({})
expectType<Required<SubsetFilters<{ testField: EntryFields.Number }, 'fields'>>>({
  'fields.testField[in]': mocks.numberArrayValue,
  'fields.testField[nin]': mocks.numberArrayValue,
})
