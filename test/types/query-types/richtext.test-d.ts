import { expectAssignable, expectNotAssignable, expectType } from 'tsd'
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

expectAssignable<Required<EntryFieldsSetFilter<{ testField: EntryFieldTypes.RichText }, 'fields'>>>(
  {}
)

expectAssignable<
  Required<EntryFieldsEqualityFilter<{ testField: EntryFieldTypes.RichText }, 'fields'>>
>({})

expectAssignable<
  Required<EntryFieldsInequalityFilter<{ testField: EntryFieldTypes.RichText }, 'fields'>>
>({})

expectAssignable<EntryFieldsExistenceFilter<{ testField: EntryFieldTypes.RichText }, 'fields'>>({})
expectType<
  Required<EntryFieldsExistenceFilter<{ testField?: EntryFieldTypes.RichText }, 'fields'>>
>({
  'fields.testField[exists]': mocks.booleanValue,
})

expectAssignable<
  Required<LocationSearchFilters<{ testField: EntryFieldTypes.RichText }, 'fields'>>
>({})

expectType<Required<EntryFieldsRangeFilters<{ testField: EntryFieldTypes.RichText }, 'fields'>>>({})

expectAssignable<
  EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.RichText }, 'fields'>
>({})
expectType<
  Required<EntryFieldsFullTextSearchFilters<{ testField: EntryFieldTypes.RichText }, 'fields'>>
>({
  'fields.testField[match]': mocks.stringValue,
})

expectNotAssignable<EntryOrderFilterWithFields<{ testField: EntryFieldTypes.Object }>>({
  order: ['fields.testField'],
})

expectAssignable<EntrySelectFilterWithFields<{ testField: EntryFieldTypes.RichText }>>({})
expectAssignable<Required<EntrySelectFilterWithFields<{ testField?: EntryFieldTypes.RichText }>>>({
  select: ['fields.testField'],
})

expectAssignable<
  Required<EntryFieldsSubsetFilters<{ testField: EntryFieldTypes.RichText }, 'fields'>>
>({})
