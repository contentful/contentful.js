import { expectAssignable, expectNotAssignable } from 'tsd'
import { TagNameFilters } from '../../../lib/types/query/query'

const booleanValue = false
const stringValue = ''
const rangeString = 'test1,test2'

expectAssignable<TagNameFilters>({
  'name[exists]': booleanValue,
})

expectAssignable<TagNameFilters>({
  name: stringValue,
})

expectAssignable<TagNameFilters>({
  'name[match]': stringValue,
})

expectAssignable<TagNameFilters>({
  'name[ne]': stringValue,
})

expectAssignable<TagNameFilters>({
  'name[in]': rangeString,
})

expectAssignable<TagNameFilters>({
  'name[nin]': rangeString,
})

expectNotAssignable<TagNameFilters>({
  'name[near]': rangeString,
})

expectNotAssignable<TagNameFilters>({
  'name[within]': rangeString,
})

expectNotAssignable<TagNameFilters>({
  select: ['name'],
})

expectNotAssignable<TagNameFilters>({
  'name[lt]': stringValue,
  'name[lte]': stringValue,
  'name[gt]': stringValue,
  'name[gte]': stringValue,
})
