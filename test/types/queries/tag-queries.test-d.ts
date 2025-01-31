import { expectTypeOf, test } from "vitest";
import { TagQueries } from '../../../lib'
import * as mocks from '../mocks'

test('tagQueries', async () => {

// equality operator

expectTypeOf<TagQueries>({
  'sys.id': mocks.stringValue,
  'sys.createdAt': mocks.dateValue,
  'sys.updatedAt': mocks.dateValue,
  'sys.visibility': mocks.stringValue,
  'sys.type': mocks.stringValue,
})
expectTypeOf({ 'sys.createdBy': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.updatedBy': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.version': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.revision': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()

// gt operator (range)

expectTypeOf<TagQueries>({
  'sys.createdAt[gt]': mocks.dateValue,
  'sys.updatedAt[gt]': mocks.dateValue,
})
expectTypeOf({ 'sys.createdBy[gt]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.id[gt]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.revision[gt]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.type[gt]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.updatedBy[gt]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.version[gt]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.visibility[gt]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()

// gte operator (range)

expectTypeOf<TagQueries>({
  'sys.createdAt[gte]': mocks.dateValue,
  'sys.updatedAt[gte]': mocks.dateValue,
})
expectTypeOf({ 'sys.createdBy[gte]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.id[gte]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.revision[gte]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.type[gte]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.updatedBy[gte]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.version[gte]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.visibility[gte]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()

// in operator

expectTypeOf<TagQueries>({
  'sys.id[in]': mocks.stringArrayValue,
  'sys.createdAt[in]': mocks.dateArrayValue,
  'sys.updatedAt[in]': mocks.dateArrayValue,
  'sys.visibility[in]': mocks.stringArrayValue,
  'sys.type[in]': mocks.stringArrayValue,
})
expectTypeOf({ 'sys.createdBy[in]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.updatedBy[in]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.version[in]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.revision[in]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()

// lt operator (range)

expectTypeOf<TagQueries>({
  'sys.createdAt[lt]': mocks.dateValue,
  'sys.updatedAt[lt]': mocks.dateValue,
})
expectTypeOf({ 'sys.createdBy[lt]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.id[lt]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.revision[lt]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.type[lt]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.updatedBy[lt]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.version[lt]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.visibility[lt]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()

// lte operator (range)

expectTypeOf<TagQueries>({
  'sys.createdAt[lte]': mocks.dateValue,
  'sys.updatedAt[lte]': mocks.dateValue,
})
expectTypeOf({ 'sys.createdBy[lte]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.id[lte]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.revision[lte]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.type[lte]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.updatedBy[lte]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.version[lte]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.visibility[lte]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()

// ne operator (inequality)

expectTypeOf<TagQueries>({
  'sys.id[ne]': mocks.stringValue,
  'sys.createdAt[ne]': mocks.dateValue,
  'sys.updatedAt[ne]': mocks.dateValue,
  'sys.visibility[ne]': mocks.stringValue,
  'sys.type[ne]': mocks.stringValue,
})
expectTypeOf({ 'sys.createdBy[ne]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.updatedBy[ne]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.version[ne]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.revision[ne]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()

// nin operator

expectTypeOf<TagQueries>({
  'sys.id[nin]': mocks.stringArrayValue,
  'sys.createdAt[nin]': mocks.dateArrayValue,
  'sys.updatedAt[nin]': mocks.dateArrayValue,
  'sys.visibility[nin]': mocks.stringArrayValue,
  'sys.type[nin]': mocks.stringArrayValue,
})
expectTypeOf({ 'sys.createdBy[nin]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.updatedBy[nin]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.version[nin]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()
expectTypeOf({ 'sys.revision[nin]': mocks.anyValue }).not.toEqualTypeOf<TagQueries>()

// order operator

expectTypeOf<TagQueries>({
  order: ['sys.id', 'sys.createdAt', 'sys.updatedAt', 'sys.visibility', 'sys.type'],
})
expectTypeOf<TagQueries>({
  order: ['-sys.id', '-sys.createdAt', '-sys.updatedAt', '-sys.visibility', '-sys.type'],
})

// Fixed query filters

expectTypeOf<TagQueries>({ skip: 1, limit: 1 })
expectTypeOf({ locale: 'en' }).not.toEqualTypeOf<TagQueries>()})