import { expectAssignable } from 'tsd'
import { EntriesQueries, EntryFieldTypes, EntrySkeletonType, EntryFieldsQueries } from '../../lib'

// @ts-ignore
import * as mocks from './mocks'

expectAssignable<Required<EntryFieldsQueries<{ stringField: EntryFieldTypes.Text }>>>({
  select: ['fields.stringField'],
  'fields.stringField[exists]': mocks.booleanValue,
  'fields.stringField': mocks.stringValue,
  'fields.stringField[ne]': mocks.stringValue,
  'fields.stringField[in]': [mocks.stringValue],
  'fields.stringField[nin]': [mocks.stringValue],
  'fields.stringField[match]': mocks.stringValue,
})

expectAssignable<Required<EntryFieldsQueries<{ numberField: EntryFieldTypes.Number }>>>({
  select: ['fields.numberField'],
  'fields.numberField[exists]': mocks.booleanValue,
  'fields.numberField': mocks.numberValue,
  'fields.numberField[ne]': mocks.numberValue,
  'fields.numberField[in]': [mocks.numberValue],
  'fields.numberField[nin]': [mocks.numberValue],
  'fields.numberField[lt]': mocks.numberValue,
  'fields.numberField[lte]': mocks.numberValue,
  'fields.numberField[gt]': mocks.numberValue,
  'fields.numberField[gte]': mocks.numberValue,
})

expectAssignable<Required<EntryFieldsQueries<{ integerField: EntryFieldTypes.Integer }>>>({
  select: ['fields.integerField'],
  'fields.integerField[exists]': mocks.booleanValue,
  'fields.integerField': mocks.numberValue,
  'fields.integerField[ne]': mocks.numberValue,
  'fields.integerField[in]': [mocks.numberValue],
  'fields.integerField[nin]': [mocks.numberValue],
  'fields.integerField[lt]': mocks.numberValue,
  'fields.integerField[lte]': mocks.numberValue,
  'fields.integerField[gt]': mocks.numberValue,
  'fields.integerField[gte]': mocks.numberValue,
})

expectAssignable<Required<EntryFieldsQueries<{ symbolField: EntryFieldTypes.Symbol }>>>({
  select: ['fields.symbolField'],
  'fields.symbolField[exists]': mocks.booleanValue,
  'fields.symbolField': mocks.stringValue,
  'fields.symbolField[ne]': mocks.stringValue,
  'fields.symbolField[in]': [mocks.stringValue],
  'fields.symbolField[nin]': [mocks.stringValue],
  'fields.symbolField[match]': mocks.stringValue,
})

expectAssignable<Required<EntryFieldsQueries<{ dateField: EntryFieldTypes.Date }>>>({
  select: ['fields.dateField'],
  'fields.dateField[exists]': mocks.booleanValue,
  'fields.dateField': mocks.dateValue,
  'fields.dateField[ne]': mocks.dateValue,
  'fields.dateField[in]': [mocks.dateValue],
  'fields.dateField[nin]': [mocks.dateValue],
  'fields.dateField[match]': mocks.dateValue, // Date is a string type so Typescript will allow the match filter on it.
  'fields.dateField[lt]': mocks.dateValue,
  'fields.dateField[lte]': mocks.dateValue,
  'fields.dateField[gt]': mocks.dateValue,
  'fields.dateField[gte]': mocks.dateValue,
})

expectAssignable<Required<EntryFieldsQueries<{ locationField: EntryFieldTypes.Location }>>>({
  select: ['fields.locationField'],
  'fields.locationField[exists]': mocks.booleanValue,
  'fields.locationField[near]': [34, 35],
  'fields.locationField[within]': [34, 35, 37, 38],
})

expectAssignable<Required<EntryFieldsQueries<{ objectField: EntryFieldTypes.Object }>>>({
  select: ['fields.objectField'],
  'fields.objectField[exists]': mocks.booleanValue,
})

expectAssignable<Required<EntryFieldsQueries<{ richTextField: EntryFieldTypes.RichText }>>>({
  select: ['fields.richTextField'],
  'fields.richTextField[exists]': mocks.booleanValue,
  'fields.richTextField[match]': mocks.stringValue,
})

expectAssignable<
  Required<EntryFieldsQueries<{ arrayStringField: EntryFieldTypes.Array<EntryFieldTypes.Symbol> }>>
>({
  select: ['fields.arrayStringField'],
  'fields.arrayStringField[exists]': mocks.booleanValue,
  'fields.arrayStringField': mocks.stringValue,
  'fields.arrayStringField[ne]': mocks.stringValue,
  'fields.arrayStringField[in]': [mocks.stringValue],
  'fields.arrayStringField[nin]': [mocks.stringValue],
  'fields.arrayStringField[match]': mocks.stringValue,
})

expectAssignable<
  Required<EntryFieldsQueries<{ referenceField: EntryFieldTypes.EntryLink<EntrySkeletonType> }>>
>({
  select: ['fields.referenceField'],
  'fields.referenceField[exists]': mocks.booleanValue,
  'fields.referenceField.sys.contentType.sys.id': mocks.stringValue,
  'fields.referenceField.fields.numberField': mocks.numberValue,
})

expectAssignable<
  EntriesQueries<
    EntrySkeletonType<{
      stringField: EntryFieldTypes.Symbol
      numberField: EntryFieldTypes.Number
    }>,
    undefined
  >
>({
  content_type: 'id',
  'fields.stringField[exists]': mocks.booleanValue,
  'fields.stringField[match]': mocks.stringValue,
  'fields.numberField[gte]': mocks.numberValue,
  select: ['fields.stringField', 'fields.numberField'],
  limit: mocks.numberValue,
  order: ['fields.stringField', '-fields.numberField'],
  links_to_asset: mocks.stringValue,
  links_to_entry: mocks.stringValue,
})
