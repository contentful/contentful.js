import { expectAssignable, expectNotAssignable, expectType } from 'tsd'
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

expectAssignable<Required<SetFilter<{ testField: EntryFields.RichText }, 'fields'>>>({})

expectAssignable<Required<EqualityFilter<{ testField: EntryFields.RichText }, 'fields'>>>({})

expectAssignable<Required<InequalityFilter<{ testField: EntryFields.RichText }, 'fields'>>>({})

expectAssignable<ExistenceFilter<{ testField: EntryFields.RichText }, 'fields'>>({})
expectType<Required<ExistenceFilter<{ testField: EntryFields.RichText }, 'fields'>>>({
  'fields.testField[exists]': mocks.booleanValue,
})

expectAssignable<Required<LocationSearchFilters<{ testField: EntryFields.RichText }, 'fields'>>>({})

expectType<Required<RangeFilters<{ testField: EntryFields.RichText }, 'fields'>>>({})

expectAssignable<FullTextSearchFilters<{ testField: EntryFields.RichText }, 'fields'>>({})
expectType<Required<FullTextSearchFilters<{ testField: EntryFields.RichText }, 'fields'>>>({
  'fields.testField[match]': mocks.stringValue,
})

expectNotAssignable<EntryOrderFilterWithFields<{ testField: EntryFields.Object }>>({
  order: ['fields.testField'],
})

expectAssignable<EntrySelectFilterWithFields<{ testField: EntryFields.RichText }>>({})
expectAssignable<Required<EntrySelectFilterWithFields<{ testField: EntryFields.RichText }>>>({
  select: ['fields.testField'],
})

expectAssignable<Required<SubsetFilters<{ testField: EntryFields.RichText }, 'fields'>>>({})
