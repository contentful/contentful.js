import { expectAssignable, expectNotAssignable } from 'tsd'
import { EntryFields, EntriesQueries } from '../../../lib'

// exists operator (field is present)

expectNotAssignable<EntriesQueries<{ someField: string }>>({
  'fields.numberField[exists]': true,
})
expectAssignable<EntriesQueries<{ someField: string }>>({
  content_type: 'id',
  'fields.someField[exists]': true,
})
expectNotAssignable<EntriesQueries<{ someField: string }>>({
  content_type: 'id',
  'fields.unknownField[exists]': true,
})

// gt operator (range)

expectNotAssignable<EntriesQueries<{ numberField: number }>>({
  'fields.numberField[gt]': 3,
})
expectAssignable<EntriesQueries<{ numberField: number }>>({
  content_type: 'id',
  'fields.numberField[gt]': 3,
})
expectNotAssignable<EntriesQueries<{ numberField: number }>>({
  content_type: 'id',
  'fields.unknownField[gt]': 3,
})

// gte operator (range)

expectNotAssignable<EntriesQueries<{ numberField: number }>>({
  'fields.numberField[gte]': 3,
})
expectAssignable<EntriesQueries<{ numberField: number }>>({
  content_type: 'id',
  'fields.numberField[gte]': 3,
})
expectNotAssignable<EntriesQueries<{ numberField: number }>>({
  content_type: 'id',
  'fields.unknownField[gte]': 3,
})

// lt operator (range)

expectNotAssignable<EntriesQueries<{ numberField: number }>>({
  'fields.numberField[lt]': 3,
})
expectAssignable<EntriesQueries<{ numberField: number }>>({
  content_type: 'id',
  'fields.numberField[lt]': 3,
})
expectNotAssignable<EntriesQueries<{ numberField: number }>>({
  content_type: 'id',
  'fields.unknownField[lt]': 3,
})

// lte operator (range)

expectNotAssignable<EntriesQueries<{ numberField: number }>>({
  'fields.numberField[lte]': 3,
})
expectAssignable<EntriesQueries<{ numberField: number }>>({
  content_type: 'id',
  'fields.numberField[lte]': 3,
})
expectNotAssignable<EntriesQueries<{ numberField: number }>>({
  content_type: 'id',
  'fields.unknownField[lte]': 3,
})

// match operator (full-text search)

expectNotAssignable<EntriesQueries<{ textField: string }>>({
  'fields.textField[match]': 'value',
})
expectAssignable<EntriesQueries<{ textField: string }>>({
  content_type: 'id',
  'fields.textField[match]': 'value',
})
expectNotAssignable<EntriesQueries<{ textField: string }>>({
  content_type: 'id',
  'fields.unknownField[match]': 'value',
})

// near operator (full-text search)

expectNotAssignable<EntriesQueries<{ locationField: EntryFields.Location }>>({
  'fields.locationField[near]': [0, 1],
})
expectAssignable<EntriesQueries<{ locationField: EntryFields.Location }>>({
  content_type: 'id',
  'fields.locationField[near]': [0, 1],
})
expectNotAssignable<EntriesQueries<{ locationField: EntryFields.Location }>>({
  content_type: 'id',
  'fields.unknownField[near]': [0, 1],
})

// select operator

expectAssignable<EntriesQueries<{ someField: string }>>({ select: ['sys'] })
expectAssignable<EntriesQueries<{ someField: string }>>({ select: ['sys.createdAt'] })
expectNotAssignable<EntriesQueries<{ someField: string }>>({ select: ['sys.unknownProperty'] })

expectAssignable<EntriesQueries<{ someField: string }>>({ select: ['fields'] })
expectNotAssignable<EntriesQueries<{ someField: string }>>({ select: ['fields.someField'] })
expectAssignable<EntriesQueries<{ someField: string }>>({
  content_type: 'id',
  select: ['fields.someField'],
})
expectNotAssignable<EntriesQueries<{ someField: string }>>({
  content_type: 'id',
  select: ['fields.unknownField'],
})

// within operator (bounding circle)

expectNotAssignable<EntriesQueries<{ locationField: EntryFields.Location }>>({
  'fields.locationField[within]': [0, 1, 2],
})
expectAssignable<EntriesQueries<{ locationField: EntryFields.Location }>>({
  content_type: 'id',
  'fields.locationField[within]': [0, 1, 2],
})
expectNotAssignable<EntriesQueries<{ locationField: EntryFields.Location }>>({
  content_type: 'id',
  ['fields.unknownField[within]']: [0, 1, 2],
})

// within operator (bounding rectangle)

expectNotAssignable<EntriesQueries<{ locationField: EntryFields.Location }>>({
  'fields.locationField[within]': [0, 1, 2, 3],
})
expectAssignable<EntriesQueries<{ locationField: EntryFields.Location }>>({
  content_type: 'id',
  'fields.locationField[within]': [0, 1, 2, 3],
})
expectNotAssignable<EntriesQueries<{ locationField: EntryFields.Location }>>({
  content_type: 'id',
  'fields.unknownField[within]': [0, 1, 2, 3],
})

// search on references

expectNotAssignable<EntriesQueries<{ referenceField: EntryFields.EntryLink<any> }>>({
  'fields.referenceField.sys.contentType.sys.id': 'id',
})
expectAssignable<EntriesQueries<{ referenceField: EntryFields.EntryLink<any> }>>({
  content_type: 'id',
  'fields.referenceField.sys.contentType.sys.id': 'id',
})
expectNotAssignable<EntriesQueries<{ referenceField: EntryFields.EntryLink<any> }>>({
  content_type: 'id',
  'fields.unknownField.sys.contentType.sys.id': 'id',
})
