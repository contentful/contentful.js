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
import { SetFilter } from '../../../lib/types/query/set'

expectAssignable<Required<SetFilter<{ testField: EntryFields.Integer }, 'fields'>>>({})

expectAssignable<EqualityFilter<{ testField: EntryFields.Integer }, 'fields'>>({})
expectType<Required<EqualityFilter<{ testField: EntryFields.Integer }, 'fields'>>>({
  'fields.testField': mocks.numberValue,
})

expectAssignable<InequalityFilter<{ testField: EntryFields.Integer }, 'fields'>>({})
expectType<Required<InequalityFilter<{ testField: EntryFields.Integer }, 'fields'>>>({
  'fields.testField[ne]': mocks.numberValue,
})

expectAssignable<ExistenceFilter<{ testField: EntryFields.Integer }, 'fields'>>({})
expectType<Required<ExistenceFilter<{ testField: EntryFields.Integer }, 'fields'>>>({
  'fields.testField[exists]': mocks.booleanValue,
})

expectAssignable<Required<LocationSearchFilters<{ testField: EntryFields.Integer }, 'fields'>>>({})

expectAssignable<RangeFilters<{ testField: EntryFields.Integer }, 'fields'>>({})
expectType<Required<RangeFilters<{ testField: EntryFields.Integer }, 'fields'>>>({
  'fields.testField[lt]': mocks.numberValue,
  'fields.testField[lte]': mocks.numberValue,
  'fields.testField[gt]': mocks.numberValue,
  'fields.testField[gte]': mocks.numberValue,
})

expectAssignable<Required<FullTextSearchFilters<{ testField: EntryFields.Integer }, 'fields'>>>({})

expectAssignable<EntryOrderFilterWithFields<{ testField: EntryFields.Integer }>>({})
expectAssignable<Required<EntryOrderFilterWithFields<{ testField: EntryFields.Integer }>>>({
  order: ['fields.testField', '-fields.testField'],
})

expectAssignable<EntrySelectFilterWithFields<{ testField: EntryFields.Integer }>>({})
expectAssignable<Required<EntrySelectFilterWithFields<{ testField: EntryFields.Integer }>>>({
  select: ['fields.testField'],
})

expectAssignable<SubsetFilters<{ testField: EntryFields.Integer }, 'fields'>>({})
expectType<Required<SubsetFilters<{ testField: EntryFields.Integer }, 'fields'>>>({
  'fields.testField[in]': mocks.numberArrayValue,
  'fields.testField[nin]': mocks.numberArrayValue,
})
