import { expectAssignable } from 'tsd'
import { EntryFields, EntryQueries } from '../../lib'
import { EntryFieldsQueries } from '../../lib/types/query/query'

export const stringValue = ''
export const numberValue = 123
export const booleanValue = true

/*
 * EntryFields
 */
expectAssignable<EntryFieldsQueries<{ stringField: EntryFields.Text }>>({
  select: ['fields.stringField'],
  'fields.stringField[exists]': booleanValue,
  'fields.stringField': stringValue,
  'fields.stringField[ne]': stringValue,
  'fields.stringField[in]': stringValue,
  'fields.stringField[nin]': stringValue,
  'fields.stringField[match]': stringValue,
})

expectAssignable<EntryFieldsQueries<{ numberField: EntryFields.Number }>>({
  select: ['fields.stringField'],
  'fields.numberField[exists]': booleanValue,
  'fields.numberField': numberValue,
  'fields.numberField[ne]': numberValue,
  'fields.numberField[in]': numberValue,
  'fields.numberField[nin]': numberValue,
  'fields.numberField[match]': stringValue,
})

/*
 * Entry
 */
expectAssignable<
  EntryQueries<{
    stringField: EntryFields.Text
    numberField: EntryFields.Number
  }>
>({
  'fields.stringField[exists]': booleanValue,
  'fields.stringField[match]': stringValue,
  'fields.numberField[gte]': numberValue,
  select: ['fields.stringField', 'fields.numberField'],
  limit: numberValue,
})
