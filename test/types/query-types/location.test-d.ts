import { expectAssignable, expectNotAssignable } from 'tsd'
import { EntryFields } from '../../../lib'
import { EqualityFilter, InequalityFilter } from '../../../lib/types/query/equality'
import { ExistenceFilter } from '../../../lib/types/query/existence'
import {
  BoundingBoxSearchFilterInput,
  BoundingCircleSearchFilterInput,
  LocationSearchFilters,
  ProximitySearchFilterInput,
} from '../../../lib/types/query/location'
import { RangeFilters } from '../../../lib/types/query/range'
import { FullTextSearchFilters } from '../../../lib/types/query/search'
import { EntrySelectFilterWithFields } from '../../../lib/types/query/select'
import { SubsetFilters } from '../../../lib/types/query/subset'

const stringValue = ''
const booleanValue = true
const numberValue = 12.11
export const nearLocationValue: ProximitySearchFilterInput = [1, 0]
export const withinCircleLocationValue: BoundingCircleSearchFilterInput = [1, 0, 2]
export const withinBoxLocationValue: BoundingBoxSearchFilterInput = [1, 0, 2, 1]

expectNotAssignable<EqualityFilter<{ testField: EntryFields.Location }, 'fields'>>({
  'fields.testField': { lat: numberValue, lon: numberValue },
})
expectNotAssignable<InequalityFilter<{ testField: EntryFields.Location }, 'fields'>>({
  'fields.testField[ne]': { lat: numberValue, lon: numberValue },
})
expectAssignable<ExistenceFilter<{ testField: EntryFields.Location }, 'fields'>>({
  'fields.testField[exists]': booleanValue,
})
expectAssignable<
  LocationSearchFilters<
    {
      testField: EntryFields.Location
    },
    'fields'
  >
>({
  'fields.testField[near]': nearLocationValue,
})
expectNotAssignable<
  LocationSearchFilters<
    {
      testField: EntryFields.Location
    },
    'fields'
  >
>({
  'fields.testField[within]': nearLocationValue,
})
expectAssignable<
  LocationSearchFilters<
    {
      testField: EntryFields.Location
    },
    'fields'
  >
>({
  'fields.testField[within]': withinCircleLocationValue,
})
expectNotAssignable<
  LocationSearchFilters<
    {
      testField: EntryFields.Location
    },
    'fields'
  >
>({
  'fields.testField[near]': withinCircleLocationValue,
})

expectAssignable<
  LocationSearchFilters<
    {
      testField: EntryFields.Location
    },
    'fields'
  >
>({
  'fields.testField[within]': withinBoxLocationValue,
})
expectNotAssignable<
  LocationSearchFilters<
    {
      testField: EntryFields.Location
    },
    'fields'
  >
>({
  'fields.testField[near]': withinBoxLocationValue,
})
expectNotAssignable<RangeFilters<{ testField: EntryFields.Location }, 'fields'>>({
  'fields.testField[lt]': nearLocationValue,
  'fields.testField[lte]': nearLocationValue,
  'fields.testField[gt]': nearLocationValue,
  'fields.testField[gte]': nearLocationValue,
})
expectNotAssignable<FullTextSearchFilters<{ testField: EntryFields.Location }, 'fields'>>({
  'fields.testField[match]': stringValue,
})
expectAssignable<EntrySelectFilterWithFields<{ testField: EntryFields.Location }>>({
  select: ['fields.testField'],
})
expectNotAssignable<SubsetFilters<{ testField: EntryFields.Location }, 'fields'>>({
  'fields.testField[in]': nearLocationValue,
  'fields.testField[nin]': nearLocationValue,
})
