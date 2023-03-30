import { expectAssignable, expectNotAssignable } from 'tsd'
import { EntriesQueries, EntrySkeletonType, EntryFieldTypes } from '../../../lib'
// @ts-ignore
import * as mocks from '../mocks'

// all operator

expectAssignable<
  EntriesQueries<
    EntrySkeletonType<{
      stringField: EntryFieldTypes.Symbol
      stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
    }>
  >
>({
  'metadata.tags.sys.id[all]': mocks.stringArrayValue,
})
expectNotAssignable<
  EntriesQueries<
    EntrySkeletonType<{
      stringField: EntryFieldTypes.Symbol
      stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
    }>
  >
>({
  'fields.stringField[all]': mocks.anyValue,
})
expectAssignable<
  EntriesQueries<
    EntrySkeletonType<{
      stringField: EntryFieldTypes.Symbol
      stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
    }>
  >
>({
  content_type: 'id',
  'fields.stringField[all]': mocks.stringArrayValue,
  'fields.stringArrayField[all]': mocks.stringArrayValue,
})
expectNotAssignable<
  EntriesQueries<
    EntrySkeletonType<{
      stringField: EntryFieldTypes.Symbol
      stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
    }>
  >
>({
  content_type: 'id',
  'fields.unknownField[all]': mocks.anyValue,
})

// equality

expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  'sys.updatedAt': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  'fields.numberField': mocks.anyValue,
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  content_type: 'id',
  'fields.someField': mocks.stringValue,
  'sys.updatedAt': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  'sys.unknownProp': mocks.anyValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  content_type: 'id',
  'fields.unknownField': mocks.anyValue,
})

// exists operator (field is present)

expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  'metadata.tags[exists]': mocks.booleanValue,
  'sys.updatedAt[exists]': mocks.booleanValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  'fields.numberField[exists]': mocks.anyValue,
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  content_type: 'id',
  'fields.someField[exists]': mocks.booleanValue,
  'sys.updatedAt[exists]': mocks.booleanValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  'sys.unknownProp[exists]': mocks.anyValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  content_type: 'id',
  'fields.unknownField[exists]': mocks.anyValue,
})

// gt operator (range)

expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  'sys.updatedAt[gt]': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>>>({
  'fields.numberField[gt]': mocks.anyValue,
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>>>({
  content_type: 'id',
  'fields.numberField[gt]': mocks.numberValue,
  'sys.updatedAt[gt]': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>>>({
  'sys.unknownProp[gt]': mocks.anyValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>>>({
  content_type: 'id',
  'fields.unknownField[gt]': mocks.anyValue,
})

// gte operator (range)

expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Number }>>>({
  'sys.updatedAt[gte]': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>>>({
  'fields.numberField[gte]': mocks.anyValue,
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>>>({
  content_type: 'id',
  'fields.numberField[gte]': mocks.numberValue,
  'sys.updatedAt[gte]': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>>>({
  'sys.unknownProp[gte]': mocks.anyValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>>>({
  content_type: 'id',
  'fields.unknownField[gte]': mocks.anyValue,
})

// in operator

expectAssignable<
  EntriesQueries<
    EntrySkeletonType<{
      numberField: number
      stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
    }>
  >
>({
  'metadata.tags.sys.id[in]': mocks.stringArrayValue,
  'sys.updatedAt[in]': mocks.dateArrayValue,
})
expectNotAssignable<
  EntriesQueries<
    EntrySkeletonType<{
      numberField: EntryFieldTypes.Number
      stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
    }>
  >
>({
  'fields.numberField[in]': mocks.anyValue,
  'fields.stringArrayField[in]': mocks.anyValue,
})
expectAssignable<
  EntriesQueries<
    EntrySkeletonType<{
      numberField: EntryFieldTypes.Number
      stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
    }>
  >
>({
  content_type: 'id',
  'fields.numberField[in]': mocks.numberArrayValue,
  'fields.stringArrayField[in]': mocks.stringArrayValue,
  'sys.updatedAt[in]': mocks.dateArrayValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  'sys.unknownProp[in]': mocks.anyValue,
})
expectNotAssignable<
  EntriesQueries<
    EntrySkeletonType<{
      numberField: EntryFieldTypes.Number
      stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
    }>
  >
>({
  content_type: 'id',
  'fields.unknownField[in]': mocks.anyValue,
})

// lt operator (range)

expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  'sys.updatedAt[lt]': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>>>({
  'fields.numberField[lt]': mocks.anyValue,
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>>>({
  content_type: 'id',
  'fields.numberField[lt]': mocks.numberValue,
  'sys.updatedAt[lt]': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>>>({
  'sys.unknownProp[lt]': mocks.anyValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>>>({
  content_type: 'id',
  'fields.unknownField[lt]': mocks.anyValue,
})

// lte operator (range)

expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  'sys.updatedAt[lte]': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>>>({
  'fields.numberField[lte]': mocks.anyValue,
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>>>({
  content_type: 'id',
  'fields.numberField[lte]': mocks.numberValue,
  'sys.updatedAt[lte]': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>>>({
  'sys.unknownProp[lte]': mocks.anyValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ numberField: EntryFieldTypes.Number }>>>({
  content_type: 'id',
  'fields.unknownField[lte]': mocks.anyValue,
})

// match operator (full-text search)

expectNotAssignable<EntriesQueries<EntrySkeletonType<{ textField: EntryFieldTypes.Symbol }>>>({
  'fields.textField[match]': mocks.anyValue,
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ textField: EntryFieldTypes.Symbol }>>>({
  content_type: 'id',
  'fields.textField[match]': mocks.stringValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ textField: EntryFieldTypes.Symbol }>>>({
  content_type: 'id',
  'fields.unknownField[match]': mocks.anyValue,
})

// ne operator (inequality)

expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  'sys.updatedAt[ne]': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  'fields.numberField[ne]': mocks.anyValue,
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  content_type: 'id',
  'fields.someField[ne]': mocks.stringValue,
  'sys.updatedAt[ne]': mocks.dateValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  'sys.unknownProp[ne]': mocks.anyValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  content_type: 'id',
  'fields.unknownField[ne]': mocks.anyValue,
})

// near operator (full-text search)

expectNotAssignable<EntriesQueries<EntrySkeletonType<{ locationField: EntryFieldTypes.Location }>>>(
  {
    'fields.locationField[near]': mocks.anyValue,
  }
)
expectAssignable<EntriesQueries<EntrySkeletonType<{ locationField: EntryFieldTypes.Location }>>>({
  content_type: 'id',
  'fields.locationField[near]': mocks.nearLocationValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ locationField: EntryFieldTypes.Location }>>>(
  {
    content_type: 'id',
    'fields.unknownField[near]': mocks.anyValue,
  }
)

// nin operator

expectAssignable<
  EntriesQueries<
    EntrySkeletonType<{
      numberField: EntryFieldTypes.Number
      stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
    }>
  >
>({
  'sys.updatedAt[nin]': mocks.dateArrayValue,
})
expectNotAssignable<
  EntriesQueries<
    EntrySkeletonType<{
      numberField: EntryFieldTypes.Number
      stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
    }>
  >
>({
  'fields.numberField[nin]': mocks.anyValue,
  'fields.stringArrayField[nin]': mocks.anyValue,
})
expectAssignable<
  EntriesQueries<
    EntrySkeletonType<{
      numberField: EntryFieldTypes.Number
      stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
    }>
  >
>({
  content_type: 'id',
  'fields.numberField[nin]': mocks.numberArrayValue,
  'fields.stringArrayField[nin]': mocks.stringArrayValue,
  'sys.updatedAt[nin]': mocks.dateArrayValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  'sys.unknownProp[nin]': mocks.anyValue,
})
expectNotAssignable<
  EntriesQueries<
    EntrySkeletonType<{
      numberField: EntryFieldTypes.Number
      stringArrayField: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
    }>
  >
>({
  content_type: 'id',
  'fields.unknownField[nin]': mocks.anyValue,
})

// order operator

expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  order: ['sys.createdAt', '-sys.createdAt'],
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  order: ['sys.unknownProperty'],
})

expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  order: ['fields.someField'],
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  content_type: 'id',
  order: ['fields.someField', '-fields.someField'],
})
expectAssignable<
  EntriesQueries<
    EntrySkeletonType<{
      mediaField: EntryFieldTypes.AssetLink
      referenceField: EntryFieldTypes.EntryLink<any>
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
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  content_type: 'id',
  order: ['fields.unknownField'],
})

// select operator

expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  select: ['sys'],
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  select: ['sys.createdAt'],
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  select: ['sys.unknownProperty'],
})

expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  select: ['fields'],
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  select: ['fields.someField'],
})
expectAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  content_type: 'id',
  select: ['fields.someField'],
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ someField: EntryFieldTypes.Symbol }>>>({
  content_type: 'id',
  select: ['fields.unknownField'],
})

// within operator (bounding circle)

expectNotAssignable<EntriesQueries<EntrySkeletonType<{ locationField: EntryFieldTypes.Location }>>>(
  {
    'fields.locationField[within]': mocks.anyValue,
  }
)
expectAssignable<EntriesQueries<EntrySkeletonType<{ locationField: EntryFieldTypes.Location }>>>({
  content_type: 'id',
  'fields.locationField[within]': mocks.withinCircleLocationValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ locationField: EntryFieldTypes.Location }>>>(
  {
    content_type: 'id',
    'fields.unknownField[within]': mocks.anyValue,
  }
)

// within operator (bounding rectangle)

expectNotAssignable<EntriesQueries<EntrySkeletonType<{ locationField: EntryFieldTypes.Location }>>>(
  {
    'fields.locationField[within]': mocks.anyValue,
  }
)
expectAssignable<EntriesQueries<EntrySkeletonType<{ locationField: EntryFieldTypes.Location }>>>({
  content_type: 'id',
  'fields.locationField[within]': mocks.withinBoxLocationValue,
})
expectNotAssignable<EntriesQueries<EntrySkeletonType<{ locationField: EntryFieldTypes.Location }>>>(
  {
    content_type: 'id',
    'fields.unknownField[within]': mocks.anyValue,
  }
)

// search on references

expectNotAssignable<
  EntriesQueries<EntrySkeletonType<{ referenceField: EntryFieldTypes.EntryLink<any> }>>
>({
  'fields.referenceField.sys.contentType.sys.id': 'id',
})
expectAssignable<
  EntriesQueries<EntrySkeletonType<{ referenceField: EntryFieldTypes.EntryLink<any> }>>
>({
  content_type: 'id',
  'fields.referenceField.sys.contentType.sys.id': 'id',
})
expectNotAssignable<
  EntriesQueries<EntrySkeletonType<{ referenceField: EntryFieldTypes.EntryLink<any> }>>
>({
  content_type: 'id',
  'fields.unknownField.sys.contentType.sys.id': 'id',
})
