import { expectAssignable, expectType } from 'tsd'
import { Entry, EntryFields, EntrySys, LocalizedEntry } from '../../lib'

export const stringValue = ''
export const numberValue = 123
export const booleanValue = true
export const dateValue = '2018-05-03T09:18:16.329Z'

const entrySysValue: EntrySys = {
  contentType: { sys: { id: stringValue, type: 'Link', linkType: 'ContentType' } },
  environment: { sys: { id: stringValue, type: 'Link', linkType: 'Environment' } },
  revision: numberValue,
  space: { sys: { id: stringValue, type: 'Link', linkType: 'Space' } },
  type: '', //?
  updatedAt: dateValue,
  id: stringValue,
  createdAt: dateValue,
}

expectAssignable<Entry<{ stringField: EntryFields.Text }>>({
  sys: entrySysValue,
  fields: {
    stringField: stringValue,
  },
})

expectAssignable<LocalizedEntry<{ stringField: EntryFields.Text }, 'US' | 'DE'>>({
  sys: entrySysValue,
  fields: {
    stringField: {
      US: stringValue,
      DE: stringValue,
    },
  },
})

// TODO fix test
/*
expectAssignable<ResolvedEntry<{ referenceField: EntryLink }>>({
  sys: entrySysValue,
  fields: {
    referenceField: {
      sys: entrySysValue,
      fields: {
        stringField: stringValue
      }
    }
  }
})
 */
