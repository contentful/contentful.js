import { expectAssignable, expectNotAssignable } from 'tsd'
import { EntryFields, EntriesQueries, EntrySkeletonType } from '../../../lib'
// @ts-ignore
import * as mocks from '../mocks'

// all operator

expectAssignable<
  EntriesQueries<EntrySkeletonType<{ stringField: string; stringArrayField: string[] }>>
>({
  'metadata.tags.sys.id[all]': mocks.stringArrayValue,
})
expectNotAssignable<
  EntriesQueries<EntrySkeletonType<{ stringField: string; stringArrayField: string[] }>>
>({
  'fields.stringField[all]': mocks.anyValue,
})
expectAssignable<
  EntriesQueries<EntrySkeletonType<{ stringField: string; stringArrayField: string[] }>>
>({
  content_type: 'id',
  'fields.stringField[all]': mocks.stringArrayValue,
  'fields.stringArrayField[all]': mocks.stringArrayValue,
})
expectNotAssignable<
  EntriesQueries<EntrySkeletonType<{ stringField: string; stringArrayField: string[] }>>
>({
  content_type: 'id',
  'fields.unknownField[all]': mocks.anyValue,
})

// equality

expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  'sys.updatedAt': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  'fields.numberField': mocks.anyValue,
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  content_type: 'id',
  'fields.someField': mocks.stringValue,
  'sys.updatedAt': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  'sys.unknownProp': mocks.anyValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  content_type: 'id',
  'fields.unknownField': mocks.anyValue,
})

// exists operator (field is present)

expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  'metadata.tags[exists]': mocks.booleanValue,
  'sys.updatedAt[exists]': mocks.booleanValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  'fields.numberField[exists]': mocks.anyValue,
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  content_type: 'id',
  'fields.someField[exists]': mocks.booleanValue,
  'sys.updatedAt[exists]': mocks.booleanValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  'sys.unknownProp[exists]': mocks.anyValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  content_type: 'id',
  'fields.unknownField[exists]': mocks.anyValue,
})

// gt operator (range)

expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  'sys.updatedAt[gt]': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: number }>>>({
  'fields.numberField[gt]': mocks.anyValue,
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ numberField: number }>>>({
  content_type: 'id',
  'fields.numberField[gt]': mocks.numberValue,
  'sys.updatedAt[gt]': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: number }>>>({
  'sys.unknownProp[gt]': mocks.anyValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: number }>>>({
  content_type: 'id',
  'fields.unknownField[gt]': mocks.anyValue,
})

// gte operator (range)

expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  'sys.updatedAt[gte]': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: number }>>>({
  'fields.numberField[gte]': mocks.anyValue,
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ numberField: number }>>>({
  content_type: 'id',
  'fields.numberField[gte]': mocks.numberValue,
  'sys.updatedAt[gte]': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: number }>>>({
  'sys.unknownProp[gte]': mocks.anyValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: number }>>>({
  content_type: 'id',
  'fields.unknownField[gte]': mocks.anyValue,
})

// in operator

expectAssignable<
  EntriesQueries<EntrySkeletonType<{ numberField: number; stringArrayField: string[] }>>
>({
  'metadata.tags.sys.id[in]': mocks.stringArrayValue,
  'sys.updatedAt[in]': mocks.dateArrayValue,
})
expectNotAssignable<
  EntriesQueries<EntrySkeletonType<{ numberField: number; stringArrayField: string[] }>>
>({
  'fields.numberField[in]': mocks.anyValue,
  'fields.stringArrayField[in]': mocks.anyValue,
})
expectAssignable<
  EntriesQueries<EntrySkeletonType<{ numberField: number; stringArrayField: string[] }>>
>({
  content_type: 'id',
  'fields.numberField[in]': mocks.numberArrayValue,
  'fields.stringArrayField[in]': mocks.stringArrayValue,
  'sys.updatedAt[in]': mocks.dateArrayValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  'sys.unknownProp[in]': mocks.anyValue,
})
expectNotAssignable<
  EntriesQueries<EntrySkeletonType<{ numberField: number; stringArrayField: string[] }>>
>({
  content_type: 'id',
  'fields.unknownField[in]': mocks.anyValue,
})

// lt operator (range)

expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  'sys.updatedAt[lt]': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: number }>>>({
  'fields.numberField[lt]': mocks.anyValue,
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ numberField: number }>>>({
  content_type: 'id',
  'fields.numberField[lt]': mocks.numberValue,
  'sys.updatedAt[lt]': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: number }>>>({
  'sys.unknownProp[lt]': mocks.anyValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: number }>>>({
  content_type: 'id',
  'fields.unknownField[lt]': mocks.anyValue,
})

// lte operator (range)

expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  'sys.updatedAt[lte]': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: number }>>>({
  'fields.numberField[lte]': mocks.anyValue,
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ numberField: number }>>>({
  content_type: 'id',
  'fields.numberField[lte]': mocks.numberValue,
  'sys.updatedAt[lte]': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: number }>>>({
  'sys.unknownProp[lte]': mocks.anyValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: number }>>>({
  content_type: 'id',
  'fields.unknownField[lte]': mocks.anyValue,
})

// match operator (full-text search)

expectNotAssignable<EntriesQueries<EntrySkeletonType<{ textField: string }>>>({
  'fields.textField[match]': mocks.anyValue,
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ textField: string }>>>({
  content_type: 'id',
  'fields.textField[match]': mocks.stringValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ textField: string }>>>({
  content_type: 'id',
  'fields.unknownField[match]': mocks.anyValue,
})

// ne operator (inequality)

expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  'sys.updatedAt[ne]': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  'fields.numberField[ne]': mocks.anyValue,
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  content_type: 'id',
  'fields.someField[ne]': mocks.stringValue,
  'sys.updatedAt[ne]': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  'sys.unknownProp[ne]': mocks.anyValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  content_type: 'id',
  'fields.unknownField[ne]': mocks.anyValue,
})

// near operator (full-text search)

expectNotAssignable<EntriesQueries<EntrySkeletonType<{ locationField: EntryFields.Location }>>>({
  'fields.locationField[near]': mocks.anyValue,
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ locationField: EntryFields.Location }>>>({
  content_type: 'id',
  'fields.locationField[near]': mocks.nearLocationValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ locationField: EntryFields.Location }>>>({
  content_type: 'id',
  'fields.unknownField[near]': mocks.anyValue,
})

// nin operator

expectAssignable<
  EntriesQueries<EntrySkeletonType<{ numberField: number; stringArrayField: string[] }>>
>({
  'sys.updatedAt[nin]': mocks.dateArrayValue,
})
expectNotAssignable<
  EntriesQueries<EntrySkeletonType<{ numberField: number; stringArrayField: string[] }>>
>({
  'fields.numberField[nin]': mocks.anyValue,
  'fields.stringArrayField[nin]': mocks.anyValue,
})
expectAssignable<
  EntriesQueries<EntrySkeletonType<{ numberField: number; stringArrayField: string[] }>>
>({
  content_type: 'id',
  'fields.numberField[nin]': mocks.numberArrayValue,
  'fields.stringArrayField[nin]': mocks.stringArrayValue,
  'sys.updatedAt[nin]': mocks.dateArrayValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  'sys.unknownProp[nin]': mocks.anyValue,
})
expectNotAssignable<
  EntriesQueries<EntrySkeletonType<{ numberField: number; stringArrayField: string[] }>>
>({
  content_type: 'id',
  'fields.unknownField[nin]': mocks.anyValue,
})

// order operator

expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  order: ['sys.createdAt', '-sys.createdAt'],
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  order: ['sys.unknownProperty'],
})

expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  order: ['fields.someField'],
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  content_type: 'id',
  order: ['fields.someField', '-fields.someField'],
})
expectAssignable<
  EntriesQueries<
    EntrySkeletonType<{
      mediaField: EntryFields.AssetLink
      referenceField: EntryFields.EntryLink<any>
    }>
  >
>({
  content_type: 'id',
  order: [
    'fields.mediaField.sys.id',
    '-fields.mediaField.sys.id',
    'fields.referenceField.sys.id',
    '-fields.referenceField.sys.id',
  ],
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  content_type: 'id',
  order: ['fields.unknownField'],
})

// select operator

expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  select: ['sys'],
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  select: ['sys.createdAt'],
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  select: ['sys.unknownProperty'],
})

expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  select: ['fields'],
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  select: ['fields.someField'],
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  content_type: 'id',
  select: ['fields.someField'],
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: string }>>>({
  content_type: 'id',
  select: ['fields.unknownField'],
})

// within operator (bounding circle)

expectNotAssignable<EntriesQueries<EntrySkeletonType<{ locationField: EntryFields.Location }>>>({
  'fields.locationField[within]': mocks.anyValue,
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ locationField: EntryFields.Location }>>>({
  content_type: 'id',
  'fields.locationField[within]': mocks.withinCircleLocationValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ locationField: EntryFields.Location }>>>({
  content_type: 'id',
  'fields.unknownField[within]': mocks.anyValue,
})

// within operator (bounding rectangle)

expectNotAssignable<EntriesQueries<EntrySkeletonType<{ locationField: EntryFields.Location }>>>({
  'fields.locationField[within]': mocks.anyValue,
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ locationField: EntryFields.Location }>>>({
  content_type: 'id',
  'fields.locationField[within]': mocks.withinBoxLocationValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ locationField: EntryFields.Location }>>>({
  content_type: 'id',
  'fields.unknownField[within]': mocks.anyValue,
})

// search on references

expectNotAssignable<
  EntriesQueries<EntrySkeletonType<{ referenceField: EntryFields.EntryLink<any> }>>
>({
  'fields.referenceField.sys.contentType.sys.id': 'id',
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ referenceField: EntryFields.EntryLink<any> }>>>(
  {
    content_type: 'id',
    'fields.referenceField.sys.contentType.sys.id': 'id',
  }
)
expectNotAssignable<
  EntriesQueries<EntrySkeletonType<{ referenceField: EntryFields.EntryLink<any> }>>
>({
  content_type: 'id',
  'fields.unknownField.sys.contentType.sys.id': 'id',
})
