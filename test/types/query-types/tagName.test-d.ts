import { expectTypeOf, test } from "vitest";
import { TagNameFilters } from '../../../lib'

// @ts-ignore
import * as mocks from '../mocks'

test('tagName', async () => {
  expectTypeOf<TagNameFilters>({
    'name[exists]': mocks.booleanValue,
    name: mocks.stringValue,
    'name[match]': mocks.stringValue,
    'name[ne]': mocks.stringValue,
    'name[in]': mocks.stringArrayValue,
    'name[nin]': mocks.stringArrayValue,
  })

  expectTypeOf({ 'name[near]': mocks.anyValue }).not.toEqualTypeOf<TagNameFilters>()
  expectTypeOf({ 'name[within]': mocks.anyValue }).not.toEqualTypeOf<TagNameFilters>()
  expectTypeOf({ select: mocks.anyValue }).not.toEqualTypeOf<TagNameFilters>()
  expectTypeOf({ 'name[lt]': mocks.anyValue }).not.toEqualTypeOf<TagNameFilters>()
  expectTypeOf({ 'name[lte]': mocks.anyValue }).not.toEqualTypeOf<TagNameFilters>()
  expectTypeOf({ 'name[gt]': mocks.anyValue }).not.toEqualTypeOf<TagNameFilters>()
  expectTypeOf({ 'name[gte]': mocks.anyValue }).not.toEqualTypeOf<TagNameFilters>()
})