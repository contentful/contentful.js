import { expectAssignable } from 'tsd'
import { EntriesQueries, EntryFields, FieldsType } from '../../lib'
import { EntryFieldsQueries } from '../../lib/types/query/query'

export const stringValue = ''
export const numberValue = 123
export const booleanValue = true

const symbolValue: EntryFields.Symbol = ''
const dateValue: EntryFields.Date = '23-02-2023T00:00:00Z'

/*
 * EntryFields: Type Text
 */
expectAssignable<Required<EntryFieldsQueries<{ stringField: EntryFields.Text }>>>({
  select: ['fields.stringField'],
  'fields.stringField[exists]': booleanValue,
  'fields.stringField': stringValue,
  'fields.stringField[ne]': stringValue,
  'fields.stringField[in]': [stringValue],
  'fields.stringField[nin]': [stringValue],
  'fields.stringField[match]': stringValue,
})

/*
 * EntryFields: Type Number
 */
expectAssignable<Required<EntryFieldsQueries<{ numberField: EntryFields.Number }>>>({
  select: ['fields.numberField'],
  'fields.numberField[exists]': booleanValue,
  'fields.numberField': numberValue,
  'fields.numberField[ne]': numberValue,
  'fields.numberField[in]': [numberValue],
  'fields.numberField[nin]': [numberValue],
  'fields.numberField[lt]': numberValue,
  'fields.numberField[lte]': numberValue,
  'fields.numberField[gt]': numberValue,
  'fields.numberField[gte]': numberValue,
})

/*
 * EntryFields: Type Integer
 */
expectAssignable<Required<EntryFieldsQueries<{ integerField: EntryFields.Integer }>>>({
  select: ['fields.integerField'],
  'fields.integerField[exists]': booleanValue,
  'fields.integerField': numberValue,
  'fields.integerField[ne]': numberValue,
  'fields.integerField[in]': [numberValue],
  'fields.integerField[nin]': [numberValue],
  'fields.integerField[lt]': numberValue,
  'fields.integerField[lte]': numberValue,
  'fields.integerField[gt]': numberValue,
  'fields.integerField[gte]': numberValue,
})

/*
 * EntryFields: Type Symbol
 */
expectAssignable<Required<EntryFieldsQueries<{ symbolField: EntryFields.Symbol }>>>({
  select: ['fields.symbolField'],
  'fields.symbolField[exists]': booleanValue,
  'fields.symbolField': symbolValue,
  'fields.symbolField[ne]': symbolValue,
  'fields.symbolField[in]': [symbolValue],
  'fields.symbolField[nin]': [symbolValue],
  'fields.symbolField[match]': symbolValue,
})

/*
 * EntryFields: Type Date
 */
expectAssignable<Required<EntryFieldsQueries<{ dateField: EntryFields.Date }>>>({
  select: ['fields.dateField'],
  'fields.dateField[exists]': booleanValue,
  'fields.dateField': dateValue,
  'fields.dateField[ne]': dateValue,
  'fields.dateField[in]': [dateValue],
  'fields.dateField[nin]': [dateValue],
  'fields.dateField[match]': dateValue, // Date is a string type so Typescript will allow the match filter on it.
  'fields.dateField[lt]': dateValue,
  'fields.dateField[lte]': dateValue,
  'fields.dateField[gt]': dateValue,
  'fields.dateField[gte]': dateValue,
})

/*
 * EntryFields: Type Location
 */
expectAssignable<Required<EntryFieldsQueries<{ locationField: EntryFields.Location }>>>({
  select: ['fields.locationField'],
  'fields.locationField[exists]': booleanValue,
  'fields.locationField[near]': [34, 35],
  'fields.locationField[within]': [34, 35, 37, 38],
})

/*
 * EntryFields: Type Object
 */
expectAssignable<Required<EntryFieldsQueries<{ objectField: EntryFields.Object }>>>({
  select: ['fields.objectField'],
  'fields.objectField[exists]': booleanValue,
})

/*
 * EntryFields: Type RichText
 */
expectAssignable<Required<EntryFieldsQueries<{ richTextField: EntryFields.RichText }>>>({
  select: ['fields.richTextField'],
  'fields.richTextField[exists]': booleanValue,
  'fields.richTextField[match]': stringValue,
})

/*
 * EntryFields: Type Array of strings
 */
expectAssignable<Required<EntryFieldsQueries<{ arrayStringField: EntryFields.Array<string> }>>>({
  select: ['fields.arrayStringField'],
  'fields.arrayStringField[exists]': booleanValue,
  'fields.arrayStringField': stringValue,
  'fields.arrayStringField[ne]': stringValue,
  'fields.arrayStringField[in]': [stringValue],
  'fields.arrayStringField[nin]': [stringValue],
  'fields.arrayStringField[match]': stringValue,
})

/*
 * EntryFields: Type Reference
 */
expectAssignable<
  Required<EntryFieldsQueries<{ referenceField: EntryFields.EntryLink<FieldsType> }>>
>({
  select: ['fields.referenceField'],
  'fields.referenceField[exists]': booleanValue,
  'fields.referenceField.sys.contentType.sys.id': stringValue,
  'fields.referenceField.fields.numberField': numberValue,
})

/*
 * Entry
 */
expectAssignable<
  EntriesQueries<{
    stringField: EntryFields.Text
    numberField: EntryFields.Number
  }>
>({
  content_type: 'id',
  'fields.stringField[exists]': booleanValue,
  'fields.stringField[match]': stringValue,
  'fields.numberField[gte]': numberValue,
  select: ['fields.stringField', 'fields.numberField'],
  limit: numberValue,
  order: ['fields.stringField', '-fields.numberField'],
  links_to_asset: stringValue,
  links_to_entry: stringValue,
})
