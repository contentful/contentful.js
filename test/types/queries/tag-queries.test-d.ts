import { expectAssignable, expectNotAssignable } from 'tsd'
import { TagQueries } from '../../../lib'
// @ts-ignore
import * as mocks from '../mocks'

// equality operator

expectAssignable<TagQueries>({
  'sys.id': mocks.stringValue,
  'sys.createdAt': mocks.dateValue,
  'sys.updatedAt': mocks.dateValue,
  'sys.visibility': mocks.stringValue,
  'sys.type': mocks.stringValue,
})
expectNotAssignable<TagQueries>({ 'sys.createdBy': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.updatedBy': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.version': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.revision': mocks.anyValue })

// gt operator (range)

expectAssignable<TagQueries>({
  'sys.createdAt[gt]': mocks.dateValue,
  'sys.updatedAt[gt]': mocks.dateValue,
})
expectNotAssignable<TagQueries>({ 'sys.createdBy[gt]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.id[gt]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.revision[gt]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.type[gt]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.updatedBy[gt]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.version[gt]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.visibility[gt]': mocks.anyValue })

// gte operator (range)

expectAssignable<TagQueries>({
  'sys.createdAt[gte]': mocks.dateValue,
  'sys.updatedAt[gte]': mocks.dateValue,
})
expectNotAssignable<TagQueries>({ 'sys.createdBy[gte]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.id[gte]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.revision[gte]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.type[gte]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.updatedBy[gte]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.version[gte]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.visibility[gte]': mocks.anyValue })

// in operator

expectAssignable<TagQueries>({
  'sys.id[in]': mocks.stringArrayValue,
  'sys.createdAt[in]': mocks.dateArrayValue,
  'sys.updatedAt[in]': mocks.dateArrayValue,
  'sys.visibility[in]': mocks.stringArrayValue,
  'sys.type[in]': mocks.stringArrayValue,
})
expectNotAssignable<TagQueries>({ 'sys.createdBy[in]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.updatedBy[in]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.version[in]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.revision[in]': mocks.anyValue })

// lt operator (range)

expectAssignable<TagQueries>({
  'sys.createdAt[lt]': mocks.dateValue,
  'sys.updatedAt[lt]': mocks.dateValue,
})
expectNotAssignable<TagQueries>({ 'sys.createdBy[lt]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.id[lt]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.revision[lt]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.type[lt]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.updatedBy[lt]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.version[lt]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.visibility[lt]': mocks.anyValue })

// lte operator (range)

expectAssignable<TagQueries>({
  'sys.createdAt[lte]': mocks.dateValue,
  'sys.updatedAt[lte]': mocks.dateValue,
})
expectNotAssignable<TagQueries>({ 'sys.createdBy[lte]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.id[lte]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.revision[lte]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.type[lte]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.updatedBy[lte]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.version[lte]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.visibility[lte]': mocks.anyValue })

// ne operator (inequality)

expectAssignable<TagQueries>({
  'sys.id[ne]': mocks.stringValue,
  'sys.createdAt[ne]': mocks.dateValue,
  'sys.updatedAt[ne]': mocks.dateValue,
  'sys.visibility[ne]': mocks.stringValue,
  'sys.type[ne]': mocks.stringValue,
})
expectNotAssignable<TagQueries>({ 'sys.createdBy[ne]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.updatedBy[ne]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.version[ne]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.revision[ne]': mocks.anyValue })

// nin operator

expectAssignable<TagQueries>({
  'sys.id[nin]': mocks.stringArrayValue,
  'sys.createdAt[nin]': mocks.dateArrayValue,
  'sys.updatedAt[nin]': mocks.dateArrayValue,
  'sys.visibility[nin]': mocks.stringArrayValue,
  'sys.type[nin]': mocks.stringArrayValue,
})
expectNotAssignable<TagQueries>({ 'sys.createdBy[nin]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.updatedBy[nin]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.version[nin]': mocks.anyValue })
expectNotAssignable<TagQueries>({ 'sys.revision[nin]': mocks.anyValue })

// order operator

expectAssignable<TagQueries>({
  order: ['sys.id', 'sys.createdAt', 'sys.updatedAt', 'sys.visibility', 'sys.type'],
})
expectAssignable<TagQueries>({
  order: ['-sys.id', '-sys.createdAt', '-sys.updatedAt', '-sys.visibility', '-sys.type'],
})

// Fixed query filters

expectAssignable<TagQueries>({ skip: 1, limit: 1 })
expectNotAssignable<TagQueries>({ locale: 'en' })
