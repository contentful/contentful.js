import { expectAssignable, expectNotAssignable } from 'tsd'
import { TagNameFilters } from '../../../lib/types/query/query'
// @ts-ignore
import * as mocks from '../mocks'

expectAssignable<TagNameFilters>({
  'name[exists]': mocks.booleanValue,
  name: mocks.stringValue,
  'name[match]': mocks.stringValue,
  'name[ne]': mocks.stringValue,
  'name[in]': mocks.stringArrayValue,
  'name[nin]': mocks.stringArrayValue,
})

expectNotAssignable<TagNameFilters>({ 'name[near]': mocks.anyValue })
expectNotAssignable<TagNameFilters>({ 'name[within]': mocks.anyValue })
expectNotAssignable<TagNameFilters>({ select: mocks.anyValue })
expectNotAssignable<TagNameFilters>({ 'name[lt]': mocks.anyValue })
expectNotAssignable<TagNameFilters>({ 'name[lte]': mocks.anyValue })
expectNotAssignable<TagNameFilters>({ 'name[gt]': mocks.anyValue })
expectNotAssignable<TagNameFilters>({ 'name[gte]': mocks.anyValue })
