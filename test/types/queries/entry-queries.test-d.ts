import { expectTypeOf, test } from "vitest";
import { EntriesQueries, EntrySkeletonType, EntryFieldTypes } from '../../../lib'
import * as mocks from '../mocks'

test('entryQueries', async () => {

// all operator

expectTypeOf<EntriesQueries<
  EntrySkeletonType<{
    stringField: EntryFieldTypes.Symbol
    stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  }>,
  undefined
>>({
  'metadata.tags.sys.id[all]': mocks.stringArrayValue,
  'metadata.concepts.sys.id[all]': mocks.stringArrayValue,
})

expectTypeOf<EntriesQueries<
  EntrySkeletonType<{
    stringField: EntryFieldTypes.Symbol
    stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  }>,
  undefined
>>({
  'metadata.tags.sys.id[all]': mocks.stringArrayValue,
  'metadata.concepts.sys.id[all]': mocks.stringArrayValue,
  'metadata.concepts.descendants[in]': mocks.stringArrayValue,
})

expectTypeOf({
  'fields.stringField[all]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<
  EntrySkeletonType<{
    stringField: EntryFieldTypes.Symbol
    stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  }>,
  undefined
>>()
expectTypeOf<EntriesQueries<
  EntrySkeletonType<{
    stringField: EntryFieldTypes.Symbol
    stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  }>,
  undefined
>>({
  content_type: 'id',
  'fields.stringField[all]': mocks.stringArrayValue,
  'fields.stringArrayField[all]': mocks.stringArrayValue,
})
expectTypeOf({
  content_type: 'id',
  'fields.unknownField[all]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<
  EntrySkeletonType<{
    stringField: EntryFieldTypes.Symbol
    stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  }>,
  undefined
>>()

// equality

expectTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>({
  'sys.updatedAt': mocks.dateValue,
})
expectTypeOf({
  'fields.numberField': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>()
expectTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>({
  content_type: 'id',
  'fields.someField': mocks.stringValue,
  'sys.updatedAt': mocks.dateValue,
})
expectTypeOf({
  'sys.unknownProp': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>()
expectTypeOf({
  content_type: 'id',
  'fields.unknownField': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>()

// exists operator (field is present)

expectTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>({
  'metadata.tags[exists]': mocks.booleanValue,
  'metadata.concepts[exists]': mocks.booleanValue,
  'sys.updatedAt[exists]': mocks.booleanValue,
})
expectTypeOf({
  'fields.numberField[exists]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>()
expectTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>({
  content_type: 'id',
  'fields.someField[exists]': mocks.booleanValue,
  'sys.updatedAt[exists]': mocks.booleanValue,
})
expectTypeOf({
  'sys.unknownProp[exists]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>()
expectTypeOf({
  content_type: 'id',
  'fields.unknownField[exists]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>()

// gt operator (range)

expectTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>({
  'sys.updatedAt[gt]': mocks.dateValue,
})
expectTypeOf({
  'fields.numberField[gt]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>, undefined>>()
expectTypeOf<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>, undefined>>({
  content_type: 'id',
  'fields.numberField[gt]': mocks.numberValue,
  'sys.updatedAt[gt]': mocks.dateValue,
})
expectTypeOf({
  'sys.unknownProp[gt]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>, undefined>>()
expectTypeOf({
  content_type: 'id',
  'fields.unknownField[gt]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>, undefined>>()

// gte operator (range)

expectTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Number }>, undefined>>({
  'sys.updatedAt[gte]': mocks.dateValue,
})
expectTypeOf({
  'fields.numberField[gte]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>, undefined>>()
expectTypeOf<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>, undefined>>({
  content_type: 'id',
  'fields.numberField[gte]': mocks.numberValue,
  'sys.updatedAt[gte]': mocks.dateValue,
})
expectTypeOf({
  'sys.unknownProp[gte]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>, undefined>>()
expectTypeOf({
  content_type: 'id',
  'fields.unknownField[gte]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>, undefined>>()

// in operator

expectTypeOf<EntriesQueries<
  EntrySkeletonType<{
    numberField: number
    stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  }>,
  undefined
>>({
  'metadata.tags.sys.id[in]': mocks.stringArrayValue,
  'metadata.concepts.sys.id[in]': mocks.stringArrayValue,
  'sys.updatedAt[in]': mocks.dateArrayValue,
})
expectTypeOf({
  'fields.numberField[in]': mocks.anyValue,
  'fields.stringArrayField[in]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<
  EntrySkeletonType<{
    numberField: EntryFieldTypes.Number
    stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  }>,
  undefined
>>()
expectTypeOf<EntriesQueries<
  EntrySkeletonType<{
    numberField: EntryFieldTypes.Number
    stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  }>,
  undefined
>>({
  content_type: 'id',
  'fields.numberField[in]': mocks.numberArrayValue,
  'fields.stringArrayField[in]': mocks.stringArrayValue,
  'sys.updatedAt[in]': mocks.dateArrayValue,
})
expectTypeOf({
  'sys.unknownProp[in]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>()
expectTypeOf({
  content_type: 'id',
  'fields.unknownField[in]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<
  EntrySkeletonType<{
    numberField: EntryFieldTypes.Number
    stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  }>,
  undefined
>>()

// lt operator (range)

expectTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>({
  'sys.updatedAt[lt]': mocks.dateValue,
})
expectTypeOf({
  'fields.numberField[lt]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>, undefined>>()
expectTypeOf<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>, undefined>>({
  content_type: 'id',
  'fields.numberField[lt]': mocks.numberValue,
  'sys.updatedAt[lt]': mocks.dateValue,
})
expectTypeOf({
  'sys.unknownProp[lt]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>, undefined>>()
expectTypeOf({
  content_type: 'id',
  'fields.unknownField[lt]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>, undefined>>()

// lte operator (range)

expectTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>({
  'sys.updatedAt[lte]': mocks.dateValue,
})
expectTypeOf({
  'fields.numberField[lte]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>, undefined>>()
expectTypeOf<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>, undefined>>({
  content_type: 'id',
  'fields.numberField[lte]': mocks.numberValue,
  'sys.updatedAt[lte]': mocks.dateValue,
})
expectTypeOf({
  'sys.unknownProp[lte]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>, undefined>>()
expectTypeOf({
  content_type: 'id',
  'fields.unknownField[lte]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>, undefined>>()

// match operator (full-text search)

expectTypeOf({
  'fields.textField[match]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ textField: EntryFieldTypes.Symbol }>, undefined>>()
expectTypeOf<EntriesQueries<EntrySkeletonType<{ textField: EntryFieldTypes.Symbol }>, undefined>>({
  content_type: 'id',
  'fields.textField[match]': mocks.stringValue,
})
expectTypeOf({
  content_type: 'id',
  'fields.unknownField[match]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ textField: EntryFieldTypes.Symbol }>, undefined>>()

// ne operator (inequality)

expectTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>({
  'sys.updatedAt[ne]': mocks.dateValue,
})
expectTypeOf({
  'fields.numberField[ne]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>()
expectTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>({
  content_type: 'id',
  'fields.someField[ne]': mocks.stringValue,
  'sys.updatedAt[ne]': mocks.dateValue,
})
expectTypeOf({
  'sys.unknownProp[ne]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>()
expectTypeOf({
  content_type: 'id',
  'fields.unknownField[ne]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>()

// near operator (full-text search)

expectTypeOf({
  'fields.locationField[near]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ locationField: EntryFieldTypes.Location }>, undefined>>()
expectTypeOf<EntriesQueries<EntrySkeletonType<{ locationField: EntryFieldTypes.Location }>, undefined>>({
  content_type: 'id',
  'fields.locationField[near]': mocks.nearLocationValue,
})
expectTypeOf({
  content_type: 'id',
  'fields.unknownField[near]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ locationField: EntryFieldTypes.Location }>, undefined>>()

// nin operator

expectTypeOf<EntriesQueries<
  EntrySkeletonType<{
    numberField: EntryFieldTypes.Number
    stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  }>,
  undefined
>>({
  'metadata.tags.sys.id[nin]': mocks.stringArrayValue,
  'metadata.concepts.sys.id[nin]': mocks.stringArrayValue,
  'sys.updatedAt[nin]': mocks.dateArrayValue,
})
expectTypeOf({
  'fields.numberField[nin]': mocks.anyValue,
  'fields.stringArrayField[nin]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<
  EntrySkeletonType<{
    numberField: EntryFieldTypes.Number
    stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  }>,
  undefined
>>()
expectTypeOf<EntriesQueries<
  EntrySkeletonType<{
    numberField: EntryFieldTypes.Number
    stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  }>,
  undefined
>>({
  content_type: 'id',
  'fields.numberField[nin]': mocks.numberArrayValue,
  'fields.stringArrayField[nin]': mocks.stringArrayValue,
  'sys.updatedAt[nin]': mocks.dateArrayValue,
})
expectTypeOf({
  'sys.unknownProp[nin]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>()
expectTypeOf({
  content_type: 'id',
  'fields.unknownField[nin]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<
  EntrySkeletonType<{
    numberField: EntryFieldTypes.Number
    stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  }>,
  undefined
>>()

// order operator

expectTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>({
  order: ['sys.createdAt', '-sys.createdAt'],
})
expectTypeOf({
  order: ['sys.unknownProperty'],
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>()

expectTypeOf({
  order: ['fields.someField'],
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>()
expectTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>({
  content_type: 'id',
  order: ['fields.someField', '-fields.someField'],
})
expectTypeOf<EntriesQueries<
  EntrySkeletonType<{
    mediaField: EntryFieldTypes.AssetLink
    referenceField: EntryFieldTypes.EntryLink<any>
  }>,
  undefined
>>({
  content_type: 'id',
  order: [
    'fields.mediaField.sys.id',
    '-fields.mediaField.sys.id',
    'fields.referenceField.sys.id',
    '-fields.referenceField.sys.id',
  ],
})
expectTypeOf({
  content_type: 'id',
  order: ['fields.unknownField'],
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>()

// select operator

expectTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>({
  select: ['sys'],
})
expectTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>({
  select: ['sys.createdAt'],
})
expectTypeOf({
  select: ['sys.unknownProperty'],
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>()

expectTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>({
  select: ['fields'],
})
expectTypeOf({
  select: ['fields.someField'],
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>()
expectTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>({
  content_type: 'id',
  select: ['fields.someField'],
})
expectTypeOf({
  content_type: 'id',
  select: ['fields.unknownField'],
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>, undefined>>()

// within operator (bounding circle)

expectTypeOf({
  'fields.locationField[within]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ locationField: EntryFieldTypes.Location }>, undefined>>()
expectTypeOf<EntriesQueries<EntrySkeletonType<{ locationField: EntryFieldTypes.Location }>, undefined>>({
  content_type: 'id',
  'fields.locationField[within]': mocks.withinCircleLocationValue,
})
expectTypeOf({
  content_type: 'id',
  'fields.unknownField[within]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ locationField: EntryFieldTypes.Location }>, undefined>>()

// within operator (bounding rectangle)

expectTypeOf({
  'fields.locationField[within]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ locationField: EntryFieldTypes.Location }>, undefined>>()
expectTypeOf<EntriesQueries<EntrySkeletonType<{ locationField: EntryFieldTypes.Location }>, undefined>>({
  content_type: 'id',
  'fields.locationField[within]': mocks.withinBoxLocationValue,
})
expectTypeOf({
  content_type: 'id',
  'fields.unknownField[within]': mocks.anyValue,
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ locationField: EntryFieldTypes.Location }>, undefined>>()

// search on references

expectTypeOf({
  'fields.referenceField.sys.contentType.sys.id': 'id',
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ referenceField: EntryFieldTypes.EntryLink<any> }>, undefined>>()
expectTypeOf<EntriesQueries<EntrySkeletonType<{ referenceField: EntryFieldTypes.EntryLink<any> }>, undefined>>({
  content_type: 'id',
  'fields.referenceField.sys.contentType.sys.id': 'id',
})
expectTypeOf({
  content_type: 'id',
  'fields.unknownField.sys.contentType.sys.id': 'id',
}).not.toEqualTypeOf<EntriesQueries<EntrySkeletonType<{ referenceField: EntryFieldTypes.EntryLink<any> }>, undefined>>()

// locale option

expectTypeOf<EntriesQueries<EntrySkeletonType<{ referenceField: EntryFieldTypes.EntryLink<any> }>, undefined>>({ locale: mocks.stringValue })
expectTypeOf({ locale: mocks.anyValue }).not.toEqualTypeOf<EntriesQueries<
  EntrySkeletonType<{ referenceField: EntryFieldTypes.EntryLink<any> }>,
  'WITH_ALL_LOCALES'
>>()})